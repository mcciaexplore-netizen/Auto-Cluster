# Design Direction — Auto Cluster (ACDRI) website rebuild

**Status:** Phase 1 deliverable. Awaiting sign-off before any page code is written.
**Visual mockups:** https://claude.ai/code/artifact/a911dc8c-7ac0-45fb-ae3d-fd68cfa55186
(hero, facility card with full state coverage, equipment spec table — rendered at real fidelity in the actual typefaces and palette)

---

## 1. Positioning

ACDRI's visitor is an engineer, a quality manager or a procurement officer at an MSME. They
arrive with a part in hand and four questions:

1. Can you test / make this?
2. To what standard?
3. What does it cost?
4. How do I get it to you?

The current site answers none of them. Its most valuable content — 30 machine records with
makes, models, capacities and ASTM/ISO standards — is locked inside modal markup that no
search engine and no casual visitor ever sees. Its only price list is a JPEG. Its
accreditation reference (`NABL ISO/IEC 17025:2017`) appears exactly once, mid-paragraph, four
pages deep.

**The design principle is therefore single and severe: specifications are the content.**
Numbers, units, standards and capacities are set as first-class typography, not as decoration
arranged around marketing copy. The reference points are a calibration certificate, an
engineering drawing sheet and a NABL scope document — not a corporate homepage.

This is a deliberate break from the current site, which has no identity beyond a WordPress
theme default. It is also a break from "generic government-institute website", which would be
equally wrong: ACDRI competes for commercial testing work against private labs, and the thing
it can prove that they often cannot is accreditation plus published capability.

### Why this positioning pays

| Asset | Where it is today | Where it goes |
|---|---|---|
| `NABL ISO/IEC 17025:2017` | One clause, RPL page body | Header strip, hero credential band, every facility card, every equipment record |
| "900+ customers, 100+ added annually" | RPL page body | Homepage credential strip, RPL hero |
| "200+ customers" (env. testing) | Env. page body | Homepage credential strip |
| "100+ exhibitions over ten years" | Exhibition page body | Homepage credential strip, venue hero |
| 30 machine records | Invisible modal library | 30 indexable `/equipment/[slug]` pages |
| Core operation rates | `Core-Operation-Rates-1.jpg` | HTML table at `/venues/rate-card` + per-machine rate line (**already transcribed** — see `docs/extracted/rate-card.md`) |

Engineers search by make, model and standard: *"Tinius Olsen UTM Pune"*, *"salt spray ASTM
B117 Pune"*, *"FTIR polymer identification Pune"*. None of that is currently indexable. That
is the single largest available gain on this project and the design is built to serve it.

---

## 2. Type system

**Two families. Three jobs.**

| Role | Family | Weights | Rationale |
|---|---|---|---|
| Display / headings | **Archivo** | 600, 700 | Squared grotesque with flat terminals and tight apertures — the character of engineering signage and instrument panels. Holds up at 44px+ and stays legible condensed into spec labels. |
| Body / UI | **IBM Plex Sans** | 400, 600 | High legibility at 17px, neutral without being anonymous, and — decisively — it is the only open superfamily with a genuine Devanagari companion drawn to the same skeleton. |
| Marathi / Hindi | **IBM Plex Sans Devanagari** | 400, 600 | Matched metrics and matched design DNA, so a language switch produces no visual jump. Held in reserve until a Marathi edition is confirmed in scope. |
| Data / labels | **IBM Plex Mono** | 400, 500 | Specification values, standard numbers, reference codes, table figures, all uppercase labels. Tabular figures wherever digits stack in a column. |

> **Correction to `00-ARCHITECTURE.md` §5.** That file proposes `Source Sans 3` as
> "Devanagari-capable". It is not — Source Sans 3 ships no Devanagari coverage. Since
> Devanagari support is explicitly a requirement for a PCMC-linked body, IBM Plex replaces it.

**Type scale** — display 44/46 · h1 36/40 · h2 28/32 · h3 22/26 · body 17/27 · small 15/22 ·
mono label 11.5/16 at 0.14em tracking. Body never below 16px. Prose measure capped at 66ch.
Display tracking −2.2%, headings −1.5%, body 0.

