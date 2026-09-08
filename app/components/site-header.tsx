"use client";

import { useState } from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "#curriculum", label: "Curriculum" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-foreground/8 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <a href="#top" className="shrink-0">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <a
            href="#buy"
            className="rounded-[10px] bg-red-600 px-6 py-3 text-xs font-extrabold tracking-wider whitespace-nowrap text-white uppercase shadow-lg shadow-red-600/35 transition-all hover:scale-[1.03] hover:bg-red-500"
          >
            Buy now — ₦10,000
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Toggle navigation menu"
            className="grid size-10 place-items-center rounded-[10px] border border-foreground/12 text-foreground"
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
      </div>

      {open ? (
        <div className="border-t border-foreground/8 bg-background/95 px-5 py-4 lg:hidden">
          <nav className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#buy"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-[10px] bg-red-600 px-6 py-4 text-center text-sm font-extrabold tracking-wider text-white uppercase shadow-lg shadow-red-600/30"
            >
              Buy now — ₦10,000
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
