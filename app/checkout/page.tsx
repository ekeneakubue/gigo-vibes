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
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="grid-backdrop pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 left-1/4 size-[28rem] rounded-full bg-violet-brand/25 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 -bottom-40 size-[26rem] rounded-full bg-fuchsia-brand/20 blur-[120px]" />

      <header className="relative z-10 mx-auto flex w-full max-w-lg items-center justify-between px-5 pt-8 sm:px-8">
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

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-5 py-12 sm:px-8">
        <p className="font-mono text-xs tracking-[0.22em] text-cyan-brand uppercase">
          Checkout
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Pay <span className="text-gradient">₦10,000</span> to join the course
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          After payment, Paystack will send you back here automatically so you
          can join the Telegram training channel.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-foreground/15 bg-foreground/[0.03] p-5 sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-left text-sm">
              <span className="mb-1.5 block text-muted">First name</span>
              <input
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-12 w-full rounded-[10px] border border-foreground/12 bg-background px-4 text-foreground outline-none focus:border-violet-brand/60"
                autoComplete="given-name"
              />
            </label>
            <label className="block text-left text-sm">
              <span className="mb-1.5 block text-muted">Last name</span>
              <input
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-12 w-full rounded-[10px] border border-foreground/12 bg-background px-4 text-foreground outline-none focus:border-violet-brand/60"
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
              className="h-12 w-full rounded-[10px] border border-foreground/12 bg-background px-4 text-foreground outline-none focus:border-violet-brand/60"
              placeholder="you@email.com"
              autoComplete="email"
            />
          </label>

          {error ? (
            <p className="rounded-[10px] border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-[10px] bg-red-600 px-8 py-4 text-sm font-extrabold tracking-wider text-white uppercase shadow-lg shadow-red-600/35 transition-all hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Redirecting to Paystack…" : "Pay ₦10,000 with Paystack"}
          </button>
        </form>

        <p className="mt-4 font-mono text-[11px] leading-5 text-muted">
          Secured by Paystack. Supports card, bank, USSD, and OPay.
        </p>
      </div>
    </main>
  );
}
