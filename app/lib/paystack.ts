import {
  COURSE_AMOUNT_KOBO,
  getPaymentSuccessUrl,
} from "./links";

export type PaystackVerifyResult = {
  ok: boolean;
  reference?: string;
  amount?: number;
  status?: string;
};

export function getPaystackSecret() {
  return process.env.PAYSTACK_SECRET_KEY?.trim() || "";
}

export async function initializePaystackPayment(options: {
  email: string;
  firstName?: string;
  lastName?: string;
  origin: string;
}) {
  const secret = getPaystackSecret();
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured");
  }

  const callbackUrl = getPaymentSuccessUrl(options.origin);
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: options.email,
      amount: COURSE_AMOUNT_KOBO,
      currency: "NGN",
      callback_url: callbackUrl,
      metadata: {
        custom_fields: [
          ...(options.firstName
            ? [
                {
                  display_name: "First name",
                  variable_name: "first_name",
                  value: options.firstName,
                },
              ]
            : []),
          ...(options.lastName
            ? [
                {
                  display_name: "Last name",
                  variable_name: "last_name",
                  value: options.lastName,
                },
              ]
            : []),
        ],
      },
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    status: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string; access_code?: string };
  };

  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    throw new Error(payload.message || "Unable to start Paystack checkout");
  }

  return payload.data;
}

export async function verifyPaystackReference(
  reference: string,
): Promise<PaystackVerifyResult> {
  const secret = getPaystackSecret();
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
