const tools = [
  "Cursor",
  "Antigravity",
  "Next.js",
  "Tailwind CSS",
  "Prisma",
  "Cloudflare",
  "TypeScript",
  "PostgreSQL",
  "Vercel",
  "Git",
  "GitHub",
  "VS Code",
];

export function ToolMarquee() {
  return (
    <section className="border-y border-foreground/8 bg-ink-900/40 py-10">
      <p className="text-center font-mono text-[11px] tracking-[0.24em] text-muted uppercase">
        The AI/Tools/Stack you will actually use
      </p>

      <div
        className="relative mt-7 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        }}
      >
        <ul className="flex w-max animate-marquee items-center gap-12 pr-12">
          {[...tools, ...tools].map((tool, index) => (
            <li
              key={`${tool}-${index}`}
              aria-hidden={index >= tools.length}
              className="text-lg font-medium whitespace-nowrap text-foreground/45 transition-colors hover:text-foreground"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
