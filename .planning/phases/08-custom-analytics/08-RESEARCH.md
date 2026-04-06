# Phase 8: Custom Analytics - Research

**Researched:** 2026-04-06
**Domain:** Privacy-first analytics with Supabase, Next.js App Router API routes, client-side event tracking
**Confidence:** HIGH

## Summary

Phase 8 implements a custom analytics system using Supabase as the sole data store -- no third-party scripts, no cookies, no PII. The system tracks three event types: page views (every page load), article reads (scroll depth past 75%), and outbound clicks (external link clicks). All events flow through Next.js API routes that validate input, filter bots, and insert into Supabase via the existing service role client.

The architecture is straightforward: three lightweight client components fire beacons to three API routes, which insert into three Supabase tables. A Vercel cron job triggers a daily rollup API route that refreshes materialized views for summary data. RLS policies lock all analytics tables to insert-only via service role, preventing any public read access.

The project already has established patterns for API routes (Phase 7 subscribe), rate limiting, Supabase admin client, and Intersection Observer (TOC component). This phase extends those patterns with minimal new dependencies -- the only recommended addition is the `isbot` package for bot user agent detection.

**Primary recommendation:** Use `navigator.sendBeacon()` for fire-and-forget analytics from client components, `isbot` for bot filtering, and Supabase SQL views (not materialized views) for daily rollups refreshed via Vercel cron.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Client-side beacon -- lightweight client component fires POST to `/api/analytics/pageview` on mount. Works with SSG. Sends path, referrer, user agent. No cookies.
- **D-02:** Bot filtering on the API route -- check user agent against known bot list before inserting.
- **D-03:** "Read" defined as scroll depth past 75% of article body. Intersection Observer on a marker element near the bottom. One read event per page load.
- **D-04:** Separate `article_reads` table: id, article_slug, scroll_depth, created_at.
- **D-05:** Event listener on external links -- client component wraps article body, intercepts clicks on `<a>` with external href. Fires beacon to `/api/analytics/outbound`, then allows navigation. No delay.
- **D-06:** `outbound_clicks` table: id, article_slug, target_url, link_text, created_at.
- **D-07:** SQL views + Vercel cron -- create SQL views for daily/weekly summaries. Vercel cron (free tier: 1 job) triggers a daily rollup API route. No pg_cron needed.
- **D-08:** RLS policies: insert-only via service role on all analytics tables. No public read access.

### Claude's Discretion
- Exact bot user agent list
- Page view beacon component placement (layout.tsx vs per-page)
- Article read marker element positioning
- Outbound click event delegation pattern
- SQL view definitions for rollups
- Vercel cron schedule (e.g., daily at 3am UTC)
- Country detection approach (if available from headers)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ANAL-01 | Supabase page_views table: id, path, referrer, user_agent, country, created_at | Migration SQL pattern from Phase 7 (001_create_subscribers.sql), RLS + index patterns established |
| ANAL-02 | Server-side API route for tracking page views (no client-side tracking cookies) | Existing API route pattern in `/api/subscribe/route.ts`, rate limiting via `rate-limit.ts` |
| ANAL-03 | Bot filtering on analytics ingestion (exclude known crawlers) | `isbot` package (v5.1.37) -- single function call, ~1M weekly downloads, regularly updated |
| ANAL-04 | Article read tracking: scroll depth trigger to distinguish visits from reads | Intersection Observer pattern already in project (table-of-contents.tsx), 75% scroll marker per D-03 |
| ANAL-05 | Outbound click tracking for external links | Event delegation on article body wrapper, `navigator.sendBeacon` for non-blocking send |
| ANAL-06 | Pre-aggregation strategy: SQL views for daily/weekly summaries | Supabase SQL views + Vercel cron daily refresh, rollup into summary tables |
| ANAL-07 | RLS policies on analytics tables (insert via service role only) | Service role key bypasses RLS; policies block anon key. Pattern from subscribers table |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | ^2.101.1 | Database client | Already installed, service role admin client in `src/lib/supabase/admin.ts` |
| next | 14.2.35 | API routes, App Router | Project framework, API route pattern established in Phase 7 |

