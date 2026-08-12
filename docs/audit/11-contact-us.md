# Contact Us

| | |
|---|---|
| Current URL | `/contact-us/` → New: `/contact` |
| Current `<title>` | `Contact Us – autoclusterpune` |

**New title:** `Contact Auto Cluster — Testing, Prototyping & Venue Enquiries | Chinchwad, Pune`

---

## Hero (verbatim)

**H1:** Contact Us
**H2:** Address and Contact Details of Auto Cluster

---

## Address and Contact (verbatim)

**H2:** Address and Contact

> Auto Cluster Development and Research Institute
> H-Block, Plot No. C-181, Chinchwad East,
> Mumbai Pune Road,
> Pune - 411 019 Maharashtra,
> India

> +91 20 6633 3700

> marketing@autoclusterpune.org
> marketing2@autoclusterpune.org

🔴 **Phone and emails are plain text.** Not `tel:` links, not `mailto:` links. On mobile the number cannot be tapped to call — for an MSME audience that is likely mobile-majority, this is the single most costly small defect on the site.

⚠️ Address formatting differs from the footer: here `Pune - 411 019` (hyphen) versus footer `Pune – 411 019` (en dash); line breaks differ too.

⚠️ **Email inconsistency across the site:**
| Location | Addresses shown |
|---|---|
| Header | `marketing@` · `marketing2@` |
| This page | `marketing@` · `marketing2@` |
| Footer | `marketing@` · `info@` |

Three addresses, no explanation of which is for what. A visitor cannot tell whether a lab enquiry goes to `marketing@`, `marketing2@` or `info@`.

⚠️ Leading whitespace is baked into the source markup (`- \t\t\t\t\t\t Auto Cluster…`), indicating hard-coded indentation rather than styled layout.

---

## Locate Us (verbatim)

**H2:** Locate Us

**Google Maps embed:**
```
https://maps.google.com/maps?q=Auto%20Cluster%20Development%20%26%20Research%20Institute%20
H-Block%2C%20Plot%20No.%20C-181%2C%20Chinchwad%20East%2C%20%20Mumbai%20Pune%20Road%2C%20
&t=m&z=10&output=embed&iwloc=near
```

🔴 **`z=10`** — zoom level 10 shows most of the Pune district, not the plot. A visitor cannot see where the facility actually is. Should be `z=16` or higher.
🔴 Uses an **address query string** rather than a Place ID, so pin placement is unreliable and will drift if Google's geocoding changes.
⚠️ Double space in the query between "East," and "Mumbai".
⚠️ Direct iframe — loads the full Maps payload on page load. Should be a static map that upgrades on click.
⚠️ No "Get directions" link, no coordinates, no what3words, no nearest landmark.

---

## Enquire Now (verbatim)

**H2:** Enquire Now

> [Customer Registration Form : Please click.](https://forms.gle/xYZnEyN2NqiF3ySD6)

🔴 **This is the entire enquiry mechanism on the Contact page.** There is no form. The link goes to an external **Google Form** (`forms.gle/xYZnEyN2NqiF3ySD6`).

Consequences:
- Off-brand — visitors leave the site to a Google-branded form
- No conversion tracking; GTM cannot see the submission
- Data lands in a Google Sheet outside ACDRI's governed environment — a **DPDP Act** concern for a government-promoted body
- No auto-acknowledgement to the enquirer
- No department routing
- No enquiry history or CRM
- Link text "Please click." is poor for accessibility (non-descriptive) and the label says "Customer Registration Form", which is not what a first-time visitor expects to see when they want to ask a question

This exists because the site's Contact Form 7 installation is broken — `[contact-form-7 404 "Not Found"]` renders on every page. The Google Form is a workaround for a broken plugin.

---

## What the page does not have

| Missing | Why it matters |
|---|---|
| Working contact form | Primary conversion path |
| Department-wise contacts | Testing vs prototyping vs venue vs careers vs tenders all go to one inbox |
| Office / reception hours | Visitors cannot plan a sample drop-off |
| Directions from Mumbai-Pune Highway | The address alone is insufficient in Chinchwad |
| Parking guidance | Relevant for sample delivery and event visitors |
| WhatsApp | India B2B standard |
| Map at usable zoom | See above |
| Named contact persons | For a facility with 30+ staff, no one is named on the contact page |
| Sample submission address | If different from the main address |
| GST / registration details | Frequently required by procurement teams |

---

## Media inventory

**No images on this page** apart from the global header/footer assets.
**No video.**

---

## Defects summary

| Severity | Defect |
|---|---|
| 🔴 | No contact form — replaced by an external Google Form |
| 🔴 | Phone not a `tel:` link |
| 🔴 | Emails not `mailto:` links |
| 🔴 | Map at zoom 10 — facility not visible |
| 🔴 | Map uses address query, not Place ID |
| 🟠 | Three different email addresses across the site, none explained |
| 🟠 | Non-descriptive link text ("Please click.") |
| 🟠 | Address formatting differs from the footer |
| 🟠 | Direct Maps iframe, heavy payload |
| 🟡 | No hours, directions, parking, WhatsApp or named contacts |

---

## New build

| Order | Component | Content |
|---|---|---|
| 1 | `PageHero` | H1 + H2 |
| 2 | `ContactGrid` | Address · `tel:` · `mailto:` · WhatsApp · hours — all live links |
| 3 | `DepartmentContacts` | **New** — Testing · Prototyping · Venue Hire · Careers · Tenders · General, each with a named owner and address |
| 4 | `EnquiryForm` | **Replaces the Google Form.** Fields: name, company, email, phone, department (routes the submission), subject, message, optional file upload, consent checkbox. Inline success/error states. Writes to Postgres + emails the routed team + auto-acknowledges the sender + fires a GTM event |
| 5 | `MapFacade` | Static map at zoom 16+, Place ID pinned, upgrades to interactive on click, with a "Get directions" deep link |
| 6 | `DirectionsPanel` | **New** — from Mumbai-Pune Highway, nearest landmark, parking, public transport |
| 7 | `LegalDetails` | **New** — GST / registration details for procurement |

**Schema:** `LocalBusiness` with `geo`, `openingHours`, `contactPoint` per department.

---

## Migration note

The existing Google Form (`forms.gle/xYZnEyN2NqiF3ySD6`) will have collected enquiries since the CF7 plugin broke. **Export that response sheet before decommissioning it** — it is currently ACDRI's only digital enquiry record, and it should be imported into the new `enquiries` table as historical data.
