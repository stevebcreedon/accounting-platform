---
phase: 02-content-pipeline
plan: 02
subsystem: content
tags: [velite, mdx, queries, scheduled-publishing, irish-accounting, vat, sole-trader]

requires:
  - phase: 02-content-pipeline plan 01
    provides: Velite MDX pipeline with strict Zod schema, category configs, MDXContent renderer, #site/content path alias
provides:
  - Content query abstraction layer with 7 typed functions (getAllGuides, getGuideBySlug, getGuidesByCategory, getCategories, getPillarGuides, getFeaturedGuides, getReadingTime)
  - Guide type export for downstream consumers
  - Scheduled publishing gate (isPublished filters all public queries)
  - 3 sample MDX articles with real Irish accounting content (2 published, 1 future-dated)
  - End-to-end verified content pipeline (MDX authoring -> Zod validation -> Velite compilation -> query consumption)
affects: [03-article-pages, 04-navigation, 06-seo, 10-deployment]

tech-stack:
  added: []
  patterns: [query-abstraction-over-velite-output, date-string-comparison-for-utc-safety, isPublished-gate-on-all-public-queries]

key-files:
  created: [src/lib/content/queries.ts, content/guides/how-to-register-for-vat-in-ireland.mdx, content/guides/sole-trader-vs-limited-company-ireland.mdx, content/guides/what-does-an-accountant-cost-ireland.mdx]
  modified: []

key-decisions:
  - "isPublished uses .slice(0,10) on both publishDate and today for UTC-safe string comparison"
  - "getReadingTime computes from wordCount/200 not Velite metadata.readingTime (WPM rate may differ)"
  - "slug field required in MDX frontmatter (Velite s.slug does not auto-derive from filename)"
  - "Future-dated article (2027-01-01) verifies scheduled publishing exclusion at build time"

patterns-established:
  - "All content access through queries.ts -- never import .velite directly in pages"
  - "Every public query function filters through isPublished gate"
  - "Date comparison as YYYY-MM-DD string slices to avoid timezone drift"
  - "MDX frontmatter must include explicit slug field matching filename"

requirements-completed: [CONT-02, CONT-03, CONT-06]

duration: 5min
completed: 2026-04-03
---

# Phase 2 Plan 2: Content Query Layer and Sample Articles Summary

**Typed content query functions with scheduled publishing gate and 3 real Irish accounting articles (VAT registration pillar, business structures spoke, accountant costs future-dated)**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-03T19:16:15Z
- **Completed:** 2026-04-03T19:20:46Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Content query abstraction layer with 7 exported functions and Guide type -- all public functions filter through isPublished gate
- 3 sample articles with real Irish accounting content: VAT registration (1063 words, pillar), sole trader vs ltd company (952 words, spoke), accountant costs (792 words, future-dated spoke)
- Full content pipeline verified end-to-end: MDX authoring, Zod validation, Velite compilation, query function consumption
- Scheduled publishing confirmed: future-dated article (2027-01-01) excluded from all query results

## Task Commits

Each task was committed atomically:

1. **Task 1: Create content query functions with scheduled publishing** - `5186190` (feat)
2. **Task 2: Write 3 sample MDX articles and verify pipeline builds** - `1747613` (feat)

## Files Created/Modified
- `src/lib/content/queries.ts` - 7 query functions (getAllGuides, getGuideBySlug, getGuidesByCategory, getCategories, getPillarGuides, getFeaturedGuides, getReadingTime) with isPublished gate
- `content/guides/how-to-register-for-vat-in-ireland.mdx` - Pillar article on VAT registration (thresholds, TR1/TR2 forms, rates, Revenue/ROS)
- `content/guides/sole-trader-vs-limited-company-ireland.mdx` - Spoke article comparing business structures (12.5% corp tax, income tax bands, CRO, Form 11/CT1/B1)
- `content/guides/what-does-an-accountant-cost-ireland.mdx` - Spoke article on accountant fees (future-dated 2027-01-01 for schedule testing)

## Decisions Made
- isPublished uses `.slice(0, 10)` on BOTH the publishDate and today's date to ensure UTC-safe comparison (Velite outputs full ISO datetime strings like `2026-03-15T00:00:00.000Z`)
- getReadingTime computes `Math.ceil(wordCount / 200)` rather than using Velite's `metadata.readingTime` since Velite's WPM rate may differ from the 200 WPM requirement
- Slug field must be explicitly included in MDX frontmatter -- Velite's `s.slug('guides')` validates format but does not auto-derive from filename
- getCategories returns static array of 8 slugs rather than deriving from categories.ts to keep queries.ts independent

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added explicit slug field to MDX frontmatter**
- **Found during:** Task 2 (article creation)
- **Issue:** Velite's `s.slug('guides')` requires slug in frontmatter; does not auto-derive from filename. Build reported "Required slug" validation error for all 3 articles.
- **Fix:** Added `slug:` field to each article's frontmatter matching the filename
- **Files modified:** all 3 MDX files
- **Verification:** `npm run build` succeeds, `.velite/guides.json` contains 3 articles
- **Committed in:** 1747613 (Task 2 commit)

**2. [Rule 1 - Bug] Fixed isPublished string comparison for same-day edge case**
- **Found during:** Task 2 (verifying pipeline)
- **Issue:** Velite outputs publishDate as full ISO string (`2026-03-15T00:00:00.000Z`). Comparing against 10-char date (`2026-04-03`) works for different dates but fails on same-day: longer string is lexicographically "greater" than shorter string, so articles published today would be excluded.
- **Fix:** Added `.slice(0, 10)` to guide.publishDate in isPublished function so both sides are 10-char YYYY-MM-DD strings
- **Files modified:** src/lib/content/queries.ts
- **Verification:** String comparison now correctly handles same-day publishing
- **Committed in:** 1747613 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were necessary for correct pipeline operation. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviations above.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None - all query functions are complete and all articles contain real substantive content.

## Next Phase Readiness
- Query functions ready for Phase 3 article page template (`getGuideBySlug`, `getAllGuides` for `generateStaticParams`)
- isPillar field and getPillarGuides() available for Phase 3 pillar badge/card variant implementation
- 2 published sample articles available for rendering in Phase 3 article template
- Category system complete: schema enum + category config + getGuidesByCategory query

---
*Phase: 02-content-pipeline*
*Completed: 2026-04-03*