### New Dependencies
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| isbot | ^5.1.37 | Bot user agent detection | Every analytics API route -- call `isbot(userAgent)` before inserting |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| isbot | Manual regex list | isbot is community-maintained, covers 1000+ bots, auto-updates. Manual lists go stale. |
| isbot | crawler-user-agents (JSON file) | isbot wraps this + more sources into a single boolean function. Simpler API. |
| navigator.sendBeacon | fetch with keepalive | sendBeacon is purpose-built for analytics, guaranteed delivery on page unload. fetch+keepalive is fallback. |
| SQL views | Materialized views | Materialized views don't support RLS in PostgreSQL (as of v15). SQL views are simpler and sufficient for this volume. For rollups, write aggregated data into summary tables via the cron route instead. |

**Installation:**
```bash
npm install isbot
```

**Version verification:** `isbot` v5.1.37 confirmed current via `npm view isbot version` on 2026-04-06.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/api/analytics/
│   ├── pageview/route.ts      # POST handler for page views
│   ├── read/route.ts          # POST handler for article reads
│   └── outbound/route.ts      # POST handler for outbound clicks
├── app/api/cron/
│   └── rollup/route.ts        # GET handler triggered by Vercel cron
├── components/analytics/
│   ├── page-view-tracker.tsx   # 'use client' - fires beacon on mount
│   ├── read-tracker.tsx        # 'use client' - Intersection Observer at 75%
│   └── outbound-tracker.tsx    # 'use client' - wraps children, intercepts external clicks
├── lib/analytics/
│   └── bot-filter.ts           # isbot wrapper + any custom exclusions
supabase/
└── migrations/
    └── 002_create_analytics_tables.sql  # All 3 tables + RLS + indexes + views
vercel.json                              # Cron configuration
```

### Pattern 1: Fire-and-Forget Beacon from Client Component
**What:** Lightweight client component that sends analytics data via `navigator.sendBeacon()` with `fetch()` fallback. No state updates, no loading indicators, invisible to users.
**When to use:** All three analytics event types (pageview, read, outbound click).
**Example:**
```typescript
// Source: MDN Navigator.sendBeacon() docs
'use client';

import { useEffect, useRef } from 'react';

export function PageViewTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const data = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer || null,
    });

    // sendBeacon is fire-and-forget, ideal for analytics
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/pageview', new Blob([data], { type: 'application/json' }));
    } else {
      fetch('/api/analytics/pageview', {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      });
    }
  }, []);

  return null; // Renders nothing
}
```

### Pattern 2: Intersection Observer Read Marker
**What:** Place an invisible div at ~75% of article body height. When it enters viewport, fire a single read event.
**When to use:** Article pages only. One event per page load.
**Example:**
```typescript
'use client';

import { useEffect, useRef } from 'react';

export function ReadTracker({ articleSlug }: { articleSlug: string }) {
  const markerRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!markerRef.current || fired.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          const data = JSON.stringify({
            articleSlug,
            scrollDepth: 75,
          });
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/analytics/read', new Blob([data], { type: 'application/json' }));
          } else {
            fetch('/api/analytics/read', {
              method: 'POST',
              body: data,
              headers: { 'Content-Type': 'application/json' },
              keepalive: true,
            });
          }
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(markerRef.current);
    return () => observer.disconnect();
  }, [articleSlug]);

  return <div ref={markerRef} aria-hidden="true" />;
}
```

### Pattern 3: Event Delegation for Outbound Clicks
**What:** Wrapper component that listens for click events on child elements, checks if the target is an external link, and fires a beacon before allowing navigation.
**When to use:** Wrap article body content to capture all outbound clicks.
**Example:**
```typescript
'use client';

import { useCallback } from 'react';

