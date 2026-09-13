import { NextResponse } from "next/server";
import {
  createPaymentAccessToken,
  PAYMENT_ACCESS_COOKIE,
  PAYMENT_ACCESS_MAX_AGE,
  upsertPaidEnrollment,
} from "../../../lib/course-access";
import { PAYSTACK_CHECKOUT_URL } from "../../../lib/links";
import { verifyPaystackReference } from "../../../lib/paystack";

/**
 * Paystack redirects here after payment with ?reference=...
 * We verify the charge, persist lifetime access for the email, then send
 * the student to /payment with a long-lived access cookie.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference")?.trim();

  if (!reference) {
    return NextResponse.redirect(new URL(PAYSTACK_CHECKOUT_URL, url.origin));
  }

  const verification = await verifyPaystackReference(reference);

  if (!verification.ok || !verification.reference || !verification.email) {
    return NextResponse.redirect(new URL(PAYSTACK_CHECKOUT_URL, url.origin));
  }

  await upsertPaidEnrollment({
    email: verification.email,
    reference: verification.reference,
    amount: verification.amount ?? 0,
  });

  const token = await createPaymentAccessToken(verification.email);
  const response = NextResponse.redirect(new URL("/payment", url.origin));
  response.cookies.set(PAYMENT_ACCESS_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PAYMENT_ACCESS_MAX_AGE,
  });

  return response;
}
