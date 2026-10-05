import type { ReactNode } from "react";

// A divider, a heading on the left, and content starting at the center
// line. Stacks on small screens.
export default function Split({
  label,
  id,
  children,
  className = "",
}: {
  label: string;
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-[var(--header-h)] ${className}`}>
      <div data-reveal="rule" aria-hidden="true" />
      <div className="grid gap-y-6 pt-6 md:grid-cols-2 md:pt-[max(1.75rem,2.5vw)]">
        <h2 data-reveal="mask" className="type-section">
          <span>{label}</span>
        </h2>
        <div>{children}</div>
      </div>
    </section>
  );
}
