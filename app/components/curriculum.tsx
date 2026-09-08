"use client";

import { useState } from "react";
import { SectionHeading } from "./section-heading";

const modules = [
  {
    week: "Module 01",
    title: "Prompting like a builder",
    description:
      "Write specs, not sentences. Scoping, context windows, planning documents and the difference between a request and a brief.",
    lessons: [
      "What an AI brief looks like vs a chat prompt",
      "Scoping a project into shippable chunks",
      "Context windows, memory and when to start over",
      "Writing a planning document the agent can follow",
      "Build: turn a one-paragraph idea into a full brief",
    ],
  },
  {
    week: "Module 02",
    title: "Cursor from zero to fluent",
    description:
      "Agent mode, inline edits, project rules, custom commands and MCP servers. The keyboard-first workflow professionals actually use.",
    lessons: [
      "Composer, Agent and Inline Edit — when to use each",
      "Project rules that keep the agent on-brand",
      "Custom commands and reusable slash workflows",
      "MCP servers for docs, databases and browsers",
      "Build: scaffold a Next.js app end-to-end in Cursor",
    ],
  },
  {
    week: "Module 03",
    title: "Antigravity and the agentic stack",
    description:
      "Run parallel agents, verify work in a real browser, and orchestrate multi-step builds without losing the thread.",
    lessons: [
      "Antigravity setup and your first agent run",
      "Running parallel agents without losing the plot",
      "Browser verification and visual QA loops",
      "Handing work between Cursor and Antigravity",
      "Build: ship a feature with two agents in parallel",
    ],
  },
  {
    week: "Module 04",
    title: "Design taste, on demand",
    description:
      "Type scales, spacing, colour systems and motion. Turn a design system into tokens your agent can build against every time.",
    lessons: [
      "Typography and spacing systems that feel intentional",
      "Colour tokens, contrast and brand constraints",
      "Motion that creates hierarchy, not noise",
      "Encoding taste into rules your agent obeys",
      "Build: redesign a generic landing page with real taste",
    ],
  },
  {
    week: "Module 05",
    title: "Ship it for real",
    description:
      "Databases, authentication, payments, environment variables, analytics and a deploy pipeline that will not embarrass you.",
    lessons: [
      "Postgres, schemas and the data the product needs",
      "Auth flows that agents get wrong — and how to fix them",
      "Payments, env vars and secrets handling",
      "Analytics, error tracking and a clean deploy pipeline",
      "Build: go from localhost to a live production URL",
    ],
  },
  {
    week: "Module 06",
    title: "Sell what you build",
    description:
      "Package your skills: pricing, proposals, client onboarding and the delivery checklist for handing a website over.",
    lessons: [
      "Packaging your offer and setting a confident price",
      "Writing proposals that close without overpromising",
      "Client onboarding without the chaos",
      "The handover checklist every project needs",
      "Build: deliver a client-ready site with a proposal pack",
    ],
  },
];

export function Curriculum() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="curriculum" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute top-1/3 -left-40 size-[30rem] rounded-full bg-violet-brand/12 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="left"
          eyebrow="Curriculum"
          title={
            <>
              Six modules from prompt to{" "}
              <span className="text-gradient">production</span>
            </>
          }
          description="Roughly four hours a module. Every module ends with a build you keep, and every build is reviewed by a human."
        />

        <div className="mt-14 space-y-3">
          {modules.map((module, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={module.title}
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
                  className="flex w-full cursor-pointer items-start gap-4 p-5 text-left sm:items-center sm:gap-6 sm:p-6 md:grid md:grid-cols-[auto_1fr_auto] md:items-center"
                >
                  <div className="flex shrink-0 items-center gap-3 md:w-28 md:flex-col md:items-start md:gap-1">
                    <span
                      className={`font-mono text-2xl font-semibold tabular-nums transition-colors sm:text-3xl ${
                        isOpen ? "text-foreground/30" : "text-foreground/15"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[11px] tracking-wider text-cyan-brand uppercase">
                      {module.week}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pr-2">
                    <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                      {module.title}
                    </h3>
                    <p className="mt-1.5 hidden text-sm leading-6 text-muted sm:block">
                      {module.description}
                    </p>
                  </div>

                  <div className="ml-auto flex shrink-0 items-center gap-3 sm:ml-0">
                    <span className="hidden font-mono text-xs whitespace-nowrap text-muted sm:inline">
                      5 lessons
                    </span>
                    <span
                      className={`grid size-8 place-items-center rounded-[10px] border transition-transform duration-200 ${
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
                  </div>
                </button>

                {isOpen ? (
                  <div className="border-t border-foreground/8 px-5 pb-6 sm:px-6 sm:pb-7 md:pl-[9.5rem]">
                    <p className="mt-4 text-sm leading-6 text-muted sm:hidden">
                      {module.description}
                    </p>
                    <ol className="mt-4 space-y-2.5 sm:mt-5">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <li
                          key={lesson}
                          className="flex items-start gap-3 rounded-[10px] bg-foreground/3 px-3.5 py-3 text-sm leading-6 text-foreground/90"
                        >
                          <span className="mt-0.5 font-mono text-[11px] text-fuchsia-brand tabular-nums">
                            {String(lessonIndex + 1).padStart(2, "0")}
                          </span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
