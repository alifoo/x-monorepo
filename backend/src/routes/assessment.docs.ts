import type {
  ZodOpenApiPathsObject,
  ZodOpenApiResponseObject,
} from "zod-openapi";
import { errorResponseSchema } from "../types/common.schema.js";
import {
  createEvaluationSchema,
  evaluationDetailDtoSchema,
  evaluationDtoSchema,
  getEvaluationParamsSchema,
  getEvaluationsQuerySchema,
} from "../types/assessment.schema.js";

const errorResponse = (description: string): ZodOpenApiResponseObject => ({
  description,
  content: { "application/json": { schema: errorResponseSchema } },
});

export const assessmentPaths: ZodOpenApiPathsObject = {
  "/evaluations": {
    post: {
      operationId: "createEvaluation",
      tags: ["Evaluations"],
      summary: "Create an evaluation",
      description:
        "Runs the Fragile-X scoring rule server-side (RN01–RN06). Send every symptom applicable to the patient's sex with its presence flag — 11 for female, 12 for male. The backend selects the weight and threshold from the patient's sex; the client never sends them.",
      requestBody: {
        required: true,
        content: { "application/json": { schema: createEvaluationSchema } },
      },
      responses: {
        "201": {
          description: "The created evaluation, including the computed score.",
          content: {
            "application/json": { schema: evaluationDetailDtoSchema },
          },
        },
        "400": errorResponse(
          "Validation failed (wrong symptom count, duplicate or missing symptoms).",
        ),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("Patient not found."),
      },
    },
    get: {
      operationId: "listEvaluations",
      tags: ["Evaluations"],
      summary: "List evaluations",
      description:
        "Healthcare professionals see only their own evaluations; administrators see all. Filter by patient, screening result and date range (RF06).",
      requestParams: { query: getEvaluationsQuerySchema },
      responses: {
        "200": {
          description: "List of evaluations, most recent first.",
          content: {
            "application/json": { schema: evaluationDtoSchema.array() },
          },
        },
        "400": errorResponse("Invalid filters."),
        "401": errorResponse("Missing or invalid token."),
      },
    },
  },
  "/evaluations/{id}": {
    get: {
      operationId: "getEvaluationById",
      tags: ["Evaluations"],
      summary: "Get an evaluation by id",
      description:
        "Detailed view including per-symptom presence. Professionals can only read their own evaluations; administrators can read any.",
      requestParams: { path: getEvaluationParamsSchema },
      responses: {
        "200": {
          description: "The requested evaluation.",
          content: {
            "application/json": { schema: evaluationDetailDtoSchema },
          },
        },
        "400": errorResponse("Invalid id."),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("Evaluation not found or not owned by you."),
      },
    },
  },
};
