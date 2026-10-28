# Content Questions — for ACDRI

Everything on this list needs a decision or a fact from the client. Nothing here is guessed
silently: where a build could not wait, an interim value is in place and is marked `[VERIFY]`
in the page content so it is visible to anyone reviewing the site before launch.

**Legend** — `BLOCKER` cannot ship without an answer · `INTERIM` placeholder in place, marked
`[VERIFY]` on the page · `ASSET` a file or photograph is needed · `SCOPE` a decision about
what we build.

Maintained throughout the build. Last updated at end of Phase 1 (design direction).

---

## A. Contradictions in the current content

### CQ-01 · Auditorium capacity: 170 or 172? `INTERIM`
Three statements on the live site, two values:

| Location | Value |
|---|---|
| Homepage service card | 170 |
| Auditorium page, body copy | 170 |
| Auditorium page, highlights block | **172** |

**Interim:** using **172 `[VERIFY]`** — the highlights block is the specification block, and
capacity is the kind of number that gets rounded down in prose. Two of three occurrences say
170, so this could easily go the other way.
**Also needed:** seating configurations (theatre / classroom / conference), since the new
venue page has a capacity table.

### CQ-02 · Prototype Production: which axis configurations are real? `BLOCKER`
The page's capabilities sentence and its own machine list disagree:

| Source | States |
|---|---|
| Capabilities copy | 3 Axis, 4 axis, 3+2 Axis |
| Machine cards on the same page | 5-Axis, 3-Axis, 3+1 Axis, 5 Axis, W-EDM |
| Equipment modals | 5-Axis (Rambaudi), 3-Axis (Hartford), 3+1 Axis (TAI), 5+1 Axis laser (TRUMPF) |
| **Core operation rate card** | **5 Axis Machining · 3 + 1 Axis** |

**Assessment:** the rate card independently corroborates the machine list, so the
*capabilities sentence* is very probably the error — there appears to be no 4-axis or 3+2-axis
machine. Confirm before we rewrite that paragraph, because it is a capability claim.

### CQ-03 · Is there one Universal Testing Machine or two? `BLOCKER`
The RPL page shows two cards both named "Universal Testing Machine": one with full
specifications (Tinius Olsen), one with none and an image named `Picture2.jpg` — a default
filename from an Office paste. Either a second UTM that needs a distinct name and its own
specs, or a duplicate card to delete. This changes the equipment count.

### CQ-04 · Is there one CMM or two? `BLOCKER`
The homepage claims *"we have 02 big Co-ordinate Measuring Machines (CMM)"*. The equipment
library catalogues one (Accurate / Cordimesur). If a second exists, we need its full record;
if not, the homepage claim must be corrected.

### CQ-05 · The machine labelled "Deep Hole Drilling" that does die sinking `BLOCKER`
Two machines share the title "Deep Hole Drilling". The second (`Service_01.7-1.png`) lists
`Machine Type: Z NC` and `Machine Application: Die Sinking` — almost certainly a **die-sinking
EDM**, not a drill. It needs its correct name, make and model before it can have a URL.

### CQ-06 · Equipment count reconciliation — 30, 31 or 32? `SCOPE`
The catalogue file totals "30 machines" in its section headers but lists 32 individual
records. The gap reconciles as follows, and we need confirmation:

- The **Xenon Test Chamber** is listed under both Environmental and RPL — one machine, two
  services. We will publish it once and relate it to both. (−1)
- The **second UTM** is assumed a duplicate pending CQ-03. (−1)
- The **HDT & VICAT Softening Temperature Tester** exists in the modal library but appears on
  no page at all — it is a real machine that is currently invisible. It should be published.
- Two PPF machines (**3+1 Axis VMC**, **5 Axis VMC**) appear on the page with images but have
  no specification record anywhere.

### CQ-07 · Which email address is for what? `BLOCKER`
Three addresses appear across the site with no stated purpose: `marketing@`, `marketing2@`,
`info@` (header shows the first two, footer shows the first and third). The new site routes
enquiries by department — testing, prototyping, venue hire, careers, tenders, general. We need
a destination address and, ideally, a named owner for each.

### CQ-08 · Board of directors — photo/name pairing `BLOCKER`
In the current markup the A.K. Jindal photograph renders *above* the Gadgil name block, with
both name blocks following. At least one photograph is paired with the wrong name. **We will
not publish the board grid until ACDRI verifies all ten pairings against their own records.**

