import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  assertLoginRateLimit,
  authenticateAdmin,
  clearLoginRateLimit,
  createAdminSessionToken,
  sanitizeLoginInput,
} from "../../../lib/admin-auth";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > 4096) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }

    const ip = clientIp(request);
    assertLoginRateLimit(ip);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const sanitized = sanitizeLoginInput(
      body as { email?: unknown; password?: unknown },
    );
    if ("error" in sanitized) {
      return NextResponse.json({ error: sanitized.error }, { status: 400 });
    }

    const admin = await authenticateAdmin(sanitized);
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    clearLoginRateLimit(ip);
    const token = await createAdminSessionToken(admin);

    const response = NextResponse.json({
      ok: true,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in";
    const status = message.includes("Too many") ? 429 : 500;
    return NextResponse.json(
      {
        error:
          status === 429
            ? "Too many login attempts. Try again later."
            : "Unable to sign in",
      },
      { status },
    );
  }
}
