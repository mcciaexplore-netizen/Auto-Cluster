# Auto Cluster (ACDRI) — website rebuild

Rebuild of [autoclusterpune.org](https://autoclusterpune.org) for the Auto Cluster
Development and Research Institute, Chinchwad, Pune.

- **Design direction:** [DESIGN_DIRECTION.md](./DESIGN_DIRECTION.md)
- **Open questions for the client:** [CONTENT_QUESTIONS.md](./CONTENT_QUESTIONS.md)
- **Site audit (14 files):** [docs/audit/](./docs/audit/)
- **Content recovered from images:** [docs/extracted/](./docs/extracted/)

---

## Running it

```bash
npm install
cp .env.example .env.local     # nothing is required for the site to run
npm run dev                    # http://localhost:3000
```

```bash
npm run build      # production build
npm start          # serve the build
npm run typecheck  # tsc --noEmit
```

No database or mail provider is needed for local development. The enquiry API logs
messages to the console when `RESEND_API_KEY` is unset.

---

## Structure

```
src/
├── app/
│   ├── (site)/            public site — shared header/footer shell
│   │   ├── page.tsx                     Home
│   │   ├── about/                       Overview, certifications, vision, MD video, board
│   │   ├── facilities/[slug]/           9 facility pages
│   │   ├── equipment/[slug]/            30 machine records
│   │   ├── venues/[slug]/               3 venues + /book + /rate-card
│   │   ├── life-at-auto-cluster/        + [category]
│   │   ├── tenders/                     public list + [ref] + /portal
│   │   └── legal/[slug]/                privacy, terms, accessibility
│   ├── api/enquiry/route.ts             validated, rate-limited, department-routed
│   ├── globals.css                      ALL design tokens live here
│   ├── sitemap.ts  robots.ts  not-found.tsx
│   └── layout.tsx                       fonts + sitewide metadata
├── components/
│   ├── layout/    Header (mega nav + mobile drawer), Footer
│   ├── ui/        Button, Card, Section, SpecTable
│   ├── forms/     EnquiryForm
│   └── blocks/    PendingPage, BuildNote
├── content/       typed content modules — the CMS seam
├── payload/       Payload CMS schema (see "Connecting Payload")
├── lib/           types, validation, email, flags
└── middleware.ts  legacy URL redirects
redirects.mjs      legacy URL map — single source of truth
```

### The content seam

Pages read from typed modules in `src/content/`, which mirror the Payload collections
exactly. Swapping a static import for a Payload query is a one-line change per page —
no component touches raw data shapes.

| Module | Contents |
|---|---|
| `equipment.ts` | 30 machines, full specs, corrections and provenance |
| `facilities.ts` | 9 facilities, 26 test methods with standards |
| `venues.ts` | 3 venues, all 12 expo categories |
| `rates.ts` | 20 priced operations, transcribed from the rate-card JPEG |
| `site.ts` | Navigation, contact, promoters, verified statistics |
| `life.ts` | Life-at-Auto-Cluster categories, legal pages |

---

## Design tokens

Everything visual is a CSS custom property in [`src/app/globals.css`](./src/app/globals.css).
No component hard-codes a colour, so a change of direction is a change to one file.

The palette is sampled from the ACDRI logo artwork — indigo `#393185`, cyan `#00A0E3`,
green `#009846` — and every pair is contrast-measured. See DESIGN_DIRECTION.md §3 for the
measured ratios and the three rules that follow from them.

---

## Build notes in the UI

Pages awaiting content render an amber note explaining what is blocked and on which
`CONTENT_QUESTIONS.md` item. These are **internal** and never appear in production.

```bash
NEXT_PUBLIC_SHOW_BUILD_NOTES=true    # force on  (staging review)
NEXT_PUBLIC_SHOW_BUILD_NOTES=false   # force off (development)
```

Default: on outside production, off in production. See `src/lib/flags.ts`.

---

## Redirects

Every legacy URL resolves in a **single 301**. WordPress emitted trailing slashes
everywhere, so `/about-us/` must reach `/about` in one hop, not two.

Next's own `redirects()` runs *after* trailing-slash normalisation, which would make every
inbound legacy backlink a two-hop chain. So `skipTrailingSlashRedirect` is on and
`src/middleware.ts` handles both: legacy URLs get one 301, everything else gets its slash
normalised with a 308.

The map lives in [`redirects.mjs`](./redirects.mjs) and is consumed by both the middleware
and `next.config.mjs` (as defence in depth). Add legacy URLs there and nowhere else.

---

## Connecting Payload

The schema is complete and type-checked in `src/payload/` — 13 collections and 3 globals,
per `docs/audit/00-ARCHITECTURE.md` §3. **It is not yet wired into the app**, because that
needs a running PostgreSQL instance.

To connect it:

```bash
npm i @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical sharp
```

1. Uncomment the `db:` adapter in `src/payload/payload.config.ts`.
2. Set `DATABASE_URI` and `PAYLOAD_SECRET` in `.env.local`.
3. Wrap the export in `next.config.mjs` with `withPayload()`.
4. Add the `src/app/(payload)/` admin route group.
5. Migrate `src/content/*` into the collections, then switch page imports to Payload queries.

Two schema-level guarantees worth keeping:

- **`navigation` rejects `href="#"`.** Dead nav links are a validation error, not a QA
  finding — the current site has seven.
- **`media.alt` rejects filenames**, `null`, and bare words like "image". The current site
  has roughly 24 of 30 machine images with no alt text at all.

---

## What is verified

| Check | Status |
|---|---|
| `npm run build` | Passes — 70 static pages |
| `npm run typecheck` | Clean |
| First-load JS | 102 kB shared, 122 kB peak (budget: 130 kB) |
| One `h1` per page | Verified across 24 routes |
| Heading level skips | None |
| `href="#"` or `href=""` | None — prevented by the `Href` type |
| Images without `alt` | None |
| `localhost` / staging URLs | None |
| Legacy redirects | 301, single hop, verified |
| Trailing-slash normalisation | 308, single hop, verified |

## What is not built yet

Phases 5–8 of the brief. Named honestly rather than stubbed silently:

- Availability calendar for venue bookings (the enquiry path works; live availability does not)
- Tender list, detail and vendor portal — blocked on access to the existing PHP application
- Nine pages awaiting a verbatim capture (`CQ-67`)
- NABL scope, floor plans, guidelines PDFs — blocked on documents from ACDRI
- Structured data beyond `Organization`, `LocalBusiness`, `Service`, `Product`, `EventVenue`
- GTM container, image migration off WordPress, full WCAG audit
