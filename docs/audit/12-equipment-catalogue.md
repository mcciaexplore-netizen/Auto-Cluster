# Equipment Catalogue — All 30 Machines

**Source:** the global modal library, which renders in the DOM of every page on the current site. This data is currently invisible to search engines and to users who never click a modal trigger. It is the single largest untapped content asset ACDRI has.

**Replaces:** `/our-machines/` and the five orphaned category pages.
**New URLs:** `/equipment` (filterable) + `/equipment/[slug]` (one indexable page per machine).

⚠️ **Every spec below is reproduced verbatim.** The "Correction required" column flags what must be fixed before publication — these are technical accuracy errors on a NABL-accredited lab's public specification pages.

---

## A. Prototype Production Facility — 8 machines

### A1. 5-Axis VMC (Non-Continous)
`/uploads/2020/11/Service_01.1.png`
- Make : Rambaudi
- Max. Job Size : 3 M * 2 M * 0.8 M
- Machine Application : 2D – 3D Profile m/c, Boring, Drilling, Reaming, Side face operations etc.

**Corrections:** "Non-Continous" → Non-Continuous · `3 M * 2 M * 0.8 M` → `3000 × 2000 × 800 mm`

### A2. 3-Axis VMC
`/uploads/2020/11/Service_01.2.png`
- Make : Hartford
- Max. Job Size : 3 M * 1.4 M * 0.75 M
- Machine Application : 2D – 3D Profile m/c, Boring, Drilling, Reaming etc. with 16 Number tool ATC.

**Corrections:** unit convention · "16 Number tool ATC" → "16-tool ATC"

### A3. 5+1 Axis Laser (Rotary Attachment)
`/uploads/2020/11/Service_01.3-1.png`
- Make : TRUMPF
- Max. Job Size : 3 M * 1.5 M * 0.75 M (4.5 KW)
- Machine Application : 2D – 3D Profile m/c, Oxygen Cutting up to 12 mm & Nitrogen Cutting up to 8 mm with Welding Head.

**Corrections:** unit convention · `KW` → `kW`

### A4. 3+1 Axis VMC (Rotary Attachment)
`/uploads/2020/11/Service_01.4-1.png`
- Make : TAI
- Max. Job Size : 1 M * 0.5 M * 0.65 M
- **Max. Job Size** : Machine Application : 2D – 3D Profile m/c, Boring, Drilling, Reaming etc. with 20 Number Tool ATC Capacity

🔴 **Duplicate field label.** The third row is labelled "Max. Job Size" but contains the machine application. Broken data entry.

### A5. Turn Mill Centre
`/uploads/2020/11/Service_01.5-1.png`
- Make : ACE
- Max .Job Size : @ 250 * 600 mm
- Machine Application : Turining, Milling, Boring, Drilling, Reaming etc. with 12 Number Tool Turret

**Corrections:** "Turining" → Turning · `Max .Job Size` → `Max. Job Size` · `@ 250` → `⌀250` (diameter symbol lost)

### A6. Deep Hole Drilling
`/uploads/2020/11/Service_01.6-1.png`
- Make : Ixion
- Max. Job Size : 1.7 M * 0.4 M
- Machine Application : One Stroke 650 mm Deep Hole * ¢20

**Corrections:** `¢20` → `⌀20` (cent sign used in place of the diameter symbol)

### A7. Deep Hole Drilling 🔴 **MISLABELLED**
`/uploads/2020/11/Service_01.7-1.png`
- Machine Type : Z NC
- Max. Job Size : 2.5 M * 1.2 M**/li>**
- Machine Application : Die Sinking

🔴 **Two problems.** (1) Titled "Deep Hole Drilling" but the application is **Die Sinking** — this is almost certainly a Die Sinking EDM, not a drill. Two machines on the site share the identical title. (2) **Leaked HTML** — `/li>` printing as visible text.

### A8. W-EDM
`/uploads/2020/11/Service_01.8-1.png`
- Machine Type : CNC
- Max. Job Size : 620 mm * 420 mm * 300 mm
- Machine Application : Wire Cutting (Submerged Type)

*(This one uses correct mm units — the only machine in section A that does.)*

**Also shown on the PPF page but absent from the modal library:**
- **3+1 Axis VMC** — `/uploads/2026/02/3-AXIS.jpg` (filename says 3-AXIS, card says 3+1) — no specs
- **5 Axis VMC** — `/uploads/2026/02/5-axis.gif` (animated GIF) — no specs

---

## B. Rapid Prototyping — 4 machines

### B1. SLA – 3D Systems 7000 HD
`/uploads/2020/11/SLA.jpg`
- Platform Size : 380 x 380 x 250 mm
- Materials : Accura Phoenix (SLA) / Visijet SL Flex

