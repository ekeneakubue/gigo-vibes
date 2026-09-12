"use client";

import { useRef, useState } from "react";
import { SectionHeading } from "./section-heading";

// Placeholder clips and posters — swap videoSrc/poster for real recordings.
const testimonials = [
  {
    name: "Amara Okonjo",
    role: "Freelance web designer · Lagos",
    initials: "AO",
    accent: "from-violet-brand to-fuchsia-brand",
    videoSrc: "https://mdn.github.io/shared-assets/videos/flower.mp4",
    poster: "https://picsum.photos/seed/gigo-review-1/800/1000",
    quote:
      "I came in as a marketer who could barely read HTML. Nine weeks later I shipped a booking site for a client.",
  },
  {
    name: "Dan Whitfield",
    role: "Product engineer · Manchester",
    initials: "DW",
    accent: "from-cyan-brand to-violet-brand",
    videoSrc: "https://mdn.github.io/shared-assets/videos/friday.mp4",
    poster: "https://picsum.photos/seed/gigo-review-2/800/1000",
    quote:
      "The Cursor module alone paid for the course. I stopped fighting the agent and started giving it a spec.",
  },
  {
    name: "Priya Raman",
    role: "UX designer · Bengaluru",
    initials: "PR",
    accent: "from-fuchsia-brand to-lime-brand",
    videoSrc:
      "https://mdn.github.io/shared-assets/videos/tears-of-steel-battle-clip-medium.mp4",
    poster: "https://picsum.photos/seed/gigo-review-3/800/1000",
    quote:
      "My portfolio finally looks like the work I actually do. Three interviews in the first month.",
  },
];

function ReviewVideoCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[number];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video || failed) return;

    if (video.paused) {
      try {
        await video.play();
        setPlaying(true);
      } catch {
        setFailed(true);
      }
      return;
    }

    video.pause();
    setPlaying(false);
  }

  return (
    <figure className="overflow-hidden rounded-2xl border border-foreground/12 bg-ink-950/70">
      <div className="relative aspect-4/5 overflow-hidden bg-ink-900">
        <div
          className={`absolute inset-0 bg-linear-to-br ${testimonial.accent} opacity-35`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(255_255_255/0.12),transparent_55%)]" />

        {!failed ? (
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover"
            src={testimonial.videoSrc}
            poster={testimonial.poster}
            playsInline
            preload="metadata"
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <span
              className={`grid size-16 place-items-center rounded-full bg-linear-to-br ${testimonial.accent} text-lg font-semibold text-white`}
            >
              {testimonial.initials}
            </span>
            <p className="text-sm leading-6 text-foreground/85 text-pretty">
              {testimonial.quote}
            </p>
          </div>
        )}

        {!failed ? (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={
              playing
                ? `Pause review from ${testimonial.name}`
                : `Play review from ${testimonial.name}`
            }
            className="absolute inset-0 grid place-items-center bg-black/20 transition-colors hover:bg-black/30"
          >
            <span className="grid size-14 place-items-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-transform hover:scale-105">
              {playing ? (
                <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                  <path d="M7 5h3.5v14H7zm6.5 0H17v14h-3.5z" fill="currentColor" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="ml-0.5 size-6"
                  aria-hidden="true"
                >
                  <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                </svg>
              )}
            </span>
          </button>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/35 to-transparent p-5 pt-16">
          <p className="text-sm font-semibold tracking-tight text-white">
            {testimonial.name}
          </p>
          <p className="mt-1 text-xs text-white/70">{testimonial.role}</p>
        </div>
      </div>
    </figure>
  );
}

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

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <ReviewVideoCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}