export function OutboundTracker({
  articleSlug,
  children,
}: {
  articleSlug: string;
  children: React.ReactNode;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.href;
      if (!href || anchor.hostname === window.location.hostname) return;

      const data = JSON.stringify({
        articleSlug,
        targetUrl: href,
        linkText: anchor.textContent?.slice(0, 200) || '',
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/outbound', new Blob([data], { type: 'application/json' }));
      } else {
        fetch('/api/analytics/outbound', {
          method: 'POST',
          body: data,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        });
      }
      // Do NOT preventDefault -- let navigation proceed normally
    },
    [articleSlug]
  );

  return <div onClick={handleClick}>{children}</div>;
}
```

### Pattern 4: API Route with Bot Filtering
**What:** Standard Next.js App Router POST handler that validates input, filters bots, and inserts into Supabase.
**When to use:** All three analytics API routes.
**Example:**
```typescript
// Source: Existing /api/subscribe/route.ts pattern + isbot docs
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isbot } from 'isbot';

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent') || '';

    // Filter bots
    if (isbot(userAgent)) {
      return NextResponse.json({ ok: true }); // Silent success to not reveal filtering
    }

    const body = await request.json();
    const { path } = body;

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Invalid' }, { status: 400 });
    }

    // Country from Vercel header (available on deployed Vercel Functions)
    const country = request.headers.get('x-vercel-ip-country') || null;

    // Hash user agent for privacy
    const encoder = new TextEncoder();
    const data = encoder.encode(userAgent);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const userAgentHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { error } = await supabaseAdmin
      .from('page_views')
      .insert({
        path: path.slice(0, 500),
        referrer: (body.referrer || '').slice(0, 2000) || null,
        user_agent_hash: userAgentHash,
        country,
      });

    if (error) {
      console.error('Analytics insert error:', error);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // Never reveal errors to client
  }
}
```

### Pattern 5: Vercel Cron Configuration
**What:** `vercel.json` at project root configuring a daily cron job.
**When to use:** Trigger daily rollup aggregation.
**Example:**
```json
{
  "crons": [
    {
      "path": "/api/cron/rollup",
      "schedule": "0 3 * * *"
    }
  ]
}
```

### Anti-Patterns to Avoid
- **Storing raw user agents:** Privacy concern. Hash them with SHA-256 before storing.
- **Blocking navigation for outbound tracking:** Never `preventDefault()` on outbound clicks. Use `sendBeacon` which is non-blocking.
- **Using materialized views with RLS:** PostgreSQL does not support RLS on materialized views. Use regular SQL views for read access, or write rollups into regular tables.
- **Returning error details to analytics clients:** Always return 200/ok to analytics endpoints even on error. Errors in analytics should never affect user experience.
- **Using cookies or localStorage:** Violates the privacy-first requirement. No session tracking needed.
- **Rate limiting analytics routes aggressively:** Analytics routes receive one hit per page load per user. A limit of 30/minute per IP is sufficient to block abuse without losing legitimate data.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bot detection | Custom regex matching user agents | `isbot` package | Maintains 1000+ bot patterns, updated weekly, covers edge cases like headless Chrome |
| User agent hashing | Custom hash function | `crypto.subtle.digest('SHA-256', ...)` | Built into Web Crypto API, available in Node.js and Edge Runtime, no dependency needed |
| Country detection | GeoIP database lookup | `x-vercel-ip-country` header | Free on all Vercel plans, zero latency (already computed by Vercel edge) |
| Cron scheduling | Custom interval timer | Vercel Cron Jobs | Built into platform, free tier allows 1 daily cron, no infrastructure to manage |

**Key insight:** The entire analytics pipeline uses zero external services beyond what is already in the stack (Supabase + Vercel). The only new npm dependency is `isbot` for bot filtering.

## Common Pitfalls

### Pitfall 1: sendBeacon Content-Type
**What goes wrong:** `navigator.sendBeacon(url, jsonString)` sends with `text/plain` Content-Type, which Next.js App Router's `request.json()` may reject.
**Why it happens:** sendBeacon with a plain string defaults to `text/plain`. The API route expects `application/json`.
**How to avoid:** Wrap the JSON string in a `Blob` with explicit Content-Type: `new Blob([data], { type: 'application/json' })`.
**Warning signs:** Analytics API routes returning 400 errors or body parsing failures in logs.

### Pitfall 2: Double-Firing in React Strict Mode
**What goes wrong:** In development, React Strict Mode mounts components twice, causing duplicate analytics events.
**Why it happens:** React 18 Strict Mode intentionally double-invokes effects in development.
**How to avoid:** Use a `useRef` flag (`sent.current`) to ensure each event fires only once per component instance.
**Warning signs:** Doubled page view counts in development vs production.

### Pitfall 3: Vercel Cron CRON_SECRET Not Set
**What goes wrong:** Anyone can trigger the rollup endpoint by hitting `/api/cron/rollup` directly.
**Why it happens:** Vercel cron jobs call the route like any other request. Without verification, the route is public.
**How to avoid:** Set `CRON_SECRET` environment variable in Vercel dashboard. Check `request.headers.get('authorization') === 'Bearer ' + process.env.CRON_SECRET'` in the route handler.
**Warning signs:** Unexpected rollup executions in logs, potential abuse.

### Pitfall 4: Supabase Table Bloat Without Retention
**What goes wrong:** Analytics tables grow indefinitely with raw events. Over months, queries slow down.
**Why it happens:** No automatic data retention policy.
**How to avoid:** Add a retention step to the cron rollup: delete raw events older than 90 days after they have been aggregated into daily summary tables. Or add this as a future concern and address when data volume warrants it.
**Warning signs:** Supabase storage usage climbing, slow dashboard queries.