Self-hosted via `next/font/local` — no third-party font requests, which matters for both
performance budget and data-residency posture.

---

## 3. Colour system

### The finding: the brand is indigo, not navy

`00-ARCHITECTURE.md` §5 proposes a dark-navy palette (`#0A1A2F`) with an orange accent
(`#E0731A`), inferred from the fact that the site's logo is a white lockup on a dark header.
**Sampling the actual logo artwork contradicts this.** The mark contains no navy and no
orange.

Pixel-sampled from `logo-new-w.png`, corroborated against `favicon-1.png` and the separate
`/tenders/assets/img/logo.png`:

| Sampled | Hex | Where it appears in the mark |
|---|---|---|
| Indigo | `#393185` | "AUTO" wordmark, cupped-hands device |
| Cyan | `#00A0E3` | "CLUSTER" wordmark, steering-wheel device |
| Green | `#009846` | Steering-wheel roundel |

The palette below is derived from those three, then constrained by measured contrast.

### Tokens

```css
:root{
  /* Brand — sampled from the logo, never altered */
  --brand-indigo:#393185;   /* 10.76:1 on white — AAA */
  --brand-cyan:#00A0E3;     /* 2.94:1 on white — decorative only */
  --brand-green:#009846;    /*  3.76:1 on white — logo only */

  /* Indigo — structure */
  --indigo-900:#1B1745;     /* dark ground: header, hero, CTA bands. 16.73:1 w/ white */
  --indigo-800:#221C57;
  --indigo-600:#393185;     /* primary: headings, fills. 10.76:1 */
  --indigo-400:#6B62C4;     /*  5.04:1 on white */
  --indigo-50:#E8E6F7;

  /* Green — the one accent, actions only */
  --green-700:#007D3A;      /* CTA fill + links. 5.26:1 — AA */
  --green-800:#006831;      /* hover. 6.94:1 */
  --green-300:#3FC97C;      /* actions on dark ground. 7.85:1 on --indigo-900 */

  /* Cyan — dark grounds and data only */
  --cyan-500:#00A0E3;       /* 5.69:1 on --indigo-900 — AA. Never on white. */

  /* Ink — cool neutrals, biased toward indigo */
  --ink-900:#0E1220;        /* body text. 18.65:1 — AAA */
  --ink-700:#343B4F;        /* 11.14:1 */
  --ink-500:#4E566C;        /* secondary text. 7.31:1 */
  --ink-400:#6B7488;        /* meta text. 4.69:1 — AA */

  /* Surfaces and rules */
  --paper:#F8F9FC; --paper-2:#F1F3F7; --white:#FFFFFF;
  --rule:#C6CAD6;           /* decorative hairlines */
  --rule-strong:#8C94A6;    /* input borders. 3.04:1 — meets 1.4.11 */

  /* Status */
  --success:#007D3A;  /* 5.26:1 */   --warning:#8A5B00;  /* 5.87:1 */
  --error:#B3261E;    /* 6.54:1 */   --info:#1E5F9E;     /* 6.59:1 */
}
```

Every ratio above was computed, not estimated. Spacing, radius and shadow tokens carry over
from `00-ARCHITECTURE.md` §5 unchanged, with one amendment: **radii drop to 3px** (from
4/8/12) and shadows appear only on hover.

### The three rules that follow

1. **Green is only ever an action.** One accent, used for primary CTAs and links and nothing
   else. Brand green `#009846` measures 3.76:1 and cannot legally carry white text, so the
   *interactive* green is darkened to `#007D3A`; the brand original survives untouched in the
   logo. On dark grounds the action colour becomes `#3FC97C`.
2. **Cyan never touches white.** At 2.94:1 it fails every text threshold. It earns its place
   on indigo grounds — eyebrows, hairlines, chart series — where it reaches 5.69:1.
3. **Neutrals carry ~80% of every screen.** Paper, ink and hairline rule. Indigo is
   structure; green is the one thing you click.

---

## 4. Tone and layout

**Tone:** precise, uncluttered, confident. Declarative sentences. Units always stated. No
exclamation marks, no "cutting-edge", no "world-class". Where the source copy is broken
English it gets rewritten into plain correct English — the facts survive, the grammar does
not.

**Layout — "the datasheet".**

