# Auto Cluster Website — Rebuild Architecture

**Principle:** content stays identical to the current site. Structure, stack, markup and delivery are rebuilt. Every content file in this set reproduces the live copy verbatim so nothing is lost in migration.

---

## 1. Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router), TypeScript | SSG for content pages, SSR for tenders/booking |
| Styling | Tailwind CSS + CSS custom properties | Tokens in `globals.css` |
| CMS | Payload CMS 3.x (self-hosted, runs inside the Next app) | Single deployment, no separate CMS server |
| Database | PostgreSQL (Neon or self-hosted) | Payload adapter: `@payloadcms/db-postgres` |
| Media | Payload uploads + S3/R2, `next/image` | AVIF/WebP with automatic srcset |
| Forms | Next.js Route Handlers → Postgres + Resend/SMTP | Replaces the broken Contact Form 7 |
| Booking | Custom availability module (Postgres-backed) | Replaces WP Booking Calendar |
| Search | Postgres full-text | Equipment catalogue filtering |
| Hosting | Vercel, or Docker on an Indian VPS if data residency is required | Confirm with ACDRI — govt linkage may mandate India-hosted |
| Analytics | GTM (reuse `GTM-WWZZQQJ`) + GA4 | Rebuild the tag config |

**Why Payload:** self-hostable (matters for a government-promoted body), Postgres-native, and the editorial UI is close enough to WordPress that ACDRI's marketing staff can operate it. It also models the equipment catalogue and tender list properly, which WordPress never did.

---

## 2. Directory structure

```
autocluster/
├── src/
│   ├── app/
│   │   ├── (site)/                      # public site, shared layout
│   │   │   ├── layout.tsx               # header + footer shell
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── about/page.tsx
│   │   │   ├── facilities/
│   │   │   │   ├── prototype-production-facility/page.tsx
│   │   │   │   ├── rapid-prototyping/page.tsx
│   │   │   │   ├── environmental-testing/page.tsx
│   │   │   │   ├── rubber-polymer-testing/page.tsx
│   │   │   │   ├── large-bed-cmm-services/page.tsx
│   │   │   │   ├── design-centre/page.tsx
│   │   │   │   ├── skill-development/page.tsx
│   │   │   │   └── incubation-centre/page.tsx
│   │   │   ├── venues/
│   │   │   │   ├── exhibition-centre/page.tsx
│   │   │   │   ├── auditorium/page.tsx
│   │   │   │   ├── training-seminar-hall/page.tsx
│   │   │   │   └── book/page.tsx        # unified booking flow
│   │   │   ├── equipment/
│   │   │   │   ├── page.tsx             # filterable catalogue
│   │   │   │   └── [slug]/page.tsx      # one page per machine
│   │   │   ├── life-at-auto-cluster/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [category]/page.tsx  # achievements, training, etc.
│   │   │   ├── knowledge-centre/
│   │   │   ├── tenders/
│   │   │   │   ├── page.tsx             # PUBLIC list — no login
│   │   │   │   └── [ref]/page.tsx
│   │   │   ├── careers/
│   │   │   ├── contact/page.tsx
│   │   │   └── legal/[slug]/page.tsx    # privacy, terms, accessibility
│   │   ├── (auth)/tenders/portal/       # vendor login — submission only
│   │   ├── api/
│   │   │   ├── enquiry/route.ts
│   │   │   ├── quote/route.ts
│   │   │   ├── booking/route.ts
│   │   │   └── availability/route.ts
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layout/     Header, MegaNav, MobileNav, Footer, TopBar, Breadcrumbs
│   │   ├── blocks/     Hero, AudienceRouter, ServiceGrid, StatBand, TestimonialSet,
│   │   │               PartnerLogos, CTABand, TestAccordion, TeamGrid, SpecTable,
│   │   │               HighlightGrid, ExpoTypeGrid, MachineCard, DownloadCard
│   │   ├── forms/      EnquiryForm, QuoteForm, BookingForm, FieldGroup, FormStatus
│   │   ├── equipment/  EquipmentFilters, EquipmentCard, EquipmentSpecs
│   │   └── ui/         Button, Card, Accordion, Modal, Tabs, Badge, Table
│   ├── payload/
│   │   ├── collections/  Pages, Equipment, Venues, Tenders, Events, Team,
│   │   │                 Testimonials, Enquiries, Bookings, Media, Downloads, Jobs
│   │   ├── globals/      SiteSettings, Navigation, Footer, Contact
│   │   └── blocks/       reusable layout blocks
│   └── lib/            db, email, seo, validation (zod), analytics
├── public/
└── redirects.js        # legacy URL → new URL map
```

---

## 3. Content model

### Collection: `equipment` — replaces the 30 modals and 6 orphan pages

