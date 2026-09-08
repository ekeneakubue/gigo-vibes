import { AgentPreview } from "./agent-preview";
import { BuyButtons } from "./buy-buttons";

const stats = [
  { value: "12,400+", label: "Builders trained" },
  { value: "40+", label: "Guided projects" },
  { value: "3", label: "Career tracks" },
  { value: "4.9/5", label: "Learner rating" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-backdrop pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 -left-32 size-[34rem] rounded-full bg-violet-brand/25 blur-[120px]" />
      <div className="pointer-events-none absolute -top-24 right-0 size-[30rem] rounded-full bg-fuchsia-brand/16 blur-[120px]" />
      <div className="pointer-events-none absolute top-72 left-1/3 size-[26rem] rounded-full bg-violet-brand/16 blur-[130px]" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-5 pt-16 pb-24 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pt-10 lg:pb-32">
        <div>
          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            Learn How to Design Software with{" "}
            <span className="text-gradient">AI as your co-founder</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-muted text-pretty">
            GigoPlanet Coding Vibes teaches you how to design your website |
            Software | Mobile Applications with AI tools. No computer science
            degree required — just Prompts.
          </p>

          <BuyButtons className="mt-9" layout="row" />

          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-mono text-2xl font-semibold tracking-tight">
                  {stat.value}
                </dd>
                <p className="mt-1 text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:animate-float">
          <AgentPreview />
        </div>
      </div>
    </section>
  );
}
