import Link from "next/link";
import Drift from "@/components/Drift";
import Intro from "@/components/Intro";
import ShowcaseVideo from "@/components/ShowcaseVideo";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";

export default function Home() {
  const showcase = projects.filter((p) => p.media);

  return (
    <>
      <Intro text={profile.welcome} />

      {/* Hero: exactly fills the first screen */}
      <section className="flex min-h-[calc(100svh_-_var(--header-h))] flex-col justify-between gap-12 px-gutter pb-[max(0.75rem,1vw)] pt-[max(1.5rem,3vw)]">
        <div>
          <p
            id="welcome"
            data-reveal="mask"
            className="type-welcome text-[clamp(1.125rem,1.6vw,1.75rem)]"
          >
            <span>{profile.welcome}</span>
          </p>
          <p
            data-reveal="fade"
            className="mt-[max(1rem,1.5vw)] max-w-[30ch] text-[clamp(1.625rem,3.2vw,3.75rem)] font-medium leading-[1.12] tracking-[-0.03em]"
          >
            I study Computer Science and Finance with a concentration in Artificial Intelligence @ Northeastern University.
          </p>
        </div>

        {/* Container for the name, which is sized to span it exactly */}
        <div className="[container-type:inline-size]">
          <div className="flex items-end justify-between gap-6 pb-3 text-small font-medium">
            <p data-reveal="mask">
              <span>{profile.location}</span>
            </p>
            <a href="#showcase" data-reveal="mask">
              <span>
                Scroll{" "}
                <span aria-hidden="true" className="scroll-arrow">
                  ↓
                </span>
              </span>
            </a>
          </div>
          <div data-reveal="rule" aria-hidden="true" />
          <h1 data-reveal="mask" className="type-masthead pt-[max(0.5rem,0.8vw)]">
            <span>{profile.name}</span>
          </h1>
        </div>
      </section>

      {/* Project Showcase */}
      <section
        id="showcase"
        aria-labelledby="showcase-title"
        className="scroll-mt-[var(--header-h)] px-gutter pt-[max(4rem,7vw)]"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <h2
            id="showcase-title"
            data-reveal="mask"
            className="type-title text-[clamp(2.75rem,7vw,8rem)]"
          >
            <span>Project Showcase</span>
          </h2>
          <div data-reveal="mask" className="shrink-0 pb-[0.4em]">
            <Link href="/projects" className="cta group font-medium">
              <span className="link-draw">All projects</span>
              <span aria-hidden="true" className="arrow">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-[max(2rem,3.5vw)] grid gap-[max(1rem,1.25vw)] md:grid-cols-2">
          {showcase.map((p) => (
            // The video is the whole card; its labels sit on top of it in
            // fixed colors, since they're over footage, not the page.
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              data-reveal="fade"
              className="group relative isolate block aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-black"
            >
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]">
                {p.media && (
                  <ShowcaseVideo
                    src={p.media.video}
                    poster={p.media.poster}
                    label={`Preview of ${p.name}`}
                  />
                )}
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 via-black/15 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-[max(0.75rem,1.1vw)]">
                {/* One row of tags: any that don't fit beside the name wrap
                    onto a second row, which is cut off */}
                <ul className="flex h-[2em] min-w-0 flex-wrap gap-x-1.5 overflow-hidden text-small font-medium">
                  {p.stack.slice(0, 3).map((tech) => (
                    <li
                      key={tech}
                      className="flex h-[2em] items-center rounded-full bg-white/90 px-[0.85em] text-[#141210] backdrop-blur"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
                <span className="flex shrink-0 items-center gap-2 rounded-[0.7rem] bg-white px-[1em] py-[0.6em] text-[#141210] shadow-[0_8px_24px_rgb(0_0_0/0.25)]">
                  <span className="text-lead font-bold tracking-[-0.02em]">
                    {p.name}
                  </span>
                  <span aria-hidden="true" className="arrow">
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        aria-labelledby="about-title"
        className="flex min-h-[100svh] scroll-mt-[var(--header-h)] flex-col justify-center px-gutter pb-[max(1rem,2vw)] pt-[max(6rem,10vw)]"
      >
        <h2
          id="about-title"
          data-reveal="mask"
          className="text-small font-semibold uppercase tracking-[0.08em] text-muted"
        >
          <span>About</span>
        </h2>
        <p
          data-reveal="fade"
          className="mt-[max(1.5rem,2.5vw)] max-w-[20ch] text-[clamp(2.25rem,5vw,6rem)] font-extrabold leading-[1.02] tracking-[-0.04em]"
        >
          A little about me...
        </p>

        {/* A staircase (one column on phones): heading at the left edge, the
            first column in from the left, the second on the right and lower.
            The second also drifts a little as you scroll. */}
        <div className="mt-[max(3rem,5vw)] grid gap-y-[1em] text-lead text-muted md:grid-cols-12 md:gap-x-[max(1.5rem,2.5vw)]">
          <div className="max-w-[34rem] space-y-[1em] md:col-span-5 md:col-start-2 lg:col-span-4 lg:col-start-3">
            <p data-reveal="fade">
              I grew up in Chicago before moving to a small(ish) town on the Iowa–Illinois border.
              I did soccer, competitive sculling, snare drum, and plenty of video games, but two
              things stuck: investing and coding.
            </p>
            <p data-reveal="fade">
              I&apos;ve always been fascinated by how a company&apos;s image with investors moves
              billions of dollars a day. At 14, I&apos;d watch my few hundred dollars of Amazon,
              NVIDIA, and Apple tick up and back down without caring why. Now that my losses are
              actually <em>my</em> losses, it all feels a lot more real.
            </p>
          </div>
          <Drift className="max-w-[34rem] space-y-[1em] md:col-span-6 md:col-start-7 md:mt-[max(5rem,9vw)] lg:col-span-5 lg:col-start-8">
            <p data-reveal="fade">
              My coding journey started in elementary school with a line-following robot for my school&apos;s
              tech fair. It went to the state fair and won its category. Since then I&apos;ve built
              client websites, game scripts and styles, and full applications that grew into physical products.
            </p>
            <p data-reveal="fade">
              Coding and investing are a natural pair. This summer I built a watchlist bot that pinged my phone
              with a score and its take on each stock it flagged. Tinkering with its screening
              algorithms and news sources taught me a ton about what actually moves prices.
            </p>
            <div data-reveal="mask" className="pt-2">
              <Link href="/resume" className="cta group font-semibold text-ink">
                <span className="link-draw">Resume</span>
                <span aria-hidden="true" className="arrow">
                  →
                </span>
              </Link>
            </div>
          </Drift>
        </div>
      </section>
    </>
  );
}
