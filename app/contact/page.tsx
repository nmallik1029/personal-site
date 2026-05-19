import Link from "next/link";

export const metadata = {
  title: "Contact — Neel Mallik",
};

const channels = [
  {
    label: "Email",
    value: "nmallik1029@gmail.com",
    href: "mailto:nmallik1029@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/nmallik1029",
    href: "https://github.com/nmallik1029",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/neel-mallik",
    href: "https://linkedin.com/in/neel-mallik",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
          Contact
        </p>
        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-8">
          Let&apos;s talk.
        </h1>

        <p className="text-base text-gray-600 leading-relaxed max-w-2xl mb-16">
          I&apos;m always interested in new opportunities, collaboration, or
          just a good conversation about software, finance, or anything in
          between. Reach out through whichever channel works best for you.
        </p>

        <div className="space-y-4">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-baseline justify-between border-b border-gray-200 py-5 hover:border-gray-900 transition-colors"
            >
              <span className="text-xs font-mono uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors">
                {c.label}
              </span>
              <span className="text-lg font-mono text-gray-700 group-hover:text-gray-900 transition-colors">
                {c.value}
              </span>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
