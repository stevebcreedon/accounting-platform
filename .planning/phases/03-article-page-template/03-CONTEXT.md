# Phase 3: Article Page Template - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the complete article reading experience: a structured page with 10 sections (breadcrumbs, title, meta line, intro, TOC, body, key takeaways, FAQ, related articles, email CTA placeholder), interactive components (sticky TOC with scroll tracking, FAQ accordion), trust signals (verified badge, meta line), and generateStaticParams for build-time pre-rendering. Also completes the pillar/spoke visual distinction deferred from Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Page Layout
- **D-01:** Table of Contents uses a **sticky sidebar** — floats in a right sidebar, stays visible as user scrolls. Needs wider viewport breakpoint; collapses to inline on mobile.
- **D-02:** Email CTA placement is **Claude's discretion** — place where it makes most sense for editorial flow (after key takeaways, before FAQ is a natural option).
- **D-03:** Article body renders inside the existing `.article-content` prose class with `max-w-article` (48rem) width from Phase 1.

### Interactive Components
- **D-04:** FAQ accordion uses **one-open-at-a-time** behavior — clicking a new question closes the previous one. Cleaner for accounting FAQ content.
- **D-05:** TOC has **active section highlighting** via Intersection Observer — tracks which H2 is in view and highlights the corresponding link in the sticky sidebar.
- **D-06:** FAQ section includes **JSON-LD FAQPage schema** (ART-04) for rich snippet eligibility.

### Trust Signals & Meta
- **D-07:** "Last verified" badge uses **tax year format**: "Verified for 2025/26 tax year" — Ireland-specific, signals content is current for the active tax year. Only shows when `updatedDate` exists in frontmatter.
- **D-08:** Category pill in meta line is a **clickable link** to `/guides/category/{slug}`. Category pages are built in Phase 4; link works once those exist.
- **D-09:** Meta line shows: published date, updated date (if exists), reading time, category pill, and verified badge (if updatedDate exists).

### Pillar vs Spoke
- **D-10:** Pillar articles get a **"Comprehensive Guide" badge + enhanced header** treatment — prominent badge near the title, plus a slightly different header (e.g., larger title, category-colored accent bar). Spoke articles use the standard layout.

### Claude's Discretion
- Email CTA exact placement and styling
- Specific section spacing and visual rhythm
- TOC sidebar width and breakpoint
- FAQ animation/transition style
- Related article card layout (use existing card shadow tokens)
- Breadcrumb separator and styling
- Key takeaways box design
- Enhanced header treatment details for pillar articles
- Mobile responsive adaptations for all sections

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDEacc.md` — Original build spec with component list, article template sections
- `ClearCount-ie-Complete-Spec.docx` — Full business spec with article structure requirements

### Prior Phase Artifacts
- `.planning/phases/01-project-scaffold/01-CONTEXT.md` — Brand decisions (cream/charcoal/burnt-orange, Satoshi/DM Sans, editorial spacing, card shadow tokens)
- `.planning/phases/01-project-scaffold/01-UI-SPEC.md` — UI design contract (spacing, typography scale, color palette, accent usage rules)
- `.planning/phases/02-content-pipeline/02-CONTEXT.md` — Content pipeline decisions (Zod schema, categories, pillar/spoke data, scheduled publishing)

### Existing Code
- `tailwind.config.ts` — Design tokens, prose overrides, card shadows
- `src/app/globals.css` — `.article-content` prose class
- `src/lib/content/queries.ts` — Query functions (getGuideBySlug, getAllGuides, getReadingTime, getPillarGuides)
- `src/lib/content/categories.ts` — 8 category definitions with slugs, descriptions, emoji
- `src/components/mdx/mdx-content.tsx` — MDX renderer component
- `velite.config.ts` — Content schema (toc field available for TOC generation)

### Planning
- `.planning/PROJECT.md` — Core project context and constraints
- `.planning/REQUIREMENTS.md` — ART-01 through ART-08 + CONT-04 are this phase's requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/mdx/mdx-content.tsx` — MDX renderer, can be extended with custom component mapping for KeyTakeaways, FAQSection
- `src/lib/content/queries.ts` — `getGuideBySlug()` returns full Guide with toc, metadata, relatedSlugs, isPillar
- `src/lib/content/categories.ts` — Category lookup by slug for breadcrumbs and category pills
- `src/lib/utils.ts` — `cn()` utility for conditional class merging
- `tailwind.config.ts` — `shadow-card`, `shadow-card-hover` tokens ready for related article cards

### Established Patterns
- Tailwind v3 with `@tailwindcss/typography` prose plugin
- `.article-content` class for long-form content styling
- `max-w-article` (48rem) for content width
- next/font for DM Sans (body) and Satoshi (headings)
- Server components by default (App Router)

### Integration Points
- New route: `src/app/guides/[slug]/page.tsx` — article page with generateStaticParams
- New components: `src/components/article/` — Breadcrumbs, MetaLine, TOC, KeyTakeaways, FAQSection, RelatedArticles, EmailCTA
- MDX custom components: KeyTakeaways + FAQSection mapped via MDXContent component props
- Velite `toc` field: auto-generated table of contents data available on each Guide

</code_context>

<specifics>
## Specific Ideas

- The sticky sidebar TOC should feel like a premium editorial reading experience (think Stripe docs, MDN)
- FAQ accordion should use smooth animations — motion library can be installed if needed, or CSS transitions
- The "Comprehensive Guide" badge for pillar articles should be prominent but not overwhelming
- Tax year format for verified badge is Ireland-specific (runs April-December for income tax)
- Category pill links to `/guides/category/{slug}` which won't exist until Phase 4 — ensure graceful handling

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-article-page-template*
*Context gathered: 2026-04-03*
