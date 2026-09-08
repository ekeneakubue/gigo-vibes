export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <span className="relative grid size-9 place-items-center rounded-xl bg-linear-to-br from-red-500 via-violet-brand to-fuchsia-brand">
        <span className="absolute inset-px rounded-[11px] bg-black/85" />
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="relative size-4.5 text-white"
        >
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <ellipse
            cx="12"
            cy="12"
            rx="10.5"
            ry="4.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(-28 12 12)"
            opacity="0.85"
          />
        </svg>
      </span>
      <span className="text-[15px] leading-tight font-semibold tracking-tight">
        GigoPlanet
        <span className="block font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
          Coding Vibes
        </span>
      </span>
    </span>
  );
}
