import type { Symptom } from "../generated/prisma/index.js";
import { ScreeningResult } from "../generated/prisma/index.js";

export type Sexo = "m" | "f";

export type SymptomInput = {
  id: string;
  presente: boolean;
};

export type ScoringResult = {
  score: number;
  thresholdAplicado: number;
  resultado: ScreeningResult;
  sintomasAplicados: string[];
  sintomasIgnorados: string[];
};

function validationError(message: string): Error {
  return Object.assign(new Error(message), { status: 400 });
}

// RN01–RN06. Pure (no I/O); POST /evaluations is the only production caller.
export function calcularScore(
  sexo: Sexo,
  respostas: SymptomInput[],
  catalogoSintomas: Symptom[],
): ScoringResult {
  const aplicaveis = catalogoSintomas.filter(
    (s) => !s.applicableSex || s.applicableSex === sexo,
  );
  const ignorados = catalogoSintomas
    .filter((s) => s.applicableSex && s.applicableSex !== sexo)
    .map((s) => s.id);

  // RN03: the answers must cover exactly the applicable catalog for this sex.
  if (respostas.length !== aplicaveis.length) {
    throw validationError(
      `Quantidade de sintomas inválida. Esperado ${aplicaveis.length} para o sexo "${sexo}", recebido ${respostas.length}.`,
    );
  }

  const respostaMap = new Map(respostas.map((r) => [r.id, r.presente]));
  if (respostaMap.size !== respostas.length) {
    throw validationError("Sintomas duplicados na avaliação.");
  }

  let score = 0;
  const aplicados: string[] = [];

  for (const sintoma of aplicaveis) {
    if (!respostaMap.has(sintoma.id)) {
      throw validationError(
        `Sintoma obrigatório ausente na avaliação: ${sintoma.id}.`,
      );
    }
    aplicados.push(sintoma.id);

    if (respostaMap.get(sintoma.id)) {
      const peso = sexo === "m" ? sintoma.weightM : sintoma.weightF;
      score += peso ? Number(peso) : 0;
    }
  }

  score = Math.round(score * 100) / 100;

  // RN06
  const thresholdAplicado = sexo === "m" ? 0.56 : 0.55;
  const resultado =
    score > thresholdAplicado
      ? ScreeningResult.suspected
      : ScreeningResult.low_risk;

  return {
    score,
    thresholdAplicado,
    resultado,
    sintomasAplicados: aplicados,
    sintomasIgnorados: ignorados,
  };
}
