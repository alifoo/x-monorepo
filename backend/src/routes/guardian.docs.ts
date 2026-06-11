import type {
  ZodOpenApiPathsObject,
  ZodOpenApiResponseObject,
} from "zod-openapi";
import { errorResponseSchema } from "../types/common.schema.js";
import {
  createGuardianSchema,
  getGuardianParamsSchema,
  updateGuardianSchema,
  guardianResponseSchema,
} from "../types/guardian.schema.js";

const errorResponse = (description: string): ZodOpenApiResponseObject => ({
  description,
  content: { "application/json": { schema: errorResponseSchema } },
});

const guardianResponse = (description: string): ZodOpenApiResponseObject => ({
  description,
  content: { "application/json": { schema: guardianResponseSchema } },
});

export const guardianPaths: ZodOpenApiPathsObject = {
  "/guardians": {
    post: {
      operationId: "createGuardian",
      tags: ["Guardians"],
      summary: "Create a guardian",
      description: "Creates a new patient guardian.",
      requestBody: {
        required: true,
        content: { "application/json": { schema: createGuardianSchema } },
      },
      responses: {
        "201": guardianResponse("The created guardian."),
        "400": errorResponse("Validation failed."),
        "401": errorResponse("Missing or invalid token."),
        "409": errorResponse("CPF já cadastrado."),
      },
    },
  },
  "/guardians/{id}": {
    get: {
      operationId: "getGuardianById",
      tags: ["Guardians"],
      summary: "Get a guardian by id",
      requestParams: { path: getGuardianParamsSchema },
      responses: {
        "200": guardianResponse("The requested guardian."),
        "400": errorResponse("Invalid id."),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("Guardian not found."),
      },
    },
    patch: {
      operationId: "updateGuardian",
      tags: ["Guardians"],
      summary: "Update a guardian",
      description: "All fields are optional.",
      requestParams: { path: getGuardianParamsSchema },
      requestBody: {
        required: true,
        content: { "application/json": { schema: updateGuardianSchema } },
      },
      responses: {
        "200": guardianResponse("The updated guardian."),
        "400": errorResponse("Validation failed."),
        "401": errorResponse("Missing or invalid token."),
        "404": errorResponse("Guardian not found."),
        "409": errorResponse("CPF já cadastrado."),
      },
    },
  },
};
