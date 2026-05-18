"use client";

import { useEffect, useState } from "react";

export default function Nav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        stuck
          ? "bg-white/60 backdrop-blur-md border-b border-gray-100"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-2xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between text-sm">
          <span className="font-mono font-medium">neel mallik</span>
          <div className="flex gap-6 text-gray-500">
            <a href="#work" className="hover:text-gray-900 transition-colors">work</a>
            <a href="#about" className="hover:text-gray-900 transition-colors">about</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">contact</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
