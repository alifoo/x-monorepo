import type { Request, Response } from "express";
import { guardianService } from "../services/guardian.service.js";
import type { GetGuardianParams } from "../types/guardian.schema.js";
import { Prisma } from "../generated/prisma/index.js";

export const guardianController = {
  async getById(req: Request<GetGuardianParams>, res: Response) {
    const guardian = await guardianService.getById(req.params.id);
    if (!guardian) {
      return res.status(404).json({ error: "Responsável não encontrado" });
    }
    res.json(guardian);
  },

  async create(req: Request, res: Response) {
    try {
      const guardian = await guardianService.create(req.body);
      res.status(201).json(guardian);
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(409).json({ error: "CPF já cadastrado" });
      }
      throw error;
    }
  },

  async update(req: Request<GetGuardianParams>, res: Response) {
    try {
      const guardian = await guardianService.update(req.params.id, req.body);
      if (!guardian) {
        return res.status(404).json({ error: "Responsável não encontrado" });
      }
      res.json(guardian);
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(409).json({ error: "CPF já cadastrado" });
      }
      throw error;
    }
  },
};
