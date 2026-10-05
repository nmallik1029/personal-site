import type { Metadata } from "next";
import type { ReactNode } from "react";
import Split from "@/components/Split";
import TitleRow from "@/components/TitleRow";
import { experience } from "@/content/experience";
import { education, profile, resumeSkills } from "@/content/profile";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Resume",
};

const sectionGap = "mt-[max(4rem,6vw)]";

function Entry({
  title,
  detail,
  period,
  children,
}: {
  title: string;
  detail?: string;
  period: string;
  children: ReactNode;
}) {
  return (
    <div data-reveal="fade">
      <TitleRow date={period}>
        <h3 className="type-item">
          {title}
          {detail && (
            <span className="font-sans text-lead font-[450] text-muted"> · {detail}</span>
          )}
        </h3>
      </TitleRow>
      {children}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 max-w-[44rem] list-disc space-y-1.5 pl-5 marker:text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function ResumePage() {
  const resumeProjects = projects.filter((p) => p.resume);

  return (
    <div className="px-gutter">
      <h1
        data-reveal="mask"
        className="type-title pb-[max(2.5rem,5vw)] pt-[max(2rem,5vw)] print:pb-6 print:pt-0 print:text-5xl"
      >
        <span>Resume</span>
      </h1>

      <Split label="Contact">
        <div data-reveal="fade" className="space-y-1">
          <p className="text-lead">{profile.name}</p>
          <p className="text-muted">
            {profile.location} · {profile.phone}
          </p>
          <p>
            <a href={`mailto:${profile.email}`} className="link">
              {profile.email}
            </a>
          </p>
          <p>
            <a
              href={profile.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {profile.github.label}
            </a>{" "}
            ·{" "}
            <a
              href={profile.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {profile.linkedin.label}
            </a>
          </p>
          <p className="text-muted">Availability: {profile.availability}</p>
        </div>
      </Split>

      <Split label="Education" className={sectionGap}>
        <Entry title={education.school} period={education.graduation}>
          <div className="mt-2 space-y-0.5">
            <p>{education.degree}</p>
            <p className="text-muted">Relevant courses: {education.courses}</p>
            <p className="text-muted">Major GPA: {education.gpa}</p>
          </div>
        </Entry>
      </Split>

      <Split label="Skills" className={sectionGap}>
        <dl data-reveal="fade" className="space-y-3">
          {resumeSkills.map((group) => (
            <div key={group.label} className="sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4">
              <dt className="text-muted">{group.label}</dt>
              <dd>{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Split>

      <Split label="Experience" className={sectionGap}>
        <div className="space-y-[max(2rem,3vw)]">
          {experience.map((job) => (
            <Entry
              key={`${job.org}-${job.role}`}
              title={job.role}
              detail={job.org}
              period={job.period}
            >
              <Bullets items={job.bullets} />
            </Entry>
          ))}
        </div>
      </Split>

      <Split label="Projects" className={sectionGap}>
        <div className="space-y-[max(2rem,3vw)]">
          {resumeProjects.map((p) => (
            <Entry
              key={p.slug}
              title={p.name}
              detail={p.resume!.stack}
              period={p.period}
            >
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link mt-1 inline-block text-small"
                >
                  {p.url.replace(/^https?:\/\//, "")}
                </a>
              )}
              <Bullets items={p.resume!.bullets} />
            </Entry>
          ))}
        </div>
      </Split>

      {/* Pinned to the bottom of the screen while reading, then settles
          under the last section so it never covers the footer */}
      <div
        data-reveal="fade"
        className="pointer-events-none sticky bottom-gutter mt-[max(2.5rem,4vw)] flex justify-end print:hidden"
      >
        <a
          href={profile.resumePdf}
          download
          className="btn group pointer-events-auto shadow-[0_10px_30px_rgb(0_0_0/0.18)] hover:opacity-100"
        >
          Download PDF
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-out group-hover:translate-y-0.5"
          >
            ↓
          </span>
        </a>
      </div>
    </div>
  );
}
