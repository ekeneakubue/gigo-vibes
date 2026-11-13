import { SectionHeading } from "./section-heading";

const features = [
  {
    title: "Updated every month",
    description:
      "AI tools change weekly. Lessons are re-recorded whenever Cursor, Antigravity or the model underneath them changes meaningfully.",
  },
  {
    title: "Taste, not templates",
    description:
      "Anyone can generate a landing page. You learn the design judgement that separates a real product from a prompt result.",
  },
  {
    title: "Human code review",
    description:
      "Every project submission gets a recorded walkthrough from a mentor — what works, what breaks, what to fix first.",
  },
  {
    title: "A community that ships",
    description:
      "A Discord of builders posting work in progress daily, plus weekly live co-working and office hours.",
  },
  {
    title: "The freelance playbook",
    description:
      "Contracts, pricing sheets, proposal templates and a handover checklist you can use on your first paid job.",
  },
  {
    title: "Lifetime access",
    description:
      "Buy once, keep everything — including future modules, project files and the prompt library.",
  },
];

export function Features() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Why GigoPlanet"
          title={
            <>
              Everything a{" "}
              <span className="text-gradient">self-taught builder</span> is
              usually missing
            </>
          }
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="neu-lg rounded-2xl bg-background p-7 transition hover:-translate-y-px"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
