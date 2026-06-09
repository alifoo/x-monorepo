import { Router } from "express";
import { assessmentController } from "../controllers/assessment.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createEvaluationSchema,
  getEvaluationsQuerySchema,
  getEvaluationParamsSchema,
} from "../types/assessment.schema.js";

export const assessmentRouter: Router = Router();

// Aplica autenticação global exigida para o domínio
assessmentRouter.use(requireAuth);

assessmentRouter.post(
  "/",
  validate(createEvaluationSchema, "body"),
  assessmentController.create,
);

assessmentRouter.get(
  "/",
  validate(getEvaluationsQuerySchema, "query"),
  assessmentController.list,
);

assessmentRouter.get(
  "/:id",
  validate(getEvaluationParamsSchema, "params"),
  assessmentController.getById,
);
