// Shared state for the site's motion: components/Intro.tsx,
// components/Transitions.tsx, and components/RevealObserver.tsx.

export const EASE_IN_OUT = "cubic-bezier(0.76, 0, 0.24, 1)";

export function reducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Set once the first page has hydrated, to tell a fresh page load apart
// from client-side navigation.
export const boot = { done: false };

// Scroll reveals wait while the gate is held, so content doesn't animate in
// behind the intro screen or a page transition.
type Listener = () => void;
const listeners = new Set<Listener>();
let held = true;
let failsafe: ReturnType<typeof setTimeout> | undefined;

function release() {
  clearTimeout(failsafe);
  if (!held) return;
  held = false;
  listeners.forEach((listener) => listener());
}

function hold() {
  held = true;
  clearTimeout(failsafe);
  // Never leave content hidden for long if something goes wrong
  failsafe = setTimeout(release, 6000);
}

export const gate = {
  get held() {
    return held;
  },
  hold,
  release,
  onRelease(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

// Pages start held until the intro or the first transition lets them in
if (typeof window !== "undefined") hold();
