import { SectionHeading } from "./section-heading";
import type { AdminTechStackItem } from "../lib/tech-stack";

export function TechStack({ items }: { items: AdminTechStackItem[] }) {
  return (
    <section
      id="stack"
      className="relative overflow-hidden border-y border-foreground/8 bg-ink-900/40 py-24"
    >
      <div className="pointer-events-none absolute top-0 -right-32 size-[26rem] rounded-full bg-cyan-brand/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-[22rem] rounded-full bg-violet-brand/10 blur-[130px]" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          align="left"
          eyebrow="Core Technology Stack"
          title={
            <>
              The tools you will actually{" "}
              <span className="text-gradient">work with</span>
            </>
          }
          description="Every module is built around the same production stack — from the AI editor to deploy."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((tech) => (
            <article
              key={tech.id}
              className="group glass relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-cyan-brand/40 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-25"
              />

              <div className="relative flex items-start gap-4">
                {tech.logo ? (
                  <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-foreground/12 bg-ink-850">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tech.logo}
                      alt=""
                      className="size-full object-contain p-1.5"
                    />
                  </span>
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-800 font-mono text-[13px] font-semibold tracking-tight text-foreground"
                  >
                    {tech.mark}
                  </span>
                )}

                <div className="min-w-0">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                    {tech.layer}
                  </span>
                  <h3 className="mt-1.5 text-base font-semibold tracking-tight">
                    {tech.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {tech.purpose}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
