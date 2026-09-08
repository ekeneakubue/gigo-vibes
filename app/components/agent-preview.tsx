const steps = [
  { tool: "Read", target: "brand/design-tokens.md", state: "done" },
  { tool: "Write", target: "app/(marketing)/page.tsx", state: "done" },
  { tool: "Write", target: "components/pricing-table.tsx", state: "done" },
  { tool: "Shell", target: "npm run build", state: "running" },
] as const;

const files = [
  { name: "layout.tsx", added: 48, removed: 6 },
  { name: "page.tsx", added: 212, removed: 19 },
  { name: "globals.css", added: 37, removed: 4 },
];

export function AgentPreview() {
  return (
    <div className="glass relative rounded-2xl p-2 shadow-2xl shadow-black/60">
      <div className="rounded-xl bg-ink-900/90 ring-1 ring-white/5">
        <div className="flex items-center gap-2 border-b border-foreground/8 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <p className="ml-3 font-mono text-[11px] text-muted">
            gigoplanet — agent session
          </p>
          <span className="ml-auto rounded-md bg-foreground/6 px-2 py-0.5 font-mono text-[10px] text-muted">
            composer
          </span>
        </div>

        <div className="space-y-4 p-4">
          <div className="rounded-lg border border-violet-brand/25 bg-violet-brand/8 p-3">
            <p className="font-mono text-[10px] tracking-widest text-violet-brand uppercase">
              You
            </p>
            <p className="mt-1.5 font-mono text-[13px] leading-relaxed text-foreground/90">
              Build the pricing page for my studio — three tiers, annual
              toggle, match the brand tokens.
              <span className="ml-0.5 inline-block h-4 w-[7px] translate-y-0.5 animate-caret bg-cyan-brand" />
            </p>
          </div>

          <ul className="space-y-2">
            {steps.map((step) => (
              <li
                key={step.target}
                className="flex items-center gap-3 rounded-lg bg-foreground/3 px-3 py-2"
              >
                {step.state === "done" ? (
                  <svg
                    viewBox="0 0 16 16"
                    className="size-4 shrink-0 text-lime-brand"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5l3 3 6-7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="size-4 shrink-0 rounded-full border-2 border-cyan-brand border-t-transparent" />
                )}
                <span className="font-mono text-[11px] text-cyan-brand">
                  {step.tool}
                </span>
                <span className="truncate font-mono text-[11px] text-muted">
                  {step.target}
                </span>
              </li>
            ))}
          </ul>

          <div className="rounded-lg border border-foreground/8 bg-ink-950/60 p-3">
            <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
              Changed files
            </p>
            <ul className="mt-2.5 space-y-2">
              {files.map((file) => (
                <li
                  key={file.name}
                  className="flex items-center justify-between font-mono text-[11px]"
                >
                  <span className="text-foreground/80">{file.name}</span>
                  <span className="flex gap-2">
                    <span className="text-lime-brand">+{file.added}</span>
                    <span className="text-[#ff7a8a]">-{file.removed}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="glass absolute -right-4 -bottom-6 hidden items-center gap-3 rounded-xl px-4 py-3 sm:flex">
        <span className="grid size-9 place-items-center rounded-lg bg-lime-brand/15 text-lime-brand">
          <svg viewBox="0 0 20 20" className="size-4.5" aria-hidden="true">
            <path
              d="M4 10.5l4 4 8-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span>
          <p className="text-xs font-semibold">Deployed in 14 minutes</p>
          <p className="font-mono text-[10px] text-muted">
            week 2 · student project
          </p>
        </span>
      </div>
    </div>
  );
}
