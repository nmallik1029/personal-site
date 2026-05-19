"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export type DockZone = "tl" | "tr" | "bl" | "br";

export type PanelPosition =
  | { mode: "dock"; zone: DockZone }
  | { mode: "float"; x: number; y: number };

export type PanelBounds = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type Props = {
  id: string;
  title: string;
  defaultPosition: PanelPosition;
  width: number;
  height: number;
  allowedZones?: DockZone[];
  otherBounds?: PanelBounds[];
  onBoundsChange?: (bounds: PanelBounds) => void;
  children: ReactNode;
};

const PADDING = 24;
const NAV_OFFSET = 80;
const PROXIMITY_THRESHOLD = 360;
const ALL_ZONES: DockZone[] = ["tl", "tr", "bl", "br"];

function dockCoords(zone: DockZone, w: number, h: number) {
  const W = typeof window !== "undefined" ? window.innerWidth : 1280;
  const H = typeof window !== "undefined" ? window.innerHeight : 720;
  switch (zone) {
    case "tl":
      return { x: PADDING, y: NAV_OFFSET };
    case "tr":
      return { x: W - w - PADDING, y: NAV_OFFSET };
    case "bl":
      return { x: PADDING, y: H - h - PADDING };
    case "br":
      return { x: W - w - PADDING, y: H - h - PADDING };
  }
}

function overlaps(a: PanelBounds, b: PanelBounds): boolean {
  return !(
    a.x + a.w <= b.x ||
    b.x + b.w <= a.x ||
    a.y + a.h <= b.y ||
    b.y + b.h <= a.y
  );
}

function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function cursorInZone(
  cursorX: number,
  cursorY: number,
  zone: DockZone,
  w: number,
  h: number
): boolean {
  const c = dockCoords(zone, w, h);
  return (
    cursorX >= c.x &&
    cursorX <= c.x + w &&
    cursorY >= c.y &&
    cursorY <= c.y + h
  );
}

