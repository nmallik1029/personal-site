import Link from "next/link";
import Skills from "@/components/Skills";
import FadeIn from "@/components/FadeIn";

const projects = [
  {
    title: "EMBER Analytics",
    year: "2025",
    stack: ["TypeScript", "Python"],
    description:
      "Portfolio generator that builds personalized baskets from user-provided capital, risk tolerance, and interests. A scoring engine underneath uses volatility, historical returns, and financial indicators to rank suggestions.",
    href: "https://github.com/nmallik1029/ember-analytics",
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
      className="group relative block h-6 overflow-hidden text-sm font-mono w-fit text-right"
    >
      <span className="block h-6 leading-6 text-gray-700 transition-transform duration-300 ease-out group-hover:-translate-y-6">
        {label}
      </span>
      <span className="block h-6 leading-6 text-gray-900 transition-transform duration-300 ease-out group-hover:-translate-y-6">
        {reveal}
      </span>
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-6 lg:px-12 lg:grid lg:grid-cols-2 lg:gap-20">

        {/* ─── Left rail (sticky on desktop) ─────────────── */}
        <aside className="lg:sticky lg:top-0 flex flex-col py-16 lg:py-24">
          <h1 className="text-6xl font-semibold tracking-tight mb-4">
            Neel Mallik
          </h1>
          <p className="text-2xl text-gray-700 mb-6">
            CS + Mathematics at Northeastern University
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-md">
            I build <strong className="font-semibold text-gray-900">full-stack apps at the intersection of data, finance, and
            the web.</strong> Usually with something algorithmic running underneath.
          </p>

          <div className="mb-10">
            <Skills />
          </div>

        </aside>

        {/* ─── Right column (scrolls) ────────────────────── */}
        <section className="py-8 lg:py-24">

          {/* Projects */}
          <div id="work" className="mb-12">
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-8 lg:hidden">
              Projects
            </h2>
            <div className="space-y-10">
              {projects.map((p) => (
                <div key={p.title}>
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <h3 className="text-2xl font-semibold">{p.title}</h3>
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-mono text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
                        >
                          {p.live.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                    </div>
                    <span className="text-sm font-mono text-gray-400">{p.year}</span>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed mb-4">
                    {p.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {p.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-sm font-mono bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-gray-400 hover:text-gray-900 transition-colors"
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
            <p className="text-base text-gray-600 leading-relaxed mb-12">
              Junior studying CS with a minor in Mathematics. I care about
              making software that's actually useful. Clean interfaces over
              clever APIs, real data over mock data, tools that do one thing
              well.
            </p>
            <div className="flex flex-wrap items-start justify-between gap-y-6">
              <div className="flex flex-col gap-1 text-sm font-mono leading-6 text-gray-400">
                <span className="h-6">Boston, MA</span>
                <span className="h-6">Available Jul–Dec 2026</span>
                <span className="h-6">Class of 2028</span>
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

        {/* ─── View Resume CTA (inside splash) ────────────── */}
        <div className="-mt-12 lg:-mt-16 flex justify-center">
          <Link
            href="/resume"
            className="group inline-flex items-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-mono uppercase tracking-widest hover:bg-gray-700 transition-colors shadow-sm"
          >
            View Resume
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* ─── Section divider ────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 -mt-4 lg:-mt-6">
        <div className="border-t-2 border-gray-300" />
      </div>

      {/* ─── About (scroll-revealed) ────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-tight mb-8">
            About me
          </h2>
        </FadeIn>

        <div className="columns-1 lg:columns-2 gap-x-12">
        <FadeIn delay={100} className="break-inside-avoid">
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            I&apos;m a{" "}
            <strong className="font-semibold text-gray-900">
              Computer Science student at Northeastern University
            </strong>{" "}
            with a concentration in{" "}
            <strong className="font-semibold text-gray-900">
              Artificial Intelligence
            </strong>{" "}
            and a strong interest in{" "}
            <strong className="font-semibold text-gray-900">
              machine learning, data analysis, and full-stack development
            </strong>
            . What draws me most to technology is the ability to turn
            information into something practical and meaningful. I enjoy
            building systems that simplify decision making, uncover patterns in
            data, and create smoother experiences for users. Most of my work
            revolves around{" "}
            <strong className="font-semibold text-gray-900">
              Python, TypeScript, JavaScript, and SQL
            </strong>
            , and I&apos;m especially interested in the intersection of
            analytics, prediction models, and user-focused software design.
          </p>
        </FadeIn>

        <FadeIn delay={250} className="break-inside-avoid">
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            A lot of my recent work has centered around finance and data-driven
            applications. I developed{" "}
            <strong className="font-semibold text-gray-900">
              EMBER Analytics
            </strong>
            , a portfolio generation platform that creates personalized stock
            portfolios based on user inputs like risk tolerance, investment
            goals, and existing holdings. The platform uses{" "}
            <strong className="font-semibold text-gray-900">
              scoring systems, financial indicators, and volatility analysis
            </strong>{" "}
            to generate recommendations that feel more adaptive and
            personalized. Building it gave me experience across both{" "}
            <strong className="font-semibold text-gray-900">
              frontend and backend development
            </strong>
            , while also reinforcing how important it is to make technically
            complex systems feel intuitive for the user.
          </p>
        </FadeIn>

        <FadeIn delay={400} className="break-inside-avoid">
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            I also created{" "}
            <strong className="font-semibold text-gray-900">VSN Analysis</strong>
            , a{" "}
            <strong className="font-semibold text-gray-900">
              full-stack stock analysis platform
            </strong>{" "}
            built around real-time financial data and community interaction.
            The platform includes{" "}
            <strong className="font-semibold text-gray-900">
              live charting tools, stock analysis features, authentication
              systems
            </strong>
            , and a community space where users can discuss market activity
            and ideas. One of my biggest goals with the project was{" "}
            <strong className="font-semibold text-gray-900">accessibility</strong>
            . I wanted to make financial tools feel approachable to users who
            may not have extensive investing experience while still providing
            meaningful depth and functionality. Working on projects like this
            has strengthened my interest in creating software that balances
            strong technical foundations with clean and straightforward user
            experiences.
          </p>
        </FadeIn>

        <FadeIn delay={550} className="break-inside-avoid">
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            Outside of software development, rowing has been one of the most
            important parts of my life and has shaped a lot of how I approach{" "}
            <strong className="font-semibold text-gray-900">
              leadership and teamwork
            </strong>
            . I{" "}
            <strong className="font-semibold text-gray-900">
              captained my high school rowing team
            </strong>
            , an experience that taught me how to lead under pressure, support
            teammates through difficult training cycles, and keep a group
            motivated toward long-term goals. Rowing is a sport that demands
            consistency and discipline every single day, and I learned quickly
            that success depends just as much on trust and communication as it
            does on physical performance. Competing in regattas and earning
            medals alongside my teammates remains one of the most rewarding
            experiences I&apos;ve had, not only because of the results but
            because of the work and commitment it took to get there.
          </p>
        </FadeIn>

        <FadeIn delay={700} className="break-inside-avoid">
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            That same mindset has carried over into the way I work with people
            today. Through my role with{" "}
            <strong className="font-semibold text-gray-900">Gankster.gg</strong>
            , I have worked directly with a large user base, resolving support
            tickets and helping users navigate technical issues clearly and
            efficiently. Working in a fast-paced support environment taught me
            how important{" "}
            <strong className="font-semibold text-gray-900">
              communication and adaptability
            </strong>{" "}
            are, especially when working with people from different technical
            backgrounds. I&apos;ve also enjoyed building communities outside of
            work, including{" "}
            <strong className="font-semibold text-gray-900">
              founding the Games Club at Northeastern
            </strong>{" "}
            as a way to bring students together through shared interests and
            collaboration.
          </p>
        </FadeIn>

        <FadeIn delay={850} className="break-inside-avoid">
          <p className="text-base text-gray-700 leading-relaxed">
            At this stage, I&apos;m focused on continuing to grow both
            technically and personally through projects that challenge me to
            think creatively and solve meaningful problems. Whether I&apos;m
            building applications, analyzing data, collaborating with a team,
            or working toward long-term goals outside of technology, I try to
            approach everything with{" "}
            <strong className="font-semibold text-gray-900">
              curiosity, consistency, and a willingness to improve
            </strong>
            . I&apos;m excited by work that combines technical depth with
            real-world impact, and I&apos;m always looking for opportunities
            to build things that people genuinely find useful.
          </p>
        </FadeIn>
        </div>
      </section>
    </main>
  );
}
