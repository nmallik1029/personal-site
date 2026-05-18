# Portfolio — Neel Mallik

A minimal, editorial-style portfolio site built with Next.js 15, TypeScript, and Tailwind.

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Editing Content

All content lives in `app/page.tsx` — projects are an array at the top of the file. Add or edit entries there.

Design tokens (colors, fonts) live in `tailwind.config.js` and `app/globals.css`.

## Deploying to Railway

1. Push this repo to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo**, pick this repo.
3. Railway auto-detects Next.js via Nixpacks. No env vars needed for a static-ish site like this.
4. Once deployed, go to **Settings → Networking → Generate Domain** for a `*.up.railway.app` URL, or add a custom domain.

Railway will run `npm run build` then `npm run start` automatically. The `start` script reads `$PORT` from Railway's environment.

## Custom Domain

In Railway: **Settings → Networking → Custom Domain**, then add a CNAME at your DNS provider pointing to the Railway domain Railway gives you. Propagation usually takes a few minutes.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Cormorant Garamond + Inter Tight + JetBrains Mono (via `next/font`)
