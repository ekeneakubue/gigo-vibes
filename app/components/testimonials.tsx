import { SectionHeading } from "./section-heading";

const testimonials = [
  {
    quote:
      "I came in as a marketer who could barely read HTML. Nine weeks later I shipped a booking site for a client and charged £2,400 for it.",
    name: "Amara Okonjo",
    role: "Freelance web designer · Lagos",
    initials: "AO",
    accent: "from-violet-brand to-fuchsia-brand",
  },
  {
    quote:
      "The Cursor module alone paid for the course. I stopped fighting the agent and started giving it a spec — my output roughly tripled.",
    name: "Dan Whitfield",
    role: "Product engineer · Manchester",
    initials: "DW",
    accent: "from-cyan-brand to-violet-brand",
  },
  {
    quote:
      "My portfolio finally looks like the work I actually do. Three interviews in the first month after I rebuilt it here.",
    name: "Priya Raman",
    role: "UX designer · Bengaluru",
    initials: "PR",
    accent: "from-fuchsia-brand to-lime-brand",
  },
];

export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24 sm:px-8">
      <SectionHeading
        eyebrow="Reviews"
        title={
          <>
            Built by people who had{" "}
            <span className="text-gradient">never shipped before</span>
          </>
        }
      />

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name} className="glass rounded-2xl p-7">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-7 text-foreground/15"
            >
              <path
                d="M9.6 5.4C6.5 6.9 4.8 9.6 4.8 13.3v5.3h6.1v-6H8.1c0-2.4 1-4 3-5.1zm9.6 0c-3.1 1.5-4.8 4.2-4.8 7.9v5.3h6.1v-6h-2.8c0-2.4 1-4 3-5.1z"
                fill="currentColor"
              />
            </svg>

            <blockquote className="mt-4 text-[15px] leading-7 text-foreground/90 text-pretty">
              {testimonial.quote}
            </blockquote>

            <figcaption className="mt-6 flex items-center gap-3 border-t border-foreground/8 pt-6">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br ${testimonial.accent} text-xs font-semibold text-white`}
              >
                {testimonial.initials}
              </span>
              <span>
                <p className="text-sm font-medium">{testimonial.name}</p>
                <p className="text-xs text-muted">{testimonial.role}</p>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
