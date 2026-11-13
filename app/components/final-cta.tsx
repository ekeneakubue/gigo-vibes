import { BuyButtons } from "./buy-buttons";

export function FinalCta() {
  return (
    <section id="buy" className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
      <div className="neu-lg relative overflow-hidden rounded-3xl bg-background px-6 py-16 text-center sm:px-16">
        <div className="grid-backdrop pointer-events-none absolute inset-0" />

        <div className="relative">
          <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            The gap between an idea and a live site is now{" "}
            <span className="text-gradient">one weekend</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted text-pretty">
            Join 12,400 builders learning to design software, business websites
            and portfolios with the AI tools the industry is actually hiring
            for.
          </p>

          <BuyButtons className="mx-auto mt-9" />

          <p className="mt-4 font-mono text-[11px] text-muted">
            Join the link to the course after payment.
          </p>
        </div>
      </div>
    </section>
  );
}
