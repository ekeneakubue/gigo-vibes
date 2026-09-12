import { UserStatus as PrismaUserStatus } from "@prisma/client";
import { prisma } from "./prisma";

export type AdminUserStatus = "active" | "pending" | "refunded";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  status: AdminUserStatus;
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

export function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  status: PrismaUserStatus;
  paidAt: Date | null;
}): AdminUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: statusToUi[user.status],
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

export function toPrismaUserStatus(status: AdminUserStatus): PrismaUserStatus {
  return statusToDb[status];
}
