---
phase: 07-email-capture
plan: 01
subsystem: api
tags: [supabase, resend, react-email, gdpr, rate-limiting, email]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Next.js 14 App Router project structure, Tailwind config
provides:
  - Supabase admin client (service role)
  - In-memory IP rate limiter
  - React Email confirmation template
  - POST /api/subscribe endpoint
  - GET /api/confirm endpoint
  - GET /api/unsubscribe endpoint
  - SQL migration for subscribers table
affects: [07-02-email-capture, analytics]

# Tech tracking
tech-stack:
  added: ["@supabase/supabase-js", "resend", "@react-email/components"]
  patterns: [service-role-admin-client, in-memory-rate-limit, react-email-template]

key-files:
  created:
    - src/lib/supabase/admin.ts
    - src/lib/rate-limit.ts
    - src/emails/confirmation-email.tsx
    - src/app/api/subscribe/route.ts
    - src/app/api/confirm/route.ts
    - src/app/api/unsubscribe/route.ts
    - supabase/migrations/001_create_subscribers.sql
  modified:
    - next.config.mjs
    - package.json

key-decisions:
  - "Service role client (not @supabase/ssr) since no Supabase Auth needed"
  - "In-memory Map rate limiter -- resets on cold start, acceptable for serverless"
  - "Email normalization: lowercase + trim before insert/lookup"

patterns-established:
  - "supabaseAdmin: server-only import from @/lib/supabase/admin for all DB operations"
  - "Rate limit utility: rateLimit(ip, limit, windowMs) returns boolean"
  - "API route pattern: validate input, check rate limit, handle duplicates, return JSON"

requirements-completed: [EMAIL-01, EMAIL-02, EMAIL-03, EMAIL-04, EMAIL-06, EMAIL-08]

# Metrics
duration: 2min
completed: 2026-04-06
---

# Phase 7 Plan 1: Email Subscription Backend Summary

**Supabase subscribers table, Resend double opt-in flow, and three API routes with rate limiting and GDPR consent proof**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-06T07:32:51Z
- **Completed:** 2026-04-06T07:35:04Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- Complete email subscription backend with subscribe, confirm, and unsubscribe API routes
- GDPR-compliant double opt-in flow with consent text, IP address, and timestamp storage
- Branded React Email confirmation template with unsubscribe link
- Duplicate email handling covering confirmed, unconfirmed, and unsubscribed states
- SQL migration for subscribers table with RLS enabled and indexes

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, create Supabase admin client, rate limiter, and update next.config.mjs** - `15bb4a0` (feat)
2. **Task 2: Create email template, SQL migration, and all three API routes** - `4ca4a3d` (feat)

## Files Created/Modified
- `src/lib/supabase/admin.ts` - Service role Supabase client (bypasses RLS)
- `src/lib/rate-limit.ts` - In-memory IP-based rate limiter (5 req/min default)
- `src/emails/confirmation-email.tsx` - Branded React Email template with confirm button and unsubscribe link
- `src/app/api/subscribe/route.ts` - POST handler: validates, rate-limits, handles duplicates, sends confirmation
- `src/app/api/confirm/route.ts` - GET handler: validates token, marks confirmed, redirects
- `src/app/api/unsubscribe/route.ts` - GET handler: validates token, marks unsubscribed, redirects
- `supabase/migrations/001_create_subscribers.sql` - Table with all GDPR fields, RLS, indexes
- `next.config.mjs` - Added serverComponentsExternalPackages for React Email
- `package.json` - Added @supabase/supabase-js, resend, @react-email/components

## Decisions Made
- Used @supabase/supabase-js with service role key directly (not @supabase/ssr) since no Supabase Auth is used
- In-memory Map for rate limiting resets on serverless cold start -- acceptable per D-10
- Email normalized to lowercase+trim before all operations to prevent case-sensitive duplicates

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

The SQL migration at `supabase/migrations/001_create_subscribers.sql` must be run in the Supabase dashboard SQL editor before the API routes will work. Environment variables (SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, NEXT_PUBLIC_SITE_URL) must be present in .env.local.

## Next Phase Readiness
- All API routes ready for the frontend EmailCapture component (Plan 02)
- Subscribe endpoint accepts POST with email, source, consentText
- Plan 02 will create the client component calling these routes

---
*Phase: 07-email-capture*
*Completed: 2026-04-06*
