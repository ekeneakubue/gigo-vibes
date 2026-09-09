import { NextResponse } from "next/server";
import { initializePaystackPayment } from "../../../lib/paystack";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      firstName?: string;
      lastName?: string;
    };

    const email = body.email?.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 },
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
      new URL(request.url).origin;

    const data = await initializePaystackPayment({
      email,
      firstName: body.firstName?.trim(),
      lastName: body.lastName?.trim(),
      origin,
    });

    return NextResponse.json({
      authorization_url: data.authorization_url,
      reference: data.reference,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to start checkout";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
