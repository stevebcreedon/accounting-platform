---
phase: 06-seo-infrastructure
plan: 03
subsystem: seo
tags: [mdx, seo, internal-linking, ai-search, content-optimization]

# Dependency graph
requires:
  - phase: 03-article-page-template
    provides: MDX article page template with heading rendering
  - phase: 02-content-pipeline
    provides: Velite MDX pipeline with relatedSlugs frontmatter field
provides:
  - Complete internal linking graph across all 3 published articles (SEO-11)
  - Verified heading hierarchy H2/H3 in all article bodies (SEO-12)
  - AI-optimized structured introductions on all articles (SEO-13)
affects: [content-pipeline, future-articles]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Structured intro pattern: direct answer in first 1-2 sentences, then expand"
    - "relatedSlugs cross-referencing: every article links to all related articles"

key-files:
  created: []
  modified:
    - content/guides/how-to-register-for-vat-in-ireland.mdx
    - content/guides/sole-trader-vs-limited-company-ireland.mdx
    - content/guides/what-does-an-accountant-cost-ireland.mdx

key-decisions:
  - "Article intros restructured to lead with direct factual answer for AI citation readiness"
  - "All 3 articles cross-reference each other via relatedSlugs (complete graph with 3 nodes)"

patterns-established:
  - "Structured intro pattern: every article starts with direct 1-2 sentence answer to title question, then expands with context"
  - "relatedSlugs completeness: every article must reference all related articles"

requirements-completed: [SEO-11, SEO-12, SEO-13]

# Metrics
duration: 4min
completed: 2026-04-04
---

# Phase 6 Plan 3: Article Content SEO Optimization Summary

**Internal linking, heading hierarchy audit, and AI-optimized introductions across all 3 published MDX articles**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-04T19:42:47Z
- **Completed:** 2026-04-04T19:46:21Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added missing relatedSlugs cross-reference to sole-trader article (now all 3 articles link to each other)
- Verified heading hierarchy across all articles: no H1 in body, no skipped levels, proper H2/H3 nesting
- Rewrote all 3 article introductions to follow structured intro pattern (direct answer first) for AI search citation readiness

## Task Commits

Each task was committed atomically:

1. **Task 1: Audit and fix heading hierarchy and relatedSlugs in all MDX articles** - `5e0765f` (feat)
2. **Task 2: Rewrite article introductions for AI search optimization** - `2aa3e37` (feat)

## Files Created/Modified
- `content/guides/sole-trader-vs-limited-company-ireland.mdx` - Added missing relatedSlugs entry + restructured intro
- `content/guides/how-to-register-for-vat-in-ireland.mdx` - Restructured intro with direct answer (TR1/TR2, thresholds)
- `content/guides/what-does-an-accountant-cost-ireland.mdx` - Restructured intro with cost ranges (EUR 300-800, EUR 1,500-3,500)

## Decisions Made
- Article intros restructured to lead with direct factual answer using data already present in article body (no invented figures)
- sole-trader article intro references EUR 40,000-50,000 threshold and 12.5% corp tax from the article's own comparison data

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None - all content changes are complete with real data from existing articles.

## Next Phase Readiness
- All 3 articles now have complete SEO optimization (internal linking, heading hierarchy, AI-optimized intros)
- Pattern established for future articles: structured intro, complete relatedSlugs, proper heading nesting

---
*Phase: 06-seo-infrastructure*
*Completed: 2026-04-04*
