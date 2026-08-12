# Rapid Prototype Centre

| | |
|---|---|
| Current URL | `/rapid-prototyping/` → New: `/facilities/rapid-prototyping` |
| Current `<title>` | `Rapid Prototype Center – autoclusterpune` |
| Nav label | "Rapid Prototype Center" (US spelling; page H1 uses "Centre") |

**New title:** `3D Printing & Rapid Prototyping in Pune — SLA, SLS, FDM, Vacuum Casting | Auto Cluster`

---

## Hero (verbatim)

**H1:** Rapid Prototype Centre in Pune
**H2:** 3D-Printing Centre in Pune, fulfilling all types of Rapid Prototyping Requirements.

⚠️ Trailing full stop in the H2. Page uses "Centre", nav and title tag use "Center".

---

## About Our Rapid Prototype Centre (verbatim)

**H2:** About Our Rapid Prototype Centre

> Auto Cluster is equipped with an established Rapid Prototyping centre in Pune. ACDRI Possesses the latest technology in 3D printing along with variants of SLA, SLS, FDM, and Vacuum Casting are available. Auto Cluster provides its services to MSMEs who are looking for a cost-effective solution rather than buying costly machines.

⚠️ "ACDRI Possesses" — capital P mid-sentence. Sentence has a broken construction ("along with variants of … are available").

---

## Our Rapid Prototyping Capabilities (verbatim)

**H2:** Our Rapid Prototyping Capabilities

> Our 3D Printing capabilities include all variants of SLA, SLS, FDM, and Vacuum Casting. Recently our Rapid Prototyping team completed the development of prototypes for medical instruments (Oximeter, Temperature, Gun), Face shield, masks, Door opener. The prototype development was done via available 3D printing setup, which further contributed to the R and D operations of medical equipment.

🔴 **"Recently"** refers to COVID-era work (oximeters, face shields, masks, door openers) from 2020. Five years stale. The work itself is a genuinely strong credential — reframe as a dated case study rather than "recently".
⚠️ "(Oximeter, Temperature, Gun)" is garbled — almost certainly "Temperature Gun" as one item.
⚠️ "R and D" → "R&D".

---

## Industries that use Our Rapid Prototyping Facility (verbatim)

**H2:** Industries that use Our Rapid Prototyping Facility

> Engineering and non-engineering industry like:

- Automotive component manufacturers
- Medical equipment manufacturers
- Architectural
- Educational start-ups
- Defense
- E-Vehicles
- Automotive Heavy Engineering

⚠️ "Defense" (US) here; the homepage uses "Defence" and "Défense". Three spellings sitewide.

---

## Rapid Prototype Machines (verbatim)

Each card carries an "Enquire now" link → `#` 🔴

| Card | Heading | Image |
|---|---|---|
| 1 | SLA – 3D Systems 7000 HD | `/uploads/2020/11/SLA.jpg` |
| 2 | SLS – EOS P385 | `/uploads/2020/11/SLS.jpg` |
| 3 | FDM – Stratasys 450 MC | `/uploads/2020/11/FDM.jpg` |
| 4 | Vacuum Casting - KLM | `/uploads/2020/11/Vacuum-Casting.jpg` |

⚠️ Card 4 uses a hyphen where cards 1–3 use an en dash.
⚠️ Full specifications live only in the global modals — see `12-equipment-catalogue.md`.
⚠️ A duplicate SLA block also appears in the global modal layer with an image loaded from `http://localhost/staging/…/Rapid-Prototype-Production.jpg` and `alt="null"`. 🔴

---

## Meet Our Rapid Prototype Team (verbatim)

**H2:** Meet Our Rapid Prototype Team

- Avinash Wadkar
- Raj Shenavi
- Kiran Gojre
- Yogesh Apune
- Milind Chandashive
- Pratik Sabale

⚠️ "Kiran Gojre" here vs "Mrs. Kiran Gojare" on the PPF page.
⚠️ An earlier cached version of this page listed a different roster including "Mr. Pritam Patil", "Mr. Abhilash Dhamanskar" and **"Mr. Mohit Kakade" / "Mr. Mohit kakade" duplicated**. The roster has changed; confirm the current list with ACDRI.
⚠️ No designations. No team photo on this page (PPF, ENV and RPL pages all have one).

---

## Media inventory

| Asset | Alt | Notes |
|---|---|---|
| `/uploads/2020/11/SLA.jpg` | ❌ | |
| `/uploads/2020/11/SLS.jpg` | ❌ | |
| `/uploads/2020/11/FDM.jpg` | ❌ | |
| `/uploads/2020/11/Vacuum-Casting.jpg` | ❌ | |
| `http://localhost/staging/…/Rapid-Prototype-Production.jpg` | `null` | 🔴 broken, in global modal layer |

**No video. No team photo. No printed-part gallery** — a significant omission for a 3D printing service, where sample output photographs are the primary selling tool.

---

## Defects summary

| Severity | Defect |
|---|---|
| 🔴 | `localhost` image in the duplicate SLA modal block |
| 🔴 | "Enquire now" links → `#`, opening the broken CF7 form |
| 🔴 | COVID-era work described as "recently" |
| 🟠 | Centre/Center inconsistency between H1, nav and title |
| 🟠 | "Defense"/"Defence"/"Défense" — three spellings sitewide |
| 🟠 | No alt text on any machine image |
| 🟠 | "(Oximeter, Temperature, Gun)" garbled |
| 🟡 | No material list, tolerances, build volumes in page text |
| 🟡 | No sample-part gallery |
| 🟡 | No lead times or pricing |

---

## New build

| Order | Component | Content |
|---|---|---|
| 1 | `FacilityHero` | H1 + H2 |
| 2 | `RichText` | About + capabilities, COVID work reframed as a dated case study |
| 3 | `TechnologyTabs` | **New** — SLA / SLS / FDM / Vacuum Casting, each with build volume, materials, tolerance, lead time |
| 4 | `IndustryList` | 7 industries, spelling normalised to "Defence" |
| 5 | `EquipmentStrip` | 4 machines → full `/equipment` records |
| 6 | `SamplePartsGallery` | **New** — printed part photography |
| 7 | `CaseStudy` | **New** — the medical prototype work, properly dated |
| 8 | `TeamGrid` | 6 members, designations, team photo |
| 9 | `EnquiryForm` | Inline, with STL/STEP file upload |

**Schema:** `Service`.
