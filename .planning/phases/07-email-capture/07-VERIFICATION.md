---
phase: 07-email-capture
verified: 2026-04-06T08:00:00Z
status: human_needed
score: 11/11 must-haves verified
human_verification:
  - test: "Submit email on homepage with checkbox unchecked"
    expected: "Subscribe button is disabled; form cannot be submitted"
    why_human: "Disabled button state requires browser rendering to confirm visual state"
  - test: "Full double opt-in flow: submit email, click link in confirmation email, check Supabase"
    expected: "Subscriber row created with confirmed=false, confirmation email received via Resend, clicking link sets confirmed=true and confirmed_at in Supabase, redirects to /subscribe/confirm"
    why_human: "Requires live Resend API key, SQL migration run in Supabase, and real email delivery to verify end-to-end"
  - test: "Click unsubscribe link from confirmation email"
    expected: "Sets unsubscribed_at in Supabase and redirects to /unsubscribe page with 'You've Been Unsubscribed'"
    why_human: "Requires live environment with Supabase migration applied"
  - test: "Submit same email twice (already confirmed)"
    expected: "Returns 409 error 'This email is already subscribed.' shown in form"
    why_human: "Requires Supabase subscribers table to be populated"
  - test: "Submit 6 requests from same IP in under 60 seconds"
    expected: "6th request returns 429 'Too many requests. Please try again later.'"
    why_human: "In-memory rate limiter cannot be tested without repeated live requests"
---

# Phase 7: Email Capture Verification Report

**Phase Goal:** Visitors can subscribe to the platform with full GDPR compliance -- double opt-in, consent proof, and unsubscribe
**Verified:** 2026-04-06T08:00:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|---------|
| 1 | POST /api/subscribe accepts email, source, consentText and inserts a subscriber row | VERIFIED | `src/app/api/subscribe/route.ts`: parses `{email, source, consentText}`, calls `supabaseAdmin.from('subscribers').insert(...)` with all fields including ip_address, consent_text, consent_timestamp |
| 2 | POST /api/subscribe sends a confirmation email via Resend with confirm and unsubscribe links | VERIFIED | Route calls `resend.emails.send()` with `react: ConfirmationEmail({ confirmUrl, unsubscribeUrl })` where both URLs are built from the subscription token |
| 3 | GET /api/confirm?token=xxx updates confirmed=true, confirmed_at=now() and redirects to /subscribe/confirm | VERIFIED | `src/app/api/confirm/route.ts`: queries by token, updates `{confirmed: true, confirmed_at: new Date().toISOString()}`, redirects to `/subscribe/confirm` |
| 4 | GET /api/unsubscribe?token=xxx sets unsubscribed_at=now() and redirects to /unsubscribe | VERIFIED | `src/app/api/unsubscribe/route.ts`: queries by token, updates `{unsubscribed_at: new Date().toISOString()}`, redirects to `/unsubscribe` |
| 5 | Rate limiting blocks more than 5 requests per minute per IP | VERIFIED | `src/lib/rate-limit.ts`: Map-based limiter with default `limit=5, windowMs=60_000`; subscribe route calls `rateLimit(ip)` before any processing and returns 429 on false |
| 6 | Duplicate email submissions handled gracefully | VERIFIED | Route checks for existing subscriber: confirmed+active returns 409; unconfirmed resends confirmation; unsubscribed resets and resends |
| 7 | EmailCapture component renders inline form with email input, consent checkbox (unchecked by default), and submit button | VERIFIED | `src/components/email-capture.tsx`: `useState(false)` for consent; checkbox `checked={consent}`; submit disabled when `!consent \|\| status === 'loading'` |
| 8 | Consent checkbox links to /privacy and blocks submission when unchecked | VERIFIED | `href="/privacy"` in consent label; `if (!consent) return` in handleSubmit; button `disabled={!consent ...}` |
| 9 | Form replaces itself with success message after successful submission | VERIFIED | On `res.ok`, sets `status='success'`; success branch renders `<div className="rounded-lg bg-emerald-50 ...">Check Your Email</div>` replacing the form |
| 10 | EmailCapture appears on 3 pages with correct source values | VERIFIED | homepage: `source="homepage"`, article: `source="article-cta"`, find-accountant: `source="directory-waitlist"` -- all confirmed via grep |
| 11 | EmailCTAPlaceholder is no longer imported or used anywhere in src/app/ | VERIFIED | `grep -rn "EmailCTAPlaceholder" src/app/` returns empty |

**Score:** 11/11 truths verified (automated)

### Required Artifacts

