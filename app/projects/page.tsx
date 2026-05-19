import TradingFloor, { ProjectData } from "@/components/projects/TradingFloor";

export const metadata = {
  title: "Projects — Neel Mallik",
};

export const revalidate = 3600;

type Project = {
  slug: string;
  ticker: string;
  name: string;
  tagline: string;
  repo: string;
  liveUrl?: string;
  status: "Live" | "In Dev";
  customMetric: { label: string; value: string };
  manualCommits?: number;
  manualLoc?: number;
};

const projects: Project[] = [
  {
    slug: "ember-analytics",
    ticker: "EMBR",
    name: "EMBER Analytics",
    tagline: "Portfolio generator",
    repo: "nmallik1029/ember_analytics",
    status: "In Dev",
    customMetric: { label: "Portfolios generated", value: "47" },
  },
  {
    slug: "vsn-analysis",
    ticker: "VSNA",
    name: "VSN Analysis",
    tagline: "vsnanalysis.com",
    repo: "nmallik1029/vsn_analysis",
    liveUrl: "https://vsnanalysis.com",
    status: "Live",
    customMetric: { label: "Tickers searched", value: "1,247" },
  },
  {
    slug: "tourney-bot",
    ticker: "TRNY",
    name: "Tourney Bot",
    tagline: "Tournament automation",
    repo: "nmallik1029/tourney-bot",
    status: "In Dev",
    customMetric: { label: "Tournaments hosted", value: "12" },
  },
];

function ghHeaders(): HeadersInit {
  const h: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return h;
}

async function getCommitCount(repo: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=1`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok) return 0;
    const link = res.headers.get("link");
    if (link) {
      const match = link.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
      if (match) return parseInt(match[1], 10);
    }
    const commits = await res.json();
    return Array.isArray(commits) ? commits.length : 0;
  } catch {
    return 0;
  }
}

async function getWeeklyActivity(repo: string): Promise<number[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/stats/commit_activity`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (!res.ok || res.status === 202) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data.map((w: { total: number }) => w.total ?? 0)
      : [];
  } catch {
    return [];
  }
}

async function getRealLoc(repo: string): Promise<number> {
  try {
    const res = await fetch(`https://api.codetabs.com/v1/loc/?github=${repo}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return 0;
    const data = await res.json();
    if (!Array.isArray(data)) return 0;
    const total = data.find(
      (d: { language?: string; linesOfCode?: number }) =>
        d.language === "Total"
    );
    return total?.linesOfCode ?? 0;
  } catch {
    return 0;
  }
}

async function getLanguages(repo: string) {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/languages`, {
      headers: ghHeaders(),
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, number>;
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    if (total === 0) return [];
    return Object.entries(data)
      .map(([name, bytes]) => ({ name, bytes, percent: (bytes / total) * 100 }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 6);
  } catch {
    return [];
  }
}

async function getRecentCommits(repo: string, ticker: string) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/commits?per_page=5`,
      { headers: ghHeaders(), next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(
      (c: {
        sha: string;
        html_url: string;
        commit: { message: string; author: { name: string; date: string } };
      }) => ({
        sha: c.sha,
        message: c.commit.message,
        author: c.commit.author.name,
        date: c.commit.author.date,
        url: c.html_url,
        ticker,
      })
    );
  } catch {
    return [];
  }
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

function fmtChange(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

async function buildProjectData(p: Project): Promise<ProjectData> {
  const [apiCommits, weekly, apiLoc, languages, recentCommits] =
    await Promise.all([
      getCommitCount(p.repo),
      getWeeklyActivity(p.repo),
      getRealLoc(p.repo),
      getLanguages(p.repo),
      getRecentCommits(p.repo, p.ticker),
    ]);

  const commits = p.manualCommits ?? apiCommits;
  const loc = p.manualLoc ?? apiLoc;
  const sparkline = weekly.length > 0 ? weekly : new Array(52).fill(0);

  const last8 = sparkline.slice(-8);
  const recent = last8.slice(-4).reduce((a, b) => a + b, 0);
  const prior = last8.slice(0, 4).reduce((a, b) => a + b, 0);
  const change =
    prior === 0 ? (recent > 0 ? 100 : 0) : ((recent - prior) / prior) * 100;

  return {
    slug: p.slug,
    ticker: p.ticker,
    name: p.name,
    tagline: p.tagline,
    repo: p.repo,
    liveUrl: p.liveUrl,
    status: p.status,
    customMetric: p.customMetric,
    stats: { commits, loc, sparkline, change },
    languages,
    recentCommits,
  };
}

export default async function ProjectsPage() {
  const data = await Promise.all(projects.map(buildProjectData));

  const totalCommits = data.reduce((sum, p) => sum + p.stats.commits, 0);
  const totalLoc = data.reduce((sum, p) => sum + p.stats.loc, 0);
  const avgChange =
    data.reduce((sum, p) => sum + p.stats.change, 0) / Math.max(1, data.length);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-28">
        {/* Eyebrow + Title */}
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
          Projects
        </p>
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-2">
          <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight">
            Trading floor.
          </h1>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>Market open</span>
          </div>
        </div>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl mb-10">
          Live read of what I&apos;m building. Pick a ticker on the right to
          inspect — chart, language composition, and recent commits all stream
          straight from GitHub.
        </p>

        {/* Index summary bar */}
        <div className="border border-gray-200 rounded-xl px-6 py-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Listed
            </p>
            <p className="text-2xl text-gray-900">{data.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Total commits
            </p>
            <p className="text-2xl text-gray-900">
              {totalCommits.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Total LOC
            </p>
            <p className="text-2xl text-gray-900">{fmt(totalLoc)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Avg momentum
            </p>
            <p
              className={`text-2xl ${
                avgChange >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {fmtChange(avgChange)}
            </p>
          </div>
        </div>

        {/* Trading dashboard */}
        <TradingFloor projects={data} />

        {/* Footer note */}
        <p className="mt-6 text-xs font-mono text-gray-400">
          Data refreshes hourly. Commits and recent activity pulled live from
          GitHub. LOC via codetabs. Momentum = recent 4 weeks vs prior 4 weeks.
        </p>
      </div>
    </main>
  );
}
