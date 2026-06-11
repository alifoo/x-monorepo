import { Router } from "express";
import { guardianController } from "../controllers/guardian.controller.js";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/requireAuth.js";
import {
  createGuardianSchema,
  getGuardianParamsSchema,
  updateGuardianSchema,
} from "../types/guardian.schema.js";

export const guardianRouter: Router = Router();

guardianRouter.use(requireAuth);

guardianRouter.get(
  "/:id",
  validate(getGuardianParamsSchema, "params"),
  guardianController.getById,
);

guardianRouter.post(
  "/",
  validate(createGuardianSchema),
  guardianController.create,
);

guardianRouter.patch(
  "/:id",
  validate(getGuardianParamsSchema, "params"),
  validate(updateGuardianSchema),
  guardianController.update,
);
