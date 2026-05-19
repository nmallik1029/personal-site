"use client";

import { useEffect, useRef, useState } from "react";

type Skill = {
  name: string;
  slug?: string;
  category: "Languages" | "Frameworks" | "AI/ML" | "Cloud" | "Tools";
};

const skills: Skill[] = [
  // Languages
  { name: "Python", slug: "python", category: "Languages" },
  { name: "TypeScript", slug: "typescript", category: "Languages" },
  { name: "JavaScript", slug: "javascript", category: "Languages" },
  { name: "Java", slug: "openjdk", category: "Languages" },
  { name: "C++", slug: "cplusplus", category: "Languages" },
  { name: "Kotlin", slug: "kotlin", category: "Languages" },
  { name: "SQL", slug: "mysql", category: "Languages" },
  { name: "HTML", slug: "html5", category: "Languages" },
  { name: "Lua", slug: "lua", category: "Languages" },

  // Frameworks
  { name: "React", slug: "react", category: "Frameworks" },
  { name: "Next.js", slug: "nextdotjs", category: "Frameworks" },
  { name: "Tailwind", slug: "tailwindcss", category: "Frameworks" },

  // AI/ML
  { name: "NumPy", slug: "numpy", category: "AI/ML" },
  { name: "Pandas", slug: "pandas", category: "AI/ML" },
  { name: "Jupyter", slug: "jupyter", category: "AI/ML" },
  { name: "LoRA/PEFT", category: "AI/ML" },

  // Cloud
  { name: "Vercel", slug: "vercel", category: "Cloud" },
  { name: "Railway", slug: "railway", category: "Cloud" },
  { name: "Render", slug: "render", category: "Cloud" },
  { name: "Cloudflare", slug: "cloudflare", category: "Cloud" },
  { name: "Supabase", slug: "supabase", category: "Cloud" },

  // Tools
  { name: "Docker", slug: "docker", category: "Tools" },
  { name: "Git", slug: "git", category: "Tools" },
  { name: "GitHub", slug: "github", category: "Tools" },
  { name: "PostgreSQL", slug: "postgresql", category: "Tools" },
  { name: "SQLite", slug: "sqlite", category: "Tools" },
  { name: "Neovim", slug: "neovim", category: "Tools" },
  { name: "IntelliJ", slug: "intellijidea", category: "Tools" },
  { name: "JetBrains", slug: "jetbrains", category: "Tools" },
  { name: "Figma", slug: "figma", category: "Tools" },
  { name: "Notion", slug: "notion", category: "Tools" },
  { name: "REST APIs", category: "Tools" },
];

const categories = ["All", "Languages", "Frameworks", "AI/ML", "Cloud", "Tools"] as const;
type Category = (typeof categories)[number];

const PAGE_SIZE = 12;

function SkillCard({ s, index }: { s: Skill; index: number }) {
  return (
    <div
      className="skill-fade group flex flex-col items-center justify-center gap-2 aspect-square border border-gray-100 rounded-lg p-3 hover:border-gray-300 hover:bg-gray-50 transition-colors"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {s.slug ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${s.slug}`}
            alt={s.name}
            className="w-7 h-7 opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-[10px] font-mono text-gray-600 group-hover:text-gray-900 transition-colors text-center">
            {s.name}
          </span>
        </>
      ) : (
        <span className="text-xs font-mono text-gray-700 group-hover:text-gray-900 transition-colors text-center leading-tight">
          {s.name}
        </span>
      )}
    </div>
  );
}

export default function Skills() {
  const [active, setActive] = useState<Category>("All");
  const [page, setPage] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const directionRef = useRef<1 | -1>(1);

  const filtered =
    active === "All" ? skills : skills.filter((s) => s.category === active);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  useEffect(() => {
    if (!autoPlay || totalPages <= 1) return;
    const id = setInterval(() => {
      setPage((p) => {
        let next = p + directionRef.current;
        if (next >= totalPages) {
          directionRef.current = -1;
          next = p - 1;
        } else if (next < 0) {
          directionRef.current = 1;
          next = p + 1;
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(id);
  }, [autoPlay, totalPages]);

  const stopAutoPlay = () => setAutoPlay(false);

  // Slice the filtered list into pages of PAGE_SIZE, padding the last page
  const pages: (Skill | null)[][] = Array.from({ length: totalPages }, (_, i) => {
    const slice = filtered.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
    while (slice.length < PAGE_SIZE) slice.push(null as unknown as Skill);
    return slice as (Skill | null)[];
  });

  const hasPrev = safePage > 0;
  const hasNext = safePage < totalPages - 1;

  const changeCategory = (c: Category) => {
    setActive(c);
    setPage(0);
  };

  return (
    <div className="relative border border-gray-100 rounded-xl p-4">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            className={`text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
              active === c
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Sliding viewport */}
      <div className="overflow-hidden">
        <div
          key={active}
          className="flex transition-transform duration-500 ease-out"
          style={{
            width: `${totalPages * 100}%`,
            transform: `translateX(-${(safePage * 100) / totalPages}%)`,
          }}
        >
          {pages.map((pageItems, pi) => (
            <div
              key={pi}
              className="flex-shrink-0 grid grid-cols-3 sm:grid-cols-4 gap-2"
              style={{ width: `${100 / totalPages}%` }}
            >
              {pageItems.map((s, i) =>
                s ? (
                  <SkillCard key={s.name} s={s} index={pi * PAGE_SIZE + i} />
                ) : (
                  <div key={`ph-${pi}-${i}`} className="aspect-square" aria-hidden />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows — positioned outside the bordered container */}
      {totalPages > 1 && (
        <>
          <button
            onClick={() => {
              stopAutoPlay();
              setPage((p) => Math.max(0, p - 1));
            }}
            disabled={!hasPrev}
            aria-label="Previous"
            className="absolute -left-7 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-900 disabled:opacity-25 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>

          <button
            onClick={() => {
              stopAutoPlay();
              setPage((p) => Math.min(totalPages - 1, p + 1));
            }}
            disabled={!hasNext}
            aria-label="Next"
            className="absolute -right-7 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-900 disabled:opacity-25 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
