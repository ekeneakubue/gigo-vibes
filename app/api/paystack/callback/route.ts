import { NextResponse } from "next/server";
import {
  PAYMENT_ACCESS_COOKIE,
  PAYMENT_ACCESS_MAX_AGE,
  verifyPaystackReference,
} from "../../../lib/paystack";
import { PAYSTACK_CHECKOUT_URL } from "../../../lib/links";

/**
 * Paystack redirects here after payment with ?reference=...
 * We verify the charge, grant access, then send the student to /payment.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference")?.trim();

  if (!reference) {
    return NextResponse.redirect(new URL(PAYSTACK_CHECKOUT_URL, url.origin));
  }

  const verification = await verifyPaystackReference(reference);

  if (!verification.ok || !verification.reference) {
    return NextResponse.redirect(new URL(PAYSTACK_CHECKOUT_URL, url.origin));
  }

  const response = NextResponse.redirect(new URL("/payment", url.origin));
  response.cookies.set(PAYMENT_ACCESS_COOKIE, verification.reference, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PAYMENT_ACCESS_MAX_AGE,
  });

  return response;
}
