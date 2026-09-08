import { SectionHeading } from "./section-heading";

const steps = [
  {
    step: "Step 1",
    title: "Pick a track and a real brief",
    description:
      "Choose software, a business website or a portfolio. You start with an actual client-style brief, not a to-do app.",
  },
  {
    step: "Step 2",
    title: "Build alongside the agent",
    description:
      "Follow the session, pause where you like, and let Cursor or Antigravity do the typing while you make the decisions.",
  },
  {
    step: "Step 3",
    title: "Ship, review, repeat",
    description:
      "Deploy it, drop the link in the community, and get a recorded review from a mentor within 48 hours.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="How it works"
        title={
          <>
            Learn by <span className="text-gradient">shipping</span>, not by
            watching
          </>
        }
        description="No 12-hour video dumps. Short sessions, one build at a time, with feedback from people who do this for a living."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-12 -right-3 hidden h-px w-6 bg-linear-to-r from-foreground/25 to-transparent md:block"
              />
            ) : null}

            <div className="glass h-full rounded-2xl p-7">
              <span className="font-mono text-[11px] tracking-[0.2em] text-fuchsia-brand uppercase">
                {step.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-balance">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
