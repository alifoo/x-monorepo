import { prisma } from "../config/prisma.js";
import { ScreeningResult } from "../generated/prisma/index.js";
import type { GetEvaluationsQuery } from "../types/assessment.schema.js";

export const assessmentRepository = {
  async findById(id: string) {
    return prisma.assessment.findFirst({
      where: { id, deletedAt: null },
      include: {
        symptoms: {
          include: { symptom: true },
        },
      },
    });
  },

  async findMany(
    filters: GetEvaluationsQuery,
    userId: string,
    isAdmin: boolean,
  ) {
    const whereClause: any = {
      deletedAt: null,
    };

    if (!isAdmin) {
      whereClause.userId = userId;
    }

    if (filters.patientId) whereClause.patientId = filters.patientId;
    if (filters.resultado)
      whereClause.screeningResult = filters.resultado as ScreeningResult;

    if (filters.dataInicio || filters.dataFim) {
      whereClause.assessmentDate = {};
      if (filters.dataInicio)
        whereClause.assessmentDate.gte = new Date(filters.dataInicio);
      if (filters.dataFim)
        whereClause.assessmentDate.lte = new Date(filters.dataFim);
    }

    return prisma.assessment.findMany({
      where: whereClause,
      orderBy: { assessmentDate: "desc" },
    });
  },

  async create(data: {
    userId: string;
    patientId: string;
    score: number;
    screeningResult: ScreeningResult;
    appliedThreshold: number;
    sintomas: { id: string; presente: boolean }[];
  }) {
    return prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.create({
        data: {
          userId: data.userId,
          patientId: data.patientId,
          score: data.score,
          screeningResult: data.screeningResult,
          appliedThreshold: data.appliedThreshold,
        },
      });

      const recordsSintomas = data.sintomas.map((s) => ({
        assessmentId: assessment.id,
        symptomId: s.id,
        symptomPresent: s.presente,
      }));

      await tx.assessmentSymptom.createMany({
        data: recordsSintomas,
      });

      return assessment;
    });
  },
};
