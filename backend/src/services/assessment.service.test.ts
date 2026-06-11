import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../repositories/assessment.repository.js", () => ({
  assessmentRepository: {
    findById: vi.fn(),
    findMany: vi.fn(),
    findIdsByPatients: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../repositories/patient.repository.js", () => ({
  patientRepository: {
    findById: vi.fn(),
  },
}));

vi.mock("../repositories/symptom.repository.js", () => ({
  symptomRepository: {
    findAll: vi.fn(),
  },
}));

vi.mock("../repositories/user.repository.js", () => ({
  userRepository: {
    hasActiveRole: vi.fn(),
  },
}));

import { assessmentService } from "./assessment.service.js";
import { assessmentRepository } from "../repositories/assessment.repository.js";
import { patientRepository } from "../repositories/patient.repository.js";
import { symptomRepository } from "../repositories/symptom.repository.js";
import { userRepository } from "../repositories/user.repository.js";

const catalog = [
  {
    id: "s1",
    symptomName: "Sintoma 1",
    category: null,
    weightM: 0.6,
    weightF: 0.6,
    applicableSex: null,
  },
  {
    id: "s2",
    symptomName: "Macroorquidismo",
    category: null,
    weightM: 0.3,
    weightF: null,
    applicableSex: "m",
  },
];

function makeAssessment(overrides: object = {}) {
  return {
    id: "a-1",
    userId: "u-1",
    patientId: "p-1",
    score: 0.6,
    screeningResult: "suspected",
    appliedThreshold: 0.56,
    assessmentDate: new Date("2026-06-01T10:00:00.000Z"),
    deletedAt: null,
    symptoms: [
      {
        assessmentId: "a-1",
        symptomId: "s1",
        isPresent: true,
        symptom: catalog[0],
      },
    ],
    ...overrides,
  };
}

describe("assessmentService.create", () => {
  beforeEach(() => vi.clearAllMocks());

  it("throws 404 when the patient does not exist", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue(null);

    await expect(
      assessmentService.create("u-1", {
        patientId: "missing",
        sintomas: [{ id: "s1", presente: true }],
      }),
    ).rejects.toMatchObject({ status: 404 });
    expect(assessmentRepository.create).not.toHaveBeenCalled();
  });

  it("scores against the patient's sex and persists the result", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue({
      id: "p-1",
      sex: "m",
    } as never);
    vi.mocked(symptomRepository.findAll).mockResolvedValue(catalog as never);
    vi.mocked(assessmentRepository.create).mockResolvedValue(
      makeAssessment() as never,
    );
    vi.mocked(assessmentRepository.findIdsByPatients).mockResolvedValue([
      { id: "a-1", patientId: "p-1" },
    ] as never);

    const result = await assessmentService.create("u-1", {
      patientId: "p-1",
      sintomas: [
        { id: "s1", presente: true },
        { id: "s2", presente: false },
      ],
    });

    const call = vi.mocked(assessmentRepository.create).mock.calls[0]?.[0];
    expect(call).toMatchObject({
      userId: "u-1",
      patientId: "p-1",
      score: 0.6,
      screeningResult: "suspected",
      appliedThreshold: 0.56,
    });
    expect(call?.symptoms).toEqual([
      { symptomId: "s1", isPresent: true },
      { symptomId: "s2", isPresent: false },
    ]);
    expect(result.sessionNumber).toBe(1);
    expect(result.symptoms).toEqual([
      { symptomId: "s1", name: "Sintoma 1", isPresent: true },
    ]);
  });

  it("rejects a female evaluation that includes a male-only symptom", async () => {
    vi.mocked(patientRepository.findById).mockResolvedValue({
      id: "p-1",
      sex: "f",
    } as never);
    vi.mocked(symptomRepository.findAll).mockResolvedValue(catalog as never);

    await expect(
      assessmentService.create("u-1", {
        patientId: "p-1",
        sintomas: [
          { id: "s1", presente: true },
          { id: "s2", presente: true },
        ],
      }),
    ).rejects.toMatchObject({ status: 400 });
    expect(assessmentRepository.create).not.toHaveBeenCalled();
  });
});

describe("assessmentService.getById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when the evaluation does not exist", async () => {
    vi.mocked(assessmentRepository.findById).mockResolvedValue(null);

    expect(await assessmentService.getById("missing", "u-1")).toBeNull();
  });

  it("returns null when a non-admin reads someone else's evaluation", async () => {
    vi.mocked(assessmentRepository.findById).mockResolvedValue(
      makeAssessment({ userId: "owner" }) as never,
    );
    vi.mocked(userRepository.hasActiveRole).mockResolvedValue(null);

    expect(await assessmentService.getById("a-1", "intruder")).toBeNull();
  });

  it("lets an admin read any evaluation", async () => {
    vi.mocked(assessmentRepository.findById).mockResolvedValue(
      makeAssessment({ userId: "owner" }) as never,
    );
    vi.mocked(userRepository.hasActiveRole).mockResolvedValue({
      id: "ur-1",
    } as never);
    vi.mocked(assessmentRepository.findIdsByPatients).mockResolvedValue([
      { id: "a-1", patientId: "p-1" },
    ] as never);

    const result = await assessmentService.getById("a-1", "admin-1");

    expect(result?.id).toBe("a-1");
  });

  it("computes the session number from the patient's history", async () => {
    vi.mocked(assessmentRepository.findById).mockResolvedValue(
      makeAssessment() as never,
    );
    vi.mocked(assessmentRepository.findIdsByPatients).mockResolvedValue([
      { id: "a-0", patientId: "p-1" },
      { id: "a-1", patientId: "p-1" },
    ] as never);

    const result = await assessmentService.getById("a-1", "u-1");

    expect(result?.sessionNumber).toBe(2);
  });
});

describe("assessmentService.list", () => {
  beforeEach(() => vi.clearAllMocks());

  it("scopes to the requesting user when not admin", async () => {
    vi.mocked(userRepository.hasActiveRole).mockResolvedValue(null);
    vi.mocked(assessmentRepository.findMany).mockResolvedValue([]);

    await assessmentService.list({}, "u-1");

    expect(assessmentRepository.findMany).toHaveBeenCalledWith(
      {},
      { userId: "u-1", isAdmin: false },
    );
  });

  it("passes isAdmin=true for administrators", async () => {
    vi.mocked(userRepository.hasActiveRole).mockResolvedValue({
      id: "ur-1",
    } as never);
    vi.mocked(assessmentRepository.findMany).mockResolvedValue([]);

    await assessmentService.list({}, "admin-1");

    expect(assessmentRepository.findMany).toHaveBeenCalledWith(
      {},
      { userId: "admin-1", isAdmin: true },
    );
  });

  it("maps rows to DTOs with per-patient session numbers", async () => {
    vi.mocked(userRepository.hasActiveRole).mockResolvedValue(null);
    vi.mocked(assessmentRepository.findMany).mockResolvedValue([
      makeAssessment({ id: "a-2", symptoms: undefined }),
      makeAssessment({ id: "a-1", symptoms: undefined }),
    ] as never);
    vi.mocked(assessmentRepository.findIdsByPatients).mockResolvedValue([
      { id: "a-1", patientId: "p-1" },
      { id: "a-2", patientId: "p-1" },
    ] as never);

    const result = await assessmentService.list({}, "u-1");

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: "a-2",
      sessionNumber: 2,
      score: 0.6,
      assessmentDate: "2026-06-01T10:00:00.000Z",
    });
    expect(result[1]?.sessionNumber).toBe(1);
  });
});