Specialized production parts in: Automotive · Aerospace · Research · Medical · Investment casting Patterns

🔴 A **duplicate SLA block** also exists in the modal layer with the image loaded from `http://localhost/staging/…/Rapid-Prototype-Production.jpg` and `alt="null"`.

### B2. SLS – EOS P385
`/uploads/2020/11/SLS.jpg`
- Platform : 320 mm * 320 mm * 520 mm
- Material : PA

RPT Machine Suitable for Proto Parts Development: Engineering Functional Parts · Automotive Parts · Medical Application – Skull, Knee cap · Architectural Models · Styling Models

**Corrections:** "Platform" vs "Platform Size" inconsistent with B1/B3 · `*` → `×`

### B3. FDM – Stratasys 450 MC
`/uploads/2020/11/FDM.jpg`
- Platform Size : (406 x 355 x 406 mm)
- Materials : ABS-ESD / ABS-M30 / ABS-M30i / ASA

Specialized production parts in: Automotive · Aerospace · Research · Medical

**Corrections:** stray parentheses around dimensions

### B4. Vacuum Casting – KLM
`/uploads/2020/11/Vacuum-Casting.jpg`
- Dimensions : 360 x 400 x 460 mm

Materials:
- Renishaw (Flexible Rubber)50 ~ 90 Shore hardness & wide range of Renishaw material
- Aerospace
- Research
- Medical

🔴 **The "Materials" list contains three industries, not materials.** Aerospace, Research and Medical are applications that have been pasted into the wrong list. Only the first bullet is a material.
⚠️ **"Renishaw"** is a metrology company, not a casting-resin supplier. This is very likely meant to be **"Renshape"** or a similar tooling-board/urethane brand. Requires verification — publishing a wrong supplier name is a credibility issue.
⚠️ Missing space: `(Flexible Rubber)50`

---

## C. Environmental Testing — 6 machines 🔴 **ZERO SPECIFICATIONS**

| # | Machine | Image | Specs |
|---|---|---|---|
| C1 | Xenon Test Chamber | `/uploads/2020/11/Xenon-Q-lab.jpg` | **none** |
| C2 | Salt Spray Test Chamber | `/uploads/2020/11/Salt-Spray.jpg` | **none** |
| C3 | Dust Spray Test chamber | `/uploads/2020/11/Vibration-Shaker-with-chamber.jpg` 🔴 | **none** |
| C4 | Water spray test chamber | `/uploads/2020/11/Water-Spray.jpg` | **none** |
| C5 | Thermal shock test chamber | `/uploads/2020/11/Thermal-Shock-Chamber.jpg` | **none** |
| C6 | High Low-Test Chamber | `/uploads/2020/11/High-Low-chamber.jpg` | **none** |

🔴 **Every environmental chamber has a title and an image and nothing else.** No make, no model, no chamber size, no temperature range, no humidity range, no test standards. For the service ACDRI markets to "Aeronautical, Space applications, and in Automotive", this is the most damaging gap in the catalogue — these are exactly the specs an engineer needs to decide whether their part fits.

🔴 **C3 image mismatch:** "Dust Spray Test chamber" is illustrated with `Vibration-Shaker-with-chamber.jpg`.

⚠️ Capitalisation is inconsistent across all six.
⚠️ The page copy also mentions a **Rain Test Chamber**, a **Mini Salt Spray**, a **Big Salt Spray** and a **Temp. coupled vibration chamber** — none of which appear as catalogue entries at all.

**Required from ACDRI for each:** make, model, chamber internal dimensions, temperature range, humidity range, ramp rates, salt concentration (for salt spray), spray pressure/angle (for water), dust concentration, vibration frequency/amplitude, and the applicable standards (ASTM B117, IEC 60529, IS/ISO equivalents).

---

## D. Rubber & Polymer Testing (RPL) — 11 machines

### D1. Universal Testing Machine (UTM)
`/uploads/2020/11/UniversalTesting-machines.jpg`
- Make : Tinius Olsen, UK
- Capacity : 100 N to 23 Tons
- Cross Head Travel Excluding Grips : **1100 M**
- Horizontal Clearance : 405 mm
- Speed Range : 0.001 mm/min to 1000 mm/min
- Speed At Max Capacity : 1000 mm/min
- Test Standards : ASTM D 683, ASTM D 412, ISO 178

🔴 **"1100 M"** — 1,100 metres of crosshead travel is physically impossible. Should read **1100 mm**.
⚠️ Mixed units: N and Tons in one capacity line. Should be kN throughout.
⚠️ "ASTM D 683" — likely **ASTM D638** (tensile properties of plastics). D683 is not a current standard. Verify.

