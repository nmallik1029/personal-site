import type { Metadata } from "next";
import Link from "next/link";
import Split from "@/components/Split";
import Status from "@/components/Status";
import { projects, startYear } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  const years = projects.map((p) => Number(startYear(p)));
  const span = `${Math.min(...years)} – ${Math.max(...years)}`;

  return (
    <div className="px-gutter">
      <h1
        data-reveal="mask"
        className="type-title pb-[max(2.5rem,5vw)] pt-[max(2rem,5vw)]"
      >
        <span>Things I&apos;ve built</span>
      </h1>

      <Split label="Projects">
        <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
          <p data-reveal="fade" className="max-w-[26rem] text-lead">
            What each project does and how it&apos;s built.
          </p>
          <p data-reveal="fade" className="text-lead tabular-nums">
            {span}
          </p>
        </div>
      </Split>

      <ol className="mt-[max(4rem,7vw)]">
        {projects.map((p) => (
          <li key={p.slug} id={p.slug} className="scroll-mt-[var(--header-h)]">
            <div data-reveal="rule" aria-hidden="true" />
            <div className="grid gap-y-5 py-[max(1.75rem,2.5vw)] md:grid-cols-2">
              <div data-reveal="fade">
                <p className="text-small font-medium text-muted">{p.ticker}</p>
                <h2 className="type-heading mt-2">
                  <Link
                    href={`/projects/${p.slug}`}
                    className="transition-opacity duration-500 hover:opacity-60"
                  >
                    {p.name}
                  </Link>
                </h2>
              </div>

              <div
                data-reveal="fade"
                className="flex flex-col gap-5 lg:flex-row lg:justify-between lg:gap-10"
              >
                <div className="max-w-[30rem]">
                  <p className="text-lead">{p.summary}</p>
                  <p className="mt-3 text-small text-muted">
                    {p.stack.join(", ")}
                  </p>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="cta group mt-5 font-medium"
                  >
                    <span className="link-draw">Details</span>
                    <span aria-hidden="true" className="arrow">
                      →
                    </span>
                  </Link>
                </div>
                <div className="flex shrink-0 items-center gap-4 lg:flex-col lg:items-end">
                  <span className="text-small tabular-nums text-muted">
                    {p.period}
                  </span>
                  {p.status && <Status status={p.status} />}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
