import { z } from "zod";
import type { User } from "../generated/prisma/index.js";

export const getUserParamsSchema = z.object({
  id: z.uuid().meta({ description: "User id (UUID)." }),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(1).meta({ example: "Maria Silva" }),
    roles: z
      .array(z.string().min(1))
      .meta({ example: ["administrator", "healthcare_professional"] }),
  })
  .partial()
  .meta({ id: "UpdateUser" });

export const inviteUserSchema = z
  .object({
    name: z.string().min(1).meta({ example: "Maria Silva" }),
    email: z.email().meta({ example: "maria@clinica.br" }),
    role: z.string().min(1).meta({ example: "healthcare_professional" }),
  })
  .meta({ id: "InviteUser" });

export const userDtoSchema = z
  .object({
    id: z.uuid(),
    name: z.string().meta({ example: "Maria Silva" }),
    email: z.email().meta({ example: "maria@clinica.br" }),
    roles: z.array(z.string()).meta({ example: ["healthcare_professional"] }),
  })
  .meta({ id: "User" });

export type UserDTO = Pick<User, "id" | "name" | "email"> & {
  roles: string[];
};
export type GetUserParams = z.infer<typeof getUserParamsSchema>;
export type UpdateUserParams = z.infer<typeof updateUserSchema>;
export type InviteUserParams = z.infer<typeof inviteUserSchema>;
