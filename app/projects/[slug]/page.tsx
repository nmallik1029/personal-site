import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShowcaseVideo from "@/components/ShowcaseVideo";
import Status from "@/components/Status";
import { projects } from "@/content/projects";

type Props = { params: Promise<{ slug: string }> };

// Every project page is built ahead of time; other slugs are a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.name, description: project.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const nextLink = (
    <Link href={`/projects/${next.slug}`} className="cta group font-medium">
      <span className="link-draw">Next: {next.name}</span>
      <span aria-hidden="true" className="arrow">
        →
      </span>
    </Link>
  );

  return (
    <div className="px-gutter md:grid md:grid-cols-[43fr_57fr] md:gap-x-[max(1.5rem,2.5vw)]">
      {/* Pinned on wider screens while the details scroll */}
      <aside className="flex flex-col justify-between gap-12 pb-12 pt-[max(2rem,3vw)] md:sticky md:top-[var(--header-h)] md:min-h-[calc(100dvh_-_var(--header-h))] md:self-start">
        <div>
          <p className="text-small font-medium tabular-nums text-muted">
            {project.ticker} · {index + 1} of {projects.length}
          </p>
          <h1
            data-reveal="mask"
            className="type-heading mt-[max(1.25rem,2vw)] text-[clamp(2.5rem,5vw,6rem)]"
          >
            <span>{project.name}</span>
          </h1>
          {project.status && (
            <div className="mt-4">
              <Status status={project.status} />
            </div>
          )}
          <p data-reveal="fade" className="mt-6 max-w-[28rem] text-lead text-muted">
            {project.summary}
          </p>

          <dl
            data-reveal="fade"
            className="mt-[max(2.5rem,4vw)] grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-6 gap-y-6"
          >
            <dt className="text-small font-medium text-muted">When</dt>
            <dd>{project.period}</dd>

            <dt className="text-small font-medium text-muted">Stack</dt>
            <dd>
              <ul>
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </dd>

            {(project.url || project.repo) && (
              <>
                <dt className="text-small font-medium text-muted">Links</dt>
                <dd>
                  <ul>
                    {project.url && (
                      <li>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-draw"
                        >
                          {project.url.replace(/^https?:\/\//, "")} ↗
                        </a>
                      </li>
                    )}
                    {project.repo && (
                      <li>
                        <a
                          href={`https://github.com/${project.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-draw"
                        >
                          GitHub ↗
                        </a>
                      </li>
                    )}
                  </ul>
                </dd>
              </>
            )}
          </dl>
        </div>

        <div className="hidden md:block">{nextLink}</div>
      </aside>

      <article className="pb-12 md:pt-[max(2rem,3vw)]">
        {project.media && (
          <div
            data-reveal="fade"
            className="mb-[max(2rem,3vw)] aspect-[16/10] overflow-hidden rounded-[0.75rem] bg-surface"
          >
            <ShowcaseVideo
              src={project.media.video}
              poster={project.media.poster}
              label={`Preview of ${project.name}`}
            />
          </div>
        )}

        <p data-reveal="fade" className="max-w-[38rem] text-lead">
          {project.description}
        </p>

        <h2 data-reveal="mask" className="type-item mt-[max(3rem,5vw)]">
          <span>What I built</span>
        </h2>
        <ul className="mt-6 max-w-[38rem] space-y-4">
          {project.built.map((item) => (
            <li key={item} data-reveal="fade" className="flex gap-4 text-lead">
              <span aria-hidden="true" className="text-muted">
                —
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-16 md:hidden">{nextLink}</div>
      </article>
    </div>
  );
}
