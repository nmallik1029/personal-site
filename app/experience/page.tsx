import Link from "next/link";

export default function ExperiencePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-3xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
          Experience
        </p>
        <h1 className="text-3xl font-semibold tracking-tight mb-12">
          What I&apos;ve been working on.
        </h1>

        {/* gankster.gg */}
        <div className="mb-12 pb-12 border-b border-gray-100">
          <div className="flex items-baseline justify-between flex-wrap gap-x-3 mb-2">
            <h2 className="font-semibold text-lg">Support Staff · gankster.gg</h2>
            <span className="text-xs font-mono text-gray-400">150,000+ users</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Resolving tickets and guiding users through a platform built for a
            wide spectrum of technical comfort. Translating technical issues
            into clear, friendly solutions has sharpened how I think about
            interface design — software is only as good as the slowest person
            who has to use it.
          </p>
        </div>

        {/* Nonprofit Database */}
        <div className="mb-12 pb-12 border-b border-gray-100">
          <div className="flex items-baseline justify-between flex-wrap gap-x-3 mb-2">
            <h2 className="font-semibold text-lg">Nonprofit Database · Team Project</h2>
            <span className="text-xs font-mono text-gray-400">Coursework</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Built a database system alongside a team for a hypothetical
            nonprofit, designed around streamlining internal workflow and
            improving staff retention. Collaborative work pushes me to write
            cleaner code than I would alone — scoping, owning a slice, and
            shipping something a group can stand behind.
          </p>
        </div>

        {/* Closing */}
        <p className="text-base text-gray-700 leading-relaxed">
          Interested in working together?{" "}
          <a
            href="mailto:nmallik1029@gmail.com"
            className="underline underline-offset-4 decoration-gray-300 hover:decoration-gray-900 transition-colors"
          >
            Get in touch
          </a>
          .
        </p>
      </section>
    </main>
  );
}
