export type Project = {
  slug: string;
  name: string;
  // Stock-ticker style symbol, shown on /projects and the project's page
  ticker: string;
  // A few words, e.g. "Stock research site"
  kind: string;
  // One line, shown on /projects and under the name on the project's page.
  summary: string;
  description: string;
  built: string[];
  stack: string[];
  period: string;
  status?: "Live" | "In progress";
  // "owner/name" on GitHub. Kept in this form so live repo stats can be
  // fetched from it later.
  repo?: string;
  url?: string;
  // A short muted, looping video (MP4) and its poster image, both under
  // /public. Projects with media appear in the home page's Project Showcase
  // and show the video on their own page.
  media?: { video: string; poster: string };
  // Present only for projects on the resume. Mirrors the PDF in /public.
  resume?: { stack: string; bullets: string[] };
};

export const projects: Project[] = [
  {
    // On the resume under Experience (content/experience.ts), so no `resume` here
    slug: "clinicscreen",
    name: "ClinicScreen",
    ticker: "CLSC",
    kind: "Digital signage for clinics",
    summary: "Screens for doctors' offices, where each practice controls what its patients see.",
    description:
      "ClinicScreen runs the screens in doctors' waiting rooms. Each practice gets its own account and decides what plays, from ad placements to informational tools for patients. It's being used in practices in Illinois, Iowa, and California, and I co-founded it in March 2026.",
    built: [
      "A multi-tenant platform, so every practice manages its own screens and content",
      "A drag-and-drop video timeline editor for arranging what plays",
      "A scraper that uses the Claude API to import doctor bios",
      "Raspberry Pi kiosks, with Wi-Fi set up over encrypted Bluetooth",
      "Sign-in for every user through QuickAuth, my own authentication service",
    ],
    stack: ["Next.js", "TypeScript", "Raspberry Pi", "Claude API"],
    period: "March 2026 – Present",
  },
  {
    slug: "vsn-analysis",
    name: "VSN Analysis",
    ticker: "VSNA",
    kind: "Stock research site",
    summary:
      "A stock research site with charts, watchlists, a screener, and a community feed.",
    description:
      "The goal was one place to follow a stock without opening five different tools. You can search stocks and indices, open full-screen charts, keep watchlists, and run a screener that scores companies on their fundamentals. Signed-in users can also post, comment, and follow each other in a community feed.",
    built: [
      "A Flask backend with Python fetchers for market data, plus the scoring logic behind the screener",
      "Sign-in with email or Google, profiles, avatars, and account settings, all on Supabase",
      "The community feed: posts, comments, likes, reposts, follows, and pages for admins and moderators",
      "Optional AI write-ups in the screener using Gemini",
      "The production deploy on Cloudflare Workers, with the Flask app running in a container",
    ],
    stack: ["Python", "Flask", "Supabase", "JavaScript", "Lightweight Charts", "Cloudflare"],
    period: "August 2025 – Present",
    status: "Live",
    repo: "nmallik1029/vsn_analysis",
    url: "https://vsnanalysis.com",
    media: { video: "/projects/vsn-analysis.mp4", poster: "/projects/vsn-analysis.jpg" },
    resume: {
      stack: "HTML, CSS, JavaScript, Python",
      bullets: [
        "Built a full-stack stock analysis platform enabling users to search for equities and indices using real-time financial data using yfinance API.",
        "Implemented user authentication and a community feature to promote engagement and shared insights.",
        "Designed and deployed backend infrastructure using Supabase for data storage and account management.",
        "Improved accessibility to less familiar investors by creating a simpler and more straightforward user interface using HTML, CSS, and JavaScript.",
        "Currently implementing an LLM-assisted equity analysis engine that combines deterministic financial scoring with structured AI-generated research summaries, risk factors, and bull/bear thesis extraction.",
      ],
    },
  },
  {
    slug: "ember-analytics",
    name: "EMBER Analytics",
    ticker: "EMBR",
    kind: "Portfolio builder",
    summary: "Builds a sample stock portfolio from a short questionnaire.",
    description:
      "You answer questions about your budget, risk tolerance, time horizon, the sectors you care about, anything you want to avoid, and what you already own. EMBER turns those answers into a model allocation you can save to your account. It's meant for learning: it doesn't give financial advice or place trades.",
    built: [
      "A 12-step questionnaire, with answers kept in a Zustand store as you move between steps",
      "The allocation engine, which is deterministic: the same answers always produce the same portfolio",
      "Accounts and saved portfolios on Supabase, with row-level security on user data",
      "Moved portfolio generation from a separate Python (FastAPI) service into a Next.js API route",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Zustand"],
    period: "November 2025 – Present",
    status: "In progress",
    repo: "nmallik1029/ember-analytics",
    media: { video: "/projects/ember-analytics.mp4", poster: "/projects/ember-analytics.jpg" },
  },
  {
    slug: "quickauth",
    name: "QuickAuth",
    ticker: "QATH",
    kind: "Authentication service",
    summary: "A self-hosted sign-in service, built from scratch in place of Auth0 or Clerk.",
    description:
      "QuickAuth covers signup, login, protected routes, and user profiles without a hosted provider like Auth0 or Clerk. Passwords are hashed with Argon2id, and sessions are hashed, stored in the database, and only ever sent in HTTP-only cookies. ClinicScreen uses it for all of its sign-ins.",
    built: [
      "Signup, login, protected routes, and user profiles",
      "Password hashing with Argon2id",
      "Sessions that are hashed, stored in the database, and only sent in HTTP-only cookies",
      "A Prisma schema (User, Profile, Session) that supports checking sessions on the server, expiry, revocation, and disabling accounts",
    ],
    stack: ["Next.js", "TypeScript", "Prisma", "SQLite"],
    period: "August 2026 – Present",
    resume: {
      stack: "Next.js, TypeScript, Prisma, SQLite",
      bullets: [
        "Built a self-hosted authentication service from scratch, replacing hosted providers like Auth0/Clerk, with signup, login, protected routes, and user profiles.",
        "Secured credentials with Argon2id password hashing and hashed, database-backed sessions delivered only via HTTP-only cookies.",
        "Designed a Prisma relational schema (User, Profile, Session) supporting server-side session validation, expiry, revocation, and account disabling.",
      ],
    },
  },
  {
    slug: "tourney-bot",
    name: "Tourney Bot",
    ticker: "TRNY",
    kind: "Discord tournament bot",
    summary:
      "A Discord bot that runs bi-weekly Krunker tournaments, from sign-ups to the final bracket.",
    description:
      "Team captains register through buttons in Discord. Organizers seed the teams on a drag-to-reorder web page, and the bot then creates a Challonge bracket plus a role and channels for every team. During matches it handles pick/bans, rehosts, and caster assignments. When the tournament ends it cleans up the channels and asks the top two teams for their VODs.",
    built: [
      "Slash commands and button-based forms for registration, roster edits, and pick/bans",
      "Double-elimination brackets through the Challonge API",
      "A small aiohttp web app for seeding, the admin bracket, and a tournament dashboard",
      "Scoreboard image generation, with tournament data saved to a GitHub Gist",
    ],
    stack: ["Python", "Discord API", "aiohttp", "Challonge API"],
    period: "2026",
    repo: "nmallik1029/tourney-bot",
  },
];

// First year in `period`, e.g. "2025" from "August 2025 – Present".
export function startYear(p: Project): string {
  return p.period.match(/\d{4}/)?.[0] ?? "";
}
