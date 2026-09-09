export const PAYSTACK_SHOP_URL = "https://paystack.shop/pay/gigoplanet";
export const PAYSTACK_PAGE_SLUG = "gigoplanet";
/** Amount in kobo (₦10,000) */
export const COURSE_AMOUNT_KOBO = 1_000_000;

/** Where Paystack should send buyers after a successful charge. */
export function getPaymentSuccessUrl(origin: string) {
  return `${origin.replace(/\/$/, "")}/api/paystack/callback`;
}

/** In-app checkout that initializes Paystack with an explicit callback_url. */
export const PAYSTACK_CHECKOUT_URL = "/checkout";
