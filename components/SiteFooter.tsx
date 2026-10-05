import Link from "next/link";
import { profile } from "@/content/profile";

export default function SiteFooter() {
  return (
    <footer className="mt-[max(6rem,10vw)] px-gutter pb-[max(1.25rem,2vw)] print:hidden">
      <div data-reveal="rule" aria-hidden="true" />
      <div className="grid gap-y-10 pt-6 md:grid-cols-2 md:pt-[max(1.75rem,2.5vw)]">
        <div data-reveal="mask">
          <Link href="/contact" className="cta group type-heading">
            <span className="link-draw">Get in touch</span>
            <span aria-hidden="true" className="arrow">
              →
            </span>
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div data-reveal="fade">
            <p className="text-small font-medium text-muted">Availability</p>
            <p className="mt-2 text-lead">{profile.availability}</p>
          </div>
          <div data-reveal="fade">
            <p className="text-small font-medium text-muted">Contact</p>
            <ul className="mt-2 text-lead">
              <li>
                <a href={`mailto:${profile.email}`} className="link-draw break-words">
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.github.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-[max(3rem,6vw)] flex items-center justify-between gap-6 text-small text-muted">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <a href="#main" className="link-draw">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
