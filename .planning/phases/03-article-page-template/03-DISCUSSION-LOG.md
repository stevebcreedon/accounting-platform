# Phase 3: Article Page Template - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 03-article-page-template
**Areas discussed:** Page layout & sections, Interactive components, Trust signals & meta, Pillar vs spoke visual treatment

---

## Page Layout & Sections

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky sidebar (Recommended) | TOC floats in sidebar, stays visible on scroll | ✓ |
| Inline before content | TOC as static block between intro and body | |
| You decide | Claude picks best approach | |

**User's choice:** Sticky sidebar
**Notes:** Common on editorial sites like MDN, Stripe docs.

---

| Option | Description | Selected |
|--------|-------------|----------|
| After key takeaways, before FAQ | Natural conversion point | |
| After FAQ, before related articles | Bottom of article, less intrusive | |
| Both mid-article + bottom | More aggressive capture | |
| You decide | Claude places where it makes sense | ✓ |

**User's choice:** Claude's discretion
**Notes:** User trusts Claude to place CTA in optimal editorial flow position.

---

## Interactive Components

| Option | Description | Selected |
|--------|-------------|----------|
| One open at a time | Clicking new question closes previous | ✓ |
| Multiple open | Each question toggles independently | |
| You decide | Claude picks best behavior | |

**User's choice:** One open at a time
**Notes:** Cleaner for accounting FAQ content, prevents page getting too long.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, active section highlighted (Recommended) | Intersection Observer tracks current H2 | ✓ |
| No, static links only | Just clickable links, no tracking | |
| You decide | Claude decides based on complexity vs UX | |

**User's choice:** Active section highlighting
**Notes:** Standard for editorial sites, uses Intersection Observer.

---

## Trust Signals & Meta

| Option | Description | Selected |
|--------|-------------|----------|
| Tax year format (Recommended) | "Verified for 2025/26 tax year" | ✓ |
| Date format | "Last verified: March 2026" | |
| Both combined | Full date + tax year | |
| You decide | Claude picks best format | |

**User's choice:** Tax year format
**Notes:** Ireland-specific, signals content currency for active tax year.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, clickable link (Recommended) | Links to /guides/category/{slug} | ✓ |
| No, display only | Just a styled label | |
| Link but handle missing page | Link with fallback | |

**User's choice:** Clickable link
**Notes:** Aids navigation and internal linking for SEO. Category pages built in Phase 4.

---

## Pillar vs Spoke Visual Treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Comprehensive Guide badge + enhanced header | Prominent badge + different header treatment | ✓ |
| Badge only | Small pill badge near meta line | |
| No on-page difference | Distinction only in listings | |
| You decide | Claude picks best treatment | |

**User's choice:** Comprehensive Guide badge + enhanced header
**Notes:** Prominent but not overwhelming, with category-colored accent bar.

---

## Claude's Discretion

- Email CTA exact placement and styling
- Section spacing and visual rhythm
- TOC sidebar width and breakpoint
- FAQ animation/transition style
- Related article card layout
- Breadcrumb separator and styling
- Key takeaways box design
- Enhanced header details for pillar articles
- Mobile responsive adaptations

## Deferred Ideas

None — discussion stayed within phase scope
