# Auditorium Hall

| | |
|---|---|
| Current URL | `/auditorium-hall-in-pune/` → New: `/venues/auditorium` |
| Also reachable | `/auditorium-hall/` (301s correctly today — keep the redirect) |
| Current `<title>` | `Auditorium Hall – autoclusterpune` |
| Canonical | `https://autoclusterpune.org/auditorium-hall-in-pune/` ✅ correct |

**New title:** `Auditorium on Rent in Pimpri Chinchwad — 172 Seats, AC | Auto Cluster`

---

## Hero (verbatim)

**H1:** Auditorium for all types of Industrial Events.
**H2:** Highlights of Our Auditorium

⚠️ Trailing full stop in the H1.
🔴 **"Highlights of Our Auditorium" appears twice on this page** — once here as the hero sub-head, once again as the highlights section heading.

---

## Our Services (verbatim)

**H2:** Our Services

> At Auto Cluster, we have a wide range of facilities that are available to various industries for displaying their engineering capabilities. Creating Infrastructural support to promote innovation and collective learning. The various facilities development is towards our initiative of creating cost-effective infrastructure support to promote learning and innovations. The Auditorium hall is designed to meet various international standards. Over the last decade, we have successfully hosted many industrial events.

⚠️ Identical to the Exhibition Centre intro except the final two sentences. Boilerplate reuse across all three venue pages.

**Image:** `/uploads/2020/11/Auditorium.png` — alt `Auditorium`

---

## Auditorium Hall (verbatim)

**H2:** Auditorium Hall

> Auto Cluster's Auditorium with an in-built Audi system with 170 people capacity. Institutions, Event managers, Organizations, Corporate companies, and industries are utilizing this facility.

🔴 **States 170.** The highlights block on the same page states **172**. The homepage also says 170. One of these is wrong — ACDRI must confirm.
⚠️ "Audi system" → "audio system".

---

## Highlights of Our Auditorium (verbatim)

**H2:** Highlights of Our Auditorium *(duplicate heading)*

| # | Icons | Text |
|---|---|---|
| 1 | `04.png` (linked `#`), `04.1.png` | Air Conditioned |
| 2 | `02.1-1.png` (linked `#`), `02.2.png` | **Seating Capacity :** 172 |
| 3 | `03.1-1.png`, `03.2.png` (linked `#`) | **Stage :** 35.00 ft * 16.60 ft |
| 4 | `05-5.png` (linked `#`), `05.1-2.png` | Attached VIP Room and Toilet |
| 5 | `04-2.png`, `04.1-1.png` (linked `#`) | Power backup |

All under `/uploads/2020/11/`. **No alt text on any of the 10 icons.** Several wrapped in `href="#"`.

⚠️ Stage dimensions use `*` as a multiplication sign and imperial units while every other spec on the site is metric. Recommend: `10.67 m × 5.06 m (35 ft × 16.6 ft)`.

---

## Call-to-action cards (verbatim)

**Card 1** — image `/uploads/2020/11/Request01.png`, alt `Request`
**H3:** Request for book Auditorium Hall
> Send us Request to book Exhibition / Seminar / Conference Hall.

**Card 2** — image `/uploads/2020/11/Rules-and-Regulation01.png`, alt `Rules and Regulation`
**H3:** Guidelines / Agreement Document
> Read the guidelines and rules before booking the Exhibition / Seminar / Conference Hall.

⚠️ "Request for book" — broken grammar.
⚠️ Sub-copy on the **Auditorium** page reads "book Exhibition / Seminar / Conference Hall" — generic copy never localised to this venue.
🔴 No visible download link on the Guidelines card.

---

## Media inventory

| Group | Files | Alt |
|---|---|---|
| Hero | `Auditorium.png` | ✅ `Auditorium` |
| Highlight icons | `04.png`, `04.1.png`, `02.1-1.png`, `02.2.png`, `03.1-1.png`, `03.2.png`, `05-5.png`, `05.1-2.png`, `04-2.png`, `04.1-1.png` | ❌ none |
| CTA | `Request01.png`, `Rules-and-Regulation01.png` | ✅ |

**Absent and required:** interior photo gallery, stage photo, seating layout plan, rate card, guidelines PDF, AV equipment inventory. **No video.**

⚠️ Note that `04.png` and `04.1.png` are the *same files* used on the Exhibition Centre page for "Air Conditioned" — shared icon set, which is fine, but it means filenames carry no semantic meaning.

---

## Defects summary

| Severity | Defect |
|---|---|
| 🔴 | Capacity contradiction: 170 in body vs 172 in highlights |
| 🔴 | Duplicate H2 "Highlights of Our Auditorium" |
| 🔴 | CTA sub-copy not localised to the auditorium |
| 🔴 | Guidelines document has no download link |
| 🔴 | Icons wrapped in `href="#"` |
| 🟠 | No alt text on 10 icons |
| 🟠 | "Audi system" typo |
| 🟠 | "Request for book" grammar |
| 🟠 | Specs locked in images, imperial units inconsistent with the rest of the site |
| 🟡 | Intro copy duplicated from Exhibition Centre |
| 🟡 | No gallery, seating plan, AV list or rate card |

---

## New build

| Order | Component | Content |
|---|---|---|
| 1 | `VenueHero` | H1 (full stop removed) + gallery |
| 2 | `RichText` | Description, "Audi" → "audio", capacity resolved |
| 3 | `SpecTable` | Capacity · Stage (metric + imperial) · AC · VIP room · Power backup — **as text** |
| 4 | `CapacityConfigs` | **New** — theatre / classroom / conference seating variants |
| 5 | `HighlightGrid` | 5 highlights, alt text, no dead links |
| 6 | `AVEquipmentList` | **New** — projector, sound, lighting, mics |
| 7 | `SeatingPlan` | **New** |
| 8 | `Gallery` | **New** — interior and event photos |
| 9 | `AvailabilityCalendar` | Shared booking module |
| 10 | `DownloadCard` | Rate card + guidelines PDF |
| 11 | `BookingForm` | Venue pre-selected as Auditorium |

**Schema:** `EventVenue` with `maximumAttendeeCapacity`.