Also: is it **Shrikrishna** (caption) or **Shreekrishna** (filename) Gadgil?

### CQ-09 · Rapid Prototyping team roster `INTERIM`
The current page lists six people. An earlier cached version listed a different roster
including Pritam Patil and Abhilash Dhamanskar. Using the current six `[VERIFY]`.

### CQ-10 · Name spellings across pages `INTERIM`
Same person, two spellings, on different pages. Interim choice in bold:

| Page A | Page B | Using |
|---|---|---|
| Kiran **Gojare** (PPF) | Kiran **Gojre** (Rapid Prototyping) | **Gojare** `[VERIFY]` |
| Prathamesh **Phansekar** (Env.) | Prathamesh **phansekar** (RPL) | **Phansekar** |
| Geetali **Dehspande** (RPL) | — | **Deshpande** `[VERIFY]` — likely typo |
| Pramod **dhade** (PPF) | — | **Dhade** |

Two blank bullets also render in the PPF team list — either two missing names or two stray
list items.

### CQ-11 · Team designations `BLOCKER for the team grids`
No team member anywhere on the site has a job title. "Amit Desai" appears on the PPF,
Environmental **and** RPL rosters — presumably a shared manager, but nothing says so. Designations
are needed for all ~30 named staff, or the team grids become name lists with no informational value.

---

## B. Technical corrections applied — confirm before launch

These are being corrected because they are unambiguous errors. They are listed so ACDRI can
overrule any of them.

| # | Published | Publishing as | Note |
|---|---|---|---|
| CQ-12 | `1100 M` crosshead travel (UTM) | `1100 mm` | 1.1 km of travel is not possible |
| CQ-13 | `6000C`, `4500C`, `3000C`, `1000C` | `600 °C`, `450 °C`, `300 °C`, `100 °C` | Degree symbol stripped on 4 records |
| CQ-14 | `Shimatzu` ×2 | **Shimadzu** | TGA and DSC |
| CQ-15 | `Itly` ×3 | **Italy** | Impact tester, HDT/VICAT, hardness tester |
| CQ-16 | `Insert Gas` | **Inert Gas** | DSC atmosphere |
| CQ-17 | `Whethr-O-meter` | **Weather-Ometer** | Corroborated by the rate card's "QUV Weather-O-Meter" |
| CQ-18 | `Intron Actuator` ×2 | **Instron** | Machine card spells it correctly |
| CQ-19 | `birthing action` ×4 | **breathing action** | Standard term in temperature-humidity cycling |
| CQ-20 | `electronica` ×3 | **electronic** | |
| CQ-21 | `the atom shall examine` ×3 | **the item shall be examined** | "atom" is a corruption |
| CQ-22 | `the zone effect` | **the ozone effect** | |
| CQ-23 | `Audi system` | **audio system** | |
| CQ-24 | `strength o the material` | **strength of the material** | |
| CQ-25 | `Non-Continous` | **Non-Continuous** | |
| CQ-26 | `Turining` | **Turning** | |
| CQ-27 | `¢20`, `@ 250` | `⌀20`, `⌀250` | Diameter symbol lost to encoding |
| CQ-28 | `3 M * 2 M * 0.8 M` etc. | `3000 × 2000 × 800 mm` | Unit convention normalised to mm throughout |
| CQ-29 | `FTIR Spectroscope` | **FTIR Spectrometer** | FTIR instruments are spectrometers |
| CQ-30 | `Ceast, Spa` | **CEAST S.p.A.** | |
| CQ-31 | `Q Lab` | **Q-Lab** | |
| CQ-32 | `ThermoElectron` | **Thermo Electron** (now Thermo Fisher Scientific) | |
| CQ-33 | `/li>` printing as visible text | removed | Leaked HTML in the "Deep Hole Drilling" record |
| CQ-34 | `Défense` / `Defense` / `Defence` | **Defence** | Three spellings sitewide |
| CQ-35 | `Center` / `Centre` | **Centre** | British spelling throughout, incl. "Jewellery" |
| CQ-36 | `MSEME's` | **MSMEs** | |
| CQ-37 | `ACDRIL` | **ACDRI** | |
| CQ-38 | `Tire 1 & 2` (rate card) | **Tier 1 & 2** | |
| CQ-39 | `Vision/Mision` (nav) | **Vision & Mission** | |
| CQ-40 | Duplicated clause "supported by Government of Maharashtra and Pimpri Chinchwad Municipal Corporation" (appears twice in one sentence, on Home **and** About) | stated once | |

