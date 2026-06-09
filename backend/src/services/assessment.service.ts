import { assessmentRepository } from "../repositories/assessment.repository.js";
import { prisma } from "../config/prisma.js";
import { calcularScore } from "./scoring.service.js";
import type {
  CreateEvaluationInput,
  GetEvaluationsQuery,
} from "../types/assessment.schema.js";
import { ScreeningResult } from "../generated/prisma/index.js";

export const assessmentService = {
  async getById(id: string) {
    return assessmentRepository.findById(id);
  },

  async getEvaluations(
    filters: GetEvaluationsQuery,
    userId: string,
    isAdmin: boolean,
  ) {
    return assessmentRepository.findMany(filters, userId, isAdmin);
  },

  async createEvaluation(userId: string, input: CreateEvaluationInput) {
    const patient = await prisma.patient.findFirst({
      where: { id: input.patientId, deletedAt: null },
    });

    if (!patient) {
      throw new Error("Patient not found");
    }

    const catalogoSintomas = await prisma.symptom.findMany();

    const sexoFormatado = patient.sex.toLowerCase() as "m" | "f";
    const resultadoCalculado = calcularScore(
      sexoFormatado,
      input.sintomas,
      catalogoSintomas,
    );

    return assessmentRepository.create({
      userId,
      patientId: input.patientId,
      score: resultadoCalculado.score,

      screeningResult: resultadoCalculado.resultado as ScreeningResult,

      appliedThreshold: resultadoCalculado.thresholdAplicado,

      sintomas: input.sintomas,
    });
  },
};
