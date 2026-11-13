"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Logo } from "../components/logo";

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName }),
      });
      const payload = (await response.json()) as {
        authorization_url?: string;
        error?: string;
      };

      if (!response.ok || !payload.authorization_url) {
        throw new Error(payload.error || "Unable to start Paystack checkout");
      }

      window.location.assign(payload.authorization_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh flex-1 flex-col overflow-hidden">
      <div className="grid-backdrop pointer-events-none absolute inset-0" />

      <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between px-5 pt-6 sm:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-foreground"
        >
          Cancel
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid w-full max-w-4xl flex-1 items-center gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12 lg:py-8">
        <div>
          <p className="font-mono text-xs tracking-[0.22em] text-cyan-brand uppercase">
            Checkout
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Pay <span className="font-bold text-red-600">₦5,000</span> to join
            the course
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            After payment you get lifetime Telegram access for this email —
            reopen /payment anytime and unlock the invite again with the same
            address.
          </p>
          <p className="mt-4 hidden font-mono text-[11px] leading-5 text-muted lg:block">
            Secured by Paystack. Supports card, bank, USSD, and OPay.
          </p>
        </div>

        <div>
          <form
            onSubmit={onSubmit}
            className="neu-lg space-y-4 rounded-2xl bg-background p-5 sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-left text-sm">
                <span className="mb-1.5 block text-muted">First name</span>
                <input
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  className="neu-inset h-12 w-full rounded-[10px] bg-background px-4 text-foreground outline-none"
                  autoComplete="given-name"
                />
              </label>
              <label className="block text-left text-sm">
                <span className="mb-1.5 block text-muted">Last name</span>
                <input
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  className="neu-inset h-12 w-full rounded-[10px] bg-background px-4 text-foreground outline-none"
                  autoComplete="family-name"
                />
              </label>
            </div>

            <label className="block text-left text-sm">
              <span className="mb-1.5 block text-muted">Email address</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="neu-inset h-12 w-full rounded-[10px] bg-background px-4 text-foreground outline-none"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </label>

            {error ? (
              <p className="neu-inset rounded-[10px] bg-background px-3 py-2 text-sm font-medium text-[#1d4ed8]">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="neu-md inline-flex w-full items-center justify-center rounded-xl bg-background px-8 py-4 text-sm font-semibold text-foreground transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                "Redirecting to Paystack…"
              ) : (
                <>
                  Pay <span className="font-bold text-red-600">₦5,000</span> with
                  Paystack
                </>
              )}
            </button>
          </form>

          <p className="mt-4 font-mono text-[11px] leading-5 text-muted lg:hidden">
            Secured by Paystack. Supports card, bank, USSD, and OPay.
          </p>
        </div>
      </div>
    </main>
  );
}
