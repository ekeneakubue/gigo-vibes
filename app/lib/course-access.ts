import { prisma } from "./prisma";

export const PAYMENT_ACCESS_COOKIE = "gigo_payment_access";
/** Lifetime access for paid emails — 10 years. */
export const PAYMENT_ACCESS_MAX_AGE = 60 * 60 * 24 * 365 * 10;

export type PaidEnrollmentRecord = {
  id: string;
  email: string;
  reference: string;
  amount: number;
  paidAt: Date;
};

type EnrollmentRow = {
  id: string;
  email: string;
  reference: string;
  amount: number;
  paidAt: Date;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function findEnrollmentByEmail(email: string) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const rows = await prisma.$queryRaw<EnrollmentRow[]>`
    SELECT id, email, reference, amount, "paidAt"
    FROM paid_enrollments
    WHERE email = ${normalized}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function findEnrollmentByReference(reference: string) {
  const rows = await prisma.$queryRaw<EnrollmentRow[]>`
    SELECT id, email, reference, amount, "paidAt"
    FROM paid_enrollments
    WHERE reference = ${reference}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

export async function upsertPaidEnrollment(input: {
  email: string;
  reference: string;
  amount: number;
}) {
  const email = normalizeEmail(input.email);
  const reference = input.reference.trim();
  const amount = input.amount;
  const id = `pay_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

  await prisma.$executeRaw`
    INSERT INTO paid_enrollments
      (id, email, reference, amount, "paidAt", "createdAt", "updatedAt")
    VALUES
      (${id}, ${email}, ${reference}, ${amount}, NOW(), NOW(), NOW())
    ON CONFLICT (email) DO UPDATE SET
      reference = EXCLUDED.reference,
      amount = EXCLUDED.amount,
      "paidAt" = paid_enrollments."paidAt",
      "updatedAt" = NOW()
  `;

  return findEnrollmentByEmail(email);
}

function getAccessSecret() {
  const secret =
    process.env.PAYMENT_ACCESS_SECRET?.trim() ||
    process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error(
      "PAYMENT_ACCESS_SECRET or ADMIN_SESSION_SECRET is not configured (min 32 characters).",
    );
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of view) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad =
    padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function signPayload(payload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(signature);
}

/** Signed cookie value that permanently ties a browser to a paid email. */
export async function createPaymentAccessToken(email: string) {
  const secret = getAccessSecret();
  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        email: normalizeEmail(email),
        exp: Math.floor(Date.now() / 1000) + PAYMENT_ACCESS_MAX_AGE,
      }),
    ),
  );
  const signature = await signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifyPaymentAccessToken(
  token: string | undefined | null,
): Promise<{ email: string } | null> {
  if (!token || !token.includes(".")) return null;

  try {
    const secret = getAccessSecret();
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;

    const expected = await signPayload(payload, secret);
    const left = fromBase64Url(signature);
    const right = fromBase64Url(expected);
    if (left.length !== right.length) return null;

    let diff = 0;
    for (let i = 0; i < left.length; i += 1) {
      diff |= left[i] ^ right[i];
    }
    if (diff !== 0) return null;

    const data = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payload)),
    ) as { email?: string; exp?: number };

    if (typeof data.email !== "string" || typeof data.exp !== "number") {
      return null;
    }
    if (data.exp * 1000 < Date.now()) return null;

    return { email: normalizeEmail(data.email) };
  } catch {
    return null;
  }
}

export async function hasLifetimeTelegramAccess(email: string) {
  const enrollment = await findEnrollmentByEmail(email);
  return Boolean(enrollment);
}
