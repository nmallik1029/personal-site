"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4 flex items-center justify-between">
      {/* Logo (home link) */}
      <Link href="/" aria-label="Home" className="block">
        <Image
          src="/logo.png"
          alt="Neel Mallik"
          width={96}
          height={96}
          priority
          className="h-12 w-auto"
        />
      </Link>

      {/* Right links */}
      <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-widest">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-colors ${
                active
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {l.label}
            </Link>
          );
        })}

        <Link
          href="/resume"
          className={`px-4 py-2 rounded-full border transition-colors ${
            pathname === "/resume"
              ? "bg-white text-gray-900 border-gray-900"
              : "bg-gray-900 text-white border-gray-900 hover:bg-white hover:text-gray-900"
          }`}
        >
          Resume
        </Link>
      </div>
    </nav>
  );
}
