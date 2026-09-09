"use client";

import { useState } from "react";
import { faqItems } from "../lib/content";
import { SectionHeading } from "./section-heading";

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mx-auto w-full max-w-4xl px-5 py-24 sm:px-8">
      <SectionHeading eyebrow="FAQ" title="Questions we get every cohort" />

      <div className="mt-12 space-y-3">
        {faqItems.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question}
              className={`rounded-2xl border bg-foreground/[0.03] transition-colors ${
                isOpen
                  ? "border-foreground/35 bg-foreground/6"
                  : "border-foreground/20"
              }`}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() =>
                  setOpenIndex((current) => (current === index ? null : index))
                }
                className="flex w-full cursor-pointer items-center gap-4 p-5 text-left sm:gap-6 sm:p-6"
              >
                <span
                  className={`font-mono text-2xl font-semibold tabular-nums transition-colors sm:text-3xl ${
                    isOpen ? "text-foreground/30" : "text-foreground/15"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3 className="min-w-0 flex-1 text-base font-semibold tracking-tight sm:text-lg">
                  {faq.question}
                </h3>

                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-[10px] border transition-transform duration-200 ${
                    isOpen
                      ? "rotate-45 border-fuchsia-brand/50 text-fuchsia-brand"
                      : "border-foreground/12 text-muted"
                  }`}
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="size-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M8 3v10M3 8h10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-foreground/8 px-5 pb-6 sm:px-6 sm:pb-7 sm:pl-[4.75rem]">
                  <p className="mt-4 text-sm leading-7 text-muted">
                    {faq.answer}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
