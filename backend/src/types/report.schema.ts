import { z } from "zod";

export const reportFilterSchema = z
  .object({
    sexo: z.enum(["m", "f"]).optional(),
    idadeMin: z.coerce.number().int().min(0).optional(),
    idadeMax: z.coerce.number().int().max(120).optional(),
    resultado: z.enum(["SUSPEITO", "BAIXO_RISCO"]).optional(),
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
    periodo: z.enum(["ultima_semana", "ultimo_mes", "ultimo_ano"]).optional(),
    sintomas: z
      .union([z.string().uuid(), z.array(z.string().uuid())])
      .optional()
      .transform((val) => (typeof val === "string" ? [val] : val)),
    profissionalId: z.string().uuid().optional(),
  })
  .meta({ id: "ReportFilter" });

export type ReportFilterParams = z.infer<typeof reportFilterSchema>;
