# Exhibition Centre

| | |
|---|---|
| Current URL | `/exhibition-centre-in-pune/` → New: `/venues/exhibition-centre` |
| Also linked as | `/exhibition-center/` 🔴 **404 — linked from the homepage** |
| Current `<title>` | `Exhibition Centre – autoclusterpune` |

**New title:** `Exhibition Centre in Pune — 3,000 sq m Halls for Trade Shows | Auto Cluster`

---

## Hero (verbatim)

**H1:** Exhibition Centre in Pune
**H2:** Exhibition Centre for Different Industries

---

## Our Services (verbatim)

**H2:** Our Services

> At Auto Cluster, we have a wide range of facilities that are available to various industries for displaying their engineering capabilities. Creating Infrastructural support to promote innovation and collective learning. The various facilities development is towards our initiative of creating cost-effective infrastructure support to promote learning and innovations. Our infrastructure is designed to meet the various international standards. Over the last decade, we have successfully hosted more than 100 industrial exhibitions.

**Image:** `/uploads/2020/11/Facility-Exhibition-Centre.png` — alt `Facility Exhibition Centre`

⚠️ This intro block is duplicated near-verbatim on the Auditorium and Training Hall pages.

---

## Exhibition Centre (verbatim)

**H2:** Exhibition Centre

> Auto Cluster Exhibition Centre conceived and design on international lines. The permanent outdoor Exhibition Centre with its 02 Exhibition Halls facilitates display of engineering capabilities and enables exposure to latest technology trends.

> In last ten years, more than 100 Nos. of exhibitions being carried out by different organizers like Machine Tools Association, Auto Components Manufacturers Association, Rubber industries Association, Media Exhibitions, Dental etc.

⚠️ "conceived and design" → "conceived and designed". Broken grammar throughout both paragraphs.

---

## Highlights (verbatim)

**H2:** Highlights of Our Exhibition Centre

| # | Icons | Text |
|---|---|---|
| 1 | `01.png` (linked `#`), `01.1.png` | **Hall A :** 2000 sq. mtr. (approx)<br>**Hall B :** 1000 sq. mtr. (approx) |
| 2 | `02.png` (linked `#`), `02.1.png` | Open Display Area:<br>1000 sq. mtr. (approx) |
| 3 | `03.png` (linked `#`), `03.1.png` | Dedicated Parking Space<br>for Visitors |
| 4 | `04.png` (linked `#`), `04.1.png` | Both the Halls are<br>Air Conditioned |
| 5 | `05.png`, `05.1.png` (linked `#`) | Provides Cafeteria |

All under `/uploads/2020/11/`. **None have alt text.** Each pair is a default + hover-state icon; several wrapped in `href="#"` — empty links, keyboard traps.

**Total advertised area:** Hall A 2,000 + Hall B 1,000 + open 1,000 = 4,000 sq m.

---

## Types of Exhibitions (verbatim) — 12 categories

| # | Category | Image |
|---|---|---|
| 1 | Engineering Expo. | `/uploads/2020/11/01-2.png` |
| 2 | Auto Ancillary Expo. | `/uploads/2020/11/02-2.png` |
| 3 | Automotive Engineering Expo | `/uploads/2020/11/03-3.png` |
| 4 | Water Expo. | `/uploads/2020/11/04-3.png` |
| 5 | Plasto Expo. | `/uploads/2020/11/09.png` |
| 6 | Renewable Energy Expo. | `/uploads/2020/11/10.png` |
| 7 | Rubber Die and Mold Expo. | `/uploads/2020/11/11-1.png` |
| 8 | Consumer Expo. | `/uploads/2020/11/12.png` |
| 9 | Dental Expo. | `/uploads/2020/11/05-6.png` |
| 10 | Education Expo. | `/uploads/2020/11/06.png` |
| 11 | Property Expo. | `/uploads/2020/11/07.png` |
| 12 | Jewelry Expo. | `/uploads/2020/11/08.png` |

🔴 **Critical conversion defect.** The booking form dropdown offers only **4** of these 12: Engineering, Auto Ancillary, Automotive Engineering, Water. Categories 5–12 — Plasto, Renewable Energy, Rubber Die & Mold, Consumer, Dental, Education, Property and Jewelry — **cannot be selected when booking.**

⚠️ Inconsistent trailing full stops (9 of 12 have one). No alt text on any of the 12. "Jewelry" is US spelling on an otherwise British-spelling page.

---

## Call-to-action cards (verbatim)

**Card 1** — image `/uploads/2020/11/Request01.png`, alt `Request`
**H3:** Request for book Exhibition Centre
> Send us Request to book Exhibition / Seminar / Conference Hall.

**Card 2** — image `/uploads/2020/11/Rules-and-Regulation01.png`, alt `Rules and Regulation`
**H3:** Guidelines / Agreement Document
> Read the guidelines and rules before booking the Exhibition / Seminar / Conference Hall.

⚠️ "Request for book" — broken grammar.
🔴 **No visible download link** on the Guidelines card. The document either isn't attached or is behind a JS modal.

---

## Media inventory

| Group | Files | Alt |
|---|---|---|
| Hero | `Facility-Exhibition-Centre.png` | ✅ |
| Highlight icons | `01.png`, `01.1.png`, `02.png`, `02.1.png`, `03.png`, `03.1.png`, `04.png`, `04.1.png`, `05.png`, `05.1.png` | ❌ none |
| Expo icons | `01-2`, `02-2`, `03-3`, `04-3`, `09`, `10`, `11-1`, `12`, `05-6`, `06`, `07`, `08` `.png` | ❌ none |
| CTA | `Request01.png`, `Rules-and-Regulation01.png` | ✅ |

**Absent and required:** photo gallery of past exhibitions, floor plans for Hall A / Hall B / open area, stall layout diagrams, rate card, guidelines PDF. **No video.**

---

## Defects summary

| Severity | Defect |
|---|---|
| 🔴 | 12 expo types advertised, 4 bookable |
| 🔴 | Homepage links to `/exhibition-center/` → 404 |
| 🔴 | Guidelines document has no download link |
| 🔴 | Icons wrapped in `href="#"` |
| 🟠 | No alt text on 22 images |
| 🟠 | "Request for book" grammar |
| 🟠 | Specs locked in images, not text |
| 🟡 | No floor plan, gallery, rate card or capacity table |

---

## New build

| Order | Component | Content |
|---|---|---|
| 1 | `VenueHero` | H1 + H2 + gallery |
| 2 | `RichText` | Intro + description, grammar corrected |
| 3 | `SpecTable` | Halls as **structured text**: Hall A 2,000 · Hall B 1,000 · Open 1,000 sq m |
| 4 | `HighlightGrid` | 5 highlights, real icons, alt text, no dead links |
| 5 | `FloorPlan` | **New** |
| 6 | `ExpoTypeGrid` | All 12, each linking to a filtered booking form |
| 7 | `PastEventsGallery` | **New** |
| 8 | `AvailabilityCalendar` | Server-rendered, all 12 types in the dropdown |
| 9 | `DownloadCard` | Rate card + guidelines PDF |
| 10 | `BookingForm` | Real submission with confirmation |

**Schema:** `EventVenue` + `Service`.
