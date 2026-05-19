"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import BigChart from "./BigChart";
import DraggablePanel, { PanelBounds } from "./DraggablePanel";
import ProjectsTour from "./ProjectsTour";
import Sparkline from "@/components/Sparkline";

export type ProjectData = {
  slug: string;
  ticker: string;
  name: string;
  tagline: string;
  repo: string;
  liveUrl?: string;
  status: "Live" | "In Dev";
  customMetric: { label: string; value: string };
  stats: {
    commits: number;
    loc: number;
    sparkline: number[];
    cumulative: number[];
    lastCommitAt: string | null;
  };
  languages: { name: string; percent: number; bytes: number }[];
  recentCommits: {
    sha: string;
    message: string;
    author: string;
    date: string;
    url: string;
    ticker: string;
  }[];
};

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

type Freshness = {
  label: string;
  color: string;
  dot: string;
  status: "active" | "cooling" | "dormant" | "none";
};

function freshness(iso: string | null): Freshness {
  if (!iso) {
    return {
      label: "No commits yet",
      color: "text-gray-400",
      dot: "bg-gray-300",
      status: "none",
    };
  }
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const days = diff / 86400;
  const label = timeAgo(iso);
  if (days < 7) {
    return { label, color: "text-green-600", dot: "bg-green-500", status: "active" };
  }
  if (days < 30) {
    return { label, color: "text-amber-600", dot: "bg-amber-500", status: "cooling" };
  }
  return { label, color: "text-gray-500", dot: "bg-gray-400", status: "dormant" };
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const LANG_COLORS: Record<string, string> = {
  Python: "#3776ab",
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  HTML: "#e34c26",
  CSS: "#264de4",
  Java: "#b07219",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  PLpgSQL: "#336791",
  SCSS: "#c6538c",
};

export default function TradingFloor({ projects }: { projects: ProjectData[] }) {
  const [activeSlug, setActiveSlug] = useState(projects[0]?.slug);
  const active = projects.find((p) => p.slug === activeSlug) ?? projects[0];
  const f = freshness(active.stats.lastCommitAt);

  const allCommits = projects
    .flatMap((p) => p.recentCommits)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  const latestCommit = allCommits[0]?.date ?? null;
  const totalCommits = projects.reduce((s, p) => s + p.stats.commits, 0);
  const totalLoc = projects.reduce((s, p) => s + p.stats.loc, 0);

  // Shared bounds map so each panel can know where the others are docked
  const [panelBounds, setPanelBounds] = useState<Record<string, PanelBounds>>(
    {}
  );
  const updateBounds = useCallback((id: string, bounds: PanelBounds) => {
    setPanelBounds((prev) => {
      const cur = prev[id];
      if (
        cur &&
        cur.x === bounds.x &&
        cur.y === bounds.y &&
        cur.w === bounds.w &&
        cur.h === bounds.h
      ) {
        return prev;
      }
      return { ...prev, [id]: bounds };
    });
  }, []);
  const othersOf = (id: string): PanelBounds[] =>
    Object.entries(panelBounds)
      .filter(([k]) => k !== id)
      .map(([, b]) => b);

  return (
    <>
      <ProjectsTour />

      {/* ════════════════════════════════════════════════════════════
          FEATURED PROJECT — fills the viewport behind floating panels
         ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-12 pb-8 w-full">
          {/* Header */}
          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-mono text-sm font-semibold text-gray-500 tracking-wide">
                {active.ticker}
              </span>
              <h2 className="text-4xl lg:text-5xl font-semibold text-gray-900 tracking-tight">
                {active.name}
              </h2>
            </div>
            <p
              className={`font-mono text-sm flex items-center gap-2 ${f.color}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${f.dot}`} />
              Last commit {f.label}
            </p>
          </div>
          <p className="text-base text-gray-600 mb-10">{active.tagline}</p>

          {/* MEDIA SLOT — placeholder for demo video / screenshots / hero image */}
          <div
            data-tour="media"
            className="aspect-video w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mb-8"
          >
            <div className="text-center px-6">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
                Demo
              </p>
              <p className="text-sm text-gray-500 max-w-md">
                Drop a video, GIF, or screenshot here — anything that shows{" "}
                {active.name} in action.
              </p>
            </div>
          </div>

          {/* Stats row + chart */}
          <div data-tour="repo-stats" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: stats + composition */}
            <div className="font-mono space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    Commits
                  </p>
                  <p className="text-2xl text-gray-900">
                    {active.stats.commits.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    LOC
                  </p>
                  <p className="text-2xl text-gray-900">{fmt(active.stats.loc)}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                    {active.customMetric.label}
                  </p>
                  <p className="text-2xl text-gray-900">
                    {active.customMetric.value}
                  </p>
                </div>
              </div>

              {active.languages.length > 0 && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">
                    Composition
                  </p>
                  <div className="flex h-2 rounded-full overflow-hidden mb-3">
                    {active.languages.map((l) => (
                      <div
                        key={l.name}
                        style={{
                          width: `${l.percent}%`,
                          backgroundColor: LANG_COLORS[l.name] ?? "#9ca3af",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {active.languages.map((l) => (
                      <div key={l.name} className="flex items-center gap-1.5">
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: LANG_COLORS[l.name] ?? "#9ca3af",
                          }}
                        />
                        <span className="text-xs text-gray-700">{l.name}</span>
                        <span className="text-xs text-gray-400">
                          {l.percent.toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                <Link
                  href={`/projects/${active.slug}`}
                  className="text-sm text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
                >
                  Full breakdown →
                </Link>
                <a
                  href={`https://github.com/${active.repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
                >
                  Repository
                </a>
                {active.liveUrl && (
                  <a
                    href={active.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
                  >
                    {active.liveUrl.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>

            {/* Right: chart */}
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-3">
                Cumulative commits
              </p>
              <BigChart data={active.stats.cumulative} positive={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          FLOATING PANELS
         ════════════════════════════════════════════════════════════ */}

      {/* GLOBAL STATS — small panel */}
      <DraggablePanel
        id="global-stats"
        title="Global"
        defaultPosition={{ mode: "dock", zone: "tl" }}
        width={280}
        height={340}
        otherBounds={othersOf("global-stats")}
        onBoundsChange={(b) => updateBounds("global-stats", b)}
      >
        <div className="p-4 font-mono space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
              Listed
            </p>
            <p className="text-2xl text-gray-900">{projects.length}</p>
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
              Latest push
            </p>
            <p
              className={`text-2xl ${
                latestCommit &&
                (Date.now() - new Date(latestCommit).getTime()) / 86400000 < 7
                  ? "text-green-600"
                  : "text-gray-700"
              }`}
            >
              {latestCommit ? timeAgo(latestCommit) : "—"}
            </p>
          </div>
        </div>
      </DraggablePanel>

      {/* ACTIVITY FEED */}
      <DraggablePanel
        id="activity-feed"
        title="Recent activity · all projects"
        defaultPosition={{ mode: "dock", zone: "tr" }}
        width={400}
        height={460}
        otherBounds={othersOf("activity-feed")}
        onBoundsChange={(b) => updateBounds("activity-feed", b)}
      >
        {allCommits.length === 0 ? (
          <p className="p-4 text-sm text-gray-400 font-mono">
            No recent commits available.
          </p>
        ) : (
          <ul>
            {allCommits.map((c) => (
              <li
                key={c.sha}
                className="border-b border-gray-50 last:border-b-0"
              >
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-3 mb-0.5">
                    <span className="font-mono text-xs font-semibold text-gray-700">
                      {c.ticker}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                      {timeAgo(c.date)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 truncate">
                    {c.message.split("\n")[0]}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </DraggablePanel>

      {/* PROJECT LIST */}
      <DraggablePanel
        id="project-list"
        title="All projects"
        defaultPosition={{ mode: "dock", zone: "bl" }}
        width={400}
        height={320}
        otherBounds={othersOf("project-list")}
        onBoundsChange={(b) => updateBounds("project-list", b)}
      >
        <ul className="p-2">
          {projects.map((p) => {
            const pf = freshness(p.stats.lastCommitAt);
            const isActive = p.slug === activeSlug;
            return (
              <li key={p.slug}>
                <button
                  onClick={() => setActiveSlug(p.slug)}
                  className={`w-full text-left p-3 rounded-lg transition-colors mb-1 ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-semibold text-sm tracking-wide">
                        {p.ticker}
                      </span>
                      <span
                        className={`text-xs ${
                          isActive ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {p.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 ${
                        isActive ? "text-gray-200" : pf.color
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${pf.dot}`} />
                      {pf.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-3 text-[10px] font-mono uppercase tracking-widest">
                      <span
                        className={isActive ? "text-gray-400" : "text-gray-400"}
                      >
                        {p.stats.commits.toLocaleString()} commits
                      </span>
                      <span
                        className={isActive ? "text-gray-400" : "text-gray-400"}
                      >
                        {fmt(p.stats.loc)} LOC
                      </span>
                    </div>
                    <Sparkline
                      data={p.stats.sparkline}
                      positive={pf.status === "active"}
                      width={48}
                      height={16}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </DraggablePanel>
    </>
  );
}
