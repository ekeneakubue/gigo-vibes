import { COURSE_AMOUNT_KOBO } from "./links";

export type PaystackVerifyResult = {
  ok: boolean;
  reference?: string;
  amount?: number;
  status?: string;
};

export async function verifyPaystackReference(
  reference: string,
): Promise<PaystackVerifyResult> {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret || !reference) {
    return { ok: false };
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return { ok: false };
  }

  const payload = (await response.json()) as {
    status: boolean;
    data?: {
      status?: string;
      reference?: string;
      amount?: number;
      currency?: string;
    };
  };

  const data = payload.data;
  const paid =
    payload.status === true &&
    data?.status === "success" &&
    typeof data.amount === "number" &&
    data.amount >= COURSE_AMOUNT_KOBO;

  if (!paid) {
    return {
      ok: false,
      reference: data?.reference,
      amount: data?.amount,
      status: data?.status,
    };
  }

  return {
    ok: true,
    reference: data.reference ?? reference,
    amount: data.amount,
    status: data.status,
  };
}

export const PAYMENT_ACCESS_COOKIE = "gigo_payment_access";
/** Keep access for 7 days after a verified payment. */
export const PAYMENT_ACCESS_MAX_AGE = 60 * 60 * 24 * 7;
