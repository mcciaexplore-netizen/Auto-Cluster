# Homepage

| | |
|---|---|
| Current URL | `https://autoclusterpune.org/` |
| New URL | `/` |
| Current `<title>` | `autoclusterpune` |
| Meta description | none |
| Canonical | `https://autoclusterpune.org/` |

**New title:** `Auto Cluster Development and Research Institute — NABL Testing, Prototyping & Exhibition Facilities in Pune`

---

## Section 1 — Welcome (verbatim)

### H2
> Welcome to Auto Cluster Development and Research Institute

### Body paragraph 1
> Located in the Chinchwad-Talegaon-Chakan rich automotive district of Pune, the Auto Cluster Development and Research Institute is a facility for **providing support to small & medium Enterprises.** The Auto Cluster Development and Research Institute provide an area of a common **facility, validation, training, seminar, workshop, and market promotional activities**, especially for the automotive and engineering sector.

*(Bold as it appears on the live page.)*

### Body paragraph 2
> Auto Cluster Development and Research Institute. (ACDRI) is established under the **Industrial Infrastructure Up-gradation Scheme (IIUS)** of the Department of Industrial Policy and Promotion (DIPP), Ministry of Commerce and Industry, Government of India, supported by Government of Maharashtra and Pimpri Chinchwad Municipal Corporation with the initiative of Mahratta Chamber of Commerce, Industries and Agriculture (MCCIA), supported by Government of Maharashtra and Pimpri Chinchwad Municipal Corporation.

⚠️ **Duplicated clause** — "supported by Government of Maharashtra and Pimpri Chinchwad Municipal Corporation" appears twice in one sentence. Also a stray full stop after "Institute."

---

## Section 2 — Credentials (verbatim)

| Image | Caption |
|---|---|
| `/uploads/2020/10/Govt-og-india.png` alt `Govt-of-india` | Promoted by Govt. of India, Min. of Comm. & Industry. DIPP. Delhi, Supported by Pimpri Chinchwad Municipal Corporation (PCMC). |
| `/uploads/2020/11/TUV-ISO-9001-icon-Homepage.png` alt `TUV` | With ISO 9001:2015 Certification, the potential of the Auto Cluster has grown. Our Focus is towards better and improved working conditions within the office premises and customer satisfaction. |
| `/uploads/2020/10/NABL-icon.png` — **no alt** | NABL Accreditation for our laboratory to help Auto Cluster provide better and improved working conditions within the office and build the confidence of the customer. |

---

## Section 3 — Our Achievements (animated counters)

### H2
> Our Achievements

| Label (verbatim) | Rendered value |
|---|---|
| Number of Clients(OEMs, Tier I and MSMEs) | `1 +` |
| Number of Projects | `1 +` |
| Years of Experience | `1 +` |
| Number of Machines | `1 +` |
| Number of Expert Employees | `1 +` |

🔴 **All five render as `1 +`.** The real figures are not in the HTML — they exist only as JS animation targets, so they are invisible to crawlers and to any user where the script doesn't fire. **Actual numbers must be obtained from ACDRI and server-rendered.**

Missing space in label: `Clients(OEMs`.

---

## Section 4 — Auto Cluster Facilities (verbatim)

### H2
> Auto Cluster Facilities

### Intro
> Auto Cluster provides its expertise to various MSMEs, who are looking for cost-effective solutions for creating infrastructure support and help them in innovation. We have range of services catering to various industry domains. We at Auto Cluster ensure that our products are tested, are of the highest quality and meet all the requirements of our clients.

### Cards

**1. Prototype Production Facility** → `/prototype-production-facility/`
> We are experts in Prototyping, Fixturing, Tooling, and Laser Cutting Activities and other tasks related to Vertical Machine Facilities. We have the best in industry machines that deliver high-quality and precise outputs.

**2. Rapid Prototype Centre** → `/rapid-prototyping/`
> At Auto Cluster, we use the latest technology in 3D printing and deliver to our clients across various domains. We cater to the automotive, Defence, Architectural and similar domains. We cater to all types of requirements as per client.

**3. Environment Testing** → `/environmental-testing/`
> Environment Testing helps in measuring the performance of various equipment when exposed to specific climatic conditions. These are critical for the Automotive, Electrical and Défense industry sectors.

⚠️ `Défense` here vs `Defence` in card 2.

**4. Rubber and Polymer Testing** → `/rubber-polymer-mechanical-testing/`
> Rubber and Polymer Testing is for the testing, analysing and understanding the characteristics of the polymer materials of all types. At Auto Cluster, we provide Rubber and Polymer Testing services for the defence, automotive and various engineering and non-engineering industries.

**5. Metrology CMM Services** → `/large-bed-cmm-services/`
> As part of our machines, we have 02 big Co-ordinate Measuring Machines (CMM). These machines are used to provide measurements of dies like various automobile parts, mechanical parts and other prototypes.

