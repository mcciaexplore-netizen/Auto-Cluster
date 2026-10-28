# Prototype Production Facility

| | |
|---|---|
| Current URL | `/prototype-production-facility/` → New: `/facilities/prototype-production-facility` |
| Current `<title>` | `Prototype Production Facility – autoclusterpune` |

**New title:** `VMC Machining & Prototype Production in Pune — 3, 4 & 5 Axis | Auto Cluster`

---

## Hero (verbatim)

**H1:** Prototype Production Facility in Pune
**H2:** Precision and High Quality VMC Machining Centre

---

## About Our Prototype Production Facility (verbatim)

**H2:** About Our Prototype Production Facility

> Auto Cluster is a Prototype Production and Vertical Machining centre facility based in Pune. We are experts in Prototyping, Fixturing, Tooling, and Laser Cutting Activities.

> The automotive industry is constantly innovating and for every new product, there is a need for Prototypes and testing. To achieve this we have a large VMC Machining centre in Pune. We are associated with various institutes and help them in skill development.
> We associate with MSMEs and provide cost-effective machines and Prototyping solutions for our clients.

---

## Capabilities (verbatim)

**H2:** Prototype Production Facility Capabilities

> Our VMC Machining Facility centres include 3 Axis, 4 axis, and 3+2 Axis. All are the world's top-class make machines with precision and high-quality workmanship. We cater to Automotive, heavy engineering, e-vehicle sectors.

⚠️ Inconsistent capitalisation: "3 Axis, 4 axis, and 3+2 Axis".
⚠️ Copy says **3 / 4 / 3+2 Axis** but the machine list below shows **5-Axis, 3-Axis, 3+1 Axis, 5 Axis, W-EDM**. The stated capabilities and the actual equipment do not match. ACDRI must confirm which is correct.

---

## Industries that use Our VMC Machining Facility (verbatim)

Presented as two columns:

**Column 1**
- Dies – Moulds makers
- Fixture manufacturers
- Tooling
- Heavy engineering
- Automotive

**Column 2**
- Educational start-ups,
- Heavy Engineering,
- E-Vehicles

⚠️ "Heavy engineering" / "Heavy Engineering" duplicated across both columns. Trailing commas on two items. Should be one deduplicated list.

---

## Prototype Production Machines (verbatim)

Each card carries an "Enquire now" link → `#` 🔴 (dead, and each opens the broken CF7 modal).

| Card | Heading | Image |
|---|---|---|
| 1 | 5-Axis VMC (Non-Continous) | `/uploads/2020/11/Service_01.1.png` |
| 2 | 3-Axis VMC | `/uploads/2020/11/Service_01.2.png` |
| 3 | 3+1 Axis VMC | `/uploads/2026/02/3-AXIS.jpg` |
| 4 | 5 Axis VMC | `/uploads/2026/02/5-axis.gif` ⚠️ **animated GIF** |
| 5 | W-EDM | `/uploads/2020/11/Service_01.8-1.png` |

🔴 Machine names are marked up as **`<h1>`** — five H1 elements on one page, on top of the page's actual H1.
⚠️ "Non-Continous" → "Non-Continuous".
⚠️ Card 3 is titled "3+1 Axis VMC" but the image file is named `3-AXIS.jpg`.
⚠️ Card 4 uses a `.gif` — should be a poster image or an optimised MP4/WebM loop.
⚠️ No alt text on any of the five images.
⚠️ Full specifications for these machines exist only in the global modals — see `12-equipment-catalogue.md`.

---

## Rates image 🔴 IMPORTANT

**Image:** `/uploads/2025/10/Core-Operation-Rates-1.jpg` — alt `Core Operation Rates`, title `Core Operation Rates`

**This is the only pricing anywhere on the site, and it is trapped inside a JPEG.** Not readable by search engines, not readable by screen readers, not selectable, not printable as text, not responsive on mobile. The underlying rate data must be extracted and rebuilt as an HTML table plus a downloadable PDF.

---

## Special Project Undertaken at Our Prototype Production Centre (verbatim)

**H2:** Special Project Undertaken at Our Prototype Production Centre

- Intricate machining of engine head of automotive vehicles
- Machining of critical and high finish metal dies
- Fixturing as per the requirement of MSME.
- Complicated cutting of sheet metal form parts by laser cutting.

⚠️ Inconsistent trailing full stops (items 3 and 4 only). Heading is singular "Project" but lists four.

---

## Meet Our Prototype Production Team (verbatim)

**H2:** Meet Our Prototype Production Team

**Column 1**
- Amit Desai
- Mrs. Kiran Gojare
- Sagar Shemane
- Pramod dhade
- Parag Patil
- Shivanand Kokulwar
- Suresh Dalavi

**Column 2**
- Sandeep Mohite
- Shambhji Khetmali
- Gajanan Wadkar
- *(two empty list items)*

**Image:** `/uploads/2025/10/PPF-TEAM.jpeg` — **no alt**

⚠️ "Pramod dhade" — lowercase surname.
⚠️ Honorific used for one person only ("Mrs. Kiran Gojare"), none for the other nine.
⚠️ "Kiran Gojare" here vs "Kiran Gojre" on the Rapid Prototyping page — same person, two spellings.
⚠️ Two empty list items rendering as blank bullets.
⚠️ No designations for any team member.

---

## Media inventory

| Asset | Alt | Notes |
|---|---|---|
| `/uploads/2020/11/Service_01.1.png` | ❌ | 5-Axis VMC |
| `/uploads/2020/11/Service_01.2.png` | ❌ | 3-Axis VMC |
| `/uploads/2026/02/3-AXIS.jpg` | ❌ | Labelled 3+1 Axis |
| `/uploads/2026/02/5-axis.gif` | ❌ | Animated GIF |
| `/uploads/2020/11/Service_01.8-1.png` | ❌ | W-EDM |
| `/uploads/2025/10/Core-Operation-Rates-1.jpg` | ✅ | **Rate card as image** |
| `/uploads/2025/10/PPF-TEAM.jpeg` | ❌ | Team photo |

**No video.**

---

## Defects summary

| Severity | Defect |
|---|---|
| 🔴 | Rate card exists only as a JPEG |
| 🔴 | Five `<h1>` elements for machine names |
| 🔴 | All "Enquire now" links → `#`, all open the broken CF7 form |
| 🔴 | Stated capabilities (3/4/3+2 axis) contradict the machine list (5/3/3+1 axis) |
| 🟠 | No alt text on 6 of 7 images |
| 🟠 | Duplicate "Heavy engineering" across both industry columns |
| 🟠 | Two empty list items in the team list |
| 🟠 | "Kiran Gojare"/"Kiran Gojre" inconsistency across pages |
| 🟡 | Animated GIF instead of optimised video |
| 🟡 | No turnaround times, no material list, no tolerance capability |

---

## New build

| Order | Component | Content |
|---|---|---|
| 1 | `FacilityHero` | H1 + H2 |
| 2 | `RichText` | About + capabilities, axis claim reconciled |
| 3 | `IndustryList` | Deduplicated single list |
| 4 | `EquipmentStrip` | 5 machines → link to full `/equipment` records |
| 5 | `RateTable` | **New** — extracted from `Core-Operation-Rates-1.jpg` into HTML + PDF |
| 6 | `CapabilityTable` | **New** — max job sizes, tolerances, materials, turnaround |
| 7 | `ProjectList` | 4 special projects |
| 8 | `TeamGrid` | 10 members with designations, consistent naming, no blanks |
| 9 | `EnquiryForm` | Inline, working, routed to the PPF team |

**Schema:** `Service` with `areaServed: Pune`.