### Corrections we are *not* confident enough to make alone

| # | Issue | Interim | `VERIFY` |
|---|---|---|---|
| CQ-41 | UTM standard published as `ASTM D 683` — not a current standard | **ASTM D638** (tensile properties of plastics) | Yes |
| CQ-42 | Hardness tester cites `ISO 43-1987` — withdrawn | **ISO 48** | Yes |
| CQ-43 | UTM capacity `100 N to 23 Tons` | `0.1 – 225 kN`, assuming metric tonnes | Yes |
| CQ-44 | Vacuum casting material listed as **"Renishaw (Flexible Rubber)"** — Renishaw is a metrology company, not a casting-resin supplier | Likely **Renshape** or similar urethane/tooling board. **Not published until confirmed** — a wrong supplier name is a credibility problem | Yes |
| CQ-45 | Vacuum casting "Materials" list contains Aerospace, Research and Medical — those are industries, not materials | Split into materials vs applications | Yes |
| CQ-46 | Accelerated weathering tester "Chamber Size: 75 × 150 × 6 mm" — that is a specimen size; a 24-sample QUV cannot be 6 mm deep | Relabelled **specimen size**; actual chamber size requested | Yes |
| CQ-47 | TGA resolution and measuring range given in "µ" — µg or µm? TGA measures mass, so probably µg | `µg` | Yes |
| CQ-48 | Ozone chamber make reads "In USA Inc, India" | — | Yes |
| CQ-49 | Ozone chamber "Gas Phase: 0 to 9999" has no unit | — | Yes |

---

## C. Missing data and assets

### CQ-50 · Specifications for 8 machines `BLOCKER`
These have a name and a photograph and nothing else:

**All six environmental chambers** — Xenon, Salt Spray, Dust Spray, Water Spray, Thermal
Shock, High-Low — plus the **Instron Actuator** and the **second UTM** (CQ-03).

For each chamber we need: make, model, internal chamber dimensions, temperature range,
humidity range, ramp rates, plus salt concentration (salt spray), spray pressure and angle
(water), dust concentration (dust), frequency and amplitude range (vibration), and the
applicable standards.

This is the most damaging gap in the catalogue. ACDRI markets environmental testing to
"Aeronautical, Space applications, and in Automotive" — these are precisely the numbers an
engineer needs to decide whether their part fits in the chamber.

### CQ-51 · Chambers named in copy but absent from the catalogue `BLOCKER`
The Environmental Testing page copy refers to a **Rain Test Chamber**, a **Mini Salt Spray**, a
**Big Salt Spray** and a **temperature-coupled vibration chamber**. None appears as a
catalogue record. The rate card independently lists a **Mini Salt Spray Chamber** and a **Hot
Air Oven** — so at least two of these are real, billable machines that the site never shows.

### CQ-52 · Two 3D printers that appear only on the rate card `BLOCKER`
The rate card prices **"Figure 4 – Standalone Pro black"** and **"Origin 1 SLA"** per cc. Neither
appears on the Rapid Prototyping page, which lists only four machines. Are these current
machines needing full records? Likewise, are **"SLA Imported"** and **"SLA Local"** material
grades on the existing SLA machine, or separate machines?

### CQ-53 · Test standards for 20 of 30 machines `BLOCKER for the standards index`
Ten records cite standards; twenty do not. The standards index is planned as a high-value SEO
page and cannot be built from a third of the data.

Environmental testing in particular cites **no standards anywhere** — no ASTM B117 for salt
spray, no IEC 60529 / IP ratings for water and dust ingress. For a NABL-accredited lab this is
the single most conspicuous omission on the site.

### CQ-54 · NABL scope of accreditation document `ASSET · BLOCKER for /facilities/nabl-scope`
The most-requested document for any testing lab, and it is nowhere on the current site. We need
the current scope PDF (and its certificate number and validity dates) to build the page.

### CQ-55 · Venue documents `ASSET`
Both the Exhibition Centre and Auditorium pages show a "Guidelines / Agreement Document" card
with **no download link on either**. We need:
- The guidelines and rules PDF (the booking form asks users to confirm they have read it)
- Venue rate cards
- Floor plans — Hall A, Hall B, open display area
- Seating plan and AV equipment inventory for the auditorium
- Photo galleries: past exhibitions, auditorium interior and stage

