import type { ReactNode } from "react";

// A title with a date beside it. On small screens the date sits under the
// title; on wider ones the title wraps instead of pushing the date down.
export default function TitleRow({
  children,
  date,
}: {
  children: ReactNode;
  date: string;
}) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      {children}
      <span className="text-small tabular-nums text-muted sm:shrink-0 sm:whitespace-nowrap">
        {date}
      </span>
    </div>
  );
}
