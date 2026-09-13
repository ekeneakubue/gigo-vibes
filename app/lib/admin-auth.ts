import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { createAdminSessionToken } from "./admin-session";

export {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSessionToken,
  verifyAdminSessionToken,
  type AdminSession,
} from "./admin-session";

const EMAIL_MAX = 254;
const PASSWORD_MAX = 128;
const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

type AdminRow = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

/** Strip control chars / null bytes and bound length — defense in depth before ORM. */
export function sanitizeLoginInput(raw: {
  email?: unknown;
  password?: unknown;
}): LoginCredentials | { error: string } {
  if (typeof raw.email !== "string" || typeof raw.password !== "string") {
    return { error: "Email and password are required." };
  }

  // Reject null bytes and other C0/C1 control characters (injection vectors).
  // eslint-disable-next-line no-control-regex
  const CONTROL_CHARS = /[\u0000-\u001F\u007F-\u009F]/;

  if (CONTROL_CHARS.test(raw.email) || CONTROL_CHARS.test(raw.password)) {
    return { error: "Invalid credentials." };
  }

  const email = raw.email
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .slice(0, EMAIL_MAX);
  const password = raw.password.normalize("NFKC").slice(0, PASSWORD_MAX);

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (password.length < 8) {
    return { error: "Invalid credentials." };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }

  // Reject SQL/script/markup payloads in the email field.
  if (/[<>'"`\\;]|--|\/\*|\*\/|xp_|union\s+select|drop\s+table/i.test(email)) {
    return { error: "Invalid credentials." };
  }

  return { email, password };
}

export async function findAdminByEmail(email: string) {
  const rows = await prisma.$queryRaw<AdminRow[]>`
    SELECT id, name, email, "passwordHash"
    FROM admins
    WHERE email = ${email}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function authenticateAdmin(credentials: LoginCredentials) {
  const admin = await findAdminByEmail(credentials.email);
  if (!admin) {
    // Dummy compare to reduce timing oracle on missing users.
    await compare(
      credentials.password,
      "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    );
    return null;
  }

  const valid = await compare(credentials.password, admin.passwordHash);
  if (!valid) return null;

  return { id: admin.id, email: admin.email, name: admin.name };
}

/** Very small in-memory rate limit for login attempts per IP. */
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export function assertLoginRateLimit(ip: string) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxAttempts = 10;
  const current = loginAttempts.get(ip);

  if (!current || current.resetAt < now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return;
  }

  current.count += 1;
  if (current.count > maxAttempts) {
    throw new Error("Too many login attempts. Try again later.");
  }
}

export function clearLoginRateLimit(ip: string) {
  loginAttempts.delete(ip);
}
