import { createDocument, type oas31 } from "zod-openapi";
import { userPaths } from "./routes/user.docs.js";
import { symptomPaths } from "./routes/symptoms.docs.js";
import { patientPaths } from "./routes/patient.docs.js";
import { guardianPaths } from "./routes/guardian.docs.js";
import { reportPaths } from "./routes/report.docs.js";
import { assessmentPaths } from "./routes/assessment.docs.js";

export const openApiDocument: oas31.OpenAPIObject = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Fragile-X Screening API",
    version: "1.0.0",
    description:
      "Backend API for the Fragile-X clinical screening application.",
  },
  servers: [{ url: "/", description: "Current host" }],
  tags: [
    {
      name: "Dev",
      description: "Dev-only helpers. Not available in production.",
    },
    { name: "Users", description: "User management and invitations." },
    { name: "Symptoms", description: "Symptoms filtering." },
    { name: "Patients", description: "Patient records." },
    { name: "Guardians", description: "Patient guardians." },
    {
      name: "Evaluations",
      description: "Fragile-X screening evaluations and scoring.",
    },
    { name: "Reports", description: "Geração de relatórios agregados e PDFs." },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Supabase access token sent as `Authorization: Bearer <token>`.",
      },
    },
  },
  paths: {
    "/dev/token": {
      post: {
        operationId: "devGetToken",
        tags: ["Dev"],
        summary: "Get a Supabase access token (dev only)",
        description:
          "Exchange email + password for a bearer token. Use the returned `accessToken` in the **Authorize** button above. This endpoint does not exist in production.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object" as const,
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string" as const,
                    format: "email",
                    example: "you@example.com",
                  },
                  password: {
                    type: "string" as const,
                    example: "yourpassword",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Authentication successful.",
            content: {
              "application/json": {
                schema: {
                  type: "object" as const,
                  properties: {
                    accessToken: { type: "string" as const },
                    expiresIn: { type: "number" as const },
                  },
                },
              },
            },
          },
          "401": { description: "Invalid credentials." },
        },
      },
    },
    ...userPaths,
    ...symptomPaths,
    ...patientPaths,
    ...guardianPaths,
    ...assessmentPaths,
    ...reportPaths,
  },
});
