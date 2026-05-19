"use client";

import Link from "next/link";
import { useState } from "react";
import BigChart from "./BigChart";
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
    change: number;
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

function fmtChange(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
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

// Brand color hints for language bars (best-effort, falls back to gray)
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

  // Merge all recent commits across projects, sorted newest first
  const allCommits = projects
    .flatMap((p) => p.recentCommits)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const positive = active.stats.change >= 0;

  return (
    <div className="space-y-6">
      {/* MAIN GRID: chart left, watchlist right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — featured project chart */}
        <div className="lg:col-span-2 border border-gray-200 rounded-xl p-6">
          {/* Header for active project */}
          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-1">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-sm font-semibold text-gray-500 tracking-wide">
                {active.ticker}
              </span>
              <h2 className="text-2xl font-semibold text-gray-900">
                {active.name}
              </h2>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest ${
                  active.status === "Live"
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active.status === "Live" ? "bg-green-500" : "bg-amber-500"
                  }`}
                />
                {active.status}
              </span>
            </div>
            <p
              className={`font-mono text-2xl ${
                positive ? "text-green-600" : "text-red-600"
              }`}
            >
              {positive ? "▲" : "▼"} {fmtChange(active.stats.change)}
            </p>
          </div>
          <p className="text-sm font-mono text-gray-500 mb-6">
            {active.tagline}
          </p>

          {/* Big chart */}
          <BigChart data={active.stats.sparkline} positive={positive} />

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 font-mono">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Commits
              </p>
              <p className="text-xl text-gray-900">
                {active.stats.commits.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                LOC
              </p>
              <p className="text-xl text-gray-900">{fmt(active.stats.loc)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                {active.customMetric.label}
              </p>
              <p className="text-xl text-gray-900">{active.customMetric.value}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                Momentum
              </p>
              <p
                className={`text-xl ${
                  positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {fmtChange(active.stats.change)}
              </p>
            </div>
          </div>

          {/* Language breakdown */}
          {active.languages.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-3">
                Composition
              </p>
              {/* Stacked horizontal bar */}
              <div className="flex h-2 rounded-full overflow-hidden mb-3">
                {active.languages.map((l) => (
                  <div
                    key={l.name}
                    style={{
                      width: `${l.percent}%`,
                      backgroundColor: LANG_COLORS[l.name] ?? "#9ca3af",
                    }}
                    title={`${l.name} ${l.percent.toFixed(1)}%`}
                  />
                ))}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {active.languages.map((l) => (
                  <div key={l.name} className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: LANG_COLORS[l.name] ?? "#9ca3af",
                      }}
                    />
                    <span className="text-xs font-mono text-gray-700">
                      {l.name}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      {l.percent.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
            <Link
              href={`/projects/${active.slug}`}
              className="text-sm font-mono text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
            >
              Full breakdown →
            </Link>
            <a
              href={`https://github.com/${active.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-gray-400 hover:text-gray-900 transition-colors"
            >
              Repository
            </a>
            {active.liveUrl && (
              <a
                href={active.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
              >
                {active.liveUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>

        {/* RIGHT — watchlist */}
        <aside className="border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
              Watchlist
            </p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
              {projects.length}
            </p>
          </div>

          <div className="space-y-1">
            {projects.map((p) => {
              const isActive = p.slug === activeSlug;
              const pos = p.stats.change >= 0;
              return (
                <button
                  key={p.slug}
                  onClick={() => setActiveSlug(p.slug)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-sm tracking-wide">
                      {p.ticker}
                    </span>
                    <span
                      className={`font-mono text-xs ${
                        isActive
                          ? pos
                            ? "text-green-300"
                            : "text-red-300"
                          : pos
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {pos ? "▲" : "▼"} {fmtChange(p.stats.change)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest truncate ${
                        isActive ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {p.name}
                    </span>
                    <Sparkline
                      data={p.stats.sparkline}
                      positive={pos}
                      width={48}
                      height={16}
                      className="flex-shrink-0"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* ACTIVITY FEED — full width */}
      <div className="border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
            Recent activity
          </p>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
            Across all listings
          </p>
        </div>
        {allCommits.length === 0 ? (
          <p className="p-5 text-sm text-gray-400 font-mono">
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
                  className="grid grid-cols-12 gap-3 items-baseline px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="col-span-2 lg:col-span-1 text-[10px] font-mono uppercase tracking-widest text-gray-400">
                    {timeAgo(c.date)}
                  </span>
                  <span className="col-span-2 lg:col-span-1 font-mono text-xs font-semibold text-gray-700">
                    {c.ticker}
                  </span>
                  <span className="col-span-12 lg:col-span-8 text-sm text-gray-700 truncate">
                    {c.message.split("\n")[0]}
                  </span>
                  <span className="col-span-12 lg:col-span-2 lg:text-right text-[10px] font-mono uppercase tracking-widest text-gray-400 truncate">
                    {c.author}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
