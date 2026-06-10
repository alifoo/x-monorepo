import { z } from "zod";
import type { ZodOpenApiPathsObject } from "zod-openapi";
import { reportFilterSchema } from "../types/report.schema.js";

const reportResponseSchema = z
  .object({
    filtros: z.any().meta({ description: "Filtros aplicados na busca" }),
    totais: z.object({
      suspeito: z.number().meta({ example: 12 }),
      baixo_risco: z.number().meta({ example: 80 }),
      total: z.number().meta({ example: 92 }),
    }),
    porSexo: z.object({
      m: z.object({ suspeito: z.number(), baixo_risco: z.number() }),
      f: z.object({ suspeito: z.number(), baixo_risco: z.number() }),
    }),
    incidenciaSintomas: z.array(
      z.object({
        sintomaId: z.string().uuid(),
        nome: z.string().meta({ example: "Macroorquidismo" }),
        ocorrencias: z.number().meta({ example: 47 }),
      }),
    ),
    porPeriodo: z.array(
      z.object({
        bucket: z.string().meta({ example: "2026-05" }),
        suspeito: z.number(),
        baixo_risco: z.number(),
      }),
    ),
  })
  .meta({ id: "ReportResponse" });

export const reportPaths: ZodOpenApiPathsObject = {
  "/reports": {
    get: {
      tags: ["Reports"],
      summary: "Gerar Relatório Agregado (JSON)",
      description:
        "Retorna as métricas agregadas de avaliações clínicas com base nos filtros informados (idade, sexo, período, sintomas, etc).",
      requestParams: {
        query: reportFilterSchema,
      },
      responses: {
        "200": {
          description: "Relatório gerado com sucesso.",
          content: {
            "application/json": { schema: reportResponseSchema },
          },
        },
        "400": {
          description: "Erro de validação nos filtros (Ex: data inválida).",
        },
        "403": {
          description:
            "Acesso negado. Apenas administradores podem filtrar por profissionalId.",
        },
      },
    },
  },
  "/reports/reports.pdf": {
    get: {
      tags: ["Reports"],
      summary: "Download do Relatório em PDF",
      description:
        "Gera as mesmas métricas agregadas, mas retorna um arquivo PDF formatado pronto para impressão ou download.",
      requestParams: {
        query: reportFilterSchema,
      },
      responses: {
        "200": {
          description: "Arquivo PDF gerado e enviado via stream com sucesso.",
          content: {
            "application/pdf": {
              schema: z.string().meta({ format: "binary" }),
            },
          },
        },
        "400": {
          description: "Erro de validação nos filtros.",
        },
        "403": {
          description:
            "Acesso negado. Apenas administradores podem filtrar por profissionalId.",
        },
      },
    },
  },
};
