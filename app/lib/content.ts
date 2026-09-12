export type CourseModule = {
  week: string;
  title: string;
  description: string;
  lessons: string[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type TechStackItem = {
  name: string;
  mark: string;
  layer: string;
  purpose: string;
};

export const techStack: TechStackItem[] = [
  {
    name: "Cursor AI",
    mark: "CR",
    layer: "AI editor",
    purpose: "AI-powered development and vibe coding",
  },
  {
    name: "VS Code",
    mark: "VS",
    layer: "Code editor",
    purpose: "Editor foundation, extensions and debugging",
  },
  {
    name: "Antigravity AI",
    mark: "AG",
    layer: "Agentic IDE",
    purpose: "Parallel agents and browser-verified builds",
  },
  {
    name: "Next.js",
    mark: "NX",
    layer: "Framework",
    purpose: "Full-stack React framework",
  },
  {
    name: "React",
    mark: "RC",
    layer: "Interface",
    purpose: "User interface development",
  },
  {
    name: "TypeScript",
    mark: "TS",
    layer: "Language",
    purpose: "Type-safe programming",
  },
  {
    name: "Tailwind CSS",
    mark: "TW",
    layer: "Design layer",
    purpose: "UI styling",
  },
  {
    name: "Neon PostgreSQL",
    mark: "PG",
    layer: "Database",
    purpose: "Cloud relational database",
  },
  {
    name: "Prisma ORM",
    mark: "PR",
    layer: "Data layer",
    purpose: "Database access and modeling",
  },
  {
    name: "Git/GitHub",
    mark: "GH",
    layer: "Collaboration",
    purpose: "Version control",
  },
  {
    name: "Vercel",
    mark: "VC",
    layer: "Deployment",
    purpose: "Application deployment",
  },
  {
    name: "Cloudflare",
    mark: "CF",
    layer: "Edge & security",
    purpose: "CDN, DNS, and edge security",
  },
];

export const courseModules: CourseModule[] = [
  {
    week: "Module 01",
    title: "Prompting like a builder",
    description:
      "Write specs, not sentences. Scoping, context windows, planning documents and the difference between a request and a brief.",
    lessons: [
      "What an AI brief looks like vs a chat prompt",
      "Scoping a project into shippable chunks",
      "Context windows, memory and when to start over",
      "Writing a planning document the agent can follow",
      "Build: turn a one-paragraph idea into a full brief",
    ],
  },
  {
    week: "Module 02",
    title: "Cursor from zero to fluent",
    description:
      "Agent mode, inline edits, project rules, custom commands and MCP servers. The keyboard-first workflow professionals actually use.",
    lessons: [
      "Composer, Agent and Inline Edit — when to use each",
      "Project rules that keep the agent on-brand",
      "Custom commands and reusable slash workflows",
      "MCP servers for docs, databases and browsers",
      "Build: scaffold a Next.js app end-to-end in Cursor",
    ],
  },
  {
    week: "Module 03",
    title: "Antigravity and the agentic stack",
    description:
      "Run parallel agents, verify work in a real browser, and orchestrate multi-step builds without losing the thread.",
    lessons: [
      "Antigravity setup and your first agent run",
      "Running parallel agents without losing the plot",
      "Browser verification and visual QA loops",
      "Handing work between Cursor and Antigravity",
      "Build: ship a feature with two agents in parallel",
    ],
  },
  {
    week: "Module 04",
    title: "Design taste, on demand",
    description:
      "Type scales, spacing, colour systems and motion. Turn a design system into tokens your agent can build against every time.",
    lessons: [
      "Typography and spacing systems that feel intentional",
      "Colour tokens, contrast and brand constraints",
      "Motion that creates hierarchy, not noise",
      "Encoding taste into rules your agent obeys",
      "Build: redesign a generic landing page with real taste",
    ],
  },
  {
    week: "Module 05",
    title: "Ship it for real",
    description:
      "Databases, authentication, payments, environment variables, analytics and a deploy pipeline that will not embarrass you.",
    lessons: [
      "Postgres, schemas and the data the product needs",
      "Auth flows that agents get wrong — and how to fix them",
      "Payments, env vars and secrets handling",
      "Analytics, error tracking and a clean deploy pipeline",
      "Build: go from localhost to a live production URL",
    ],
  },
  {
    week: "Module 06",
    title: "Sell what you build",
    description:
      "Package your skills: pricing, proposals, client onboarding and the delivery checklist for handing a website over.",
    lessons: [
      "Packaging your offer and setting a confident price",
      "Writing proposals that close without overpromising",
      "Client onboarding without the chaos",
      "The handover checklist every project needs",
      "Build: deliver a client-ready site with a proposal pack",
    ],
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Do I need to know how to code already?",
    answer:
      "No. Module one assumes you have never opened a terminal. What you do need is patience for detail — AI removes the typing, not the thinking.",
  },
  {
    question: "Which AI tools will I need to pay for?",
    answer:
      "You can complete the whole curriculum on free tiers. We teach Cursor and Antigravity as the primary editors and show free alternatives for every paid feature, so budget is never the blocker.",
  },
  {
    question: "What if the tools change after I enrol?",
    answer:
      "That is the point of the monthly refresh. When an editor ships a breaking change, the affected lessons are re-recorded and you get an email with a short diff of what moved.",
  },
  {
    question: "How much time does this take each week?",
    answer:
      "Around four hours: roughly two hours of lessons and two hours of building. The cohort is paced but the material is on demand, so you can go faster or slower.",
  },
  {
    question: "Will I own the projects I build?",
    answer:
      "Completely. Every project, template and prompt is yours to use commercially, including work you deliver to paying clients.",
  },
  {
    question: "Is there a refund if it is not for me?",
    answer:
      "Yes — 14 days, no questions, no forms. The free tier also gives you all of module one so you can judge before paying anything.",
  },
];

export const demoUsers = [
  {
    id: "usr_01",
    name: "Amara Okonjo",
    email: "amara@studio.ng",
    status: "active" as const,
    paidAt: "2026-09-02",
  },
  {
    id: "usr_02",
    name: "Dan Whitfield",
    email: "dan@whitfield.dev",
    status: "active" as const,
    paidAt: "2026-09-04",
  },
  {
    id: "usr_03",
    name: "Priya Raman",
    email: "priya@design.co",
    status: "pending" as const,
    paidAt: "2026-09-07",
  },
  {
    id: "usr_04",
    name: "Emeka Nwosu",
    email: "emeka@build.africa",
    status: "active" as const,
    paidAt: "2026-09-08",
  },
  {
    id: "usr_05",
    name: "Sofia Mendes",
    email: "sofia@mendes.io",
    status: "refunded" as const,
    paidAt: "2026-08-28",
  },
];