```ts
{
  slug, name, category,            // 'prototype' | 'rapid-prototyping' |
                                   // 'environmental' | 'rubber-polymer' | 'metrology'
  make, model, machineType,
  specs: [{ label, value }],       // repeatable — handles varying spec shapes
  applications: [string],
  standards: [string],             // ASTM / ISO — powers filtering + SEO
  maxJobSize: { x, y, z, unit },
  image, gallery,
  suitableFor: richText,
  isAccredited: boolean,           // NABL scope flag
  enquiryEnabled: boolean
}
```

Every machine gets a real indexable URL. This is the single biggest SEO gain available — roughly 30 pages of genuine technical content currently locked inside invisible modal markup.

### Collection: `venues`

```ts
{
  slug, name, tagline, intro: richText,
  highlights: [{ icon, label, value }],   // currently images — becomes text
  capacityConfigs: [{ layout, capacity }],
  areaSqm, stageDimensions, gallery, floorPlan,
  expoTypes: [relationship → expoTypes],  // fixes the 12-vs-4 mismatch
  rateCard: upload, guidelinesDoc: upload,
  bookable: boolean
}
```

### Collection: `tenders`

```ts
{ refNo, title, description, publishedDate, closingDate,
  emdAmount, documents: [upload], status, contactPerson }
```

**Public list. No login to view.** Login only to submit.

### Collections: `enquiries` / `bookings`

```ts
{ type, name, company, email, phone, service?, machine?, venue?,
  message, source, gclid?, status, createdAt }
```

Everything is stored, not just emailed. Gives ACDRI an enquiry history they have never had.

### Globals

`siteSettings` (phone, emails, address, social), `navigation` (menu tree — every item requires a resolvable target; no `href="#"` permitted by the schema), `footer`, `contact`.

---

## 4. Routing & redirects

Every legacy URL must 301. Full map in `01-CONTENT-INVENTORY.md`. Key ones:

```js
'/about-us'                          → '/about'
'/prototype-production-facility'     → '/facilities/prototype-production-facility'
'/rapid-prototyping'                 → '/facilities/rapid-prototyping'
'/environmental-testing'             → '/facilities/environmental-testing'
'/environment-lab-env'               → '/facilities/environmental-testing'      // dedupe
'/rubber-polymer-mechanical-testing' → '/facilities/rubber-polymer-testing'
'/rubber-polymer-rpl'                → '/facilities/rubber-polymer-testing'     // dedupe
'/large-bed-cmm-services'            → '/facilities/large-bed-cmm-services'
'/exhibition-centre-in-pune'         → '/venues/exhibition-centre'
'/exhibition-center'                 → '/venues/exhibition-centre'              // currently 404
'/auditorium-hall-in-pune'           → '/venues/auditorium'
'/auditorium-hall'                   → '/venues/auditorium'
'/training-seminar-hall-in-pune'     → '/venues/training-seminar-hall'
'/our-machines'                      → '/equipment'
'/environment-testing-machines'      → '/equipment?category=environmental'
'/metrology-cmm-machines'            → '/equipment?category=metrology'
'/prototype-production-facility-machines' → '/equipment?category=prototype'
'/rapid-prototyping-machines'        → '/equipment?category=rapid-prototyping'
'/rpl-testing-machines'              → '/equipment?category=rubber-polymer'
'/announcement/:slug'                → '/life-at-auto-cluster/:slug'
'/privacy-policy'                    → '/legal/privacy-policy'
'/privacy-policy-2'                  → '/legal/privacy-policy'                  // dedupe
'/contact-us'                        → '/contact'
```

---

## 5. Design tokens

```css
:root {
  /* Confirm against ACDRI brand guideline before build.
     Derived from the existing white-on-dark logo lockup. */
  --brand-navy-900:#0A1A2F; --brand-navy-700:#12304F; --brand-navy-500:#1E4E7A;
  --accent-500:#E0731A;  --accent-600:#C25F10;      /* CTAs only */
  --steel-50:#F7F8FA;  --steel-100:#EDEFF3;  --steel-200:#DCE0E7;
  --steel-400:#98A1B0;  --steel-600:#5A6472;  --steel-800:#2B323C;
  --success:#1E7A4B; --warning:#B8860B; --error:#B3261E; --info:#1E5F9E;

  --space-1:4px;  --space-2:8px;  --space-3:12px; --space-4:16px;
  --space-5:20px; --space-6:24px; --space-8:32px; --space-10:40px;
  --space-12:48px; --space-16:64px; --space-20:80px; --space-24:96px;

  --radius-sm:4px; --radius-md:8px; --radius-lg:12px;
  --shadow-1:0 1px 2px rgba(11,26,47,.06);
  --shadow-2:0 4px 12px rgba(11,26,47,.08);
  --shadow-3:0 12px 32px rgba(11,26,47,.12);

  --font-display:'Chivo', sans-serif;      /* technical, squared */
  --font-body:'Source Sans 3', sans-serif; /* high legibility, Devanagari-capable */
}
```

