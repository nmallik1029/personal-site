import type { Project } from "@/content/projects";

export default function Status({
  status,
}: {
  status: NonNullable<Project["status"]>;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-small">
      <span
        aria-hidden="true"
        className={`h-2 w-2 rounded-full ${status === "Live" ? "bg-live" : "bg-muted/40"}`}
      />
      {status}
    </span>
  );
}
