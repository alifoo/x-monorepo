import type { Request, Response } from "express";
import { assessmentService } from "../services/assessment.service.js";
import type {
  GetEvaluationParams,
  GetEvaluationsQuery,
} from "../types/assessment.schema.js";

export const assessmentController = {
  async create(req: Request, res: Response) {
    const evaluation = await assessmentService.create(req.user!.id, req.body);
    res.status(201).json(evaluation);
  },

  async list(req: Request, res: Response) {
    const evaluations = await assessmentService.list(
      req.query as GetEvaluationsQuery,
      req.user!.id,
    );
    res.json(evaluations);
  },

  async getById(req: Request<GetEvaluationParams>, res: Response) {
    const evaluation = await assessmentService.getById(
      req.params.id,
      req.user!.id,
    );
    if (!evaluation)
      return res.status(404).json({ error: "Avaliação não encontrada" });
    res.json(evaluation);
  },
};
