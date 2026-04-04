---
phase: 05-navigation-accessibility
plan: 02
subsystem: ui
tags: [layout-integration, print-styles, accessibility, responsive, skip-link, root-layout]

requires:
  - phase: 05-navigation-accessibility
    provides: SkipToContent, Header, Footer, Navigation, MobileMenu layout components
  - phase: 04-site-structure
    provides: 9 page files with DisclaimerBar imports and <main> wrappers
provides:
  - Root layout shell with SkipToContent, Header, main#main-content, Footer
  - All 9 page files migrated to use root layout (no nested main, no DisclaimerBar)
  - Print styles hiding nav/footer with serif typography for article pages
affects: [06-seo-metadata, 09-animation]

tech-stack:
  added: []
  patterns: [root layout shell pattern (SkipToContent > Header > main#main-content > Footer), print media query with serif fallback and URL expansion]

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/globals.css
    - src/app/page.tsx
    - src/app/about/page.tsx
    - src/app/contact/page.tsx
    - src/app/find-accountant/page.tsx
    - src/app/guides/page.tsx
    - src/app/guides/category/[slug]/page.tsx
    - src/app/privacy/page.tsx
    - src/app/terms/page.tsx
    - src/app/not-found.tsx

key-decisions:
  - "pt-16 on main#main-content to clear fixed header height"
  - "bg-cream stays on body in root layout, removed from individual page main wrappers"

patterns-established:
  - "Root layout owns all structural elements: skip-link, header, main, footer"
  - "Page components return fragments (<>) not <main> wrappers"
  - "Print styles at end of globals.css outside @layer blocks"

requirements-completed: [NAV-03, PERF-05, PERF-06]

duration: 3min
completed: 2026-04-04
---

# Phase 5 Plan 2: Layout Integration Summary

**Root layout shell wired with sticky header, footer, skip-to-content, 9 page files migrated to fragments, and print styles hiding nav with serif typography**

## Performance

- **Duration:** 3 min (across two sessions with human verification checkpoint)
- **Started:** 2026-04-03T23:21:00Z
- **Completed:** 2026-04-04T19:11:23Z
- **Tasks:** 3 (2 auto + 1 human-verify)
- **Files modified:** 11

## Accomplishments
- Root layout now renders SkipToContent, Header, main#main-content (pt-16 min-h-screen), and Footer around all page children
- All 9 page files migrated: removed DisclaimerBar imports and <main> wrapper tags, replaced with fragments
- Print styles added to globals.css: hides header/footer/nav, applies Georgia serif font, expands URLs for article links, 2cm page margins
- Human verification confirmed: sticky header, active link detection, mobile menu, footer layout, skip-link, keyboard navigation, print view, 375px responsive, no duplicate disclaimers

## Task Commits

Each task was committed atomically:

1. **Task 1: Update root layout and migrate all 9 page files** - `d83086c` (feat)
2. **Task 2: Add print styles and verify build** - `0737b6d` (feat)
3. **Task 3: Visual and accessibility verification** - user approved (checkpoint, no commit)

## Files Created/Modified
- `src/app/layout.tsx` - Root layout with SkipToContent, Header, main#main-content, Footer imports and structure
- `src/app/globals.css` - Print styles block at end of file
- `src/app/page.tsx` - Removed DisclaimerBar and main wrapper
- `src/app/about/page.tsx` - Removed DisclaimerBar and main wrapper
- `src/app/contact/page.tsx` - Removed DisclaimerBar and main wrapper
- `src/app/find-accountant/page.tsx` - Removed DisclaimerBar and main wrapper
- `src/app/guides/page.tsx` - Removed DisclaimerBar and main wrapper
- `src/app/guides/category/[slug]/page.tsx` - Removed DisclaimerBar and main wrapper
- `src/app/privacy/page.tsx` - Removed DisclaimerBar and main wrapper
- `src/app/terms/page.tsx` - Removed DisclaimerBar and main wrapper
- `src/app/not-found.tsx` - Removed DisclaimerBar and main wrapper

## Decisions Made
- Applied pt-16 to main#main-content to clear the fixed header height
- Kept bg-cream on body element in root layout rather than on individual page main wrappers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all layout integration is fully wired with no placeholder content.

## Next Phase Readiness
- Complete layout shell is live on all pages with header, footer, skip-link, and print support
- Ready for Phase 6 SEO metadata (generateMetadata, sitemap.ts, JSON-LD) which builds on this layout
- All WCAG 2.1 AA requirements met for navigation and layout

## Self-Check: PASSED

- FOUND: src/app/layout.tsx
- FOUND: src/app/globals.css
- FOUND: d83086c (Task 1 commit)
- FOUND: 0737b6d (Task 2 commit)

---
*Phase: 05-navigation-accessibility*
*Completed: 2026-04-04*
