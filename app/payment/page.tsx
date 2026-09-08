import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "../components/logo";

export const metadata: Metadata = {
  title: "Payment successful",
  description:
    "Welcome to GigoPlanet Coding Vibes. Join the Telegram training channel to start your course.",
};

const TELEGRAM_CHANNEL_URL =
  process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "https://t.me/+r8sGJySc0MQ5Y2Jk";

export default function PaymentPage() {
  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="grid-backdrop pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-32 left-1/4 size-[28rem] rounded-full bg-violet-brand/30 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 -bottom-40 size-[26rem] rounded-full bg-fuchsia-brand/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 size-[18rem] rounded-full bg-lime-brand/10 blur-[100px]" />


      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-5 py-16 text-center sm:px-8 sm:py-15">
        <div className="animate-float relative mb-8 grid size-20 place-items-center rounded-[20px] bg-lime-brand/15 ring-1 ring-lime-brand/35">
          <span className="absolute inset-0 rounded-[20px] bg-lime-brand/10 blur-xl" />
          <svg
            viewBox="0 0 24 24"
            className="relative size-10 text-lime-brand"
            aria-hidden="true"
          >
            <path
              d="M5 12.5l4.5 4.5L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="font-mono text-xs tracking-[0.24em] text-lime-brand uppercase">
          Payment successful
        </p>

        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Welcome to{" "}
          <span className="text-gradient">GigoPlanet Coding Vibes</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-7 text-muted text-pretty sm:text-lg">
          You&apos;re in. Your seat on the course is confirmed — join the Telegram
          training channel to start your journey and get mentor updates.
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col gap-3">
          <a
            href={TELEGRAM_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-blink-soft inline-flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-[#229ED9] px-10 py-5 text-sm font-extrabold tracking-wider text-white uppercase shadow-lg shadow-[#229ED9]/30 transition-colors hover:bg-[#1c8fc7]"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              aria-hidden="true"
              fill="currentColor"
            >
              <path d="M21.8 4.3c.3-.9-.5-1.6-1.3-1.3L2.7 9.6c-.9.3-.9 1.6.1 1.8l4.7 1.4 1.8 5.6c.2.7 1.1.9 1.6.4l2.6-2.6 4.7 3.5c.7.5 1.7.1 1.9-.7l3.7-14.7zM9.6 14.1l-.5 2.8-.9-3.5 10.2-6.2-8.8 6.9z" />
            </svg>
            Join Telegram training channel
          </a>          
        </div>        
      </div>
    </main>
  );
}
