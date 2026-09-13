export const ADMIN_SESSION_COOKIE = "gigo_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type AdminSession = {
  sub: string;
  email: string;
  name: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not configured (min 32 characters).",
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
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signPayload(payload: string, secret: string) {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(signature);
}

export async function createAdminSessionToken(admin: {
  id: string;
  email: string;
  name: string;
}) {
  const secret = getSessionSecret();
  const session: AdminSession = {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  };
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify(session)));
  const signature = await signPayload(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifyAdminSessionToken(
  token: string | undefined | null,
): Promise<AdminSession | null> {
  if (!token || !token.includes(".")) return null;

  try {
    const secret = getSessionSecret();
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

    const json = new TextDecoder().decode(fromBase64Url(payload));
    const session = JSON.parse(json) as AdminSession;

    if (
      typeof session.sub !== "string" ||
      typeof session.email !== "string" ||
      typeof session.name !== "string" ||
      typeof session.exp !== "number"
    ) {
      return null;
    }

    if (session.exp * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}
