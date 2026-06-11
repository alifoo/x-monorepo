import type {
  Assessment,
  AssessmentSymptom,
  Symptom,
} from "../generated/prisma/index.js";
import { assessmentRepository } from "../repositories/assessment.repository.js";
import { patientRepository } from "../repositories/patient.repository.js";
import { symptomRepository } from "../repositories/symptom.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { calcularScore } from "./scoring.service.js";
import type {
  CreateEvaluationInput,
  EvaluationDTO,
  EvaluationDetailDTO,
  GetEvaluationsQuery,
} from "../types/assessment.schema.js";

type AssessmentWithSymptoms = Assessment & {
  symptoms: (AssessmentSymptom & { symptom: Symptom })[];
};

function notFoundError(message: string): Error {
  return Object.assign(new Error(message), { status: 404 });
}

function toDto(a: Assessment, sessionNumber: number): EvaluationDTO {
  return {
    id: a.id,
    userId: a.userId,
    patientId: a.patientId,
    sessionNumber,
    score: a.score === null ? null : Number(a.score),
    screeningResult: a.screeningResult,
    appliedThreshold:
      a.appliedThreshold === null ? null : Number(a.appliedThreshold),
    assessmentDate: a.assessmentDate.toISOString(),
  };
}

function toDetailDto(
  a: AssessmentWithSymptoms,
  sessionNumber: number,
): EvaluationDetailDTO {
  return {
    ...toDto(a, sessionNumber),
    symptoms: a.symptoms.map((s) => ({
      symptomId: s.symptomId,
      name: s.symptom.symptomName,
      isPresent: s.isPresent,
    })),
  };
}

// numero_sessao is derived, not stored (spec §3.3): the assessment's 1-based
// position in the patient's chronological history.
async function sessionNumbersFor(
  patientIds: string[],
): Promise<Map<string, number>> {
  const rows = await assessmentRepository.findIdsByPatients([
    ...new Set(patientIds),
  ]);
  const counters = new Map<string, number>();
  const byAssessment = new Map<string, number>();
  for (const row of rows) {
    const next = (counters.get(row.patientId) ?? 0) + 1;
    counters.set(row.patientId, next);
    byAssessment.set(row.id, next);
  }
  return byAssessment;
}

async function isAdmin(userId: string): Promise<boolean> {
  return !!(await userRepository.hasActiveRole(userId, "administrator"));
}

export const assessmentService = {
  async getById(
    id: string,
    userId: string,
  ): Promise<EvaluationDetailDTO | null> {
    const row = await assessmentRepository.findById(id);
    if (!row) return null;
    if (row.userId !== userId && !(await isAdmin(userId))) return null;

    const sessions = await sessionNumbersFor([row.patientId]);
    return toDetailDto(row, sessions.get(row.id) ?? 1);
  },

  async list(
    filters: GetEvaluationsQuery,
    userId: string,
  ): Promise<EvaluationDTO[]> {
    const rows = await assessmentRepository.findMany(filters, {
      userId,
      isAdmin: await isAdmin(userId),
    });
    if (rows.length === 0) return [];

    const sessions = await sessionNumbersFor(rows.map((r) => r.patientId));
    return rows.map((r) => toDto(r, sessions.get(r.id) ?? 1));
  },

  async create(
    userId: string,
    input: CreateEvaluationInput,
  ): Promise<EvaluationDetailDTO> {
    const patient = await patientRepository.findById(input.patientId);
    if (!patient) throw notFoundError("Paciente não encontrado");

    const catalogo = await symptomRepository.findAll();
    const scoring = calcularScore(patient.sex, input.sintomas, catalogo);

    const row = await assessmentRepository.create({
      userId,
      patientId: input.patientId,
      score: scoring.score,
      screeningResult: scoring.resultado,
      appliedThreshold: scoring.thresholdAplicado,
      symptoms: input.sintomas.map((s) => ({
        symptomId: s.id,
        isPresent: s.presente,
      })),
    });

    const sessions = await sessionNumbersFor([row.patientId]);
    return toDetailDto(row, sessions.get(row.id) ?? 1);
  },
};