### D2. Universal testing Machine *(second entry, page only)*
`/uploads/2026/02/Picture2.jpg` — **no specs**
🔴 Duplicate name, different image, default filename from an Office paste. Either a second UTM needing a distinct name, or a duplicate to remove.

### D3. Thermo Gravimetric Analyser (TGA)
`/uploads/2020/11/Thermo-Gravimeter-Analyser.jpg`
- Make : **Shimatzu**, Japan
- Resolution : 1 µ
- Atmosphere : Air, Oxygen and Nitrogen
- Measuring Range : ± 200 µ

🔴 **"Shimatzu" → Shimadzu**
⚠️ Resolution and measuring range in "µ" — micrograms? micrometres? Ambiguous. TGA measures mass, so likely **µg**. Also no temperature range given, which is the primary TGA spec.
⚠️ Alt text on the image reads "Thermo Gravimeter Analyser" (Gravimeter ≠ Gravimetric).

### D4. Instron Actuator
`/uploads/2020/11/Instron-Actuator.jpg` — **no specs**
⚠️ Referred to as "Intron Actuator" twice in the page copy.

### D5. Xenon Test Chamber
`/uploads/2020/11/Xenon-Q-lab.jpg` — **no specs**
*(Listed under both Environmental and RPL.)*

### D6. Ozone Test
`/uploads/2020/11/Ozone-Chamber.jpg`
- Make : In USA Inc, India
- Temp Range : Room Temp to **1000C**
- Gas Phase : 0 to 9999
- Measuring Range : 0 to 200 PPHM Multiple Range
- Model : In 2000 – L2 – Low Concentration
- Chamber Size : 500 mm * 500 mm * 600 mm
- Test Standard : ASTM D1171, ASTM D1149
- **Measuring Range : 0 to 200 PPHM Multiple Ranges**

🔴 **"1000C" → 100 °C** (degree symbol stripped)
🔴 **"Measuring Range" listed twice** with near-identical values
⚠️ "Make : In USA Inc, India" — contradictory. "Gas Phase : 0 to 9999" has no unit.

### D7. Impact Tester
`/uploads/2020/11/Ozone-Chamber.jpg` 🔴 **(wrong image — reuses the Ozone chamber photo)**
*Correct image exists on the RPL page as `/uploads/2020/11/Impact-tester.jpg`*
- Make : Ceast, Spa, **Itly**
- Model : Resil Impactor
- For Izod, Charpy & Tensile Impact **text**, resilience test (Notch and w/c Notch)
- Microprocessor Controlled
- Hammer Range : **1to** 25 Joules for Izod, 4 J to 25 J
- Test Standard : ISO 180, 179

🔴 **"Itly" → Italy** · **"text" → test** · **"1to" → "1 to"**
⚠️ "Ceast, Spa" → **CEAST S.p.A.**

### D8. Accelerated Weathering Tester
`/uploads/2020/11/rubber_wtester.jpg`
- Make : Q Lab, USA
- Model : QUV / Spray
- Feature : Solar Eye Irradiance Control
- Chamber Size : **75 mm * 150 mm * 6 mm**
- Lamp : UVB 313 EL
- Max Sample Capacity : 24 Nos
- Test Standard : ASTM & SAE Std.
- Fault Recognition : Alarms

🔴 **Chamber Size 75 × 150 × 6 mm is a specimen size, not a chamber.** A QUV chamber holding 24 samples cannot be 6 mm deep. Mislabelled field.
⚠️ "Test Standard : ASTM & SAE Std." — no standard numbers given. Should cite ASTM G154 / SAE J2020.
⚠️ "Q Lab" → **Q-Lab**

### D9. Melt Flow Indexer
`/uploads/2020/11/MEtflow-Index.jpg`
- Make : Tinius Olsen, UK
- Model : MP 600
- Temp Range : Room Temp to **4500C**
- Test Standards : ASTM D 1238 ISO 1133

🔴 **"4500C" → 450 °C**
⚠️ Missing comma between the two standards.

### D10. Differential Scanning Calorimeter (DSC)
`/uploads/2020/11/Services04.8.jpg`
- Model : DSC 60
- Make : **Shimatzu**, Japan
- Temp Range : Room Temp to **6000C**
- Measuring Range :±40 mW
- Atmosphere : Air, **Insert Gas** (N2)
- Resolution : 1mW
- Test Standard : ASTM E928, ASTM D 1525, ASTM D 648

🔴 **"Shimatzu" → Shimadzu** · **"6000C" → 600 °C** · **"Insert Gas" → Inert Gas**
⚠️ `N2` → `N₂` · missing space after the colon in "Range :±40"
⚠️ Alt text on this image is `Services`.

