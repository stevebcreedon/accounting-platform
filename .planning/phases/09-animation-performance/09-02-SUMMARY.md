---
phase: 09-animation-performance
plan: 02
subsystem: ui
tags: [motion, animation, scroll-reveal, page-transition, reading-progress, framer-motion]

# Dependency graph
requires:
  - phase: 09-animation-performance/01
    provides: "Motion components (MotionProvider, PageTransition, ScrollReveal, ReadingProgressBar)"
provides:
  - "Fully animated site: page transitions, scroll reveals, reading progress bar"
  - "All motion components wired into layout and pages"
affects: [10-launch-readiness]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client component wrappers around server component children for animation"
    - "MotionProvider > PageTransition in root layout for page-level fade-in"
    - "ScrollReveal wrapping sections with staggered delays for scroll-triggered animations"
    - "ReadingProgressBar as first child in article page fragment"

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/app/guides/[slug]/page.tsx
    - src/app/guides/page.tsx
    - src/app/guides/category/[slug]/page.tsx

key-decisions:
  - "All page files remain server components -- motion client components imported as children"

patterns-established:
  - "ScrollReveal wrapper pattern: wrap entire <section> elements, stagger with delay={0.1}"
  - "ReadingProgressBar placement: first element in page fragment, before JsonLd"

requirements-completed: [ANIM-01, ANIM-02, ANIM-05, PERF-01, PERF-02, PERF-03, PERF-04]

# Metrics
duration: 2min
completed: 2026-04-06
---

# Phase 9 Plan 2: Page Animation Wiring Summary

**MotionProvider + PageTransition in root layout, ScrollReveal on all content pages, ReadingProgressBar on article pages -- SSG verified**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-06T10:07:52Z
- **Completed:** 2026-04-06T10:10:22Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Root layout wraps page content in MotionProvider > PageTransition for fade-in on navigation
- Homepage has 4 ScrollReveal-wrapped sections with staggered delays (hero, latest guides, browse by topic, email CTA)
- Article pages display a burnt-orange reading progress bar below the header and ScrollReveal on related articles
- Guides hub and category archive pages wrapped in ScrollReveal
- All pages remain server components (no "use client" added to any page file)
- Build passes with all static routes generated (SSG intact)

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire MotionProvider and PageTransition into root layout** - `91de728` (feat)
2. **Task 2: Add ScrollReveal and ReadingProgressBar to all pages** - `3589f77` (feat)

## Files Created/Modified
- `src/app/layout.tsx` - Added MotionProvider and PageTransition wrapping children inside main
- `src/app/page.tsx` - 4 homepage sections wrapped in ScrollReveal with staggered delays
- `src/app/guides/[slug]/page.tsx` - ReadingProgressBar added, related articles wrapped in ScrollReveal
- `src/app/guides/page.tsx` - Guides hub content wrapped in ScrollReveal
- `src/app/guides/category/[slug]/page.tsx` - Category archive content wrapped in ScrollReveal

## Decisions Made
- All page files remain server components -- motion client components are imported as children following standard App Router pattern

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all motion components are fully wired with real functionality.

## Next Phase Readiness
- All animations active across the site
- Phase 09 (animation-performance) complete
- Ready for Phase 10 (launch readiness)

---
*Phase: 09-animation-performance*
*Completed: 2026-04-06*
