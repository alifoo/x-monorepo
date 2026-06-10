import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import swaggerUi from "swagger-ui-express";
import { env, allowedOrigins } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import cors from "cors";
import { userRouter } from "./routes/user.routes.js";
import { symptomRouter } from "./routes/symptoms.routes.js";
import { patientRouter } from "./routes/patient.routes.js";
import { reportRouter } from "./routes/report.routes.js";
import { supabaseAdmin } from "./config/supabase.js";
import { openApiDocument } from "./openapi.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

// API docs: raw spec at /openapi.json, interactive UI at /docs.
// Disabled in production to avoid exposing the API surface publicly.
if (env.NODE_ENV !== "production") {
  app.get("/openapi.json", (_req, res) => res.json(openApiDocument));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.post("/dev/token", async (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return res.status(401).json({ error: error.message });
    res.json({
      accessToken: data.session.access_token,
      expiresIn: data.session.expires_in,
    });
  });
}

app.use("/users", userRouter);
app.use("/symptoms", symptomRouter);
app.use("/patients", patientRouter);
app.use("/reports", reportRouter);

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).send("OK");
  } catch {
    res.status(503).send("Internal Server Error. DB unreachable");
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  const message = err instanceof Error ? err.message : "Internal server error";
  const status =
    typeof err === "object" && err !== null && "status" in err
      ? (err as { status: number }).status
      : 500;
  res.status(status).json({ error: message });
});

const server = app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});

const shutdown = (signal: string) => {
  console.log(`Received ${signal}. Shutting down...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