### D11. Heat Deflection Temperature (HDT) & VICAT Softening Temperature Tester
`/uploads/2020/11/HDT-VICAT-1.jpg`
- Make : Ceast, Spa, **Itly**
- Model : HDT 3 Vicat
- Microprocessor Control
- 3 Independent Work Stations for Three Simultaneous Tests
- Temp Range : Room Temp. to **3000C**, Weight Range 1 to 5140 gm
- Test Standard : ASTM D 648 and ASTM D 1525

🔴 **"Itly" → Italy** · **"3000C" → 300 °C**
⚠️ Two different specs merged into one line (temp range + weight range)

### D12. Multi Head Micro Hardness Tester
`/uploads/2020/11/Multihead-HardnessTeaster-1.jpg`
- Make: Gibitre. **Itly**
- Model : Multi Unit Hardness Tester
- IRHD : Normal & Micro Shore A & D
- In Compliance with : ISO 43-1987, ISO 868, BS 903, ASTM D 1415, ASTM D 2240

🔴 **"Itly" → Italy** · full stop after "Gibitre" should be a comma
⚠️ Filename typo: `HardnessTeaster`
⚠️ "ISO 43-1987" is withdrawn; the current standard is **ISO 48**. Verify.

### D13. FTIR Spectroscope
`/uploads/2020/11/FTIR.jpg`
- Make : ThermoElectron, USA
- Model : Nicolet 380
- Polymer & Plasticizer Library – 01 No
- Rubber Compounding Library
- Hummel Polymer Library – 01 No
- Lubrication Oil Library – 01 No
- Test Standard : ASTM E 1252

⚠️ "ThermoElectron" → **Thermo Electron** (now Thermo Fisher Scientific)
⚠️ "Rubber Compounding Library" missing its "– 01 No" count, unlike the other three
⚠️ **"Spectroscope" → Spectrometer.** FTIR instruments are spectrometers.

---

## E. Metrology / CMM — 1 machine

### E1. Co-Ordinate Measuring Machine (CMM)
`/uploads/2020/11/Service05.1-1.jpg`
- Make : Accurate
- Accuracy : ±2.9 + (L/300)µm
- Model : Cordimesur
- Max. Job Size : X 1000mm * Y 1800mm * Z 800mm

⚠️ The homepage claims **"02 big Co-ordinate Measuring Machines (CMM)"** — only one is catalogued. The second CMM is missing entirely.
⚠️ Field order is inconsistent (Make, Accuracy, Model — Model should follow Make)
⚠️ Missing spaces before "mm"

---

## Summary of catalogue defects

| Category | Count |
|---|---|
| Machines with **no specifications at all** | **8** (6 environmental + Instron Actuator + 2nd UTM) |
| Degree symbols stripped (`6000C`, `4500C`, `3000C`, `1000C`) | 4 |
| Manufacturer names misspelt (Shimatzu ×2, Itly ×3) | 5 |
| Wrong or duplicated images | 2 (Impact Tester, Dust Spray) |
| Duplicate machine titles | 2 pairs (Deep Hole Drilling, UTM) |
| Duplicate field labels within one record | 2 (A4, D6) |
| Leaked HTML in visible text | 1 (`/li>` in A7) |
| Nonsensical / impossible values | 3 (1100 M, 6 mm chamber, "Renishaw" as a casting resin) |
| Records with no test standards cited | 20 of 30 |
| Images with no alt text | ~24 of 30 |

---

## New build — `/equipment`

**Catalogue page:** filterable grid. Filters: category · make · capability · standard supported · max job size. Search across name, make, model and standard.

**Detail page `/equipment/[slug]`:** hero image + gallery · structured spec table · applicable standards (linked) · applications · related services · "Enquire about this machine" form pre-filled with the machine name · related equipment.

**Payload schema:** see `00-ARCHITECTURE.md` §3.

**Before publication, ACDRI must supply:**
1. Full specifications for the 8 machines that currently have none — the six environmental chambers above all
2. Correct identification of the machine currently mislabelled "Deep Hole Drilling / Die Sinking"
3. Confirmation of whether there are one or two UTMs, and one or two CMMs
4. Verification of "Renishaw" as the vacuum casting material
5. Correct photographs for the Impact Tester and Dust Spray chamber
6. Test standards for all 30 machines
7. Confirmation of ASTM D683 vs D638, and ISO 43 vs ISO 48

**SEO note:** these 30 pages are the highest-value content ACDRI can publish. Engineers search by machine make, model and standard — "Tinius Olsen UTM Pune", "salt spray ASTM B117 Pune", "FTIR polymer identification Pune". None of that is currently indexable because it lives inside modals.
