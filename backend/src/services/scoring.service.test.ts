import { describe, it, expect } from "vitest";
import { calcularScore, type SymptomInput } from "./scoring.service.js";
import type { Symptom } from "../generated/prisma/index.js";

// 12 symptoms: s12 is male-only (macroorquidismo). Weights chosen so edge
// cases around the 0.56/0.55 thresholds are exactly reachable.
function makeCatalog(): Symptom[] {
  const base = Array.from({ length: 11 }, (_, i) => ({
    id: `s${i + 1}`,
    symptomName: `Sintoma ${i + 1}`,
    category: null,
    weightM: 0.07 as never,
    weightF: 0.05 as never,
    applicableSex: null,
  }));
  return [
    ...base,
    {
      id: "s12",
      symptomName: "Macroorquidismo",
      category: null,
      weightM: 0.3 as never,
      weightF: null as never,
      applicableSex: "m",
    },
  ] as Symptom[];
}

function answers(ids: string[], presentIds: string[]): SymptomInput[] {
  return ids.map((id) => ({ id, presente: presentIds.includes(id) }));
}

const maleIds = Array.from({ length: 12 }, (_, i) => `s${i + 1}`);
const femaleIds = maleIds.slice(0, 11);

describe("calcularScore", () => {
  it("RN01/RN05: uses weightM for males", () => {
    const result = calcularScore(
      "m",
      answers(maleIds, ["s1", "s2"]),
      makeCatalog(),
    );
    expect(result.score).toBe(0.14);
  });

  it("RN01/RN05: uses weightF for females", () => {
    const result = calcularScore(
      "f",
      answers(femaleIds, ["s1", "s2"]),
      makeCatalog(),
    );
    expect(result.score).toBe(0.1);
  });

  it("RN02: skips male-only symptoms for female patients", () => {
    const result = calcularScore("f", answers(femaleIds, []), makeCatalog());
    expect(result.sintomasIgnorados).toEqual(["s12"]);
    expect(result.sintomasAplicados).not.toContain("s12");
    expect(result.sintomasAplicados).toHaveLength(11);
  });

  it("RN03: rejects when the answer count does not match the catalog (f sends 12)", () => {
    expect(() =>
      calcularScore("f", answers(maleIds, []), makeCatalog()),
    ).toThrow(/Esperado 11/);
  });

  it("RN03: rejects when the answer count does not match the catalog (m sends 11)", () => {
    expect(() =>
      calcularScore("m", answers(femaleIds, []), makeCatalog()),
    ).toThrow(/Esperado 12/);
  });

  it("rejects duplicate symptom ids", () => {
    const dup = answers(maleIds, []);
    dup[1] = { id: "s1", presente: true };
    expect(() => calcularScore("m", dup, makeCatalog())).toThrow(/duplicados/);
  });

  it("rejects when an applicable symptom is missing even if the count matches", () => {
    const wrong = answers(maleIds, []);
    wrong[0] = { id: "unknown-id", presente: true };
    expect(() => calcularScore("m", wrong, makeCatalog())).toThrow(/ausente/);
  });

  it("RN04: score is the sum of weights of present symptoms only", () => {
    const result = calcularScore(
      "m",
      answers(maleIds, ["s1", "s12"]),
      makeCatalog(),
    );
    expect(result.score).toBe(0.37);
  });

  it("RN06: male score exactly at 0.56 is low_risk (strictly greater wins)", () => {
    // 8 × 0.07 = 0.56
    const result = calcularScore(
      "m",
      answers(maleIds, maleIds.slice(0, 8)),
      makeCatalog(),
    );
    expect(result.score).toBe(0.56);
    expect(result.thresholdAplicado).toBe(0.56);
    expect(result.resultado).toBe("low_risk");
  });

  it("RN06: male score above 0.56 is suspected", () => {
    // 9 × 0.07 = 0.63
    const result = calcularScore(
      "m",
      answers(maleIds, maleIds.slice(0, 9)),
      makeCatalog(),
    );
    expect(result.resultado).toBe("suspected");
  });

  it("RN06: female score exactly at 0.55 is low_risk", () => {
    // 11 × 0.05 = 0.55
    const result = calcularScore(
      "f",
      answers(femaleIds, femaleIds),
      makeCatalog(),
    );
    expect(result.score).toBe(0.55);
    expect(result.thresholdAplicado).toBe(0.55);
    expect(result.resultado).toBe("low_risk");
  });

  it("treats null weights as zero", () => {
    const catalog = makeCatalog();
    catalog[0]!.weightM = null as never;
    const result = calcularScore("m", answers(maleIds, ["s1"]), catalog);
    expect(result.score).toBe(0);
  });
});
