import { NextResponse } from "next/server";
import {
  getPaymentSuccessUrl,
  PAYSTACK_PAGE_SLUG,
  PAYSTACK_SHOP_URL,
} from "../../../lib/links";

/**
 * Sends the buyer to Paystack checkout and ensures the payment page
 * redirects back to /payment after a successful charge (card, OPay, etc.).
 *
 * Set NEXT_PUBLIC_SITE_URL + PAYSTACK_SECRET_KEY so the Paystack page
 * redirect_url syncs to /api/paystack/callback (which then opens /payment).
 */
export async function GET() {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const slug = process.env.PAYSTACK_PAGE_SLUG?.trim() || PAYSTACK_PAGE_SLUG;

  if (secret && configuredOrigin) {
    const redirectUrl = getPaymentSuccessUrl(configuredOrigin);
    try {
      await fetch(`https://api.paystack.co/page/${slug}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ redirect_url: redirectUrl }),
        cache: "no-store",
      });
    } catch {
      // Still send the buyer to Paystack even if redirect sync fails.
    }
  }

  return NextResponse.redirect(PAYSTACK_SHOP_URL, 302);
}