export default function DraggablePanel({
  id,
  title,
  defaultPosition,
  width,
  height,
  allowedZones = ALL_ZONES,
  otherBounds = [],
  onBoundsChange,
  children,
}: Props) {
  const [position, setPosition] = useState<PanelPosition>(defaultPosition);
  const [dragLive, setDragLive] = useState<{ x: number; y: number } | null>(
    null
  );
  const [hydrated, setHydrated] = useState(false);

  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const zoneRefs = useRef<Record<DockZone, HTMLDivElement | null>>({
    tl: null,
    tr: null,
    bl: null,
    br: null,
  });

  // Compute available zones from current props (re-derives on every render)
  const availableZones: DockZone[] = allowedZones.filter((zone) => {
    const c = dockCoords(zone, width, height);
    const candidate: PanelBounds = { x: c.x, y: c.y, w: width, h: height };
    return !otherBounds.some((b) => overlaps(candidate, b));
  });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(`panel:${id}`);
      if (raw) setPosition(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [id]);

  // Persist + report bounds when position settles
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(`panel:${id}`, JSON.stringify(position));
    } catch {
      /* ignore */
    }
    const bounds: PanelBounds =
      position.mode === "dock"
        ? { ...dockCoords(position.zone, width, height), w: width, h: height }
        : { x: position.x, y: position.y, w: width, h: height };
    onBoundsChange?.(bounds);
  }, [id, position, width, height, hydrated, onBoundsChange]);

  // Live style — dragLive overrides resting position during drag
  let liveStyle: React.CSSProperties;
  if (dragLive) {
    liveStyle = {
      position: "fixed",
      left: dragLive.x,
      top: dragLive.y,
      width,
      height,
      zIndex: 60,
    };
  } else if (position.mode === "dock") {
    const c = dockCoords(position.zone, width, height);
    liveStyle = {
      position: "fixed",
      left: c.x,
      top: c.y,
      width,
      height,
      zIndex: 30,
    };
  } else {
    liveStyle = {
      position: "fixed",
      left: position.x,
      top: position.y,
      width,
      height,
      zIndex: 30,
    };
  }

  function paintZones() {
    const cursor = cursorRef.current;

    for (const zone of ALL_ZONES) {
      const el = zoneRefs.current[zone];
      if (!el) continue;

      const isAvailable = availableZones.includes(zone);
      const c = dockCoords(zone, width, height);
      const inZone = cursorInZone(cursor.x, cursor.y, zone, width, height);

      if (!isAvailable) {
        // Visibly denied — light red tint, faintly visible
        el.style.opacity = inZone ? "0.7" : "0.25";
        el.style.borderColor = "#fca5a5";
        el.style.background = inZone
          ? "rgba(254,202,202,0.25)"
          : "rgba(254,242,242,0.4)";
        continue;
      }

      const d = dist(cursor.x, cursor.y, c.x + width / 2, c.y + height / 2);

      if (inZone) {
        el.style.opacity = "1";
        el.style.borderColor = "#111827";
        el.style.background = "rgba(17,24,39,0.08)";
      } else if (d < PROXIMITY_THRESHOLD) {
        const t = 1 - d / PROXIMITY_THRESHOLD;
        el.style.opacity = `${0.3 + t * 0.5}`;
        el.style.borderColor = "#6b7280";
        el.style.background = "rgba(243,244,246,0.5)";
      } else {
        el.style.opacity = "0.18";
        el.style.borderColor = "#d1d5db";
        el.style.background = "transparent";
      }
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    const headerEl = e.currentTarget as HTMLElement;
    const panelEl = headerEl.closest("[data-panel-root]") as HTMLElement | null;
    if (!panelEl) return;
    const rect = panelEl.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    cursorRef.current = { x: e.clientX, y: e.clientY };
    draggingRef.current = true;
    setDragLive({ x: rect.left, y: rect.top });
    headerEl.setPointerCapture(e.pointerId);
    requestAnimationFrame(paintZones);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    cursorRef.current = { x: e.clientX, y: e.clientY };
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const c = cursorRef.current;
      setDragLive({
        x: c.x - offsetRef.current.x,
        y: c.y - offsetRef.current.y,
      });
      paintZones();
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const c = cursorRef.current;

    // Snap if cursor is in any AVAILABLE zone on release
    let chosen: DockZone | null = null;
    for (const z of availableZones) {
      if (cursorInZone(c.x, c.y, z, width, height)) {
        chosen = z;
        break;
      }
    }

    if (chosen) {
      setPosition({ mode: "dock", zone: chosen });
    } else {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const fx = Math.max(
        PADDING,
        Math.min(W - width - PADDING, c.x - offsetRef.current.x)
      );
      const fy = Math.max(
        NAV_OFFSET,
        Math.min(H - height - PADDING, c.y - offsetRef.current.y)
      );
      setPosition({ mode: "float", x: fx, y: fy });
    }

    setDragLive(null);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  return (
    <>
      {dragLive !== null &&
        ALL_ZONES.map((zone) => {
          const c = dockCoords(zone, width, height);
          return (
            <div
              key={zone}
              ref={(el) => {
                zoneRefs.current[zone] = el;
              }}
              style={{
                position: "fixed",
                left: c.x,
                top: c.y,
                width,
                height,
                opacity: 0.18,
                borderColor: "#d1d5db",
                background: "transparent",
                transition:
                  "opacity 140ms ease-out, border-color 140ms ease-out, background 140ms ease-out",
                zIndex: 40,
              }}
              className="pointer-events-none rounded-2xl border-2 border-dashed"
            />
          );
        })}

      <div
        data-panel-root
        data-panel-id={id}
        style={liveStyle}
        className={`bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden ${
          dragLive ? "border-gray-900 shadow-lg" : "border-gray-200"
        }`}
      >
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className={`flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50 select-none ${
            dragLive ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ touchAction: "none" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-gray-400 flex flex-col gap-[2px]">
              <span className="block h-[2px] w-3 bg-current rounded-full" />
              <span className="block h-[2px] w-3 bg-current rounded-full" />
              <span className="block h-[2px] w-3 bg-current rounded-full" />
            </span>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
              {title}
            </p>
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}
