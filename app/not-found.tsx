import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-gutter pb-[max(4rem,8vw)] pt-[max(2rem,5vw)]">
      <h1 data-reveal="mask" className="type-title">
        <span>404</span>
      </h1>
      <p data-reveal="fade" className="mt-6 text-lead text-muted">
        This page doesn&apos;t exist.
      </p>
      <div data-reveal="mask" className="mt-8">
        <Link href="/" className="cta group font-medium">
          <span className="link-draw">Back home</span>
          <span aria-hidden="true" className="arrow">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
