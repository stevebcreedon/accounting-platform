# Phase 9: Animation & Performance - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Install the `motion` library and add the polish layer: page transitions (simple fade), scroll-triggered reveals on homepage and article components, hover micro-interactions on cards/buttons/links, reading progress bar, LazyMotion for bundle optimization, prefers-reduced-motion support, and Core Web Vitals verification (Lighthouse 90+ mobile).

</domain>

<decisions>
## Implementation Decisions

### Animation Style
- **D-01:** Animation personality is **subtle editorial** — gentle fade-ins (200-400ms), slight upward slides (10-20px), minimal bounce. Stripe/Linear/Monocle feel. Content is the star, animations add polish.
- **D-02:** FAQ accordion **keeps CSS grid-rows animation** — no motion library replacement. CSS already works smoothly, adding motion just increases bundle for no visible gain.
- **D-03:** All animations respect **prefers-reduced-motion** — disable motion for users who prefer reduced motion.

### Page Transitions
- **D-04:** Routes use **simple fade** transitions — opacity fade-out/fade-in (200-300ms). Elegant, performant, zero CLS risk. Works naturally with App Router.

### Performance
- **D-05:** Site is **text-only currently** — no article hero images. Set up next/image patterns for future use but no immediate optimization needed (PERF-03).
- **D-06:** Fonts already optimized via next/font (PERF-04 from Phase 1).
- **D-07:** All content pages already use SSG via generateStaticParams (PERF-02 from Phases 2-4).
- **D-08:** **LazyMotion** with `domAnimation` features for minimal bundle. Strict client boundary — motion components only in `"use client"` files.
- **D-09:** Target **Lighthouse mobile score 90+** for Core Web Vitals (PERF-01).

### Reading Progress Bar
- **D-10:** Progress bar at **top of viewport, below sticky header** — thin burnt-orange bar filling left to right on scroll. Article pages only.

### Claude's Discretion
- Exact animation durations and easing curves
- Which homepage sections get scroll reveals (hero, articles, categories, CTA)
- Stagger delay between animated elements
- Hover animation specifics (scale, shadow transition, color shift)
- Reading progress bar height and opacity
- LazyMotion loading strategy (dynamic import pattern)
- Whether to wrap motion in a reusable component or use inline

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDE.md` — Stack: `motion` ^12 (import from `motion/react` not `framer-motion`), LazyMotion for bundle optimization

### Prior Phase Artifacts
- `.planning/phases/01-project-scaffold/01-UI-SPEC.md` — Design tokens, shadow-card-hover
- `.planning/phases/03-article-page-template/03-UI-SPEC.md` — Article component specs
- `.planning/phases/05-navigation-accessibility/05-UI-SPEC.md` — Header/footer/nav specs

### Existing Code
- `src/app/layout.tsx` — Root layout (page transitions wrap here)
- `src/app/globals.css` — Existing CSS transitions, smooth scrolling
- `src/components/article/faq-section.tsx` — CSS grid-rows accordion (keep as-is)
- `src/components/shared/article-card.tsx` — Needs hover micro-interaction
- `src/components/layout/navigation.tsx` — Nav link hover states
- `src/components/layout/header.tsx` — Sticky header (progress bar goes below)
- `tailwind.config.ts` — shadow-card, shadow-card-hover tokens

### Planning
- `.planning/PROJECT.md` — Core project context
- `.planning/REQUIREMENTS.md` — ANIM-01 through ANIM-07, PERF-01 through PERF-04

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `shadow-card` / `shadow-card-hover` tokens — card hover already has shadow transition targets
- Intersection Observer pattern (Phase 3 TOC, Phase 8 ReadTracker) — reusable for scroll reveals
- `cn()` utility — conditional class merging for animation states

### Established Patterns
- `"use client"` for browser APIs
- CSS transitions already used (FAQ accordion, mobile menu, focus rings)
- `prefers-reduced-motion` consideration from Phase 5 WCAG work

### Integration Points
- `src/app/layout.tsx` — LazyMotion provider wraps children, page transition component
- New: `src/components/motion/` — scroll reveal wrapper, page transition, progress bar
- Modify: `src/components/shared/article-card.tsx` — add hover micro-interaction
- Modify: `src/components/layout/navigation.tsx` — add link hover animation
- Modify: `src/app/page.tsx` — wrap homepage sections in scroll reveal

</code_context>

<specifics>
## Specific Ideas

- The motion layer should make the site feel "alive" without being distracting — like a premium publication, not a startup landing page
- Scroll reveals should be one-time (animate in, stay visible) — no re-triggering on scroll up
- Card hover should combine shadow elevation + slight scale (1.02x) for tactile feel
- Reading progress bar should be barely there — maybe 2-3px, burnt-orange, fades in after scrolling starts

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-animation-performance*
*Context gathered: 2026-04-06*
