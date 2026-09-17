// ============================================================================
// data.js — Single source of truth for portfolio content.
// Replace every TODO value with your real details. Everything on the page
// reads from this file, so a single edit propagates site-wide.
// ============================================================================

export const data = {
  identity: {
    name: "Yaman Özdemir",
    handle: "@yamanozdemir",
    role: "Senior Frontend Engineer",
    tagline: "Shipping the web for 8 years.",
    bio: [
      "I build high-craft interfaces — and the backends behind them when a project needs it — for teams that care about the details. From motion-heavy marketing sites to systems that ship to millions of daily users.",
      "Eight years deep on the frontend across React, Vue, and Angular, with production experience on the server in ASP.NET Core and Node.js. I care about performance, accessibility, and the last 10% of polish that makes software feel alive."
    ],
    location: "Remote",
    availability: "Available for senior roles",
    email: "yamanozdemir35@gmail.com",
    resume: "public/resume.pdf"
  },

  socials: {
    github:   "https://github.com/ozdemir-yaman",
    linkedin: "https://www.linkedin.com/in/yaman-%C3%B6zdemir-32788b1a2/"
  },

  stats: [
    { label: "Years shipping",        value: 8,   suffix: "" },
    { label: "Frameworks in prod",    value: 3,   suffix: "" },
    { label: "Production deploys",    value: 2400, suffix: "+" },
    { label: "Lighthouse average",    value: 98,  suffix: "" }
  ],

  experience: [
    {
      company: "F4E",
      role: "Senior Frontend Engineer & Team Lead",
      dates: "2024 — Present",
      location: "Remote",
      bullets: [
        "Lead a team modernising a large legacy AngularJS platform via micro-frontends and a shared design system — no customer-visible downtime.",
        "Architected and shipped a self-contained Next.js AI assistant embedded inside the legacy app, powered by OpenAI and the Model Context Protocol (MCP).",
        "Introduced AI into the team's engineering workflow — measurable gains in code review throughput, test authoring, and routine task automation.",
        "Mentor junior engineers, run code reviews, and set the team's engineering standards.",
        "Contribute to product strategy, technical roadmap, and cross-functional business decisions."
      ],
      stack: ["Angular", "Next.js", "TypeScript", "ASP.NET", "OpenAI", "MCP"]
    },
    {
      company: "Freelance",
      role: "Frontend Engineer",
      dates: "2024",
      location: "Remote",
      bullets: [
        "Built a production chatbot in modern Angular backed by a custom Model Context Protocol (MCP) server.",
        "Designed the tool-calling contract end-to-end so the client's domain data could be safely exposed to an LLM without leaking sensitive context.",
        "Shipped from spec to deploy solo — architecture, UI, streaming, auth, and CI."
      ],
      stack: ["Angular", "TypeScript", "MCP", "Node.js", "OpenAI"]
    },
    {
      company: "Insider",
      role: "Frontend Engineer → Senior Frontend Engineer",
      dates: "2018 — 2024",
      location: "Istanbul, TR (Remote from 2020)",
      bullets: [
        "Six-year progression through five roles: QA Engineer → JavaScript Developer → Operation Technical Advisor → Frontend Engineer → Senior Frontend Engineer.",
        "Owned reusable UI components in Vue and React that were adopted across multiple product squads, cutting duplicated work company-wide.",
        "Wrote and maintained unit, integration, and E2E test suites (Jest, Cypress, Playwright) — kept regression rate low across a fast-moving SaaS.",
        "Deployed and operated services on AWS (Lambda, EC2, SQS, S3) with MySQL and MongoDB behind Node.js / NestJS / Express APIs.",
        "Mentored juniors, ran hiring loops, and helped shape front-end engineering standards as the team scaled."
      ],
      stack: ["Vue", "React", "TypeScript", "Node.js", "NestJS", "AWS", "Playwright"]
    }
  ],

  stack: {
    frameworks: ["React", "Next.js", "Vue 3", "Nuxt", "Angular"],
    languages:  ["TypeScript", "JavaScript", "C#", "Python", "CSS"],
    backend:    ["ASP.NET Core", "Node.js", "Express", "REST", "GraphQL"],
    tooling:    ["Vite", "Webpack", "esbuild", "Storybook", "Figma", "Git"],
    testing:    ["Vitest", "Playwright", "Selenium", "Cypress"]
  },

  projects: [
    {
      title: "Gridwright",
      tag: "Live",
      year: "2025",
      blurb: "An infinite graph-paper canvas for quick sketches — pan, zoom, and draw on a grid that never ends.",
      stack: ["Vanilla JS", "Canvas", "HTML", "CSS"],
      url: "https://ozdemir-yaman.github.io/gridwright/"
    },
    {
      title: "Tetris",
      tag: "Live",
      year: "2025",
      blurb: "A classic Tetris built in pure JS with a hand-rolled virtual DOM for maximum render performance.",
      stack: ["Vanilla JS", "VDOM", "HTML", "CSS"],
      url: "https://ozdemir-yaman.github.io/Tetris/"
    },
    {
      title: "Shadowcn",
      tag: "Coming Soon",
      year: "2026",
      blurb: "A shadcn-style component library built on Shadow DOM so it drops into any framework. Aimed at teams stuck on legacy stacks who can't justify a full migration.",
      stack: ["TypeScript", "Web Components", "Shadow DOM"]
    }
  ],

  meta: {
    siteUrl: "https://ozdemir-yaman.github.io/portfolio/",
    title:   "Yaman Özdemir — Senior Frontend Engineer",
    description: "Senior frontend engineer with 8 years of experience across React, Vue, and Angular, plus backend work in ASP.NET Core and Node.js. Available for senior roles.",
    ogImage: "public/og.png"
  }
};
