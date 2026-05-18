import Skills from "@/components/Skills";

const projects = [
  {
    title: "EMBER Analytics",
    year: "2025",
    stack: ["TypeScript", "Python"],
    description:
      "Portfolio generator that builds personalized baskets from user-provided capital, risk tolerance, and interests. A scoring engine underneath uses volatility, historical returns, and financial indicators to rank suggestions.",
    href: "https://github.com/nmallik1029/ember_analytics",
  },
  {
    title: "VSN Analysis",
    year: "2025",
    stack: ["Python", "JavaScript", "Supabase"],
    description:
      "Full-stack stock analysis platform built on real-time yfinance data. Authenticated users can search equities and indices, save research, and share insights. Designed for retail investors who shouldn't need a Bloomberg terminal to look up a ticker.",
    href: "https://github.com/nmallik1029/vsn_analysis",
    live: "https://vsnanalysis.com",
  },
];

function SlideLink({
  href,
  label,
  reveal,
}: {
  href: string;
  label: string;
  reveal: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-5 overflow-hidden text-xs font-mono w-fit text-right"
    >
      <span className="block h-5 leading-5 text-gray-700 transition-transform duration-300 ease-out group-hover:-translate-y-5">
        {label}
      </span>
      <span className="block h-5 leading-5 text-gray-900 transition-transform duration-300 ease-out group-hover:-translate-y-5">
        {reveal}
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 lg:grid lg:grid-cols-2 lg:gap-16">

        {/* ─── Left rail (sticky on desktop) ─────────────── */}
        <aside className="lg:sticky lg:top-0 lg:h-screen flex flex-col py-16 lg:py-24">
          <h1 className="text-4xl font-semibold tracking-tight mb-3">
            Neel Mallik
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            CS junior at Northeastern University
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-8 max-w-sm">
            I build full-stack apps at the intersection of data, finance, and
            the web. Usually with something algorithmic running underneath.
          </p>

          <div className="mb-10">
            <Skills />
          </div>

        </aside>

        {/* ─── Right column (scrolls) ────────────────────── */}
        <section className="py-8 lg:py-24">

          {/* Projects */}
          <div id="work" className="mb-20">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-8 lg:hidden">
              Projects
            </h2>
            <div className="space-y-10">
              {projects.map((p) => (
                <div key={p.title}>
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h3 className="font-semibold">{p.title}</h3>
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
                        >
                          {p.live.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                    <span className="text-xs font-mono text-gray-400">{p.year}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      GitHub →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* About */}
          <div id="about">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-8 lg:hidden">
              About
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-10">
              Junior studying CS with a minor in Finance. I care about
              making software that's actually useful. Clean interfaces over
              clever APIs, real data over mock data, tools that do one thing
              well.
            </p>
            <div className="flex flex-wrap items-start justify-between gap-y-6">
              <div className="flex flex-col gap-1 text-xs font-mono text-gray-400">
                <span>Boston, MA</span>
                <span>Available Jul–Dec 2026</span>
                <span>Class of 2028</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <SlideLink
                  href="mailto:nmallik1029@gmail.com"
                  label="Email"
                  reveal="nmallik1029@gmail.com"
                />
                <SlideLink
                  href="https://github.com/nmallik1029"
                  label="GitHub"
                  reveal="github.com/nmallik1029"
                />
                <SlideLink
                  href="https://linkedin.com/in/neel-mallik"
                  label="LinkedIn"
                  reveal="linkedin.com/in/neel-mallik"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="border-t border-gray-200" />
      </div>
    </main>
  );
}
