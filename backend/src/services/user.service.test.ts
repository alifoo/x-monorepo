import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../repositories/user.repository.js", () => ({
  userRepository: {
    findById: vi.fn(),
  },
}));

vi.mock("../config/supabase.js", () => ({
  supabaseAdmin: { auth: { admin: {} } },
}));

import { userService } from "./user.service.js";
import { userRepository } from "../repositories/user.repository.js";

describe("userService.getById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("return only id, name and email when the user exists", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: "u-1",
      name: "Ana",
      email: "ana@example.com",
      createdAt: new Date(),
      roles: [{ role: { name: "administrator" } }],
    } as never);

    const result = await userService.getById("u-1");

    expect(result).toEqual({
      id: "u-1",
      name: "Ana",
      email: "ana@example.com",
      roles: ["administrator"],
    });
  });

  it("return null when the user does not exist", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    const result = await userService.getById("inexistente");

    expect(result).toBeNull();
  });

  it("pass the received id to the repository", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await userService.getById("u-42");

    expect(userRepository.findById).toHaveBeenCalledWith("u-42");
  });
});

describe("userService.me", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("return only id, name and email when the user exists", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue({
      id: "u-1",
      name: "Ana",
      email: "ana@example.com",
      createdAt: new Date(),
      roles: [{ role: { name: "administrator" } }],
    } as never);

    const result = await userService.getById("u-1");

    expect(result).toEqual({
      id: "u-1",
      name: "Ana",
      email: "ana@example.com",
      roles: ["administrator"],
    });
  });

  it("return null when the user does not exist", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    const result = await userService.getById("inexistente");

    expect(result).toBeNull();
  });

  it("pass the received id to the repository", async () => {
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await userService.getById("u-42");

    expect(userRepository.findById).toHaveBeenCalledWith("u-42");
  });
});