- **Structure comes from hairlines and alignment, not from cards floating on shadows.** 1px
  rules in `--rule`, 3px radii, shadow reserved for hover as a target signal.
- **A monospace label rail** runs down the left edge of major sections carrying the section
  index, the way a test report carries clause numbering. Numbering is used *only where the
  content is genuinely enumerated* — spec rows, rate-card lines, test methods, process steps.
  Never as decoration.
- **The spec pair is the atomic unit:** mono uppercase label, display-weight value, hairline
  beneath. It recurs at every scale — hero credential strip, facility card data row,
  equipment spec table, venue capacity table, rate card.
- **Standards are chips.** ASTM/ISO numbers in mono, bordered, scannable. This is the single
  most credibility-carrying element available and it currently appears nowhere on the site.
- **Photography over illustration**, but honestly: 2020-era, low-resolution or watermarked
  assets get a visible `[NEEDS PHOTOGRAPHY]` placeholder rather than being upscaled or faked.
- **Generous whitespace**, 64–96px section rhythm on desktop, 40–64px on mobile.

**Full state coverage** on every interactive component: default, hover, focus-visible, active,
disabled, loading, empty, error. Demonstrated on the facility card and the primary button in
the mockups. Empty and error states are written as real sentences that say what happened and
what to do next — never "Something went wrong".

### One idea worth arguing about: the correction trail

The audit found genuine technical errors in the published specifications — `1100 M` of
crosshead travel, `6000C` for 600 °C, `Shimatzu` for Shimadzu, `Itly` for Italy, a chamber
listed as 6 mm deep. We are correcting all of them.

**The equipment spec table shows its working.** The corrected value leads; the published value
is cited beneath it in small text, tagged `CORRECTED`, `VERIFY` or `NOT SUPPLIED`.

- `CORRECTED` — an unambiguous error in the source, fixed
- `VERIFY` — plausible correction applied, awaiting ACDRI confirmation
- `NOT SUPPLIED` — data does not exist yet; renders as a visible state, not a blank row

A calibration lab that silently amends its own published figures invites doubt. One that shows
the amendment trail looks like what it is: an organisation with document control. It also
converts the 8 machines that have no specifications at all from an invisible hole into a
visible, actionable client request.

---

## 5. Anti-patterns, explicitly refused

| Refused | Instead |
|---|---|
| Grey-wasteland minimalism with no anchors | Deep indigo grounds anchor header, hero and CTA bands — the page has a horizon |
| Default Inter / Roboto typography | Archivo + IBM Plex, chosen for engineering character and Devanagari coverage |
| Purple-gradient-on-white | Flat brand indigo, logo-sampled. No gradient anywhere in the system |
| Button soup | One green primary per view; everything else is a text link or ghost button |
| Decorative gradients and shadows | 1px hairlines, 3px radii. Shadow only on hover, only as a target signal |
| Specs baked into images | Every number is selectable text. The rate-card JPEG is already transcribed |
| Mobile as afterthought | 375px-first, 44px minimum targets, `tel:` in the top bar, tables scroll in their own frame |
| Placeholder numbers in production | A statistic without a verified source is not rendered. Nothing ever ships reading `1 +` |

---

## 6. Decisions needed before Phase 2

1. **The palette is indigo, not navy.** Confirm I should follow the logo rather than
   `00-ARCHITECTURE.md` §5 — and I will amend that file's token block to match.
2. **Archivo + IBM Plex** as the two families, replacing the Chivo + Source Sans 3 proposal
   (Source Sans 3 has no Devanagari, which the architecture file assumed it did).
3. **The correction trail is public.** The alternative — correcting silently — looks cleaner
   but hides that a NABL lab is publishing amended figures.
4. **Unverified statistics are omitted, not estimated.** Only 900+, 200+ and 100+ have sources
   today. The other five homepage counters stay off the page until ACDRI supplies figures.
5. **The hero headline is new copy.** The current H2, "Welcome to Auto Cluster Development and
   Research Institute", is not a proposition. Proposed: *"Testing, prototyping and exhibition
   facilities for Indian manufacturing."* The existing paragraph survives verbatim beneath it.

Open content questions are tracked separately in `CONTENT_QUESTIONS.md`.
