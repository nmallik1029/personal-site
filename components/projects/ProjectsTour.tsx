"use client";

import { useEffect, useLayoutEffect, useState } from "react";

type Step = {
  selector: string;
  title: string;
  body: string;
  padding?: number;
};

const STEPS: Step[] = [
  {
    selector: '[data-panel-id="project-list"]',
    title: "All projects",
    body: "Browse the watchlist and click any ticker to feature it in the center view. Each panel is draggable — snap it to a different corner if you like.",
    padding: 6,
  },
  {
    selector: '[data-panel-id="activity-feed"]',
    title: "Recent activity",
    body: "Live commit feed across every project — newest first. Click any entry to jump straight to that commit on GitHub.",
    padding: 6,
  },
  {
    selector: '[data-panel-id="global-stats"]',
    title: "Global stats",
    body: "Aggregate view: how much I've shipped across the whole portfolio — listed projects, total commits, total LOC, and the latest push.",
    padding: 6,
  },
  {
    selector: '[data-tour="repo-stats"]',
    title: "Repo stats",
    body: "Per-project breakdown for the featured project — commit count, lines of code, a custom metric, language composition, and a cumulative-commits chart.",
    padding: 14,
  },
  {
    selector: '[data-tour="media"]',
    title: "Demo",
    body: "A video, GIF, or screenshot that shows the featured project in action. Switches as you click between projects.",
    padding: 10,
  },
];

type Rect = { x: number; y: number; w: number; h: number };
type Placement = "right" | "left" | "below" | "above";

const TOOLTIP_W = 320;
const GAP = 24;
const TRANSITION = "all 420ms cubic-bezier(0.32, 0.72, 0.24, 1)";

