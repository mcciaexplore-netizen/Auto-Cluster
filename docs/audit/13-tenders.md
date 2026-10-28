# Tenders

| | |
|---|---|
| Current URL | `/tenders/` → New: `/tenders` |
| Current `<title>` | `Login` |
| Platform | 🔴 **Separate PHP application — not WordPress** |

---

## The architectural finding

`/tenders/` is not a page on the WordPress site. It is a **standalone PHP application** sharing the domain. Evidence:

| Signal | Value |
|---|---|
| Page title | `Login` (not `… – autoclusterpune`) |
| Viewport meta | `width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no` — **different from every WordPress page** |
| Generator meta | **absent** (no WordPress fingerprint) |
| Google Tag Manager | **absent** — no analytics on this application at all |
| Logo asset | `/tenders/assets/img/logo.png` — its own copy, not the WP media library |
| Routing pattern | `/tenders/login/auth_forgot_password`, `/tenders/login/register` — CodeIgniter-style controller/method routing |
| Design language | Bootstrap-style login card, unrelated to the main site |

`maximum-scale=1, shrink-to-fit=no` is itself an accessibility failure — it blocks pinch-zoom on mobile (WCAG 1.4.4).

---

## Current content (verbatim)

**Logo:** `https://autoclusterpune.org/tenders/assets/img/logo.png` — alt `logo`

**H4:** Login

**Form fields:**
```
Username / Mobile
Password
[Forgot Password?]  → /tenders/login/auth_forgot_password
[Login]
```

**Footer text:**
> Don't have an account? [Create One](https://autoclusterpune.org/tenders/login/register)

That is the entire public surface. **No tender is visible without registering an account.**

---

## The second tender system

The main WordPress site has its *own* tender modal, present in the DOM of every page:

> **Tenders & Notices**
> Download the PDF file to view the Tender/Notice. [Download]

🔴 That Download link points to:
```
http://localhost/staging/wp-content/uploads/2020/11/dummy-PDF.pdf
```

A `localhost` URL, over HTTP, to a file literally named **dummy-PDF**. It has been broken since launch.

**So ACDRI has two tender systems and both fail the user:**
1. The WordPress modal → dead `localhost` link
2. The PHP portal → login wall before any tender can even be seen

---

## Why the login wall is the bigger problem

ACDRI is promoted by the **Ministry of Commerce and Industry, Government of India**, and supported by **PCMC** and the **Government of Maharashtra**. Public procurement transparency norms — and the plain expectation for a government-linked body — are that **tender notices are publicly viewable**. Registration should be required to *submit* a bid, not to *read* the notice.

Practical consequences:
- Vendors cannot assess whether a tender is relevant before creating an account
- Tender notices are invisible to Google, so vendors searching for them find nothing
- No GTM on this application means ACDRI has zero visibility into tender traffic
- The main site's own tender link has never worked

---

## Defects summary

| Severity | Defect |
|---|---|
| 🔴 | Tender notices behind a login wall on a government-promoted body's site |
| 🔴 | WordPress tender modal → `http://localhost/staging/…/dummy-PDF.pdf` |
| 🔴 | Two disconnected tender systems, neither functional for a visitor |
| 🔴 | `maximum-scale=1, shrink-to-fit=no` blocks pinch-zoom (WCAG 1.4.4) |
| 🟠 | No analytics on the application |
| 🟠 | Entirely different visual identity from the main site |
| 🟠 | Page title is just "Login" |
| 🟠 | Duplicate logo asset outside the media library |
| 🟡 | No tender listing, no archive, no closing dates, no EMD info |

---

## New build

**Recommended approach — rebuild inside the main site (Option 1 in `00-ARCHITECTURE.md` §4).**

### `/tenders` — public, no login

Filterable list. Each row:

| Field | Notes |
|---|---|
| Reference number | |
| Title | |
| Category | Works / Goods / Services |
| Published date | |
| Closing date | with a live countdown |
| EMD amount | |
| Documents | PDF download, public |
| Status | Open / Closing soon / Closed |
| Contact person | Name, email, phone |

Filters: status · category · closing date. Archive of closed tenders retained for transparency.

### `/tenders/[ref]` — individual tender page

Full description, downloadable documents, eligibility, submission instructions, and a "Submit a bid" action that prompts login **only at that point**.

### `/tenders/portal` — vendor area (authenticated)

Registration, profile, document upload, bid submission, submission history. This is where the existing PHP application's functionality belongs.

### Payload schema

```ts
tenders: {
  refNo, title, description: richText, category,
  publishedDate, closingDate, emdAmount,
  documents: [upload],           // public
  status: 'open' | 'closed',
  contactPerson: { name, email, phone },
  isPublic: true                 // default — notices are always viewable
}
```

**Schema.org:** `GovernmentService` / `Article` per tender, plus `BreadcrumbList`.

---

## Migration checklist

- [ ] Obtain source code and database access for the existing `/tenders/` PHP application
- [ ] Identify who maintains it — it may be a different vendor from the WordPress site
- [ ] Export existing vendor registrations and migrate accounts (with a password reset flow)
- [ ] Export historical tenders and republish the archive publicly
- [ ] Fix or remove the WordPress `localhost` tender modal (this can and should be done immediately, ahead of the rebuild)
- [ ] Confirm with ACDRI's procurement team whether any tender content is genuinely restricted, or whether all notices can be public
- [ ] Add GTM to the tender routes
- [ ] Remove `maximum-scale=1, shrink-to-fit=no`
