# Auto Cluster — plain HTML/CSS/JS build

A from-scratch rebuild of the Next.js/React app in `../src` as plain HTML, CSS and
vanilla JavaScript, served by a plain Node/Express server (no React, no JSX). Built
alongside the existing app rather than replacing it, so the working site keeps running
while this gets built out in phases.

## Run it

```bash
npm install
npm run build:css   # compiles Tailwind design tokens -> public/css/styles.css
npm run dev          # http://localhost:4000 (set PORT to use a different one)
```

`npm run watch:css` rebuilds the CSS on change while you edit `src/styles/input.css`.

## What this replaces, and why it's structured this way

Next.js does two separate jobs: rendering pages with React, and running the Node
server underneath. Moving to plain HTML/CSS/JS only has to replace the first one — the
actual business logic (auth, enquiries, bookings, the Postgres store, email, uploads,
validation — none of it is React) can be ported across largely unchanged once later
phases reach it.

- **`src/templates/`** — page-template functions, one per route, returning HTML
  strings. The plain-JS equivalent of `src/app/(site)/**/page.tsx`.
- **`src/templates/layout.js`** — the shared `<html>` shell, header (with mobile nav
  drawer) and footer. Equivalent of `src/app/(site)/layout.tsx` +
  `src/components/layout/{Header,Footer}.tsx`.
- **`src/templates/components.js`** — small markup helpers (`container`, `buttonLink`,
  `section`, `pageHero`) mirroring `src/components/ui/{Button,Section}.tsx`'s className
  logic, so pages don't repeat the same Tailwind strings everywhere.
- **`src/lib/html.js`** — a tagged-template helper (`` html`...` ``) that auto-escapes
  every interpolated value. **This is not optional boilerplate**: React escapes
  everything in JSX automatically, and a hand-written HTML string built with plain
  template literals does not. Without this file, every page that renders
  database-backed content (enquiries, staff names, booking details) would be an XSS
  vulnerability. Use `html` for every page; only use `raw()` on a string you wrote
  yourself, never on anything derived from user or database input.
- **`src/content/`** — plain-JS ports of `src/content/*.ts` (same data, types
  stripped).
- **`public/`** — compiled CSS and the vanilla-JS progressive enhancement
  (`public/js/main.js`). Images and logos are served directly from the Next.js app's
  own `public/` folder (`../public`) rather than duplicated — see `server.js`.

## Phase status

- [x] **Phase 1 — scaffold.** Server, shared layout/header/footer, Tailwind build,
      Home and About pages.
- [ ] Phase 2 — Facilities, Equipment, Venues (data-driven from ported content
      modules).
- [ ] Phase 3 — Forms (enquiry, careers, contact) wired to ported backend logic.
- [ ] Phase 4 — Staff console (login, dashboard, CRUD).
- [ ] Phase 5 — Bookings, events, uploads, payments, cron.
- [ ] Phase 6 — Redirects, sitemap, SEO, accessibility pass.

## Known differences from the Next.js app (so far)

- Fonts load from Google Fonts' CDN via `<link>` rather than being self-hosted at
  build time (`next/font`) — a small runtime request the Next.js version avoided.
- The header's mega-menu (hover panel with per-item illustrations) is simplified to a
  plain dropdown list for now; the imagery wiring is deferred to the phase that ports
  `content/images.js`.
