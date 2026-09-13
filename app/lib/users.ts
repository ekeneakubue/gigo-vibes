import {
  UserRole as PrismaUserRole,
  UserStatus as PrismaUserStatus,
} from "@prisma/client";
import { prisma } from "./prisma";

export type AdminUserStatus = "active" | "pending" | "refunded";
export type AdminUserRole = "admin" | "staff";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: AdminUserStatus;
  role: AdminUserRole;
  paidAt: string;
};

const statusToUi: Record<PrismaUserStatus, AdminUserStatus> = {
  ACTIVE: "active",
  PENDING: "pending",
  REFUNDED: "refunded",
};

const statusToDb: Record<AdminUserStatus, PrismaUserStatus> = {
  active: "ACTIVE",
  pending: "PENDING",
  refunded: "REFUNDED",
};

const roleToUi: Record<PrismaUserRole, AdminUserRole> = {
  ADMIN: "admin",
  STAFF: "staff",
};

const roleToDb: Record<AdminUserRole, PrismaUserRole> = {
  admin: "ADMIN",
  staff: "STAFF",
};

export function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  status: PrismaUserStatus;
  role: PrismaUserRole;
  paidAt: Date | null;
}): AdminUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: statusToUi[user.status],
    role: roleToUi[user.role],
    paidAt: user.paidAt ? user.paidAt.toISOString().slice(0, 10) : "—",
  };
}

export async function listAdminUsers() {
  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      role: true,
      paidAt: true,
    },
  });

  return users.map(serializeUser);
}

export function parseAdminUserStatus(value: unknown): AdminUserStatus | null {
  if (value === "active" || value === "pending" || value === "refunded") {
    return value;
  }
  return null;
}

export function parseAdminUserRole(value: unknown): AdminUserRole | null {
  if (value === "admin" || value === "staff") {
    return value;
  }
  return null;
}

export function toPrismaUserStatus(status: AdminUserStatus): PrismaUserStatus {
  return statusToDb[status];
}

export function toPrismaUserRole(role: AdminUserRole): PrismaUserRole {
  return roleToDb[role];
}
