import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../repositories/guardian.repository.js", () => ({
  guardianRepository: {
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}));

import { guardianService } from "./guardian.service.js";
import { guardianRepository } from "../repositories/guardian.repository.js";

function makeGuardian(overrides: object = {}) {
  return {
    id: "g-1",
    name: "João Silva",
    cpf: "12345678901",
    email: "joao@example.com",
    phone: "41999999999",
    ...overrides,
  };
}

describe("guardianService.getById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns the guardian if found", async () => {
    vi.mocked(guardianRepository.findById).mockResolvedValue(
      makeGuardian() as never,
    );
    const result = await guardianService.getById("g-1");
    expect(result?.name).toBe("João Silva");
  });

  it("returns null when guardian does not exist", async () => {
    vi.mocked(guardianRepository.findById).mockResolvedValue(null as never);
    expect(await guardianService.getById("missing")).toBeNull();
  });
});

describe("guardianService.create", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls repository create with stripped undefined fields", async () => {
    vi.mocked(guardianRepository.create).mockResolvedValue(
      makeGuardian() as never,
    );

    await guardianService.create({
      name: "João Silva",
      cpf: "12345678901",
      email: undefined,
      phone: "41999999999",
    });

    const call = vi.mocked(guardianRepository.create).mock.calls[0];
    expect(call?.[0]).toEqual({
      name: "João Silva",
      cpf: "12345678901",
      phone: "41999999999",
    });
    expect(call?.[0]).not.toHaveProperty("email");
  });
});

describe("guardianService.update", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns null when guardian does not exist", async () => {
    vi.mocked(guardianRepository.findById).mockResolvedValue(null as never);
    expect(await guardianService.update("missing", { name: "X" })).toBeNull();
    expect(guardianRepository.update).not.toHaveBeenCalled();
  });

  it("calls repository update with stripped undefined fields", async () => {
    vi.mocked(guardianRepository.findById).mockResolvedValue(
      makeGuardian() as never,
    );
    vi.mocked(guardianRepository.update).mockResolvedValue(
      makeGuardian() as never,
    );

    await guardianService.update("g-1", {
      name: "Novo Nome",
      email: undefined,
    });

    const call = vi.mocked(guardianRepository.update).mock.calls[0];
    expect(call?.[1]).toEqual({ name: "Novo Nome" });
    expect(call?.[1]).not.toHaveProperty("email");
    expect(call?.[1]).not.toHaveProperty("cpf");
  });
});
