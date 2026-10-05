# Portfolio — Neel Mallik

Personal site built with Next.js 15, TypeScript, and Tailwind.

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Editing Content

Structured content lives in `content/`, and every page reads from it:

- `content/profile.ts` — name, the intro greeting (`welcome`), contact links, availability, education, skills
- `content/projects.ts` — projects (used by the home page showcase, `/projects`, each project's page, and `/resume`)
- `content/experience.ts` — jobs and roles (`/resume`)

Longer prose (the home page intro sentence and About section) is written directly in `app/page.tsx`.

The resume page mirrors `public/Neel_Mallik_Resume.pdf`. When you update the PDF, update the `resume` fields in `content/projects.ts`, the roles in `content/experience.ts`, and `availability`, `education`, and `resumeSkills` in `content/profile.ts` to match. Keep the PDF's file name so download links keep working.

Each project gets its own page at `/projects/<slug>`, built ahead of time from `content/projects.ts`.

**Project Showcase:** the home page shows every project that has `media` set in `content/projects.ts`: a short muted MP4 that loops while it's on screen, plus a poster image shown before it loads. The video fills the card (16:10), with the project's name in a white label at the bottom right and up to its first three `stack` entries as tags at the bottom left (tags that don't fit on one line are left off). The same video appears on the project's own page. Put the files in `public/projects/`. Record at 16:10 and keep them short and light: 10 to 15 seconds, 1600px wide, H.264, a few MB at most.

## Changing the Look

- **Colors:** the variables at the top of `app/globals.css`. Every color on the site comes from those, so changing them re-themes everything.
- **Type:** one font, Inter (set up in `app/layout.tsx`): ExtraBold for headings and the name (the `.type-*` classes in `app/globals.css`), regular for body text. Text sizes (`text-micro` to `text-lead`) are in `tailwind.config.js` and grow with the window, with minimum sizes.
- **The name in the hero** is sized to span the screen exactly, using its measured width in `--masthead-em` (in `.type-masthead`). Re-measure it if the name changes.
- **Logo:** the header draws `public/logo-mask.png` in the current text color (`.logo-mark` in `app/globals.css`), so it follows `--ink`. It was made from `public/logo.png`: dark areas opaque, light areas transparent.
- **Layout:** most sections use `components/Split.tsx`, a divider with a heading on the left and content starting at the center line.
- **Shared styles:** `.link`, `.link-draw`, `.cta`, `.arrow`, `.pill`, and `.btn` in `app/globals.css`.

## Motion

- **Intro** (`components/Intro.tsx`): fresh loads of the home page open on the greeting from `content/profile.ts`, which then moves into place in the hero.
- **Page transitions** (`components/Transitions.tsx`): following a link drops a panel down over the page, changes the route behind it, and uncovers the new page. Fresh loads of other pages uncover the same way.
- **Scroll reveals:** add `data-reveal="mask"`, `"fade"`, or `"rule"` to an element to animate it in when it scrolls into view. Elements that appear together are staggered automatically (`components/RevealObserver.tsx`).
- Everything above is skipped for visitors with reduced motion turned on, when printing, and if scripts don't load.

## Deploying to Railway

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo**, pick this repo.
3. Railway auto-detects Next.js via Nixpacks. No env vars are required.
4. Once deployed, go to **Settings → Networking → Generate Domain** for a `*.up.railway.app` URL, or add a custom domain.

Railway will run `npm run build` then `npm run start` automatically. The `start` script reads `$PORT` from Railway's environment.

Optional env vars:

- `NEXT_PUBLIC_WEB3FORMS_KEY` — contact form key (falls back to the one in `components/ContactForm.tsx`)
- `GITHUB_WEBHOOK_SECRET` — for `/api/revalidate`, a GitHub push webhook that refreshes `/projects`

## Custom Domain

In Railway: **Settings → Networking → Custom Domain**, then add a CNAME at your DNS provider pointing to the Railway domain Railway gives you. Propagation usually takes a few minutes.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
