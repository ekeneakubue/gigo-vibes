export const PAYSTACK_SHOP_URL = "https://paystack.shop/pay/gigoplanet";
export const PAYSTACK_PAGE_SLUG = "gigoplanet";
/** Amount in kobo (₦10,000) */
export const COURSE_AMOUNT_KOBO = 1_000_000;

export function getPaymentSuccessUrl(origin: string) {
  return `${origin.replace(/\/$/, "")}/api/paystack/callback`;
}

/** @deprecated Use PAYSTACK_SHOP_URL — kept so older imports keep working */
export const PAYSTACK_CHECKOUT_URL = "/api/paystack/checkout";
