import type { Symptom } from "../generated/prisma/index.js";

export type Sexo = "m" | "f";

export type SymptomInput = {
  id: string;
  presente: boolean;
};

export type ScoringResult = {
  score: number;
  thresholdAplicado: number;
  resultado: "SUSPEITO" | "BAIXO_RISCO";
  sintomasAplicados: string[];
  sintomasIgnorados: string[];
};

export function calcularScore(
  sexo: Sexo,
  respostas: SymptomInput[],
  catalogoSintomas: Symptom[],
): ScoringResult {
  const sintomasValidosDoCatalogo = catalogoSintomas.filter((s) => {
    if (!s.applicableSex) return true;
    return s.applicableSex.toLowerCase() === sexo;
  });

  const contagemEsperada = sintomasValidosDoCatalogo.length;

  if (respostas.length !== contagemEsperada) {
    throw new Error(
      `Quantidade de sintomas inválida. Esperado ${contagemEsperada} para o sexo ${sexo}.`,
    );
  }

  let score = 0;
  const sintomasAplicados: string[] = [];
  const sintomasIgnorados: string[] = [];

  const respostaMap = new Map(respostas.map((r) => [r.id, r.presente]));

  for (const sintoma of catalogoSintomas) {
    const isAplicavel =
      !sintoma.applicableSex || sintoma.applicableSex.toLowerCase() === sexo;

    if (!isAplicavel) {
      sintomasIgnorados.push(sintoma.id);
      continue;
    }

    sintomasAplicados.push(sintoma.id);
    const presente = respostaMap.get(sintoma.id) || false;

    if (presente) {
      const pesoDecimal = sexo === "m" ? sintoma.weightM : sintoma.weightF;
      const peso = pesoDecimal ? Number(pesoDecimal) : 0;

      score += peso;
    }
  }

  score = Math.round(score * 100) / 100;

  const thresholdAplicado = sexo === "m" ? 0.56 : 0.55;
  const resultado = score > thresholdAplicado ? "SUSPEITO" : "BAIXO_RISCO";

  return {
    score,
    thresholdAplicado,
    resultado,
    sintomasAplicados,
    sintomasIgnorados,
  };
}
