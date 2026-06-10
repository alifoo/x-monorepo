import { prisma } from "../config/prisma.js";
import type { ReportFilterParams } from "../types/report.schema.js";
import { ScreeningResult } from "../generated/prisma/index.js";

export const reportingService = {
  async aggregate(
    filters: ReportFilterParams,
    currentUserId: string,
    isAdmin: boolean,
  ) {
    if (filters.profissionalId && !isAdmin) {
      throw new Error(
        "FORBIDDEN: Apenas administradores podem filtrar por profissional.",
      );
    }

    const whereClause: any = { deletedAt: null };

    if (!isAdmin) {
      whereClause.userId = currentUserId;
    } else if (filters.profissionalId) {
      whereClause.userId = filters.profissionalId;
    }

    let startDate = filters.dataInicio
      ? new Date(filters.dataInicio)
      : undefined;
    let endDate = filters.dataFim ? new Date(filters.dataFim) : undefined;

    if (filters.periodo) {
      const now = new Date();
      endDate = now;
      startDate = new Date();
      if (filters.periodo === "ultima_semana")
        startDate.setDate(now.getDate() - 7);
      if (filters.periodo === "ultimo_mes")
        startDate.setMonth(now.getMonth() - 1);
      if (filters.periodo === "ultimo_ano")
        startDate.setFullYear(now.getFullYear() - 1);
    }

    if (startDate || endDate) {
      whereClause.assessmentDate = {};
      if (startDate) whereClause.assessmentDate.gte = startDate;
      if (endDate) whereClause.assessmentDate.lte = endDate;
    }

    const patientWhere: any = {};
    if (filters.sexo) patientWhere.sex = filters.sexo;

    if (filters.idadeMin !== undefined || filters.idadeMax !== undefined) {
      const now = new Date();
      patientWhere.birthDate = {};
      if (filters.idadeMin !== undefined) {
        const maxBirthDate = new Date(
          now.getFullYear() - filters.idadeMin,
          now.getMonth(),
          now.getDate(),
        );
        patientWhere.birthDate.lte = maxBirthDate;
      }
      if (filters.idadeMax !== undefined) {
        const minBirthDate = new Date(
          now.getFullYear() - filters.idadeMax - 1,
          now.getMonth(),
          now.getDate() + 1,
        );
        patientWhere.birthDate.gte = minBirthDate;
      }
    }

    if (Object.keys(patientWhere).length > 0) {
      whereClause.patient = patientWhere;
    }

    if (filters.resultado) {
      whereClause.screeningResult =
        filters.resultado === "SUSPEITO"
          ? ScreeningResult.suspected
          : ScreeningResult.low_risk;
    }

    if (filters.sintomas && filters.sintomas.length > 0) {
      whereClause.symptoms = {
        some: { symptomId: { in: filters.sintomas }, isPresent: true },
      };
    }

    const assessments = await prisma.assessment.findMany({
      where: whereClause,
      include: {
        patient: true,
        symptoms: { include: { symptom: true } },
      },
      orderBy: { assessmentDate: "asc" },
    });

    const totais = { suspeito: 0, baixo_risco: 0, total: assessments.length };
    const porSexo = {
      m: { suspeito: 0, baixo_risco: 0 },
      f: { suspeito: 0, baixo_risco: 0 },
    };
    const incidenciaSintomasMap = new Map<
      string,
      { nome: string; ocorrencias: number }
    >();
    const porPeriodoMap = new Map<
      string,
      { suspeito: number; baixo_risco: number }
    >();

    for (const a of assessments) {
      const resultKey =
        a.screeningResult === ScreeningResult.suspected
          ? "suspeito"
          : "baixo_risco";
      const sexoKey = a.patient.sex?.toLowerCase() as "m" | "f";
      const monthBucket = a.assessmentDate.toISOString().substring(0, 7);

      totais[resultKey]++;
      if (sexoKey === "m" || sexoKey === "f") {
        porSexo[sexoKey][resultKey]++;
      }

      if (!porPeriodoMap.has(monthBucket))
        porPeriodoMap.set(monthBucket, { suspeito: 0, baixo_risco: 0 });
      porPeriodoMap.get(monthBucket)![resultKey]++;

      for (const s of a.symptoms) {
        if (s.isPresent) {
          const current = incidenciaSintomasMap.get(s.symptomId) || {
            nome: s.symptom.symptomName,
            ocorrencias: 0,
          };
          current.ocorrencias++;
          incidenciaSintomasMap.set(s.symptomId, current);
        }
      }
    }

    const incidenciaSintomas = Array.from(incidenciaSintomasMap.entries())
      .map(([id, data]) => ({
        sintomaId: id,
        nome: data.nome,
        ocorrencias: data.ocorrencias,
      }))
      .sort((a, b) => b.ocorrencias - a.ocorrencias);

    const porPeriodo = Array.from(porPeriodoMap.entries()).map(
      ([bucket, counts]) => ({
        bucket,
        ...counts,
      }),
    );

    return {
      filtros: filters,
      totais,
      porSexo,
      incidenciaSintomas,
      porPeriodo,
    };
  },
};