### CQ-56 · Correct photographs `ASSET`
| Machine | Problem |
|---|---|
| Dust Spray Chamber | Illustrated with `Vibration-Shaker-with-chamber.jpg` |
| Impact Tester | Modal reuses `Ozone-Chamber.jpg` |
| Second UTM | `Picture2.jpg` — default Office filename |
| 3+1 Axis VMC | File named `3-AXIS.jpg` — is the label or the image wrong? |
| 5 Axis VMC | An animated GIF; needs a still or a proper video |
| Rapid Prototyping | No sample-part photography at all — the primary selling tool for 3D printing |

Most remaining photography dates from 2020. Anything not replaced ships with a visible
`[NEEDS PHOTOGRAPHY]` placeholder rather than being upscaled.

### CQ-57 · The five homepage statistics `BLOCKER`
All five currently render as `1 +` — the real figures exist only as JavaScript animation
targets and are invisible to crawlers. We need actual numbers for: clients (OEM / Tier 1 /
MSME), projects, years of experience, machines, expert employees.

**Until supplied, these tiles are not rendered at all.** We will publish the three figures that
do have sources — 900+ RPL customers, 200+ environmental testing customers, 100+ exhibitions
over ten years.

### CQ-58 · Are the rates still current? `BLOCKER for /venues/rate-card`
The rate card is marked *"Effective from 1st Nov 2025"* — now nine months old. Confirm it is
current, or supply the revision. Full transcription is in `docs/extracted/rate-card.md`.

Also: the rate card covers Environmental, RPL, Rapid Prototype and PPF. There is **no published
rate for venue hire** anywhere — Exhibition Centre, Auditorium or Training Hall.

### CQ-59 · Business details for procurement `ASSET`
GST number, registration/CIN details, and reception/office hours including sample drop-off
times. Procurement teams ask for these routinely and none appears on the site.

---

## D. Scope and platform decisions

### CQ-60 · Data residency — Vercel or India-hosted? `SCOPE · affects Phase 1`
Default plan is Vercel. ACDRI is promoted by the Ministry of Commerce and Industry and
supported by PCMC and the Government of Maharashtra. **If India data residency is a hard
requirement, we need to know now** — it changes hosting to self-hosted Docker on an Indian VPS
and affects the database and media-storage choices. Related: the DPDP Act position on enquiry
data, which currently lands in a Google Sheet (CQ-63).

### CQ-61 · Marathi / Hindi edition — in scope? `SCOPE`
Affects the build from Phase 1 onward (routing, CMS field structure, `next-intl`). The type
system already carries Devanagari so no rework is needed there, but retrofitting i18n routing
later is expensive.

### CQ-62 · Tenders — can notices be public? `SCOPE · BLOCKER for Phase 6`
Today `/tenders/` is a separate PHP application where **no tender is visible without
registering an account**. For a government-promoted body this inverts the normal expectation:
registration should be required to *submit* a bid, not to *read* a notice.

Needed from the procurement team:
- Confirmation that tender notices can be published publicly (our strong recommendation)
- Source code and database access for the existing PHP application
- Who maintains it — it may be a different vendor from the WordPress site
- Existing vendor registrations, for migration with a password-reset flow
- Historical tenders, to republish as a public archive

### CQ-63 · Export the Google Form responses before decommissioning `BLOCKER · time-sensitive`
The Contact page's only enquiry mechanism is an external Google Form
(`forms.gle/xYZnEyN2NqiF3ySD6`), used as a workaround since the Contact Form 7 plugin broke.
**That response sheet is currently ACDRI's only digital enquiry record.** It must be exported
before the form is switched off, and imported into the new `enquiries` table as historical data.

### CQ-64 · Dead nav items — build or remove? `SCOPE`
| Menu label | Today | Proposed |
|---|---|---|
| Facilities | `#` | Real hub page `/facilities` |
| Services | `#` | Becomes `/venues` |
| Design Centre | `#` | Link the existing page — it already exists, just unlinked |
| Knowledge Centre | `#` | Link the existing page |
| Careers | `#` | Link the existing page |
| **Infrastructure Support** | `#` | **Does a page exist? Build or remove — need a decision** |
| **Timeline** | `#` | **Build as an About section, or remove?** Needs founding date and milestones if built |

### CQ-65 · Which privacy policy is authoritative? `BLOCKER for /legal/privacy-policy`
Two exist — `/privacy-policy/` and `/privacy-policy-2/` — and the footer links to the second.
Both redirect to one URL on the new site; we need to know which text is current. A terms-of-use
page does not exist at all and needs to be supplied or drafted.