Devanagari coverage matters — Marathi/Hindi versions are a live question for a PCMC-linked body.

**Type scale:** display 44/48px · h1 36/40 · h2 28/32 · h3 22/26 · body 17/27 · small 15/22. Body never below 16px. Measure capped at 68ch.

**Rules:** two font families maximum. One accent colour, used only for primary actions. Neutrals carry ~80% of the palette. All colour pairs meet WCAG AA (4.5:1 body, 3:1 large).

---

## 6. Component states

Every interactive component ships: default, hover, focus-visible, active, disabled, loading, empty, error. The current site designs only the happy path — the booking calendar's "Calendar is loading…" is the entire loading state.

---

## 7. Performance budget

| Metric | Target |
|---|---|
| LCP | < 2.0s (4G mobile) |
| CLS | < 0.05 |
| INP | < 200ms |
| HTML transferred | < 60 KB |
| JS (first load) | < 130 KB gzipped |
| PageSpeed mobile | ≥ 90 |

**Rules that follow from the current failures:**
- Modals render on the page that owns them. Never a global modal library.
- Machine data is fetched per-route, not embedded site-wide.
- YouTube and Google Maps load as static facades; the real embed loads on click.
- All images through `next/image`, AVIF/WebP, explicit dimensions.
- Statistics are server-rendered numbers, never JS-only counters.

---

## 8. Accessibility (GIGW 3.0 / WCAG 2.1 AA)

- Semantic landmarks: `header`, `nav`, `main`, `aside`, `footer`
- Skip link retained (the current site has one — keep it)
- No `href="#"` anywhere; schema-enforced
- Visible `:focus-visible` on every interactive element
- Touch targets ≥ 44×44px
- Specifications as real text, never baked into images
- One `h1` per page, strict h1→h2→h3 order (current pages use `h1` for machine names repeatedly)
- Meaningful `alt` on all content images, `alt=""` on decorative
- `prefers-reduced-motion` respected
- Accessibility statement page
- Marathi/Hindi via `next-intl` if confirmed in scope

---

## 9. Structured data

`Organization` + `LocalBusiness` (sitewide) · `Service` (each facility page) · `Product` (each equipment page) · `EventVenue` (each venue) · `Event` (exhibitions) · `JobPosting` (careers) · `BreadcrumbList` · `FAQPage`.

---

## 10. Forms architecture

```
Client (zod validated)
  → POST /api/enquiry
     → zod re-validation server-side
     → honeypot + rate limit + Turnstile
     → INSERT into enquiries
     → email to routed department
     → auto-acknowledgement to sender
     → GTM dataLayer event
  → success / error state rendered inline (never a redirect)
```

Department routing: testing → lab team · prototyping → PPF team · venue → marketing · careers → HR · tenders → procurement.

**This replaces:** the broken CF7 shortcode, the `forms.gle` Google Form, the 30 non-functional "Our Machines Form" instances, and the dead "Request a Quote" modal.

---

## 11. Build phases

| Phase | Work |
|---|---|
| 0 | Emergency fixes on the live site (see audit §12.7) |
| 1 | Repo, tokens, Payload schema, header/footer shell |
| 2 | Home, About, Contact |
| 3 | Five facility pages + equipment catalogue |
| 4 | Venue pages + booking module |
| 5 | Tenders (public list + vendor portal), Careers, Knowledge Centre |
| 6 | Life at Auto Cluster, legal pages |
| 7 | Redirects, sitemap, schema, GTM, QA, WCAG audit, launch |

---

## 12. Content file index

| File | Covers |
|---|---|
| `01-CONTENT-INVENTORY.md` | Every URL, status, redirect target, capture state |
| `02-global-shell.md` | Header, nav, footer, sitewide modals |
| `03-homepage.md` | Home |
| `04-about-us.md` | About Us |
| `05-exhibition-centre.md` | Exhibition Centre |
| `06-auditorium-hall.md` | Auditorium Hall |
| `07-prototype-production-facility.md` | Prototype Production Facility |
| `08-rapid-prototyping.md` | Rapid Prototype Centre |
| `09-environmental-testing.md` | Environmental Testing |
| `10-rubber-polymer-testing.md` | Rubber & Polymer Testing Lab |
| `11-contact-us.md` | Contact Us |
| `12-equipment-catalogue.md` | All 30 machines with full specs |
| `13-tenders.md` | Tender application |

Each content file carries: current URL · current meta · **verbatim current copy** · media inventory with real file paths · defects found on that page · new-build component mapping.
