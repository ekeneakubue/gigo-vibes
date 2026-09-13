import { NextResponse } from "next/server";
import {
  createPaymentAccessToken,
  findEnrollmentByEmail,
  PAYMENT_ACCESS_COOKIE,
  PAYMENT_ACCESS_MAX_AGE,
} from "../../../lib/course-access";

/**
 * Reclaim lifetime Telegram access with the email used at checkout.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown };
    if (typeof body.email !== "string") {
      return NextResponse.json(
        { error: "Enter the email you used to pay." },
        { status: 400 },
      );
    }

    const email = body.email.trim().toLowerCase();
    if (!email || !email.includes("@") || email.length > 254) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    // Reject control chars / injection noise.
    // eslint-disable-next-line no-control-regex
    if (/[\u0000-\u001F\u007F-\u009F<>'"`\\;]/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const enrollment = await findEnrollmentByEmail(email);
    if (!enrollment) {
      return NextResponse.json(
        {
          error:
            "No completed payment found for that email. Check the address you used at checkout.",
        },
        { status: 404 },
      );
    }

    const token = await createPaymentAccessToken(enrollment.email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(PAYMENT_ACCESS_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: PAYMENT_ACCESS_MAX_AGE,
    });

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to restore access";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