| Artifact | Provided | Status | Details |
|----------|----------|--------|---------|
| `src/lib/supabase/admin.ts` | Service role Supabase client | VERIFIED | Exports `supabaseAdmin` using `SUPABASE_SERVICE_ROLE_KEY`, `persistSession: false` |
| `src/lib/rate-limit.ts` | In-memory IP rate limiter | VERIFIED | Exports `rateLimit(ip, limit=5, windowMs=60_000)` returning boolean |
| `src/emails/confirmation-email.tsx` | React Email confirmation template | VERIFIED | Exports `ConfirmationEmail`, contains confirm button + unsubscribe link, brand colors applied |
| `src/app/api/subscribe/route.ts` | Subscribe POST endpoint | VERIFIED | Full implementation: validation, rate limit, duplicate handling, DB insert, Resend email |
| `src/app/api/confirm/route.ts` | Confirm GET endpoint | VERIFIED | Token lookup, idempotent confirmed check, DB update, redirect |
| `src/app/api/unsubscribe/route.ts` | Unsubscribe GET endpoint | VERIFIED | Token lookup, DB update, redirect |
| `supabase/migrations/001_create_subscribers.sql` | SQL migration for subscribers table | VERIFIED | All 11 columns present, RLS enabled, indexes on token and email, source CHECK constraint |
| `src/components/email-capture.tsx` | Reusable client-side email capture form | VERIFIED | `'use client'`, source-based defaults, consent checkbox, fetch POST, inline success state |
| `src/app/subscribe/confirm/page.tsx` | Thank-you page after confirmation | VERIFIED | "Subscription Confirmed" heading, `?error=invalid` handling, metadata exported |
| `src/app/unsubscribe/page.tsx` | Unsubscribe confirmation page | VERIFIED | "You've Been Unsubscribed" heading, `?error=invalid` handling, metadata exported |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/api/subscribe/route.ts` | `src/lib/supabase/admin.ts` | `import supabaseAdmin` | WIRED | Line 2: `import { supabaseAdmin } from '@/lib/supabase/admin'` |
| `src/app/api/subscribe/route.ts` | `src/emails/confirmation-email.tsx` | `import ConfirmationEmail` | WIRED | Line 5: `import { ConfirmationEmail } from '@/emails/confirmation-email'` |
| `src/app/api/subscribe/route.ts` | `src/lib/rate-limit.ts` | `import rateLimit` | WIRED | Line 3: `import { rateLimit } from '@/lib/rate-limit'` |
| `src/app/api/confirm/route.ts` | `src/lib/supabase/admin.ts` | `import supabaseAdmin` | WIRED | Line 2: `import { supabaseAdmin } from '@/lib/supabase/admin'` |
| `src/app/api/unsubscribe/route.ts` | `src/lib/supabase/admin.ts` | `import supabaseAdmin` | WIRED | Line 2: `import { supabaseAdmin } from '@/lib/supabase/admin'` |
| `src/components/email-capture.tsx` | `/api/subscribe` | `fetch POST` | WIRED | Line 48: `fetch('/api/subscribe', { method: 'POST', ... })` |
| `src/app/page.tsx` | `src/components/email-capture.tsx` | `import EmailCapture` | WIRED | Line 8: `import { EmailCapture } from '@/components/email-capture'`; used at line 93 |
| `src/app/guides/[slug]/page.tsx` | `src/components/email-capture.tsx` | `import EmailCapture` | WIRED | Line 9: `import { EmailCapture } from '@/components/email-capture'`; used at line 135 |
| `src/app/find-accountant/page.tsx` | `src/components/email-capture.tsx` | `import EmailCapture` | WIRED | Line 2: `import { EmailCapture } from '@/components/email-capture'`; used at line 69 |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `src/components/email-capture.tsx` | `status`, `errorMessage` | `fetch('/api/subscribe')` response | Yes — real API response drives state transitions | FLOWING |
| `src/app/api/subscribe/route.ts` | subscriber row | `supabaseAdmin.from('subscribers').insert(...)` | Yes — real Supabase DB write (service role) | FLOWING |
| `src/app/api/confirm/route.ts` | subscriber record | `supabaseAdmin.from('subscribers').select(...).eq('confirmation_token', token)` | Yes — real DB query by token | FLOWING |
| `src/app/api/unsubscribe/route.ts` | subscriber record | `supabaseAdmin.from('subscribers').select(...).eq('confirmation_token', token)` | Yes — real DB query by token | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| rate-limit module exports function | `node -e "const m=require('./src/lib/rate-limit'); console.log(typeof m.rateLimit)"` | Not testable (ESM/TS) | SKIP |
| SQL migration contains all required columns | `grep "unsubscribed_at\|consent_text\|ip_address" supabase/migrations/001_create_subscribers.sql` | All three present | PASS |
| EmailCapture consent default is false | Checked via `grep "useState(false)"` | Line 32 confirmed | PASS |
| No EmailCTAPlaceholder in app pages | `grep -rn "EmailCTAPlaceholder" src/app/` | No matches | PASS |
| All 4 git commits from SUMMARYs exist | `git log --oneline \| grep "15bb4a0\|4ca4a3d\|9f8bbe0\|87d1c5e"` | All 4 found | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| EMAIL-01 | 07-01 | Supabase subscribers table with all required columns | SATISFIED | `supabase/migrations/001_create_subscribers.sql` — 11 columns, RLS, indexes |
| EMAIL-02 | 07-01 | /api/subscribe validates email, inserts to Supabase, sends confirmation via Resend | SATISFIED | `src/app/api/subscribe/route.ts` — full implementation with validation, DB insert, Resend send |
| EMAIL-03 | 07-01 | Double opt-in: confirmation email with magic link, updates confirmed flag | SATISFIED | Confirm email sent with `confirmUrl`; `/api/confirm` sets `confirmed=true, confirmed_at=now()` |
| EMAIL-04 | 07-01 | Source tracking: homepage, directory-waitlist, article-cta | SATISFIED | `source` field validated against `VALID_SOURCES` array, stored in DB insert |
| EMAIL-05 | 07-02 | GDPR consent: explicit checkbox (not pre-checked), consent text stored, privacy policy link | SATISFIED | `useState(false)` default; `/privacy` link in label; `consentText` sent to API and stored in `consent_text` column |
| EMAIL-06 | 07-01 | Unsubscribe mechanism: link in every email, updates Supabase record | SATISFIED | `unsubscribeUrl` in `ConfirmationEmail` props; `/api/unsubscribe` sets `unsubscribed_at` |
| EMAIL-07 | 07-02 | Reusable EmailCapture component deployable on any page with configurable source | SATISFIED | `source` prop drives headings/descriptions; deployed on 3 pages with different source values |
| EMAIL-08 | 07-01 | Consent proof logging: timestamp, IP address, consent text version stored per subscriber | SATISFIED | Subscribe route captures `ip` from `x-forwarded-for`, stores `consent_text`, `consent_timestamp`, `ip_address` in DB |

**All 8 requirements SATISFIED** (EMAIL-01 through EMAIL-08).

No orphaned requirements: all 8 EMAIL-* requirements assigned to Phase 7 in REQUIREMENTS.md are accounted for in the two plans.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/components/email-capture.tsx` | 94 | `placeholder="your@email.com"` | Info | HTML input placeholder attribute — correct UI behavior, not a stub |

