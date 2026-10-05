"use client";

import { useEffect } from "react";
import { gate } from "@/lib/motion";

const STAGGER_MS = 140;
const MAX_STEPS = 8;

/*
  Adds .is-visible to [data-reveal] elements as they scroll into view (the
  animations are in app/globals.css). Elements that come into view together
  animate one after another, in page order. While the intro or a page
  transition is running, reveals wait for gate.release().
*/
export default function RevealObserver() {
  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const waiting = new Set<Element>();

    const reveal = (elements: Element[]) => {
      elements
        .sort((a, b) =>
          a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
        )
        .forEach((el, i) => {
          const step = Math.min(i, MAX_STEPS);
          (el as HTMLElement).style.setProperty("--delay", `${step * STAGGER_MS}ms`);
          el.classList.add("is-visible");
        });
    };

    const io = new IntersectionObserver((entries) => {
      const ready: Element[] = [];
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        if (gate.held) waiting.add(entry.target);
        else ready.push(entry.target);
      }
      if (ready.length) reveal(ready);
    });

    const stopWaiting = gate.onRelease(() => {
      const elements = [...waiting];
      waiting.clear();
      reveal(elements);
    });

    const observeWithin = (root: ParentNode) =>
      root
        .querySelectorAll("[data-reveal]:not(.is-visible)")
        .forEach((el) => io.observe(el));

    observeWithin(document);

    // Pick up content added later, e.g. after client-side navigation.
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]:not(.is-visible)")) io.observe(node);
          observeWithin(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      stopWaiting();
    };
  }, []);

  return null;
}
