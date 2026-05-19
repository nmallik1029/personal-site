import Link from "next/link";

export const metadata = {
  title: "Projects — Neel Mallik",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
          Projects
        </p>
        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-16">
          Things I&apos;ve built.
        </h1>

        {/* Placeholder — to be replaced with the interactive project showcase */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center text-sm font-mono uppercase tracking-widest text-gray-400">
          Project showcase coming here — interactive cards with demo videos
        </div>
      </div>
    </main>
  );
}
