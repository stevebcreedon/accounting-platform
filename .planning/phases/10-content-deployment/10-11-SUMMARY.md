---
phase: 10-content-deployment
plan: 11
subsystem: infra
tags: [vercel, cron, deployment, isr, next.js]

# Dependency graph
requires:
  - phase: 10-content-deployment (plans 01-10)
    provides: All 72 MDX articles (8 pillar + 64 spoke)
  - phase: 08-custom-analytics
    provides: Analytics cron rollup in vercel.json
provides:
  - Live site on Vercel default domain with 72 articles
  - Daily rebuild cron at 06:00 UTC for scheduled publishing
  - Cron API route with CRON_SECRET authorization
affects: [phase-2-directory, custom-domain-setup]

# Tech tracking
tech-stack:
  added: []
  patterns: [vercel-cron-isr-revalidation, cron-secret-authorization]

key-files:
  created:
    - src/app/api/cron/rebuild/route.ts
  modified:
    - vercel.json

key-decisions:
  - "ISR revalidatePath for cron rebuild; full SSG rebuild requires Deploy Hook or GitHub Action (documented in route)"
  - "CRON_SECRET Bearer token authorization on rebuild endpoint"

patterns-established:
  - "Cron route authorization: Bearer token from CRON_SECRET env var"

requirements-completed: [DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04]

# Metrics
duration: 3min
completed: 2026-04-06
---

# Phase 10 Plan 11: Vercel Deployment with Daily Rebuild Cron

**Daily rebuild cron at 06:00 UTC and live Vercel deployment with all 72 articles and environment variables configured**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-06T12:30:00Z
- **Completed:** 2026-04-06T12:33:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added daily rebuild cron job at 06:00 UTC alongside existing analytics rollup cron
- Created authorized cron rebuild API route with CRON_SECRET Bearer token
- Verified all 72 MDX articles build successfully through Velite pipeline
- Site deployed live at https://accounting-platform-liart.vercel.app

## Task Commits

Each task was committed atomically:

1. **Task 1: Add daily rebuild cron and verify build** - `7a6f8d0` (feat)
2. **Task 2: Deploy to Vercel and configure environment variables** - Human action (user deployed to Vercel)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `vercel.json` - Added rebuild cron schedule "0 6 * * *" alongside existing rollup cron
- `src/app/api/cron/rebuild/route.ts` - ISR revalidation route with CRON_SECRET authorization

## Decisions Made
- ISR revalidatePath used for cron-triggered rebuild; full static rebuild requires Vercel Deploy Hook (documented in route comments)
- CRON_SECRET Bearer token for rebuild endpoint authorization

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required

Environment variables configured in Vercel dashboard:
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- NEXT_PUBLIC_SITE_URL (https://accounting-platform-liart.vercel.app)
- CRON_SECRET

## Next Phase Readiness
- All 72 articles live and accessible on Vercel
- Daily rebuild cron registered for scheduled article publishing
- Platform ready for Phase 2 (accountant directory) when business decides to proceed
- Custom domain configuration deferred until brand name chosen

## Self-Check: PASSED

- FOUND: vercel.json
- FOUND: src/app/api/cron/rebuild/route.ts
- FOUND: commit 7a6f8d0

---
*Phase: 10-content-deployment*
*Completed: 2026-04-06*