export default function ProjectsTour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ w: 0, h: 0 });

  // Auto-open on first visit
  useEffect(() => {
    try {
      if (!localStorage.getItem("projects-tour-seen")) {
        // Small delay so panels have docked into place before we measure
        const t = window.setTimeout(() => setActive(true), 350);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useLayoutEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Re-measure the current target on each step, on resize, and on a small
  // interval (panels can be dragged mid-tour).
  useEffect(() => {
    if (!active) return;

    const current = STEPS[step];
    const pad = current.padding ?? 8;

    const measure = () => {
      const el = document.querySelector(current.selector);
      if (!el) {
        setRect(null);
        return;
      }
      const r = (el as HTMLElement).getBoundingClientRect();
      setRect({
        x: r.left - pad,
        y: r.top - pad,
        w: r.width + pad * 2,
        h: r.height + pad * 2,
      });
    };

    measure();
    const id = window.setInterval(measure, 250);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [active, step]);

  function finish() {
    try {
      localStorage.setItem("projects-tour-seen", "1");
    } catch {
      /* ignore */
    }
    setActive(false);
    // Reset to step 0 only after the fade-out, so the last step doesn't jump
    window.setTimeout(() => setStep(0), 250);
  }

  function next() {
    if (step === STEPS.length - 1) finish();
    else setStep((s) => s + 1);
  }

  function prev() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }

  if (!active) return null;

  const { tipX, tipY, placement } = computeTooltipPosition(rect, viewport);
  const current = STEPS[step];

  return (
    <div
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label={`Tour: ${current.title}`}
    >
      {/* Backdrop click-catcher: dims nothing on its own, but captures stray
          clicks so users don't accidentally trigger the page beneath. */}
      <div
        className="absolute inset-0"
        style={{ background: "transparent" }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Cutout via massive box-shadow — dims everything except the rect. */}
      {rect && (
        <div
          style={{
            position: "fixed",
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h,
            boxShadow: "0 0 0 9999px rgba(15,23,42,0.74)",
            borderRadius: 18,
            transition: TRANSITION,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Highlight outline */}
      {rect && (
        <div
          style={{
            position: "fixed",
            left: rect.x,
            top: rect.y,
            width: rect.w,
            height: rect.h,
            border: "2px solid rgba(255,255,255,0.95)",
            borderRadius: 18,
            transition: TRANSITION,
            pointerEvents: "none",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.25), 0 0 28px rgba(255,255,255,0.18)",
          }}
        />
      )}

      {/* Connector arrow from tooltip toward highlighted rect */}
      {rect && (
        <ConnectorArrow rect={rect} tipX={tipX} tipY={tipY} placement={placement} />
      )}

      {/* Tooltip card */}
      {rect && (
        <div
          style={{
            position: "fixed",
            left: tipX,
            top: tipY,
            width: TOOLTIP_W,
            transition: TRANSITION,
            pointerEvents: "auto",
          }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
              Step {step + 1} of {STEPS.length}
            </p>
            <button
              onClick={finish}
              className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Re-key so the text crossfades on each step */}
          <div key={step} className="tour-fade">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
              {current.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {current.body}
            </p>
          </div>

          <div className="flex items-center justify-between">
            {/* Step dots */}
            <div className="flex items-center gap-1.5">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: i === step ? 18 : 6,
                    background: i === step ? "#111827" : "#d1d5db",
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {step > 0 && (
                <button
                  onClick={prev}
                  className="text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors px-2 py-1"
                >
                  Back
                </button>
              )}
              <button
                onClick={next}
                className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                {step === STEPS.length - 1 ? "Done" : "Next"}
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .tour-fade {
          animation: tourFade 380ms cubic-bezier(0.32, 0.72, 0.24, 1);
        }
        @keyframes tourFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function computeTooltipPosition(
  rect: Rect | null,
  viewport: { w: number; h: number }
): { tipX: number; tipY: number; placement: Placement } {
  if (!rect) return { tipX: 0, tipY: 0, placement: "below" };

  const VW = viewport.w || (typeof window !== "undefined" ? window.innerWidth : 1280);
  const VH = viewport.h || (typeof window !== "undefined" ? window.innerHeight : 720);
  const TIP_H_EST = 220; // approximate tooltip height for placement math

  const spaceRight = VW - (rect.x + rect.w);
  const spaceLeft = rect.x;
  const spaceBelow = VH - (rect.y + rect.h);
  const spaceAbove = rect.y;

  let placement: Placement;
  if (spaceRight >= TOOLTIP_W + GAP + 16) placement = "right";
  else if (spaceLeft >= TOOLTIP_W + GAP + 16) placement = "left";
  else if (spaceBelow >= TIP_H_EST + GAP) placement = "below";
  else if (spaceAbove >= TIP_H_EST + GAP) placement = "above";
  else placement = "below"; // last resort

  let tipX: number;
  let tipY: number;

  if (placement === "right") {
    tipX = rect.x + rect.w + GAP;
    tipY = clamp(rect.y, 24, VH - TIP_H_EST - 24);
  } else if (placement === "left") {
    tipX = rect.x - TOOLTIP_W - GAP;
    tipY = clamp(rect.y, 24, VH - TIP_H_EST - 24);
  } else if (placement === "below") {
    tipX = clamp(rect.x, 24, VW - TOOLTIP_W - 24);
    tipY = rect.y + rect.h + GAP;
  } else {
    tipX = clamp(rect.x, 24, VW - TOOLTIP_W - 24);
    tipY = rect.y - TIP_H_EST - GAP;
  }

  return { tipX, tipY, placement };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function ConnectorArrow({
  rect,
  tipX,
  tipY,
  placement,
}: {
  rect: Rect;
  tipX: number;
  tipY: number;
  placement: Placement;
}) {
  // Start point: a sensible spot on the tooltip's edge facing the rect.
  // End point: closest edge of the rect.
  const TIP_H_EST = 220;

  let sx: number;
  let sy: number;
  let ex: number;
  let ey: number;

  if (placement === "right") {
    sx = tipX;
    sy = tipY + 32;
    ex = rect.x + rect.w;
    ey = rect.y + Math.min(rect.h / 2, 48);
  } else if (placement === "left") {
    sx = tipX + TOOLTIP_W;
    sy = tipY + 32;
    ex = rect.x;
    ey = rect.y + Math.min(rect.h / 2, 48);
  } else if (placement === "below") {
    sx = tipX + 40;
    sy = tipY;
    ex = rect.x + rect.w / 2;
    ey = rect.y + rect.h;
  } else {
    sx = tipX + 40;
    sy = tipY + TIP_H_EST - 12;
    ex = rect.x + rect.w / 2;
    ey = rect.y;
  }

  // Control point for a gentle curve
  const cx = (sx + ex) / 2;
  const cy = (sy + ey) / 2 + (placement === "below" || placement === "above" ? 0 : -20);

  const path = `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`;

  // Arrowhead orientation: angle from control point to end
  const angle = (Math.atan2(ey - cy, ex - cx) * 180) / Math.PI;

  return (
    <svg
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        transition: TRANSITION,
      }}
    >
      <defs>
        <marker
          id="tour-arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.95)" />
        </marker>
      </defs>
      <path
        d={path}
        stroke="rgba(255,255,255,0.95)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 6"
        markerEnd="url(#tour-arrowhead)"
        style={{ transition: TRANSITION }}
      />
      {/* hidden — silences unused warning */}
      <g style={{ display: "none" }}>{angle}</g>
    </svg>
  );
}
