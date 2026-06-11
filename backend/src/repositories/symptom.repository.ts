import { prisma } from "../config/prisma.js";

export type SexOption = "m" | "f" | "";

export const symptomRepository = {
  findAll() {
    return prisma.symptom.findMany();
  },

  async findBySex(sex: SexOption) {
    const symptoms = await prisma.symptom.findMany();

    return symptoms.map((symptom) => {
      if (sex === "") {
        return symptom;
      }

      const { weightM, weightF, ...rest } = symptom;

      return {
        ...rest,
        weight: sex === "m" ? weightM : weightF,
      };
    });
  },
};
