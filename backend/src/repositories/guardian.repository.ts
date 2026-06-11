import { prisma } from "../config/prisma.js";

type GuardianCreateData = {
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
};

type GuardianUpdateData = Partial<GuardianCreateData>;

export const guardianRepository = {
  findById(id: string) {
    return prisma.patientGuardian.findUnique({
      where: { id },
    });
  },

  create(data: GuardianCreateData) {
    return prisma.patientGuardian.create({ data });
  },

  update(id: string, data: GuardianUpdateData) {
    return prisma.patientGuardian.update({
      where: { id },
      data,
    });
  },
};
