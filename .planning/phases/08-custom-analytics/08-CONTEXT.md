# Phase 8: Custom Analytics - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Build privacy-first custom analytics: Supabase page_views table with client-side beacon, article read tracking via scroll depth, outbound click logging, bot filtering, RLS policies, and SQL views with Vercel cron for daily rollups. No third-party scripts, no cookies.

</domain>

<decisions>
## Implementation Decisions

### Page View Tracking
- **D-01:** **Client-side beacon** — lightweight client component fires POST to `/api/analytics/pageview` on mount. Works with SSG. Sends path, referrer, user agent. No cookies.
- **D-02:** Bot filtering on the API route — check user agent against known bot list before inserting.

### Article Read Tracking
- **D-03:** "Read" defined as **scroll depth past 75%** of article body. Intersection Observer on a marker element near the bottom. One read event per page load.
- **D-04:** Separate `article_reads` table: id, article_slug, scroll_depth, created_at.

### Outbound Click Tracking
- **D-05:** **Event listener on external links** — client component wraps article body, intercepts clicks on `<a>` with external href. Fires beacon to `/api/analytics/outbound`, then allows navigation. No delay.
- **D-06:** `outbound_clicks` table: id, article_slug, target_url, link_text, created_at.

### Aggregation & Storage
- **D-07:** **SQL views + Vercel cron** — create SQL views for daily/weekly summaries. Vercel cron (free tier: 1 job) triggers a daily rollup API route. No pg_cron needed.
- **D-08:** RLS policies: insert-only via service role on all analytics tables. No public read access.

### Claude's Discretion
- Exact bot user agent list
- Page view beacon component placement (layout.tsx vs per-page)
- Article read marker element positioning
- Outbound click event delegation pattern
- SQL view definitions for rollups
- Vercel cron schedule (e.g., daily at 3am UTC)
- Country detection approach (if available from headers)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDE.md` — Custom Supabase analytics only. No third-party tracking scripts.

### Existing Code
- `src/lib/supabase/admin.ts` — Supabase service role client (Phase 7)
- `src/app/api/subscribe/route.ts` — API route pattern with rate limiting (Phase 7)
- `src/app/guides/[slug]/page.tsx` — Article page where read tracking + outbound clicks are needed
- `src/app/layout.tsx` — Root layout where page view beacon could be placed

### Planning
- `.planning/PROJECT.md` — Core project context
- `.planning/REQUIREMENTS.md` — ANAL-01 through ANAL-07

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/supabase/admin.ts` — Supabase admin client ready for analytics inserts
- `src/lib/rate-limit.ts` — Rate limiter pattern (reusable for analytics API routes)
- API route pattern from Phase 7

### Established Patterns
- API routes via Next.js App Router
- Client components with `"use client"` for browser APIs
- Intersection Observer pattern (used in TOC scroll tracking, Phase 3)

### Integration Points
- New: `src/app/api/analytics/pageview/route.ts`
- New: `src/app/api/analytics/read/route.ts`
- New: `src/app/api/analytics/outbound/route.ts`
- New: `src/app/api/cron/rollup/route.ts` (Vercel cron target)
- New: `src/components/analytics/` — PageViewTracker, ReadTracker, OutboundClickTracker
- New: `supabase/migrations/002_create_analytics_tables.sql`
- New: `vercel.json` — cron configuration

</code_context>

<specifics>
## Specific Ideas

- Analytics should be invisible to users — no loading delays, no consent banners needed (no cookies/PII)
- User agent hashing for privacy — don't store raw user agents, hash them
- Country detection from Vercel's `x-vercel-ip-country` header if available
- Outbound clicks are especially valuable for Irish government sites (Revenue.ie, CRO.ie)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-custom-analytics*
*Context gathered: 2026-04-06*
