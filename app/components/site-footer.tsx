import Link from "next/link";
import { Logo } from "./logo";

const columns = [
  {
    heading: "Learn",
    links: [
      { label: "Software track", href: "#top" },
      { label: "Business websites", href: "#top" },
      { label: "Portfolios", href: "#top" },
      { label: "Free lessons", href: "#top" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Prompt library", href: "#top" },
      { label: "Cursor rules pack", href: "#top" },
      { label: "Design tokens", href: "#top" },
      { label: "Blog", href: "#top" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About GigoPlanet", href: "#top" },
      { label: "Mentors", href: "#top" },
      { label: "Contact", href: "#top" },
      { label: "Affiliates", href: "#top" },
      { label: "Admin", href: "/admin" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/8 bg-ink-950">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
              A training studio for people who want to build software with AI
              and still understand what they shipped.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="font-mono text-[11px] tracking-[0.2em] text-foreground/70 uppercase">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-foreground/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] text-muted">
            © {new Date().getFullYear()} GigoPlanet Coding Vibes · Built with
            AI, reviewed by humans
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Discord", "YouTube"].map((item) => (
              <a
                key={item}
                href="#top"
                className="text-xs text-muted transition-colors hover:text-foreground"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
