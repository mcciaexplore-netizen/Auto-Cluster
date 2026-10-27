# Global Shell — Header, Navigation, Footer

Appears on every page. Content preserved verbatim.

---

## Top bar

```
+91 20 6633 3700          ← currently href="#", must become tel:+912066333700
marketing@autoclusterpune.org
marketing2@autoclusterpune.org
```

## Logo

`https://autoclusterpune.org/wp-content/uploads/2020/11/logo-new-w.png`
Alt: `logo` → change to `Auto Cluster Development and Research Institute`
White lockup, implies dark header background.

## Main navigation (current, verbatim)

```
Home                              /
About Us                          /about-us/
  ├ Overview                      /about-us/#Overview
  ├ Certifications                /about-us/#our-certifications
  ├ Vision/Mision                 /about-us/#mission-vision      ← TYPO: "Mision"
  ├ MD's Message                  /about-us/#MD-message
  ├ Our Team                      /about-us/#our-team
  └ Board of Directors            /about-us/#board-of-directors
Facilities                        #     ← DEAD
  ├ Prototype Production Facility /prototype-production-facility/
  ├ Rapid Prototype Center        /rapid-prototyping/
  ├ Environmental Testing         /environmental-testing/
  ├ Rubber and Polymer Testing Lab /rubber-polymer-mechanical-testing/
  ├ Large Bed CMM and Metrology Services /large-bed-cmm-services/
  ├ Design Centre                 #     ← DEAD (page exists)
  ├ Skill Development             /skill-development/
  └ Incubation Centre             /incubation-centre/
Services                          #     ← DEAD
  ├ Exhibition Centre             /exhibition-centre-in-pune/
  ├ Auditorium Hall               /auditorium-hall-in-pune/
  ├ Training and Seminar Hall     /training-seminar-hall-in-pune/
  └ Infrastructure Support        #     ← DEAD
Life at Auto Cluster              /life-at-autocluster/
  ├ Our Achievements              /announcement/our-achievements/
  ├ Training                      /announcement/training/
  ├ Employment Engagement         /announcement/employee-engagement/  ← label/slug mismatch
  ├ Internal Training             /announcement/internal-training/
  ├ Annual Days and Outings       /announcement/annual-days-and-outings/
  └ Knowledge Centre              #     ← DEAD (page exists)
Timeline                          #     ← DEAD
Tenders                           /tenders/
Careers                           #     ← DEAD (page exists)
Contact Us                        /contact-us/
```

Also present: a `Skip to content` link targeting `#content`. **Keep this** — it's one of the few accessibility features already correct.

---

## Footer

### Footer nav (verbatim)
About Us · Facilities `#` · Services `#` · Life at Auto Cluster · Timeline `#` · Tenders · Careers `#` · Contact Us · Privacy policy

### Contact block (verbatim)

```
Auto Cluster Development
and Research Institute
H-Block, Plot No. C-181,
Chinchwad East,
Mumbai Pune Road,
Pune – 411 019
Maharashtra, India

marketing@autoclusterpune.org
info@autoclusterpune.org
+91 20 6633 3700
```

Note: the footer shows `info@` while the header shows `marketing2@`. Three addresses across the site with no stated purpose for each.

### "Promoted and Supported by" (verbatim)

| Logo file | Caption |
|---|---|
| `/uploads/2020/10/Govt-og-india.png` (alt `Govt-of-india`) | Ministry of Commerce and Industry, Govt. of India |
| `/uploads/2020/10/logo-pcmc.png` (alt `PCMC`) | Pimpri-Chinchwad Municipal Corporation |
| `/uploads/2020/10/logo-mccia.png` (alt `mccia`) | Mahratta Chamber of Commerce Industries and Agriculture |
| `/uploads/2020/11/logo-mh.png` (alt `logo-mh`) | Government of Maharashtra |

Filename typo in the source asset: `Govt-og-india.png`.

### Copyright

```
© Custom Copyright        ← PLACEHOLDER, live in production
```

Replace with: `© 2026 Auto Cluster Development and Research Institute. All rights reserved.`

### Footer page dump

An unstyled alphabetical list of ~28 page links sits below the copyright — a leftover WordPress "Pages" widget. It exposes both privacy policies and all six orphaned equipment pages. **Remove entirely**; replace with a curated three-column footer.

---

## Sitewide modals (present in the DOM of every page — remove)

| Modal | Content | Defect |
|---|---|---|
| Request a Quote | Empty link, `send` button | Uses broken CF7 |
| Chat widget | 3 buttons: Help, Chat, Support | All `href=""`, no accessible names. Icon from `http://ivl-staging.com` |
| Booking Details | Full exhibition booking calendar + form | Loads on all pages. Dropdown has 4 of 12 expo types |
| Tenders & Notices | "Download the PDF file to view the Tender/Notice. Download" | Points to `http://localhost/staging/…/dummy-PDF.pdf` |
| 30 × machine modals | Full specs per machine | See `12-equipment-catalogue.md` |
| `[our-machines]` | — | Unrendered shortcode printing as literal text |
| Orphan SLA block | Duplicate SLA spec | Image from `http://localhost/staging/…`, `alt="null"` |
| `[contact-form-7 404 "Not Found"]` | — | Broken shortcode, visible text |

### Booking form fields (verbatim)

```
Name*        Phone*        Email*
Types of Expo* : [Select Expo | Engineering Expo | Auto Ancillary Expo
                  | Automotive Engineering Expo | Water Expo]
Number of Stalls:
☐ I have read the Guidelines and Rules-Regulation Document.
[Send]

Note: "Additional 2 days prior to the booked dates and later 2 days will get
auto selected for this type of Exhibition. For further details, refer to the
booking guidelines."

Legend: Available · Booked · Pending
```

The dropdown must expand to all 12 expo types listed in `05-exhibition-centre.md`.

---

## New build

**Header:** sticky, dark navy. Two-level mega-nav on desktop grouped as Facilities / Venues / About. Full-screen drawer on mobile. Persistent "Enquire" button. `tel:` and WhatsApp on mobile.

**Footer:** three columns (Facilities · Venues · Institute) + contact block + promoter logos + legal row. No page dump.

**Modals:** scoped to owning routes only. Nothing global.
