"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function PaymentAccessForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/paystack/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to restore access");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to restore access");
      setLoading(false);
    }
  }

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8">
      <p className="font-mono text-xs tracking-[0.24em] text-cyan-brand uppercase">
        Course access
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Already paid?{" "}
        <span className="text-gradient">Get your invite again</span>
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-muted">
        Enter the email you used at checkout. If payment completed, your
        Telegram invite unlocks permanently for that address.
      </p>

      <form
        onSubmit={onSubmit}
        className="mt-8 w-full max-w-md space-y-4 rounded-2xl border border-foreground/15 bg-foreground/[0.03] p-5 text-left sm:p-6"
      >
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">Payment email</span>
          <input
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-[10px] border border-foreground/12 bg-background px-4 text-foreground outline-none focus:border-violet-brand/60"
            placeholder="you@email.com"
            autoComplete="email"
            autoFocus
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
          className="inline-flex w-full items-center justify-center rounded-[10px] bg-red-600 px-8 py-4 text-sm font-extrabold tracking-wider text-white uppercase shadow-lg shadow-red-600/35 transition-all hover:bg-red-500 disabled:opacity-70"
        >
          {loading ? "Checking…" : "Unlock Telegram invite"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Need to pay?{" "}
        <Link href="/checkout" className="text-foreground hover:underline">
          Go to checkout
        </Link>
      </p>
    </div>
  );
}
