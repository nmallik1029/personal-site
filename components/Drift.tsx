"use client";

import { useEffect, useRef, type ReactNode } from "react";

/*
  Drifts its content a little while it crosses the screen, from about 2.5% of
  the window width below its place to the same distance above it, so it seems
  to scroll slightly slower than the page. The offset is in whole pixels and
  uses `top` (not a transform), so text stays as sharp as the rest of the page.
  Off on phone widths and with reduced motion.
*/
export default function Drift({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const wide = window.matchMedia("(min-width: 768px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!wide.matches || calm.matches) {
        el.style.top = "";
        return;
      }
      const amount = Math.max(24, window.innerWidth * 0.025);
      const r = el.getBoundingClientRect();
      // Where it would be without the current offset
      const top = r.top - (parseFloat(el.style.top) || 0);
      // 0 as its top enters at the bottom of the screen, 1 as its bottom leaves at the top
      const progress = Math.min(1, Math.max(0, (window.innerHeight - top) / (window.innerHeight + r.height)));
      el.style.top = `${Math.round(amount * (1 - 2 * progress))}px`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    wide.addEventListener("change", schedule);
    calm.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wide.removeEventListener("change", schedule);
      calm.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
    </div>
  );
}