### Pitfall 5: Missing Index on created_at
**What goes wrong:** Rollup queries scanning full tables for date ranges.
**Why it happens:** Date-based aggregation without an index on the timestamp column.
**How to avoid:** Create indexes on `created_at` for all three analytics tables. Also index `path` on `page_views` and `article_slug` on `article_reads` and `outbound_clicks`.
**Warning signs:** Slow cron rollup execution, Supabase performance advisor warnings.

### Pitfall 6: ReadTracker Marker Placement
**What goes wrong:** Marker placed after the article body (100% scroll) or at a fixed pixel position that varies by article length.
**Why it happens:** Incorrect calculation of "75% of article body."
**How to avoid:** Place the marker element inside the article body container, approximately 75% through the content. Since articles vary in length, use CSS or a relative position within the article-content div. A practical approach: insert the ReadTracker component after the main MDX body but before the disclaimer, which is roughly 75-80% through the article content area.
**Warning signs:** Read rates that are either suspiciously high (marker too early) or suspiciously low (marker too late).

## Code Examples

### Supabase Migration: Analytics Tables
```sql
-- Source: Existing 001_create_subscribers.sql pattern

-- Page views table
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent_hash TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- No SELECT/UPDATE/DELETE policies = no public access
-- Service role bypasses RLS for inserts

CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX idx_page_views_path ON public.page_views(path);

-- Article reads table
CREATE TABLE IF NOT EXISTS public.article_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  scroll_depth INTEGER NOT NULL DEFAULT 75,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.article_reads ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_article_reads_created_at ON public.article_reads(created_at);
CREATE INDEX idx_article_reads_slug ON public.article_reads(article_slug);

-- Outbound clicks table
CREATE TABLE IF NOT EXISTS public.outbound_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  target_url TEXT NOT NULL,
  link_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.outbound_clicks ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_outbound_clicks_created_at ON public.outbound_clicks(created_at);
CREATE INDEX idx_outbound_clicks_slug ON public.outbound_clicks(article_slug);

-- Daily summary tables (populated by cron rollup)
CREATE TABLE IF NOT EXISTS public.daily_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  path TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  UNIQUE(date, path)
);

ALTER TABLE public.daily_page_views ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.daily_article_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  article_slug TEXT NOT NULL,
  read_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(date, article_slug)
);

ALTER TABLE public.daily_article_reads ENABLE ROW LEVEL SECURITY;
```

### Vercel Cron Rollup Route
```typescript
// Source: Vercel Cron Jobs docs + Supabase patterns
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().slice(0, 10);

  // Aggregate page views for yesterday
  const { data: pvData } = await supabaseAdmin.rpc('rollup_daily_page_views', {
    target_date: dateStr,
  });

  // Aggregate article reads for yesterday
  const { data: arData } = await supabaseAdmin.rpc('rollup_daily_article_reads', {
    target_date: dateStr,
  });

  return NextResponse.json({
    ok: true,
    date: dateStr,
    pageViews: pvData,
    articleReads: arData,
  });
}
```

