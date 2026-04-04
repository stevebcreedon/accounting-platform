---
phase: 06-seo-infrastructure
plan: 02
subsystem: seo
tags: [json-ld, schema-dts, sitemap, robots, structured-data, breadcrumbs]

requires:
  - phase: 06-seo-infrastructure/01
    provides: JSON-LD schemas (buildArticleSchema, buildBreadcrumbSchema, buildOrganisationSchema) and JsonLd component
provides:
  - Article + BreadcrumbList JSON-LD on all guide pages
  - Organisation JSON-LD on homepage with areaServed Ireland
  - Dynamic XML sitemap listing all static pages, guides, and categories
  - robots.txt allowing all crawlers including AI bots
affects: [content-pipeline, deployment]

tech-stack:
  added: []
  patterns: [json-ld-injection-via-fragment-wrapper, built-in-next-sitemap-convention, built-in-next-robots-convention]

key-files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified:
    - src/app/guides/[slug]/page.tsx
    - src/app/page.tsx

key-decisions:
  - "FAQPage JSON-LD left in faq-section.tsx to avoid duplication (D-06)"
  - "No disallow rules in robots.txt -- all crawlers including AI bots allowed (D-11)"

patterns-established:
  - "JsonLd components rendered in fragment wrapper at top of page return"
  - "Built-in Next.js sitemap.ts/robots.ts convention (no external packages)"

requirements-completed: [SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07]

duration: 1min
completed: 2026-04-04
---

# Phase 6 Plan 2: Structured Data, Sitemap & Robots Summary

**Article/BreadcrumbList/Organisation JSON-LD on pages plus dynamic sitemap.xml and robots.txt for full crawlability**

## Performance

- **Duration:** 1 min
- **Started:** 2026-04-04T19:47:48Z
- **Completed:** 2026-04-04T19:49:02Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Article pages now emit Article + BreadcrumbList JSON-LD structured data for rich search results
- Homepage emits Organisation JSON-LD with areaServed Ireland for entity recognition
- /sitemap.xml dynamically lists all static pages, published guides, and category archives
- /robots.txt allows all user agents with no disallow rules, linking to sitemap

## Task Commits

Each task was committed atomically:

1. **Task 1: Add JSON-LD structured data to article pages and homepage** - `39b5577` (feat)
2. **Task 2: Create sitemap.ts and robots.ts** - `fa03f37` (feat)

## Files Created/Modified
- `src/app/guides/[slug]/page.tsx` - Added Article + BreadcrumbList JSON-LD via JsonLd component
- `src/app/page.tsx` - Added Organisation JSON-LD via JsonLd component
- `src/app/sitemap.ts` - Dynamic XML sitemap with static pages, guides, and categories
- `src/app/robots.ts` - Allow-all robots configuration with sitemap reference

## Decisions Made
- FAQPage JSON-LD confirmed in faq-section.tsx and NOT duplicated at page level (per D-06)
- All crawlers allowed in robots.txt including AI bots (GPTBot, CCBot) per D-11
- BASE_URL uses same env var pattern as schemas.ts for consistency

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All SEO structured data in place (Article, FAQ, Breadcrumb, Organisation)
- Sitemap and robots.txt enable full crawlability
- Ready for OG image generation (Plan 03) and subsequent phases

---
*Phase: 06-seo-infrastructure*
*Completed: 2026-04-04*