Card thumbnails are referenced only as `img` in the extracted markup — actual filenames must be pulled from the media library during migration.

---

## Section 5 — Auto Cluster Services (verbatim)

### H2
> Auto Cluster Services

### Intro
> Creating Infrastructural support to promote innovation and collective learning. The various facilities development is towards our initiative of creating cost-effective infrastructure support to promote learning and innovations.

**1. Exhibition Center** → `/exhibition-center/` 🔴 **404**
> Auto Cluster Exhibition Centre has been designed to meet the various international guidelines. The permanent outdoor Exhibition Centre with its Two Exhibition Halls facilitates the display of engineering capabilities and enables exposure to the latest technology trends.

⚠️ Card title says "Center", nav says "Centre".

**2. Auditorium Hall** → `/auditorium-hall/` (redirects)
> Auditorium with an in-built Audi system with 170 people capacity. Institutions, Event managers, Organizations, Corporate companies, and industries are utilizing this facility.

⚠️ States **170**; the Auditorium page states **172**. "Audi system" should read "audio system".

**3. Training & Seminar Hall** → `/training-seminar-hall/`
> Auto Cluster has Training and Seminar halls for various events. Along with these, there is a CAD/CAM training centre that has 30 workstations.

---

## Section 6 — Client Testimonials (verbatim)

### H2
> Client Testimonials

**Kristina M**
> Visited here for expodent 2018. Very close to the highway and easy to reach. Good air conditioned halls

**Rajendra T**
> It's a nice place for exhibition. All stalls were in order and everything was systematic. In fact volunteers were helpful. I was not aware that this type of place exists in Pune.

**Malima S.**
> Went for a Water Expo on the Auto Cluster Exhibition. The hall size is great and the staff there was very helpful. Would recommend this place to conduct expo/events.

⚠️ All three are 2018 consumer-style venue reviews. None relates to testing, prototyping or metrology. No company, designation or photo. Retain verbatim for migration, but flag for replacement.

---

## Media inventory

| Asset | Alt | Issue |
|---|---|---|
| `/uploads/2020/11/logo-new-w.png` | `logo` | Weak alt |
| `/uploads/2020/10/Govt-og-india.png` | `Govt-of-india` | Filename typo `og` |
| `/uploads/2020/11/TUV-ISO-9001-icon-Homepage.png` | `TUV` | — |
| `/uploads/2020/10/NABL-icon.png` | *(none)* | Missing alt |
| `/uploads/2020/10/logo-pcmc.png` | `PCMC` | — |
| `/uploads/2020/10/logo-mccia.png` | `mccia` | — |
| `/uploads/2020/11/logo-mh.png` | `logo-mh` | — |
| `/uploads/2020/11/favicon-1.png` | — | Favicon |
| *(empty)* | `Slider` | 🔴 Image with `alt="Slider"` and **no src** |

**Video:** none on the homepage. (The MD's message video lives on About Us.)

---

## Page defects summary

| Severity | Defect |
|---|---|
| 🔴 | Exhibition Center card → 404 |
| 🔴 | All five counters render `1 +` |
| 🔴 | Empty image with `alt="Slider"` |
| 🔴 | `[contact-form-7 404 "Not Found"]` visible |
| 🔴 | `[our-machines]` shortcode visible |
| 🔴 | `© Custom Copyright` placeholder |
| 🔴 | Tender modal → `localhost` |
| 🟠 | Title tag is just `autoclusterpune` |
| 🟠 | No meta description |
| 🟠 | Duplicated clause in paragraph 2 |
| 🟠 | 170 vs 172 auditorium capacity |
| 🟠 | Centre/Center and Defence/Défense inconsistency |
| 🟡 | Testimonials from 2018, wrong audience |
| 🟡 | NABL icon missing alt |

---

## New build

| Order | Component | Content source |
|---|---|---|
| 1 | `Hero` | New headline needed — current H2 is "Welcome to…". Recommend a value-proposition line; keep existing copy as sub-text |
| 2 | `AudienceRouter` | **New.** Three cards: Get something tested / Get something made / Hire a venue |
| 3 | `StatBand` | Section 3 labels, with **real server-rendered numbers** |
| 4 | `RichText` | Section 1, deduplicated |
| 5 | `PartnerLogos` | Section 2, with correct alt text |
| 6 | `ServiceGrid` | Section 4, five cards |
| 7 | `ServiceGrid` | Section 5, three cards, all links resolving |
| 8 | `TestimonialSet` | Section 6 — replace with B2B testimonials when available |
| 9 | `EventsTeaser` | **New.** Upcoming exhibitions |
| 10 | `CTABand` | Enquire · Call · WhatsApp |

**Schema:** `Organization` + `LocalBusiness` + `WebSite`.
