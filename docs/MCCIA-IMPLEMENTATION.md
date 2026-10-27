# Auto Cluster service-platform update

Implemented from the latest MCCIA briefing supplied in this task. The briefing is a requirements source, not verification of domain status, chamber capabilities or legal compliance. No meeting date, owner names or unconfirmed provider names have been invented.

## What is available locally

| Requirement | Implementation | Review route |
| --- | --- | --- |
| Simplified India/MSME landing page | Short technical introduction, facilities and venue actions, links to services | `/` |
| Variable service forms | Existing manufacturing/testing/careers enquiries retained; structured venue and startup fields added, with server validation | `/contact`, `/venues/book`, `/startups` |
| Enquiry queue | Search by reference, contact, company or service; status, department, ownership and routing filters; 25 records per page | `/staff/enquiries` |
| Enquiry ownership | Super-admin, marketing and HOD users assign eligible active staff; assignment and status changes recorded in history; stale edits rejected | `/staff/enquiries/[id]` |
| Venue requests | Venue, room use, IST start/end, attendee count, event category, floor-plan/Wi-Fi/parking requests; private status URL | `/venues/book` |
| Booking review | Venue-manager approval of final quotation; overlapping approved dates blocked for the same venue; searchable approval/payment queues | `/staff/bookings` |
| Payment handoff | Accounts can attach an approved hosted-payment URL; customer opens it from the private booking page; accounts records a verified receipt | `/staff/bookings`, `/bookings/[token]` |
| Private plans and guidelines | Staff PDF uploads outside `public/`; staff authentication or a matching approved booking required for download; plans additionally require a floor-plan request | `/staff/venues` |
| Fixed rates | One approved amount per machine/venue, unit, effective date and tax terms; future rates take effect on their date; old discount ranges removed from public pages | `/rate-card`, `/staff/rates` |
| Events | Staff creates/edits drafts and published pages, opens/closes free registration and views attendees | `/events`, `/staff/events` |
| Event passes | Capacity-checked registration issues a private pass URL; duplicates and closed/draft/past events cannot issue new passes | `/events/[slug]`, `/events/pass/[token]` |
| Startup module | Dedicated page and structured applications persisted in staff enquiries | `/startups` |
| Media | Category filters for videos, flyers, service posters, publications and galleries; approved external/local asset links; existing MD video and Life at Auto Cluster links | `/media`, `/staff/media` |
| Staff access | Existing sign-in extended with role-based landing pages and staff-account creation | `/staff/login`, `/staff/users` |
| Cookie exposure | Google Maps is click-to-load; no default analytics ID; public photos and fonts use same-origin assets at runtime | `/contact` |

The historical rate figures remain in source files for audit and unit hints. They are **not** treated as approved fixed charges. No initial fixed rates, fictional events, fictional publications, room capacities or new testing specifications were seeded.

## Staff setup and review

