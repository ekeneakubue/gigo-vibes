import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import {
  parseAdminUserStatus,
  serializeUser,
  toPrismaUserStatus,
} from "../../../lib/users";

const userSelect = {
  id: true,
  name: true,
  email: true,
  status: true,
  paidAt: true,
} as const;

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ createdAt: "desc" }],
      select: userSelect,
    });

    return NextResponse.json({ users: users.map(serializeUser) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      status?: string;
    };

    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    const status = parseAdminUserStatus(body.status) ?? "pending";

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with that email already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        status: toPrismaUserStatus(status),
        paidAt: status === "active" ? new Date() : null,
      },
      select: userSelect,
    });

    return NextResponse.json({ user: serializeUser(user) }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to create user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
