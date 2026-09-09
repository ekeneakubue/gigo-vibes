import { NextResponse } from "next/server";
import { PAYSTACK_CHECKOUT_URL } from "../../../lib/links";

/** Legacy shop entry — send buyers to the in-app checkout instead. */
export async function GET(request: Request) {
  return NextResponse.redirect(new URL(PAYSTACK_CHECKOUT_URL, request.url), 302);
}
