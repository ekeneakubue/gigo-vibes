import Link from "next/link";
import { courseModules, demoUsers, faqItems } from "../lib/content";

const stats = [
  {
    label: "Paid students",
    value: String(demoUsers.filter((user) => user.status === "active").length),
    hint: "Active access",
  },
  {
    label: "Modules",
    value: String(courseModules.length),
    hint: `${courseModules.length * 5} lessons total`,
  },
  {
    label: "FAQ entries",
    value: String(faqItems.length),
    hint: "Published answers",
  },
  {
    label: "Revenue (demo)",
    value: "₦50,000",
    hint: "Last 7 days",
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 text-[#0c0e16]">
      <div>
        <p className="font-mono text-[11px] tracking-[0.2em] text-[#155e75] uppercase">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c0e16]">
          Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4b5563]">
          Track enrolments, curriculum content, and FAQ coverage for GigoPlanet
          Coding Vibes.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#d5dae6] bg-white p-5"
          >
            <p className="text-sm font-medium text-[#3d4558]">{stat.label}</p>
            <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-[#0c0e16]">
              {stat.value}
            </p>
            <p className="mt-2 text-xs font-medium text-[#4b5563]">{stat.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#d5dae6] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-[#0c0e16]">
              Recent students
            </h2>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-[#155e75] hover:underline"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[#e5e8f0]">
            {demoUsers.slice(0, 4).map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-[#0c0e16]">{user.name}</p>
                  <p className="text-xs text-[#4b5563]">{user.email}</p>
                </div>
                <span className="font-mono text-[11px] font-semibold text-[#374151] uppercase">
                  {user.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#d5dae6] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-[#0c0e16]">
              Quick links
            </h2>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              {
                href: "/admin/users",
                title: "Manage users",
                body: "Review paid students and access status.",
              },
              {
                href: "/admin/curriculum",
                title: "Edit curriculum",
                body: "Modules and lesson outlines.",
              },
              {
                href: "/admin/faqs",
                title: "Update FAQs",
                body: "Answers shown on the marketing site.",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[10px] border border-[#d5dae6] bg-[#f4f5f9] px-4 py-3 transition-colors hover:border-[#c5cad6] hover:bg-[#eef0f6]"
              >
                <p className="text-sm font-semibold text-[#0c0e16]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-[#4b5563]">{item.body}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
