import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LocalTime from "@/components/LocalTime";
import Split from "@/components/Split";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Contact",
};

const channels = [
  { label: profile.email, href: `mailto:${profile.email}` },
  { label: profile.github.label, href: profile.github.href },
  { label: profile.linkedin.label, href: profile.linkedin.href },
];

export default function ContactPage() {
  return (
    <div className="px-gutter">
      <h1
        data-reveal="mask"
        className="type-title pb-[max(2.5rem,5vw)] pt-[max(2rem,5vw)]"
      >
        <span>Get in touch</span>
      </h1>

      <Split label="Direct">
        <p data-reveal="fade" className="max-w-[24rem] text-lead">
          Email is the fastest way to reach me, sending a message via the form below works too!
        </p>
        <ul data-reveal="fade" className="mt-8 text-lead">
          {channels.map((c) => {
            const external = c.href.startsWith("http");
            return (
              <li key={c.href}>
                <a
                  href={c.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="link-draw break-words"
                >
                  {c.label}
                </a>
              </li>
            );
          })}
        </ul>
        <p data-reveal="fade" className="mt-4 text-small text-muted">
          {profile.location} · <LocalTime />
        </p>
      </Split>

      <Split label="Message" className="mt-[max(4rem,6vw)]">
        <div data-reveal="fade" className="max-w-[40rem]">
          <ContactForm />
        </div>
      </Split>
    </div>
  );
}
