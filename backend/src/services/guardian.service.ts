import { guardianRepository } from "../repositories/guardian.repository.js";
import type {
  CreateGuardianInput,
  UpdateGuardianInput,
} from "../types/guardian.schema.js";

export const guardianService = {
  async getById(id: string) {
    return guardianRepository.findById(id);
  },

  async create(params: CreateGuardianInput) {
    const data: Parameters<typeof guardianRepository.create>[0] = {
      name: params.name,
      ...(params.cpf !== undefined && { cpf: params.cpf }),
      ...(params.email !== undefined && { email: params.email }),
      ...(params.phone !== undefined && { phone: params.phone }),
    };
    return guardianRepository.create(data);
  },

  async update(id: string, params: UpdateGuardianInput) {
    const existing = await guardianRepository.findById(id);
    if (!existing) return null;

    const data: Parameters<typeof guardianRepository.update>[1] = {};
    if (params.name !== undefined) data.name = params.name;
    if (params.cpf !== undefined) data.cpf = params.cpf;
    if (params.email !== undefined) data.email = params.email;
    if (params.phone !== undefined) data.phone = params.phone;

    return guardianRepository.update(id, data);
  },
};
