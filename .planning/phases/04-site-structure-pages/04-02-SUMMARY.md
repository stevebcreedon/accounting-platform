---
phase: 04-site-structure-pages
plan: 02
subsystem: ui
tags: [nextjs, react, tailwind, client-component, filtering, static-params]

requires:
  - phase: 04-01
    provides: shared ArticleCard and DisclaimerBar components
  - phase: 02-02
    provides: content query functions (getAllGuides, getGuidesByCategory, getReadingTime)
  - phase: 02-01
    provides: categories config (CATEGORIES, getCategoryBySlug, getAllCategorySlugs)
provides:
  - Guides hub page at /guides with client-side category filtering
  - FilterPills client component with SerializedGuide type
  - 8 category archive pages at /guides/category/[slug]
affects: [05-navigation, 06-seo, 09-animation]

tech-stack:
  added: []
  patterns: [client-side filtering via useState with serialized server data, generateStaticParams for category archives]

key-files:
  created:
    - src/components/shared/filter-pills.tsx
    - src/app/guides/page.tsx
    - src/app/guides/category/[slug]/page.tsx
  modified:
    - src/components/article/breadcrumbs.tsx

key-decisions:
  - "Breadcrumbs articleTitle made optional to support category archive pages without final crumb"
  - "FilterPills is the only use client component in Phase 4 -- all pages are server components"

patterns-established:
  - "SerializedGuide interface: strip MDX body before passing to client components"
  - "Category archives use generateStaticParams from getAllCategorySlugs for static pre-rendering"

requirements-completed: [PAGE-02, PAGE-03]

duration: 1min
completed: 2026-04-03
---

# Phase 4 Plan 2: Guides Hub & Category Archives Summary

**Guides hub with 9-pill client-side category filter and 8 statically-generated category archive pages**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-03T21:45:46Z
- **Completed:** 2026-04-03T21:47:11Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Guides hub at /guides renders all published articles with category filter pills (All + 8 categories)
- Client-side filtering narrows article grid without page reload using useState
- 8 category archive pages at /guides/category/[slug] with generateStaticParams pre-rendering
- Breadcrumbs made flexible (optional articleTitle) for reuse on category pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Build guides hub with filter pills** - `1aecac8` (feat)
2. **Task 2: Build category archive pages** - `83b8536` (feat)

## Files Created/Modified
- `src/components/shared/filter-pills.tsx` - Client component for category filtering with SerializedGuide type
- `src/app/guides/page.tsx` - Guides hub server page with serialized data passing to FilterPills
- `src/app/guides/category/[slug]/page.tsx` - Category archive pages with generateStaticParams for all 8 categories
- `src/components/article/breadcrumbs.tsx` - Made articleTitle optional for category archive breadcrumbs

## Decisions Made
- Made Breadcrumbs articleTitle optional (Rule 3 deviation) so category archives can show Home > Guides > Category without a final article crumb
- FilterPills receives SerializedGuide[] (stripped of MDX body) to keep client bundle small

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Made Breadcrumbs articleTitle optional**
- **Found during:** Task 1 (preparing for Task 2 category archive usage)
- **Issue:** Breadcrumbs required articleTitle prop, but category archives need breadcrumbs without an article crumb
- **Fix:** Added `?` to articleTitle in BreadcrumbsProps interface, conditionally render final crumb
- **Files modified:** src/components/article/breadcrumbs.tsx
- **Verification:** TypeScript compiles, build succeeds, existing article pages unaffected
- **Committed in:** 1aecac8 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Plan anticipated this change. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All browsing pages complete: guides hub, category archives, article pages
- Ready for Phase 04-03 (remaining pages: homepage, find-accountant, static pages, 404)
- FilterPills pattern established for any future client-side filtering needs

---
*Phase: 04-site-structure-pages*
*Completed: 2026-04-03*
