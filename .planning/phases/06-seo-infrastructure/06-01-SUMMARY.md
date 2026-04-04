---
phase: 06-seo-infrastructure
plan: 01
subsystem: seo
tags: [next-metadata, json-ld, schema-dts, vercel-og, open-graph, twitter-card, canonical-url]

requires:
  - phase: 05-navigation-accessibility
    provides: "All page routes with layout, header, footer"
  - phase: 03-article-template
    provides: "Article page template, FAQ JSON-LD in faq-section.tsx"
provides:
  - "JSON-LD schema builder functions (Article, BreadcrumbList, Organisation)"
  - "Reusable typed JsonLd component"
  - "OG image generation route at /api/og"
  - "metadataBase in root layout for canonical URL resolution"
  - "generateMetadata on all dynamic pages"
  - "Complete metadata (title, description, canonical, OG, twitter) on all 9 page routes"
affects: [06-02-sitemap-robots, 06-03-content-audit]

tech-stack:
  added: ["@vercel/og"]
  patterns: ["metadataBase + relative canonical URLs", "synchronous generateMetadata with Velite data", "edge runtime OG image route with TTF font"]

key-files:
  created:
    - src/lib/seo/schemas.ts
    - src/components/seo/json-ld.tsx
    - src/app/api/og/route.tsx
    - public/fonts/Satoshi-Variable.ttf
  modified:
    - src/app/layout.tsx
    - src/app/guides/[slug]/page.tsx
    - src/app/guides/page.tsx
    - src/app/guides/category/[slug]/page.tsx
    - src/app/page.tsx
    - src/app/about/page.tsx
    - src/app/contact/page.tsx
    - src/app/privacy/page.tsx
    - src/app/terms/page.tsx
    - src/app/find-accountant/page.tsx

key-decisions:
  - "synchronous generateMetadata (not async) because Velite data is imported synchronously"
  - "Satoshi TTF downloaded from Fontshare for OG images (@vercel/og does not support woff2)"
  - "Brand Organization as author/publisher in Article schema, never Person (per D-04/D-05)"

patterns-established:
  - "metadataBase in root layout resolves all relative canonical/OG URLs to absolute"
  - "Child pages return only page title; root template appends ' | The Ledger'"
  - "summary_large_image for article pages, summary for static pages (per D-03)"
  - "Edge runtime for OG image route with TTF font loaded via new URL()"

requirements-completed: [SEO-01, SEO-08, SEO-09, SEO-10]

duration: 3min
completed: 2026-04-04
---

# Phase 6 Plan 1: SEO Foundation & Metadata Summary

**JSON-LD schema builders, OG image route with Satoshi TTF, and complete metadata (title, description, canonical, OG, Twitter) on all 9 page routes**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-04T19:42:33Z
- **Completed:** 2026-04-04T19:45:59Z
- **Tasks:** 2
- **Files modified:** 14

## Accomplishments
- Created SEO lib with typed JSON-LD schema builders for Article, BreadcrumbList, and Organisation
- Built edge-runtime OG image route generating branded 1200x630 PNG images with Satoshi font
- Added metadataBase to root layout enabling relative canonical URL resolution across all pages
- Added generateMetadata with full OG/Twitter/canonical metadata to all 9 page routes

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SEO infrastructure -- lib files, OG image route, root layout metadataBase** - `33d2057` (feat)
2. **Task 2: Add generateMetadata to all pages with canonical URLs, OG, and Twitter cards** - `0504ef8` (feat)

## Files Created/Modified
- `src/lib/seo/schemas.ts` - JSON-LD schema builder functions (buildArticleSchema, buildBreadcrumbSchema, buildOrganisationSchema)
- `src/components/seo/json-ld.tsx` - Reusable typed JSON-LD script component using schema-dts
- `src/app/api/og/route.tsx` - Edge runtime OG image generation with Satoshi TTF, cream background, category pill
- `public/fonts/Satoshi-Variable.ttf` - TTF font for OG image rendering (woff2 not supported by @vercel/og)
- `src/app/layout.tsx` - Added metadataBase, openGraph defaults (en_IE, siteName), twitter summary default
- `src/app/guides/[slug]/page.tsx` - Added generateMetadata with article OG type, summary_large_image twitter card, OG image URL
- `src/app/guides/page.tsx` - Added static metadata with canonical /guides
- `src/app/guides/category/[slug]/page.tsx` - Added generateMetadata with category name/description
- `src/app/page.tsx` - Added metadata with canonical /
- `src/app/about/page.tsx` - Enhanced metadata with canonical /about, OG, twitter
- `src/app/contact/page.tsx` - Enhanced metadata with canonical /contact, OG, twitter
- `src/app/privacy/page.tsx` - Enhanced metadata with canonical /privacy, OG, twitter
- `src/app/terms/page.tsx` - Enhanced metadata with canonical /terms, OG, twitter
- `src/app/find-accountant/page.tsx` - Enhanced metadata with canonical /find-accountant, OG, twitter

## Decisions Made
- Synchronous generateMetadata (not async) since Velite data imports are synchronous -- avoids unnecessary suspense boundaries
- Satoshi Variable TTF downloaded from Fontshare because @vercel/og only supports TTF/OTF/WOFF, not WOFF2
- Brand Organization used as both author and publisher in Article schema (per D-04/D-05, no personal attribution)
- Homepage metadata does not export title -- inherits default from root layout to avoid template double-application

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Build traces ENOENT error on _error.js.nft.json -- pre-existing Next.js 14 build traces bug, not caused by our changes. Build compiles successfully and generates all 21 static pages.

## Known Stubs

None - all metadata is wired to real data sources (Velite guides, category config).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- JSON-LD schema builders ready for Plan 02 to add Article + BreadcrumbList structured data to article pages
- OG image route ready for production use
- All pages have complete metadata for Google indexing and social sharing

---
*Phase: 06-seo-infrastructure*
*Completed: 2026-04-04*
