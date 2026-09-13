"use client";

import { FormEvent, useId, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "../logo";

const fieldClassName =
  "w-full rounded-[12px] border-2 border-[#c5cad6] bg-white px-3.5 py-3 text-[#0c0e16] outline-none transition-colors focus:border-red-600";

/** Only allow same-origin /admin paths — blocks open redirects. */
function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/admin") || value.startsWith("//")) {
    return "/admin";
  }
  if (value.includes("://") || value.includes("\\") || value.includes("@")) {
    return "/admin";
  }
  return value;
}

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        // Never render raw server strings that might echo input.
        const message = payload.error || "Unable to sign in";
        throw new Error(
          /invalid|required|valid|many|credentials/i.test(message)
            ? message
            : "Unable to sign in",
        );
      }

      router.replace(safeNextPath(searchParams.get("next")));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#f4f5f9]">
      <aside className="relative hidden w-[42%] shrink-0 flex-col justify-between overflow-hidden bg-[#090b14] px-10 py-12 text-[#e9eaf5] lg:flex">
        <div className="pointer-events-none absolute -top-24 -left-16 size-[22rem] rounded-full bg-red-600/25 blur-[110px]" />
        <div className="pointer-events-none absolute right-0 bottom-0 size-[20rem] rounded-full bg-cyan-400/15 blur-[120px]" />

        <div className="relative">
          <Logo />
          <p className="mt-8 font-mono text-[11px] tracking-[0.22em] text-[#9aa1bd] uppercase">
            Admin console
          </p>
          <h1 className="mt-3 max-w-sm text-4xl font-semibold tracking-tight text-balance">
            Build with AI.
            <span className="mt-2 block text-[#ef4444]">Ship with taste.</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-[#9aa1bd]">
            Sign in to manage students, curriculum, tech stack and FAQs for
            GigoPlanet Coding Vibes.
          </p>
        </div>

        <ul className="relative space-y-3 font-mono text-[11px] tracking-[0.14em] text-[#9aa1bd] uppercase">
          <li>Parameterized queries</li>
          <li>httpOnly signed sessions</li>
          <li>Rate-limited sign-in</li>
        </ul>
      </aside>

      <div className="relative flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute -top-20 -right-16 size-[18rem] rounded-full bg-red-500/10 blur-[100px]" />

        <div className="relative w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>

          <p className="font-mono text-[11px] tracking-[0.22em] text-[#155e75] uppercase">
            Admin access
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c0e16]">
            Sign in
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#4b5563]">
            Use your console credentials. Sessions expire after 7 days.
          </p>

          <form
            onSubmit={onSubmit}
            className="mt-8 rounded-2xl border border-[#d5dae6] bg-white p-6 shadow-[0_20px_60px_rgb(12_14_22_/_0.08)] sm:p-8"
            autoComplete="on"
            noValidate
          >
            <label className="block text-sm" htmlFor={emailId}>
              <span className="mb-1.5 block font-medium text-[#3d4558]">
                Email
              </span>
              <input
                id={emailId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                required
                maxLength={254}
                spellCheck={false}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${fieldClassName} h-12`}
                placeholder="admin@gigoplanet.com"
                autoFocus
              />
            </label>

            <label className="mt-4 block text-sm" htmlFor={passwordId}>
              <span className="mb-1.5 block font-medium text-[#3d4558]">
                Password
              </span>
              <div className="relative">
                <input
                  id={passwordId}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={128}
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`${fieldClassName} h-12 pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#6b7280] hover:text-[#0c0e16]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="none"
                    aria-hidden="true"
                  >
                    {showPassword ? (
                      <path
                        d="M4 4l16 16M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M9.9 5.2A10.4 10.4 0 0 1 12 5c5.2 0 9.2 3.7 10.5 7-.5 1.2-1.3 2.4-2.4 3.4M6.1 6.1C4.4 7.3 3.1 8.9 2 12c1.3 3.3 5.3 7 10.5 7 1.4 0 2.7-.2 3.9-.6"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : (
                      <>
                        <path
                          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </label>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-[10px] border border-[#f1c4c4] bg-[#fef2f2] px-3 py-2.5 text-sm font-medium text-[#b91c1c]"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-[12px] bg-red-600 px-4 py-3.5 text-xs font-extrabold tracking-wider text-white uppercase transition-opacity disabled:opacity-60"
            >
              {saving ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6b7280]">
            <Link href="/" className="hover:text-[#0c0e16]">
              ← Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