### Bot Filter Utility
```typescript
// Source: isbot npm package
import { isbot } from 'isbot';

export function isBotRequest(userAgent: string | null): boolean {
  if (!userAgent) return true; // No UA = suspicious, treat as bot
  return isbot(userAgent);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Google Analytics / gtag | Custom Supabase analytics | Project decision | Full data ownership, no third-party scripts, GDPR-friendly |
| XMLHttpRequest for analytics | navigator.sendBeacon | Widely supported since ~2017 | Non-blocking, survives page unload, purpose-built for analytics |
| Server-side session tracking | Cookieless page view counting | Privacy-first trend | No consent banners needed, simpler GDPR compliance |
| pg_cron for database jobs | Vercel Cron Jobs | Vercel feature | No database extension needed, works on Supabase free tier |

## Open Questions

1. **User agent hashing vs. storing nothing**
   - What we know: D-01 says store user_agent, CONTEXT.md says hash it for privacy
   - What's unclear: Whether the hash provides any analytical value (can't query by browser type from a hash)
   - Recommendation: Store the hash for unique visitor approximation (count distinct hashes per day). If browser analytics are needed later, parse UA into browser/OS before hashing and store those as separate columns.

2. **Rollup data retention**
   - What we know: Raw events accumulate over time, daily summaries are the primary query target
   - What's unclear: When to start deleting raw events
   - Recommendation: No retention policy in Phase 8. Add a TODO for when raw table exceeds 100K rows. The cron can be extended later.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Supabase | Analytics storage | Yes | Project provisioned | -- |
| Vercel | Cron jobs, x-vercel-ip-country | Yes (deployment target) | -- | Country detection returns null locally |
| isbot | Bot filtering | Not yet installed | 5.1.37 | -- (install required) |
| crypto.subtle | UA hashing | Yes | Built-in (Node.js) | -- |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:**
- `x-vercel-ip-country` header unavailable in local development. Country will be null during local testing. This is acceptable -- the field is nullable in the schema.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANAL-01 | page_views table exists with correct columns | manual (SQL) | Verify via Supabase dashboard or SQL editor | N/A |
| ANAL-02 | API route accepts POST and inserts to Supabase | manual (curl) | `curl -X POST http://localhost:3000/api/analytics/pageview -H 'Content-Type: application/json' -d '{"path":"/test"}'` | N/A |
| ANAL-03 | Bot requests are silently filtered | manual (curl) | `curl -X POST http://localhost:3000/api/analytics/pageview -H 'Content-Type: application/json' -H 'User-Agent: Googlebot/2.1' -d '{"path":"/test"}'` | N/A |
| ANAL-04 | Read event fires at 75% scroll | manual (browser) | Scroll article in dev tools, verify Supabase insert | N/A |
| ANAL-05 | Outbound click fires beacon before navigation | manual (browser) | Click external link, verify Supabase insert | N/A |
| ANAL-06 | Rollup API aggregates daily data | manual (curl) | `curl http://localhost:3000/api/cron/rollup` (with CRON_SECRET) | N/A |
| ANAL-07 | RLS prevents public read/update/delete | manual (SQL) | Query with anon key, verify empty results | N/A |

### Sampling Rate
- **Per task commit:** Manual verification via curl + Supabase dashboard
- **Per wave merge:** Full manual test of all 3 event types + rollup
- **Phase gate:** All 7 requirements verified manually before `/gsd:verify-work`

### Wave 0 Gaps
No test framework exists in the project. All analytics validation is manual (curl + browser + Supabase dashboard). This is acceptable for Phase 8 because:
- Analytics events are fire-and-forget with no user-facing output
- Supabase inserts are verifiable via dashboard
- API routes can be tested with curl
- Client components can be verified by inspecting Network tab in browser dev tools

Installing a test framework (Jest/Vitest) for this phase would add overhead disproportionate to the value, given the manual verification is straightforward. If a test framework is added in a later phase, unit tests for bot filtering and input validation can be retrofitted.

## Project Constraints (from CLAUDE.md)

- **Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Supabase -- all already established
- **Analytics:** Custom Supabase analytics only. No third-party tracking scripts. No Google Analytics.
- **GDPR:** No cookies, no PII storage. User agent hashed. No consent banners needed for analytics-only tracking.
- **No cookie-consent libraries:** With no third-party cookies/tracking, not needed
- **Service role client:** Use `src/lib/supabase/admin.ts` (not @supabase/ssr, since no auth needed)
- **API route pattern:** Follow existing `/api/subscribe/route.ts` structure with rate limiting

## Sources

### Primary (HIGH confidence)
- [MDN Navigator.sendBeacon()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon) - Beacon API specification and usage
- [Vercel Cron Jobs Quickstart](https://vercel.com/docs/cron-jobs/quickstart) - Cron configuration and CRON_SECRET
- [Vercel Request Headers](https://vercel.com/docs/headers/request-headers) - x-vercel-ip-country availability
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) - RLS policy patterns
- [isbot npm](https://www.npmjs.com/package/isbot) - Bot detection package, v5.1.37 verified
- Existing codebase: `src/app/api/subscribe/route.ts`, `src/lib/supabase/admin.ts`, `src/lib/rate-limit.ts`

### Secondary (MEDIUM confidence)
- [Supabase Views](https://supabase.com/docs/guides/graphql/views) - SQL view patterns for analytics
- [Vercel Cron Jobs Pricing](https://vercel.com/docs/cron-jobs/usage-and-pricing) - Free tier: 1 cron job, daily minimum

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Only one new dependency (isbot), everything else is established in the project
- Architecture: HIGH - Patterns directly extend existing API route and client component patterns from Phases 3 and 7
- Pitfalls: HIGH - Well-documented issues with sendBeacon Content-Type, React Strict Mode double-firing, and Supabase RLS on materialized views

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable domain, no fast-moving dependencies)
