import type { Request, Response } from "express";
import { assessmentService } from "../services/assessment.service.js";
import { prisma } from "../config/prisma.js";
import type { GetEvaluationParams } from "../types/assessment.schema.js";

export const assessmentController = {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const assessment = await assessmentService.createEvaluation(
        userId,
        req.body,
      );

      return res.status(201).json(assessment);
    } catch (error: any) {
      console.error(error);

      if (
        error.message.includes("Quantidade de sintomas inválida") ||
        error.message.includes("Patient not found")
      ) {
        return res.status(400).json({
          error: { code: "VALIDATION_ERROR", message: error.message },
        });
      }
      return res.status(500).json({
        error: { code: "INTERNAL", message: "Erro interno no servidor." },
      });
    }
  },

  async getById(req: Request<GetEvaluationParams>, res: Response) {
    try {
      const assessment = await assessmentService.getById(req.params.id);
      if (!assessment) {
        return res.status(404).json({
          error: { code: "NOT_FOUND", message: "Avaliação não encontrada." },
        });
      }
      return res.json(assessment);
    } catch (error) {
      return res.status(500).json({
        error: { code: "INTERNAL", message: "Erro interno no servidor." },
      });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = req.user!.id;

      const adminRole = await prisma.userRole.findFirst({
        where: {
          userId: userId,
          role: { name: "administrator" },
          status: "active",
        },
      });

      const isAdmin = !!adminRole;

      const assessments = await assessmentService.getEvaluations(
        req.query,
        userId,
        isAdmin,
      );
      return res.json(assessments);
    } catch (error) {
      return res.status(500).json({
        error: { code: "INTERNAL", message: "Erro interno no servidor." },
      });
    }
  },
};
