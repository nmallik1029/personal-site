import Link from "next/link";
import { notFound } from "next/navigation";

const projects: Record<
  string,
  { ticker: string; name: string; tagline: string; live?: string; repo: string }
> = {
  "ember-analytics": {
    ticker: "EMBR",
    name: "EMBER Analytics",
    tagline: "Portfolio generator",
    repo: "https://github.com/nmallik1029/ember-analytics",
  },
  "vsn-analysis": {
    ticker: "VSNA",
    name: "VSN Analysis",
    tagline: "Stock analysis platform",
    live: "https://vsnanalysis.com",
    repo: "https://github.com/nmallik1029/vsn_analysis",
  },
  "tourney-bot": {
    ticker: "TRNY",
    name: "Tourney Bot",
    tagline: "Tournament automation",
    repo: "https://github.com/nmallik1029/tourney-bot",
  },
};

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects[slug];
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-24 lg:py-28">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors mb-12"
        >
          <span>←</span>
          <span>Trading floor</span>
        </Link>

        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-2">
          {project.ticker}
        </p>
        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-3">
          {project.name}
        </h1>
        <p className="text-base text-gray-600 mb-12">{project.tagline}</p>

        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-sm font-mono uppercase tracking-widest text-gray-400">
          Full trading-view detail coming here
        </div>

        <div className="mt-12 flex gap-6 text-sm font-mono">
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            Repository →
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
            >
              {project.live.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
