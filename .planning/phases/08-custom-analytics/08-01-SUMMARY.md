---
phase: 08-custom-analytics
plan: 01
subsystem: api, database
tags: [supabase, analytics, rls, isbot, sha256, rate-limiting]

# Dependency graph
requires:
  - phase: 07-email-capture
    provides: Supabase admin client, rate limiter utility, API route patterns
provides:
  - SQL migration for 5 analytics tables with RLS and indexes
  - Bot filtering utility wrapping isbot package
  - Three API routes for page view, article read, and outbound click tracking
affects: [08-02-client-tracking, analytics-dashboard]

# Tech tracking
tech-stack:
  added: [isbot]
  patterns: [silent-analytics-response, sha256-ua-hashing, insert-only-rls]

key-files:
  created:
    - supabase/migrations/002_create_analytics_tables.sql
    - src/lib/analytics/bot-filter.ts
    - src/app/api/analytics/pageview/route.ts
    - src/app/api/analytics/read/route.ts
    - src/app/api/analytics/outbound/route.ts
  modified:
    - package.json

key-decisions:
  - "Silent 200 responses on all analytics routes -- errors never leak to client"
  - "Null/empty user agents treated as bots (no UA = suspicious traffic)"
  - "SHA-256 hashing of user agent for privacy before storage"
  - "Rate limits differentiated: 30/min for pageview+outbound, 10/min for reads"

patterns-established:
  - "Silent analytics pattern: all /api/analytics/* routes return { ok: true } regardless of success/failure"
  - "Insert-only RLS: tables have RLS enabled with no SELECT/UPDATE/DELETE policies, service role bypasses for writes"
  - "Bot filtering before rate limiting in analytics pipeline"

requirements-completed: [ANAL-01, ANAL-02, ANAL-03, ANAL-07]

# Metrics
duration: 2min
completed: 2026-04-06
---

# Phase 8 Plan 1: Analytics Backend Summary

**Supabase analytics tables with RLS, isbot filtering, and three API routes for page views, article reads, and outbound clicks**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-06T08:47:44Z
- **Completed:** 2026-04-06T08:49:14Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- SQL migration defining 5 analytics tables (page_views, article_reads, outbound_clicks, daily_page_views, daily_article_reads) all with RLS enabled
- Bot filtering utility that wraps isbot package with null-UA-as-bot safety
- Three API routes following existing subscribe route patterns: pageview with SHA-256 UA hashing and country detection, read with scroll depth, outbound with link text capture

## Task Commits

Each task was committed atomically:

1. **Task 1: SQL migration, isbot install, and bot filter utility** - `7656933` (feat)
2. **Task 2: Three analytics API routes** - `d2cc7d0` (feat)

## Files Created/Modified
- `supabase/migrations/002_create_analytics_tables.sql` - Five analytics tables with RLS, indexes, and daily summary tables
- `src/lib/analytics/bot-filter.ts` - Bot detection wrapper using isbot package
- `src/app/api/analytics/pageview/route.ts` - Page view tracking with UA hashing and country detection
- `src/app/api/analytics/read/route.ts` - Article read tracking with scroll depth
- `src/app/api/analytics/outbound/route.ts` - Outbound click tracking with link text
- `package.json` - Added isbot dependency

## Decisions Made
- Silent 200 responses on all analytics routes -- analytics errors must never leak to client
- Null/empty user agents treated as bots (no UA = suspicious automated traffic)
- SHA-256 user agent hashing via crypto.subtle.digest for privacy
- Differentiated rate limits: 30/min for pageview and outbound (higher volume), 10/min for reads (one per article per page load)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

The SQL migration at `supabase/migrations/002_create_analytics_tables.sql` needs to be run against the Supabase database. Execute the SQL in the Supabase SQL Editor to create the analytics tables.

## Next Phase Readiness
- API routes ready to receive events from client-side tracking components (Plan 08-02)
- Tables ready for data once migration is applied to Supabase
- Daily summary tables ready for future rollup cron job

---
*Phase: 08-custom-analytics*
*Completed: 2026-04-06*
