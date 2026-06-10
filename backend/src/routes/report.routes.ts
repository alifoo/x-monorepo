import { Router } from "express";
import { reportController } from "../controllers/report.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { reportFilterSchema } from "../types/report.schema.js";

export const reportRouter: Router = Router();

reportRouter.use(requireAuth);

reportRouter.get(
  "/",
  validate(reportFilterSchema, "query"),
  reportController.getReport,
);
reportRouter.get(
  "/reports.pdf",
  validate(reportFilterSchema, "query"),
  reportController.getReport,
);
