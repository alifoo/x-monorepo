import { z } from "zod";

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
        description:
          "Todos os sintomas aplicáveis ao sexo do paciente, com marcação de presença (11 para f, 12 para m).",
      }),
  })
  .meta({ id: "CreateEvaluation" });

const isoDateOrDatetime = z.union([z.iso.date(), z.iso.datetime()]);

export const getEvaluationsQuerySchema = z
  .object({
    patientId: z.uuid().optional(),
    resultado: z.enum(["suspected", "low_risk"]).optional(),
    dataInicio: isoDateOrDatetime.optional(),
    dataFim: isoDateOrDatetime.optional(),
  })
  .meta({ id: "GetEvaluationsQuery" });

export const getEvaluationParamsSchema = z.object({
  id: z.uuid().meta({ description: "ID da avaliação" }),
});

export const evaluationSymptomSchema = z
  .object({
    symptomId: z.uuid(),
    name: z.string().meta({ example: "Macroorquidismo" }),
    isPresent: z.boolean(),
  })
  .meta({ id: "EvaluationSymptom" });

export const evaluationDtoSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
    patientId: z.uuid(),
    sessionNumber: z.number().int().meta({
      description:
        "Posição cronológica desta avaliação no histórico do paciente (1 = primeira).",
      example: 2,
    }),
    score: z.number().nullable().meta({ example: 0.61 }),
    screeningResult: z.enum(["suspected", "low_risk"]).nullable(),
    appliedThreshold: z.number().nullable().meta({ example: 0.56 }),
    assessmentDate: z.iso.datetime(),
  })
  .meta({ id: "Evaluation" });

export const evaluationDetailDtoSchema = evaluationDtoSchema
  .extend({
    symptoms: evaluationSymptomSchema.array(),
  })
  .meta({ id: "EvaluationDetail" });

export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;
export type GetEvaluationsQuery = z.infer<typeof getEvaluationsQuerySchema>;
export type GetEvaluationParams = z.infer<typeof getEvaluationParamsSchema>;
export type EvaluationDTO = z.infer<typeof evaluationDtoSchema>;
export type EvaluationDetailDTO = z.infer<typeof evaluationDetailDtoSchema>;