1. Copy `.env.example` to `.env.local`, set a strong `STAFF_SESSION_SECRET`, and configure the intended site URL.
2. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD` (at least 12 characters) and optionally `ADMIN_NAME` in the shell; run `npm run seed:admin` to create the initial super-admin. The existing seed command can overwrite that account's password, so use it deliberately.
3. Sign in at `/staff/login`. Create named venue-manager, accounts and editor accounts through `/staff/users`.
4. Verify enquiry recipients in `/staff/settings/routing`, including the new startup service. Existing mappings are preserved when a new service is added.
5. Publish approved fixed rates through `/staff/rates`, including tax terms and effective dates.
6. Upload approved PDF plans and room rules through `/staff/venues`. Put confirmed Wi-Fi, parking and access details in the guidelines. Floor plans must not be published through the media library.
7. Create draft events and media items, review their content, then publish them through the staff console. Registration is free in this implementation; there is no assumed paid-event tariff.
8. Review a test venue request. Approve its final total using a venue-manager account, then switch to the separate accounts user for payment tasks.

The super-admin can approve bookings and administer users but cannot record payments. Accounts can record payments but cannot approve bookings. This separation is enforced in the server functions as well as the UI.

### Enquiry handling

Super-admin and marketing staff can view all enquiry departments. HOD staff see their configured department; an HOD without a department sees no enquiries. Venue managers see venue enquiries, and training coordinators see training enquiries. Accounts and editor roles cannot open the enquiry queue. Accounts accesses venue bookings through its separately authorized booking queue. These restrictions apply to server reads and writes, including direct detail URLs and modified filters.

Use the Unassigned filter to find requests needing an owner. Open a request and select an active staff member who can access its department. Assigning a new request changes its status to Assigned. Clearing the owner returns an Assigned request to New; later statuses are preserved. Historical requests without assignment fields are treated as unassigned. Ownership is an internal record; assigning someone does not send an email or change the configured routing inbox.

Status and ownership forms reject stale values if another staff member changed that field while the page was open. Refresh before retrying. Assignment history records the actor and previous/new owner identifiers; displayed dates use IST. Venue approval and payment are separate from the general enquiry status.

## Payment integration boundary

`PAYMENT_LINK_HOSTS` is an exact-host allowlist for HTTPS payment URLs issued by the chosen merchant provider. It is empty by default, so unconfigured checkout links cannot be published or followed from the booking page. No card data is collected by this application.

The provider must first be identified and the merchant account approved. Accounts then creates a hosted link for the approved total and attaches it to the booking. Opening or returning from that link never marks a booking paid. The current receipt step is a manual accounts verification against the provider.

This is a hosted-payment handoff, not a completed gateway integration. Automated order creation, signed webhooks, reconciliation, refunds and paid-event registration require provider details, credentials and agreed rules. “Hallchip” has not been assumed to mean any particular service.

## Required inputs and launch work

| Input / decision | Why it is still needed |
| --- | --- |
| Meaning and destination of “ETA” | The unclear acronym has not been placed on a public button; the page offers a requirements enquiry instead. |
| Meaning of “Hallchip” and selected payment provider | Required for a provider-specific booking/payment integration. |
| Meaning of “pass events” | Current pages support upcoming/past events and attendee passes. Confirm whether the briefing intended a different event flow. |
| Approved fixed rates and tax treatment | Existing min/max prices do not establish the new fixed tariff. |
| Verified chamber specifications | “MFME”, “high-cloth”, chemical and pressure claims are not sufficient to publish new capability/specification data. |
| Approved plans, rules and amenity information | No floor-plan geometry, room rules or Wi-Fi availability is fabricated. Conference/VC are requested uses of existing venues, not newly invented rooms. |
| Real events and approved media assets | Content creation and publication controls are ready; missing factual content remains unpopulated. |
| Main domain and startup domain/subdomain | `/startups` is a separate local module. DNS, domain registration/renewal and a separate startup host are not configured. |
| Startup programme/account requirements | Programme eligibility, resource access and any applicant account system need defined requirements; the current module takes applications. |
| Exact pages affected by the reported compliance issue | No unspecified product page was deleted on the strength of a garbled transcript. The automatic map embed was removed. |
| Approved privacy/terms text, retention and consent decisions | Existing policy pages are still awaiting approved text. Map gating and policy links do not establish legal compliance. |
| Named approvers | Leadership review, rate approval, media approval and final launch sign-off need named owners. |
| AWS account, budget, region and operational owner | No cloud resource has been purchased or deployed. |
| Email provider and sending-domain configuration | Without `RESEND_API_KEY`, delivery is skipped. Forms report saved requests without claiming email delivery. |

## Persistence and deployment

The existing file store remains the local implementation. It writes JSON under `.data/db/`; venue PDFs live under `.data/venue-documents/`. Booking tokens and event-pass tokens are private bearer links and are excluded from indexing. Do not log or publish them.

The store serializes writes **within one Node process only**. Tests exercise that guarantee. It is not a distributed database: multi-process/multi-instance deployment, ephemeral serverless filesystems and simultaneous separate deployments are not supported safely. Migrate the active schemas and transactions to a durable database before a public service launch, and use private object storage with authenticated or short-lived signed downloads for documents. Back up records and files together.

Payload remains unconnected. Its old collections are architectural scaffolding, not a drop-in representation of all the active booking/event/rate records added here. Its venue upload relationships now point at a private document collection; migrate and review access rules before connecting it. Existing public-media records must not be repurposed for private plans.

Production also needs a final origin in `NEXT_PUBLIC_SITE_URL`, TLS, configured staff and scheduler secrets, verified email routing, provider webhook decisions, backups, monitoring, data-retention rules and a full launch security review. Approval of the briefing does not supply the missing account credentials or budget decisions.

## Verification

- `npm test`: 17 passing tests covering structured validation, persistence, role separation, concurrent booking approval, payment URLs and receipt recording, private document access, concurrent event capacity, duplicate/closed registration, effective rates, API errors, scoped enquiry reads/writes, assignment eligibility, concurrent staff edits, combined queue filters and legacy unassigned records. Tests use an isolated temporary data directory.
- `npm run typecheck`: passed.
- `npm run build`: final production compilation, type checking and generation of 83 pages passed.
- Browser: desktop/mobile homepage, mobile venue form and inline validation, media category filtering and map absent before consent checked. No horizontal page overflow at a 390-pixel viewport on the homepage and booking form.
- Staff browser review: used 29 synthetic enquiries and temporary accounts in a separate data directory. Verified sign-in, pagination, search, owner assignment, status updates and history, payment filtering, department-restricted lists, denied cross-department detail access and hidden unauthorized controls. Staff booking, enquiry-list and detail pages had no horizontal page overflow at a 390-pixel viewport. Temporary accounts and records were removed after review.
- Production HTTP smoke checks passed for 11 routes, including public pages, staff redirects, forbidden private documents and missing booking URLs.
- No live financial transaction, public deployment, domain purchase, AWS provisioning or external message was performed.
