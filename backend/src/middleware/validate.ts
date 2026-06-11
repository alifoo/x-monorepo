import type { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type Target = "body" | "query" | "params";

export function validate(schema: ZodType, target: Target = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return res.status(400).json({
        error: "Dados inválidos",
        issues: result.error.issues,
      });
    }
    if (target === "query") {
      // Express 5 defines req.query as a getter-only prototype property;
      // plain assignment throws, so shadow it with an own property.
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    } else {
      req[target] = result.data;
    }
    next();
  };
}