No blocker or warning anti-patterns found. No TODO/FIXME/placeholder stubs. No empty implementations. No hardcoded empty returns.

### Human Verification Required

#### 1. GDPR Consent Visual Enforcement

**Test:** Visit http://localhost:3000 and scroll to email capture. Attempt to click Subscribe with unchecked checkbox.
**Expected:** Button is visually greyed/disabled and cannot be clicked. Checking the checkbox activates the button.
**Why human:** CSS `disabled:opacity-50` and HTML `disabled` attribute require browser rendering to confirm visual feedback.

#### 2. Full Double Opt-In Flow

**Test:** With SQL migration applied and env vars set, submit a real email on the homepage. Check Supabase for the pending subscriber row, then click the confirmation link in the received email.
**Expected:** Row created with `confirmed=false`, confirmation email received from `onboarding@resend.dev`, clicking the link sets `confirmed=true` and `confirmed_at` in Supabase, browser redirects to `/subscribe/confirm` with "Subscription Confirmed" message.
**Why human:** Requires live Resend API key, Supabase migration applied, and real email delivery.

#### 3. Unsubscribe via Email Link

**Test:** After confirming a subscription, click the unsubscribe link at the bottom of the confirmation email.
**Expected:** Supabase row gets `unsubscribed_at` timestamp, browser redirects to `/unsubscribe` showing "You've Been Unsubscribed."
**Why human:** Requires live email with real token in unsubscribe URL.

#### 4. Duplicate Email Handling (409 Response)

**Test:** Submit the same email that is already confirmed and active.
**Expected:** Form shows error message "This email is already subscribed."
**Why human:** Requires Supabase subscribers table populated with a confirmed subscriber.

#### 5. Rate Limit Enforcement

**Test:** Submit 6 requests from the same IP within 60 seconds (use curl or DevTools).
**Expected:** 6th request returns HTTP 429 and form shows "Too many requests. Please try again later."
**Why human:** In-memory rate limiter requires repeated live requests to the running server.

### Gaps Summary

No gaps. All must-haves from both plans are fully implemented and verified in code:

- All 10 artifacts exist with substantive implementations (no stubs)
- All 9 key links are wired
- All 4 data flows produce real data (live DB queries, not static returns)
- All 8 requirements (EMAIL-01 through EMAIL-08) are satisfied
- 4 git commits from the SUMMARYs exist in git history

The only outstanding items are 5 human verification checks that require a running server with live Supabase and Resend credentials. These are integration/E2E tests that cannot be verified statically.

**One setup prerequisite not yet automated:** The SQL migration at `supabase/migrations/001_create_subscribers.sql` must be manually run in the Supabase dashboard SQL editor before the API routes will function. This is documented in `07-01-SUMMARY.md` under "User Setup Required."

---

_Verified: 2026-04-06T08:00:00Z_
_Verifier: Claude (gsd-verifier)_
