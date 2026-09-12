"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "../logo";

const navItems = [
  {
    href: "/admin",
    label: "Overview",
    icon: (
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: (
      <path
        d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20c.9-3.2 3.5-5 7-5s6.1 1.8 7 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    ),
  },
  {
    href: "/admin/tech-stack",
    label: "Tech Stack",
    icon: (
      <path
        d="m12 3 8 4.5-8 4.5-8-4.5zM4 12l8 4.5 8-4.5M4 16.5 12 21l8-4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/admin/curriculum",
    label: "Curriculum",
    icon: (
      <path
        d="M4 6.5h16v12H4zM8 6.5V5.2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1.3M8 11h8M8 14.5h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/admin/faqs",
    label: "FAQs",
    icon: (
      <path
        d="M12 18h.01M9.1 9a2.9 2.9 0 1 1 4.3 2.5c-.8.5-1.4 1.1-1.4 2v.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-sidebar flex shrink-0 flex-col lg:h-full lg:w-64">
      <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 lg:hidden">
        <Logo />
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle admin menu"
          onClick={() => setOpen((value) => !value)}
          className="grid size-10 place-items-center rounded-[10px] border border-white/12 text-[#e9eaf5]"
        >
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <aside
        className={`flex flex-1 flex-col border-white/8 lg:min-h-0 lg:border-r ${
          open ? "block border-b" : "hidden lg:flex"
        }`}
      >
        <div className="hidden shrink-0 border-b border-white/8 px-5 py-5 lg:block">
          <Logo />
          <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-[#9aa1bd] uppercase">
            Admin console
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-red-600/20 font-semibold text-red-400"
                    : "text-[#9aa1bd] hover:bg-white/5 hover:text-[#e9eaf5]"
                }`}
              >
                <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true">
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden shrink-0 border-t border-white/8 p-4 lg:block">
          <Link
            href="/"
            className="text-xs text-[#9aa1bd] transition-colors hover:text-[#e9eaf5]"
          >
            ← Back to website
          </Link>
        </div>
      </aside>
    </div>
  );
}
