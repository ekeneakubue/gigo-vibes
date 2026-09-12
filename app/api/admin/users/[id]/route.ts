import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import {
  parseAdminUserStatus,
  serializeUser,
  toPrismaUserStatus,
} from "../../../../lib/users";

const userSelect = {
  id: true,
  name: true,
  email: true,
  status: true,
  paidAt: true,
} as const;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      status?: string;
    };

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true, paidAt: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const status = parseAdminUserStatus(body.status);

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }
    if (password && password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }
    if (!status) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const emailOwner = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (emailOwner && emailOwner.id !== id) {
      return NextResponse.json(
        { error: "A user with that email already exists." },
        { status: 409 },
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        status: toPrismaUserStatus(status),
        paidAt:
          status === "active"
            ? (existing.paidAt ?? new Date())
            : existing.paidAt,
        ...(password ? { password: await hash(password, 10) } : {}),
      },
      select: userSelect,
    });

    return NextResponse.json({ user: serializeUser(user) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing user id." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Select only id so a stale client that still knows `channel` does not
    // try to read that dropped column when returning the deleted row.
    await prisma.user.delete({
      where: { id },
      select: { id: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
