import Link from "next/link";

export const metadata = {
  title: "Resume — Neel Mallik",
};

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        {/* Header */}
        <header className="pb-8 mb-10 border-b-2 border-gray-300 text-center">
          <h1 className="text-5xl font-semibold tracking-tight mb-3">
            Neel Mallik
          </h1>
          <div className="text-sm font-mono text-gray-600 flex flex-wrap justify-center gap-x-3 gap-y-1">
            <span>Boston, MA</span>
            <span>·</span>
            <span>(563) 340-8972</span>
            <span>·</span>
            <a
              href="mailto:nmallik1029@gmail.com"
              className="hover:text-gray-900 transition-colors"
            >
              nmallik1029@gmail.com
            </a>
            <span>·</span>
            <span>Available July – December 2026</span>
          </div>
          <div className="text-sm font-mono text-gray-600 flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
            <a
              href="https://github.com/nmallik1029"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              github.com/nmallik1029
            </a>
            <span>·</span>
            <a
              href="https://linkedin.com/in/neel-mallik"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors"
            >
              linkedin.com/in/neel-mallik
            </a>
          </div>
        </header>

        {/* Education */}
        <section className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-200">
            Education
          </h2>
          <div>
            <div className="flex items-baseline justify-between flex-wrap gap-x-3">
              <h3 className="text-base font-semibold">Northeastern University</h3>
              <span className="text-sm font-mono text-gray-500">Expected May 2028</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">
              Candidate for B.S. Computer Science, Minor in Mathematics
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Relevant Courses: Intro. to Databases, Computer Systems, Artificial Intelligence
            </p>
            <p className="text-sm text-gray-600 mt-1">Major GPA: 3.5 / 4.0</p>
          </div>
        </section>

        {/* Skills */}
        <section className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-200">
            Skills
          </h2>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-x-4">
              <span className="font-semibold text-sm w-24 shrink-0">Languages</span>
              <span className="text-sm text-gray-700 flex-1">
                Python, SQL, Java, HTML, JavaScript, CSS, Tailwind, TypeScript, ReactJS
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4">
              <span className="font-semibold text-sm w-24 shrink-0">Software</span>
              <span className="text-sm text-gray-700 flex-1">
                Docker, VS Code, Supabase
              </span>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-200">
            Projects
          </h2>

          <div className="mb-6">
            <div className="flex items-baseline justify-between flex-wrap gap-x-3">
              <h3 className="text-base font-semibold">
                EMBER Analytics{" "}
                <span className="font-normal text-gray-500">| TypeScript, Python</span>
              </h3>
              <span className="text-sm font-mono text-gray-500">
                November 2025 – Present
              </span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc pl-5">
              <li>
                Developed a stock portfolio generator web application that
                builds customized stock portfolios based on user inputs
                including capital, risk tolerance, interests, prior holdings,
                etc.
              </li>
              <li>
                Designed and implemented a scoring and filtering algorithm
                evaluating volatility, historical returns, and additional
                financial indicators to optimize portfolio recommendations.
              </li>
              <li>
                Built full-stack architecture integrating frontend UI with
                backend logic, improving usability for retail investors.
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between flex-wrap gap-x-3">
              <h3 className="text-base font-semibold">
                VSN Analysis{" "}
                <span className="font-normal text-gray-500">
                  | HTML, CSS, JavaScript, Python
                </span>
              </h3>
              <span className="text-sm font-mono text-gray-500">
                August 2025 – Present
              </span>
            </div>
            <p className="text-xs font-mono mt-1">
              <a
                href="https://vsnanalysis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-900 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
              >
                vsnanalysis.com
              </a>
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc pl-5">
              <li>
                Built a full-stack stock analysis platform enabling users to
                search for equities and indices using real-time financial data
                via the yfinance API.
              </li>
              <li>
                Implemented user authentication and a community feature to
                promote engagement and shared insights.
              </li>
              <li>
                Designed and deployed backend infrastructure using Supabase
                for data storage and account management.
              </li>
              <li>
                Improved accessibility for less familiar investors by creating
                a simpler, more straightforward user interface using HTML,
                CSS, and JavaScript.
              </li>
            </ul>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-200">
            Experience
          </h2>

          <div className="mb-6">
            <div className="flex items-baseline justify-between flex-wrap gap-x-3">
              <h3 className="text-base font-semibold">
                Community Support{" "}
                <span className="font-normal text-gray-500">| Gankster.gg</span>
              </h3>
              <span className="text-sm font-mono text-gray-500">
                October 2024 – Present
              </span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc pl-5">
              <li>
                Resolved 600+ user support tickets for a platform serving over
                150,000 users, maintaining high response efficiency and user
                satisfaction.
              </li>
              <li>
                Collaborated with developers to streamline workflow and
                improve overall user experience.
              </li>
              <li>
                Strengthened communication skills by translating technical
                issues into clear, actionable reports.
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline justify-between flex-wrap gap-x-3">
              <h3 className="text-base font-semibold">
                Founder{" "}
                <span className="font-normal text-gray-500">
                  | Games Club @ Northeastern University (Oakland)
                </span>
              </h3>
              <span className="text-sm font-mono text-gray-500">
                September 2024 – April 2025
              </span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc pl-5">
              <li>
                Initiated a student organization focused on community-building
                via video and board games.
              </li>
              <li>
                Recruited members via campus fairs and outreach, eventually
                creating a mailing list of 50+ students.
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline justify-between flex-wrap gap-x-3">
              <h3 className="text-base font-semibold">
                Captain{" "}
                <span className="font-normal text-gray-500">
                  | Rivermont Collegiate Rowing Team
                </span>
              </h3>
              <span className="text-sm font-mono text-gray-500">2022 – 2023</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc pl-5">
              <li>
                Led teammates through intensive daily training cycles and
                competitive regatta seasons.
              </li>
              <li>
                Earned medals alongside teammates while developing leadership
                under pressure, long-term goal setting, and trust-based team
                communication.
              </li>
            </ul>
          </div>

          <div>
            <div className="flex items-baseline justify-between flex-wrap gap-x-3">
              <h3 className="text-base font-semibold">
                Host{" "}
                <span className="font-normal text-gray-500">| FoodAffair Bistro</span>
              </h3>
              <span className="text-sm font-mono text-gray-500">
                June 2021 – August 2022
              </span>
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-gray-700 leading-relaxed list-disc pl-5">
              <li>
                Managed high-volume front-of-house operations, seating and
                assisting 100+ guests per shift.
              </li>
              <li>
                Reduced door-to-table time by improving guest flow coordination
                during peak hours.
              </li>
              <li>
                Worked closely with management to adapt to staffing and
                operational needs in a fast-paced environment.
              </li>
            </ul>
          </div>
        </section>

        {/* Optional download fallback */}
        <div className="pt-8 mt-4 border-t border-gray-200">
          <a
            href="/Neel_Mallik_Resume.pdf"
            download
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF version
          </a>
        </div>
      </div>
    </main>
  );
}
