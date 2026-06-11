import { prisma } from "../config/prisma.js";
import type { Prisma, ScreeningResult } from "../generated/prisma/index.js";
import type { GetEvaluationsQuery } from "../types/assessment.schema.js";

const withSymptoms = { symptoms: { include: { symptom: true } } } as const;

function assessmentDateFilter(
  dataInicio?: string,
  dataFim?: string,
): Prisma.DateTimeFilter | undefined {
  if (!dataInicio && !dataFim) return undefined;
  const range: Prisma.DateTimeFilter = {};
  if (dataInicio) range.gte = new Date(dataInicio);
  if (dataFim) {
    if (dataFim.length === 10) {
      // date-only upper bound: include the whole day
      const next = new Date(dataFim);
      next.setUTCDate(next.getUTCDate() + 1);
      range.lt = next;
    } else {
      range.lte = new Date(dataFim);
    }
  }
  return range;
}

export const assessmentRepository = {
  findById(id: string) {
    return prisma.assessment.findFirst({
      where: { id, deletedAt: null },
      include: withSymptoms,
    });
  },

  findMany(
    filters: GetEvaluationsQuery,
    { userId, isAdmin }: { userId: string; isAdmin: boolean },
  ) {
    const dateFilter = assessmentDateFilter(
      filters.dataInicio,
      filters.dataFim,
    );
    return prisma.assessment.findMany({
      where: {
        deletedAt: null,
        ...(isAdmin ? {} : { userId }),
        ...(filters.patientId && { patientId: filters.patientId }),
        ...(filters.resultado && {
          screeningResult: filters.resultado as ScreeningResult,
        }),
        ...(dateFilter && { assessmentDate: dateFilter }),
      },
      orderBy: { assessmentDate: "desc" },
    });
  },

  // Minimal chronological rows used to derive per-patient session numbers
  // at read time (numero_sessao is not stored — spec §3.3).
  findIdsByPatients(patientIds: string[]) {
    return prisma.assessment.findMany({
      where: { patientId: { in: patientIds }, deletedAt: null },
      select: { id: true, patientId: true },
      orderBy: { assessmentDate: "asc" },
    });
  },

  create(data: {
    userId: string;
    patientId: string;
    score: number;
    screeningResult: ScreeningResult;
    appliedThreshold: number;
    symptoms: { symptomId: string; isPresent: boolean }[];
  }) {
    return prisma.assessment.create({
      data: {
        userId: data.userId,
        patientId: data.patientId,
        score: data.score,
        screeningResult: data.screeningResult,
        appliedThreshold: data.appliedThreshold,
        symptoms: { createMany: { data: data.symptoms } },
      },
      include: withSymptoms,
    });
  },
};