### CQ-66 · Testimonials `SCOPE`
The three on the homepage are 2018 consumer-style venue reviews ("Visited here for expodent
2018… Good air conditioned halls"). None relates to testing, prototyping or metrology, and
none carries a company or designation. They are retained verbatim for migration, but B2B
testimonials from lab and machining customers would replace them to far better effect.

### CQ-67 · Nine pages not yet captured `SCOPE · affects Phase 3–7 sequencing`
The audit's second-pass list is still outstanding: Large Bed CMM services, Training & Seminar
Hall, Skill Development, Incubation Centre, Life at Auto Cluster plus its five announcement
sub-pages, Design Centre, Knowledge Centre, Careers. Large Bed CMM and Training & Seminar Hall
are both commercial pages and are the priority — I will capture them from the live site before
Phase 3 unless ACDRI is supplying replacement copy.

---

## E. Decided without asking

Recorded here so they can be overruled, not because they need an answer.

- **Menu label "Employment Engagement"** contradicts its own slug and page heading, both of
  which read "Employee Engagement". Using **Employee Engagement**.
- **Auditorium stage `35.00 ft * 16.60 ft`** — the only imperial measurement on an otherwise
  metric site. Publishing as **10.67 m × 5.06 m (35 ft × 16.6 ft)**.
- **"Request for book Exhibition Centre"** → **"Request a booking"**. The same broken phrase
  appears on the Auditorium page with sub-copy that was never localised away from the
  Exhibition Centre.
- **Exhibition Centre booking will offer all 12 expo categories.** The current dropdown offers
  four — Plasto, Renewable Energy, Rubber Die & Mould, Consumer, Dental, Education, Property
  and Jewellery are advertised on the page but cannot be selected when booking.
- **The COVID-era content moves to past tense.** Both the About page ("Our team… ensures the
  following of social responsibilities in this pandemic situation") and Rapid Prototyping
  ("Recently our team completed… Oximeter, Temperature Gun, Face shield, masks") describe 2020
  work in the present tense. The exhibition centre's conversion into a PCMC COVID hospital is a
  genuinely strong credibility story — it is being reframed as a dated case study, not deleted.
- **"(Oximeter, Temperature, Gun)"** reads as three items where it means two. Publishing as
  **Oximeter, temperature gun**.
- **Duplicate "Heavy engineering"** across both PPF industry columns → one deduplicated list.
- **RPL "Endurance Testing"** currently describes flexural testing verbatim — the body text was
  copy-pasted from the entry above it and never rewritten, and it ends by saying the Instron
  Actuator is used "for conducting Flexural Testing". Being rewritten to describe endurance
  testing. Flagged here because it is a rewrite, not a typo fix.
- **Near-duplicate test descriptions consolidated.** Environmental items 1/2/3/10 are ~90%
  identical; Water Spray and Rain are near-duplicates; RPL items 9/15 (both "stress v/s strain
  via UTM") and 12/13 (both "Heat, Fuel and Oil") substantially overlap. Content is being
  merged where the tests are genuinely the same and differentiated where they are not — no test
  is dropped.
- **`© Custom Copyright`** (a live placeholder in production) → `© 2026 Auto Cluster
  Development and Research Institute. All rights reserved.`
- **The footer page dump** — an unstyled alphabetical list of ~28 links left over from a
  WordPress Pages widget, exposing both privacy policies and all six orphaned equipment pages —
  is removed and replaced with a curated three-column footer.
- **The `localhost` tender modal** (`http://localhost/staging/…/dummy-PDF.pdf`) and the
  `ivl-staging.com` chat icon do not carry over. Neither does the duplicate SLA block whose
  image loads from `localhost` with `alt="null"`.
- **Google Maps** moves from `z=10` (which shows most of the Pune district) to a Place
  ID-pinned static map at `z=17` that upgrades to interactive on click.

---

## Priority for the client

If ACDRI can only action a few things, these unlock the most:

1. **CQ-50 / CQ-53** — specifications and standards for the environmental chambers. Without
   these, the largest facility page and 6 of 30 equipment pages stay thin.
2. **CQ-57** — the five real homepage numbers.
3. **CQ-54** — the NABL scope document.
4. **CQ-08** — board photograph pairings, so the About page can ship.
5. **CQ-63** — export the Google Form responses. This one is time-sensitive and independent of
   everything else.
6. **CQ-60** — the hosting/data-residency answer, because it is cheapest to act on now.
