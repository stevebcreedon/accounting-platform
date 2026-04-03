# Phase 5: Navigation & Accessibility - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the complete responsive layout shell: sticky header with logo and navigation, footer with 3-column layout and disclaimer, full-screen mobile menu overlay, skip-to-content link, keyboard navigation, WCAG 2.1 AA compliance, and print-friendly article styles. After this phase, the site has a polished, accessible chrome wrapping all content.

</domain>

<decisions>
## Implementation Decisions

### Header & Navigation
- **D-01:** Header is **sticky** — pinned to top on scroll. Must account for scroll-margin-top on article headings (already set to 6rem in Phase 3).
- **D-02:** Navigation links: **Guides, Find an Accountant, About** — three main links. Contact and legal pages live in footer only.
- **D-03:** Logo is **"The Ledger"** text wordmark in Satoshi — no image logo yet (placeholder per brand name decision D-11 from Phase 1).

### Footer
- **D-04:** Footer uses **3-column layout + full-width disclaimer bar below**. Column 1: brand name + tagline. Column 2: quick links (Guides, Find Accountant, About, Contact). Column 3: legal links (Privacy, Terms). Disclaimer bar from existing `DisclaimerBar` component.
- **D-05:** Existing `DisclaimerBar` component from Phase 4 moves into the footer — remove standalone placement from individual pages.

### Mobile
- **D-06:** Mobile menu is a **full-screen cream overlay** — hamburger opens immersive overlay with large nav links. Clean touch targets. Closes on link click or X button.
- **D-07:** Mobile breakpoint is **lg (1024px)** — below this, show hamburger. Above, show desktop nav links inline.

### Accessibility & Print
- **D-08:** **Skip-to-content** link as first focusable element — visually hidden until focused, jumps to `#main-content`.
- **D-09:** WCAG 2.1 AA baseline: semantic HTML landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`), sufficient color contrast (burnt-orange on cream already verified), focus indicators (burnt-orange ring already in globals.css), aria-labels on interactive elements.
- **D-10:** Print stylesheet is **article-focused** — hide header, footer, TOC sidebar, email CTA, related articles. Clean article body with readable font sizes. Irish business owners may print tax guides.

### Claude's Discretion
- Header height and padding
- Logo wordmark sizing and weight
- Mobile overlay animation (CSS transitions vs motion library — motion not yet installed)
- Footer tagline text
- Hamburger icon design (Lucide menu/x icons available)
- ARIA landmark specifics
- Print font sizes and margins
- Any scroll-margin-top adjustments for sticky header height

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Prior Phase Artifacts
- `.planning/phases/01-project-scaffold/01-UI-SPEC.md` — Design tokens, focus-visible styles
- `.planning/phases/03-article-page-template/03-UI-SPEC.md` — Article component specs, scroll-margin-top
- `.planning/phases/04-site-structure-pages/04-UI-SPEC.md` — Page layout specs

### Existing Code
- `src/app/layout.tsx` — Root layout (header/footer will be added here)
- `src/app/globals.css` — Focus-visible styles, scroll-margin-top, smooth scrolling
- `src/components/shared/disclaimer-bar.tsx` — Existing disclaimer component (moves to footer)
- `src/components/article/table-of-contents.tsx` — Has sticky positioning, needs to coordinate with sticky header

### Planning
- `.planning/PROJECT.md` — Core project context
- `.planning/REQUIREMENTS.md` — NAV-01 through NAV-04, PERF-05, PERF-06

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `DisclaimerBar` — moves into footer, remove from individual page imports
- `cn()` utility — conditional class merging
- Lucide React icons — `Menu`, `X` for hamburger, already installed
- Focus-visible ring styles already in globals.css

### Established Patterns
- Server components by default
- Tailwind v3 responsive utilities (lg: breakpoint)
- `max-w-article` (48rem) for content width
- `scroll-margin-top: 6rem` on article headings

### Integration Points
- `src/app/layout.tsx` — Add `<Header>` and `<Footer>` wrapping `{children}`
- `src/app/globals.css` — Add @media print styles
- Sticky header height affects article TOC's `top` value and heading scroll-margin-top
- Mobile menu needs `"use client"` for hamburger state

</code_context>

<specifics>
## Specific Ideas

- Header should feel minimal and authoritative — "The Ledger" wordmark is the primary brand element
- Mobile overlay should feel immersive — full cream background, centered nav links in Satoshi
- Print styles should make articles look like a professional tax guide printout

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-navigation-accessibility*
*Context gathered: 2026-04-03*
