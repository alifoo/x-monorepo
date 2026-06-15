import { prisma } from "../config/prisma.js";

export const userRepository = {
  // Reads exclude soft-deleted users (deletedAt set) everywhere.
  // Active role names are included so callers can expose them in the DTO.
  findById(id: string) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        roles: {
          where: { status: "active" },
          select: { role: { select: { name: true } } },
        },
      },
    });
  },
  findAll() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      include: {
        roles: {
          where: { status: "active" },
          select: { role: { select: { name: true } } },
        },
      },
    });
  },
  // Distinct, non-deleted users holding an active administrator role.
  countActiveAdmins() {
    return prisma.user.count({
      where: {
        deletedAt: null,
        roles: { some: { status: "active", role: { name: "administrator" } } },
      },
    });
  },
  hasActiveRole(userId: string, roleName: string) {
    return prisma.userRole.findFirst({
      where: {
        userId,
        status: "active",
        role: { name: roleName },
      },
      select: { id: true },
    });
  },
  updateName(id: string, name: string) {
    return prisma.user.update({ where: { id }, data: { name } });
  },
  findRolesByNames(names: string[]) {
    return prisma.role.findMany({ where: { name: { in: names } } });
  },
  findRoleByName(name: string) {
    return prisma.role.findUniqueOrThrow({ where: { name } });
  },
  assignRole(userId: string, roleId: number) {
    return prisma.userRole.create({ data: { userId, roleId } });
  },
  replaceUserRoles(userId: string, roleIds: number[]) {
    return prisma.$transaction(async (tx) => {
      await tx.userRole.updateMany({
        where: { userId, status: "active", roleId: { notIn: roleIds } },
        data: { status: "inactive" },
      });
      for (const roleId of roleIds) {
        const row = await tx.userRole.findFirst({ where: { userId, roleId } });
        if (!row) {
          await tx.userRole.create({ data: { userId, roleId } });
        } else if (row.status !== "active") {
          await tx.userRole.update({
            where: { id: row.id },
            data: { status: "active" },
          });
        }
      }
    });
  },
  // Atomically deactivate the user's active roles and stamp deletedAt, so a
  // deleted user is never left with lingering active roles.
  softDeleteUser(userId: string) {
    return prisma.$transaction([
      prisma.userRole.updateMany({
        where: { userId, status: "active" },
        data: { status: "inactive" },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      }),
    ]);
  },
};
