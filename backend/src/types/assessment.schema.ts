import { z } from "zod";

// Validador do Payload de Criação (POST /evaluations)
export const createEvaluationSchema = z
  .object({
    patientId: z
      .uuid()
      .meta({ example: "550e8400-e29b-41d4-a716-446655440000" }),
    sintomas: z
      .array(
        z.object({
          id: z
            .uuid()
            .meta({ example: "123e4567-e89b-12d3-a456-426614174000" }),
          presente: z.boolean().meta({ example: true }),
        }),
      )
      .min(1)
      .meta({
        description: "Lista de sintomas com marcação de presença obrigatória.",
      }),
  })
  .meta({ id: "CreateEvaluation" });

// Validador de Query Params para Listagem/Filtros (GET /evaluations)
export const getEvaluationsQuerySchema = z
  .object({
    patientId: z.uuid().optional(),
    resultado: z.enum(["SUSPEITO", "BAIXO_RISCO"]).optional(),
    dataInicio: z.string().datetime().optional(),
    dataFim: z.string().datetime().optional(),
  })
  .meta({ id: "GetEvaluationsQuery" });

export const getEvaluationParamsSchema = z.object({
  id: z.uuid().meta({ description: "ID da avaliação" }),
});

// Schema de Saída (DTO) formatado de acordo com a spec
export const evaluationResponseSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
    patientId: z.uuid(),
    score: z.number(),
    screeningResult: z.enum(["SUSPEITO", "BAIXO_RISCO"]),
    assessmentDate: z.string().datetime(),
    appliedThreshold: z.number(),
  })
  .meta({ id: "Evaluation" });

export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;
export type GetEvaluationsQuery = z.infer<typeof getEvaluationsQuerySchema>;
export type GetEvaluationParams = z.infer<typeof getEvaluationParamsSchema>;
