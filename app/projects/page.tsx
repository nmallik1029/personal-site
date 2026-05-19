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
  // Path under /public — e.g. "/projects/ember-analytics/demo.mp4"
  // Recognised extensions: .mp4/.webm (video), .gif/.png/.jpg/.jpeg/.webp (image)
  media?: string;
  // Optional poster image shown before a video starts playing
  mediaPoster?: string;
};

const projects: Project[] = [
  {
    slug: "ember-analytics",
    ticker: "EMBR",
    name: "EMBER Analytics",
    tagline: "Portfolio generator",
    repo: "nmallik1029/ember-analytics",
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
  // Try GitHub's pre-computed weekly stats first (cheap, single call)
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/stats/commit_activity`,
      { headers: ghHeaders(), next: { revalidate: 3600 } }
    );
    if (res.ok && res.status !== 202) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const weekly = data.map((w: { total: number }) => w.total ?? 0);
        if (weekly.some((v) => v > 0)) return weekly;
      }
    }
  } catch {
    /* fall through */
  }

  // Fallback: bucket actual commit timestamps into weeks ourselves.
  // Reliable for new repos where GitHub hasn't computed stats yet.
  return bucketCommitsByWeek(repo);
}

async function bucketCommitsByWeek(repo: string): Promise<number[]> {
  const buckets = new Array(52).fill(0);
  try {
    // Pull up to 200 commits across 2 pages — covers >12 months for most repos
    const pages = await Promise.all([
      fetch(
        `https://api.github.com/repos/${repo}/commits?per_page=100&page=1`,
        { headers: ghHeaders(), next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.github.com/repos/${repo}/commits?per_page=100&page=2`,
        { headers: ghHeaders(), next: { revalidate: 3600 } }
      ),
    ]);

    const commits: { commit?: { author?: { date?: string }; committer?: { date?: string } } }[] = [];
    for (const p of pages) {
      if (!p.ok) continue;
      const data = await p.json();
      if (Array.isArray(data)) commits.push(...data);
    }

    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    for (const c of commits) {
      const iso =
        c?.commit?.committer?.date ?? c?.commit?.author?.date ?? null;
      if (!iso) continue;
      const ts = new Date(iso).getTime();
      const weeksAgo = Math.floor((now - ts) / weekMs);
      if (weeksAgo >= 0 && weeksAgo < 52) {
        buckets[51 - weeksAgo]++;
      }
    }
  } catch {
    /* return empty buckets */
  }
  return buckets;
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
  const weeklySeries = weekly.length > 0 ? weekly : new Array(52).fill(0);

  // Cumulative commits — starts at the count BEFORE the 52w window and adds
  // each week. End of the series equals totalCommits, so the chart's last
  // point matches the "Commits" stat.
  const sumWeekly = weeklySeries.reduce((a, b) => a + b, 0);
  const baseCommits = Math.max(0, commits - sumWeekly);
  let running = baseCommits;
  const cumulative = weeklySeries.map((w) => (running += w));

  // Most recent commit's timestamp — drives the "Last commit X ago" indicator
  const lastCommitAt = recentCommits[0]?.date ?? null;

  return {
    slug: p.slug,
    ticker: p.ticker,
    name: p.name,
    tagline: p.tagline,
    repo: p.repo,
    liveUrl: p.liveUrl,
    status: p.status,
    customMetric: p.customMetric,
    media: p.media,
    mediaPoster: p.mediaPoster,
    stats: { commits, loc, sparkline: weeklySeries, cumulative, lastCommitAt },
    languages,
    recentCommits,
  };
}

export default async function ProjectsPage() {
  const data = await Promise.all(projects.map(buildProjectData));

  return (
    <main className="bg-white text-gray-900 overflow-hidden">
      <TradingFloor projects={data} />
    </main>
  );
}
