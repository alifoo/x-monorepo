import { z } from "zod";

export const createGuardianSchema = z.object({
  name: z.string().min(1).meta({ example: "João Silva" }),
  cpf: z.string().length(11).regex(/^\d+$/, "CPF deve conter apenas números").meta({ example: "12345678901" }),
  phone: z.string().optional().meta({ example: "41999999999" }),
  email: z.string().email().optional().meta({ example: "joao@email.com" }),
}).meta({ id: "CreateGuardian" });

export const updateGuardianSchema = createGuardianSchema.partial().meta({ id: "UpdateGuardian" });

export const getGuardianParamsSchema = z.object({
  id: z.uuid().meta({ description: "ID do responsável (UUID)" }),
});

export const guardianResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  cpf: z.string(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
}).meta({ id: "Guardian" });

export type CreateGuardianInput = z.infer<typeof createGuardianSchema>;
export type UpdateGuardianInput = z.infer<typeof updateGuardianSchema>;
export type GetGuardianParams = z.infer<typeof getGuardianParamsSchema>;