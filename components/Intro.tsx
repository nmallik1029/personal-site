"use client";

import { useEffect, useRef, useState } from "react";
import { EASE_IN_OUT, boot, gate, reducedMotion } from "@/lib/motion";

// When the greeting starts moving, measured from when the page started loading
const MOVE_AT_MS = 1400;
const MOVE_MS = 1400;

/*
  Fresh loads of the home page open on a greeting. After a moment it travels
  to its place in the hero while the page appears around it. The moving text
  is the hero's own copy (#welcome), scaled up to match the greeting and then
  shrunk into place, so nothing gets swapped when it lands. Client-side
  visits to home skip this.
*/
export default function Intro({ text }: { text: string }) {
  const [active] = useState(() => !boot.done);
  const [done, setDone] = useState(false);
  const backdrop = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const target = document.getElementById("welcome");
    // The hero's copy arrives by the move below, not by a scroll reveal
    target?.classList.add("is-visible");

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      gate.release();
      root.classList.remove("intro");
      document.body.style.overflow = "";
      target?.style.removeProperty("position");
      target?.style.removeProperty("z-index");
      target?.style.removeProperty("visibility");
      setDone(true);
    };

    if (reducedMotion() || !target) {
      finish();
      return;
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    document.body.style.overflow = "hidden";
    let cancelled = false;
    const animations: Animation[] = [];
    const timers: number[] = [];

    const move = async () => {
      await document.fonts.ready;
      const el = label.current;
      if (cancelled || !el || !backdrop.current) return;
      const from = el.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const scale =
        parseFloat(getComputedStyle(el).fontSize) /
        parseFloat(getComputedStyle(target).fontSize);

      // Show the hero's copy above the intro screen, blown up over the
      // greeting, and hide the greeting in the same frame
      target.style.position = "relative";
      target.style.zIndex = "60";
      target.style.visibility = "visible";
      el.style.visibility = "hidden";

      animations.push(
        target.animate(
          [
            {
              transformOrigin: "0 0",
              transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${scale})`,
            },
            { transformOrigin: "0 0", transform: "none" },
          ],
          { duration: MOVE_MS, easing: EASE_IN_OUT }
        ),
        backdrop.current.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 1000,
          delay: 250,
          easing: "ease-in-out",
          fill: "forwards",
        })
      );
      // Start revealing the hero while the greeting is on its way
      timers.push(window.setTimeout(() => gate.release(), 400));
      await animations[0].finished.catch(() => {});
      if (!cancelled) finish();
    };

    timers.push(
      window.setTimeout(move, Math.max(300, MOVE_AT_MS - performance.now())),
      // Failsafe: never leave the intro screen up
      window.setTimeout(finish, 8000)
    );

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
      animations.forEach((a) => a.cancel());
      document.body.style.overflow = "";
    };
  }, [active]);

  if (!active || done) return null;

  return (
    <div
      aria-hidden="true"
      className="intro-screen fixed inset-0 z-50 items-center justify-center px-gutter"
    >
      <div ref={backdrop} className="absolute inset-0 bg-paper" />
      <p ref={label} className="type-welcome relative text-[clamp(2rem,5.5vw,6rem)]">
        <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <span className="intro-in inline-block">{text}</span>
        </span>
      </p>
    </div>
  );
}
