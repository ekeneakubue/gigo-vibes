"use client";

import { useState } from "react";
import { PAYSTACK_CHECKOUT_URL } from "../lib/links";
import { Logo } from "./logo";

const links = [
  { href: "#curriculum", label: "Curriculum" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="neu-header sticky top-0 z-50 bg-background">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={PAYSTACK_CHECKOUT_URL}
            className="neu rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:opacity-80 active:opacity-60"
          >
            Buy now — <span className="font-bold text-red-600">₦5,000</span>
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="neu grid size-10 place-items-center rounded-[10px] bg-background text-foreground lg:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <div className="border-t border-foreground/8 bg-background px-5 py-4 lg:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-muted transition hover:opacity-80"
              >
                {link.label}
              </a>
            ))}
            <a
              href={PAYSTACK_CHECKOUT_URL}
              onClick={() => setOpen(false)}
              className="neu mt-3 rounded-full bg-background px-6 py-4 text-center text-sm font-semibold text-foreground"
            >
              Buy now — <span className="font-bold text-red-600">₦5,000</span>
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
