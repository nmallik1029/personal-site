"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE_IN_OUT, boot, gate, reducedMotion } from "@/lib/motion";

const COVER_MS = 900;
const UNCOVER_MS = 1000;
const ABOVE = "translateY(-101%)";
const BELOW = "translateY(101%)";

/*
  Page transitions. Following a link dims the page and drops a paper panel
  down from the top while the page sinks slightly. The route changes behind
  the panel, which then keeps going down and off the screen to reveal the
  new page. A fresh load of any page except home (which has <Intro>) starts
  covered and uncovers the same way.
*/
export default function Transitions() {
  const pathname = usePathname();
  const router = useRouter();
  const [startCovered] = useState(pathname !== "/");
  const panel = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const arrived = useRef<(() => void) | null>(null);

  const uncover = useCallback(async () => {
    const el = panel.current;
    if (!el) return;
    gate.release();
    await el
      .animate([{ transform: "none" }, { transform: BELOW }], {
        duration: UNCOVER_MS,
        easing: EASE_IN_OUT,
        fill: "forwards",
      })
      .finished.catch(() => {});
    el.style.transform = ABOVE;
    el.getAnimations().forEach((a) => a.cancel());
  }, []);

  // Fresh page load
  useEffect(() => {
    boot.done = true;
    if (!startCovered) return;
    if (reducedMotion()) {
      if (panel.current) panel.current.style.transform = ABOVE;
      gate.release();
      return;
    }
    const timer = window.setTimeout(uncover, 200);
    return () => window.clearTimeout(timer);
  }, [startCovered, uncover]);

  // Let a pending navigation continue once the new route has rendered
  useEffect(() => {
    arrived.current?.();
    arrived.current = null;
  }, [pathname]);

  const navigate = useCallback(
    async (href: string, hasHash: boolean) => {
      const el = panel.current;
      const shade = dim.current;
      if (busy.current || !el || !shade) return;
      busy.current = true;

      const root = document.documentElement;
      const page = document.getElementById("page");
      const timing = { duration: COVER_MS, easing: EASE_IN_OUT, fill: "forwards" as const };

      gate.hold();
      root.classList.add("is-transitioning");
      const sink = page?.animate(
        [{ transform: "none" }, { transform: "translateY(5rem)" }],
        timing
      );
      shade.animate([{ opacity: 0 }, { opacity: 1 }], timing);
      await el
        .animate([{ transform: ABOVE }, { transform: "none" }], timing)
        .finished.catch(() => {});

      await new Promise<void>((resolve) => {
        arrived.current = resolve;
        router.push(href);
        window.setTimeout(resolve, 5000); // don't hang if the route never changes
      });

      sink?.cancel();
      shade.getAnimations().forEach((a) => a.cancel());
      if (!hasHash) window.scrollTo({ top: 0, behavior: "instant" });
      root.classList.remove("is-transitioning");
      await new Promise((r) => requestAnimationFrame(r));
      await uncover();
      busy.current = false;
    },
    [router, uncover]
  );

  // Send internal link clicks through the transition. Runs before Next's
  // <Link> handler, which skips clicks that were already handled.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;
      if (reducedMotion()) return;
      e.preventDefault();
      navigate(url.pathname + url.search + url.hash, url.hash !== "");
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [navigate]);

  return (
    <>
      <div ref={dim} aria-hidden="true" className="page-dim" />
      <div
        ref={panel}
        aria-hidden="true"
        className="page-panel"
        data-covered={startCovered ? "" : undefined}
      />
    </>
  );
}
