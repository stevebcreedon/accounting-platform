# Phase 7: Email Capture - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the full email subscription system: Supabase subscribers table, API route with validation and rate limiting, double opt-in via Resend confirmation email, GDPR consent with proof logging, source tracking (homepage/directory-waitlist/article-cta), unsubscribe mechanism, and a reusable EmailCapture component that replaces the current placeholder on all pages.

</domain>

<decisions>
## Implementation Decisions

### Subscription Flow & UX
- **D-01:** Form is **inline** — email input + consent checkbox + submit button, directly on the page. Replaces `EmailCTAPlaceholder`. Different heading per source ("Stay Updated" for articles, "Get Early Access" for directory waitlist).
- **D-02:** After submission, **inline success message** — form replaces itself with "Check your email to confirm your subscription." No page redirect.
- **D-03:** Source tracking via hidden field: `homepage`, `directory-waitlist`, `article-cta`.

### GDPR & Consent
- **D-04:** Consent checkbox is **unchecked by default**, with text like "I agree to receive email updates from The Ledger. View our [Privacy Policy](/privacy)."
- **D-05:** Consent text is **stored as a string** per subscriber — the exact text shown at time of subscription. No separate version table.
- **D-06:** IP address, consent text, and timestamp all stored per subscriber for GDPR proof.

### Email Templates
- **D-07:** **Confirmation email only** — one email with "Confirm your subscription" and magic link. No separate welcome email. Stays within Resend free tier (100/day).
- **D-08:** Confirmation email uses React Email components, branded with "The Ledger" styling.
- **D-09:** Every email includes an unsubscribe link.

### Backend & Supabase
- **D-10:** **Simple in-memory rate limiting** — IP-based, 5 requests per minute per IP. Prevents spam without external dependencies.
- **D-11:** Supabase subscribers table schema: id, email, source, confirmed, confirmation_token, created_at, confirmed_at, consent_text, consent_timestamp, ip_address, unsubscribed_at.
- **D-12:** After clicking confirmation link, user sees a **thank-you page** at `/subscribe/confirm`.

### Claude's Discretion
- Exact form styling and layout within the editorial brand
- Loading state animation (spinner vs text)
- Error message wording (invalid email, already subscribed, rate limited)
- Confirmation email HTML layout
- React Email component structure
- Supabase RLS policies
- API route error handling details
- Unsubscribe page design

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDE.md` — Stack: @supabase/supabase-js ^2, @supabase/ssr ^0.6, resend ^6.10, @react-email/components ^1.0.10, @react-email/render ^2.0.4
- `CLAUDE.md` — GDPR: double opt-in, explicit consent, privacy policy, no pre-checked boxes, unsubscribe in every email

### Prior Phase Artifacts
- `.planning/phases/04-site-structure-pages/04-CONTEXT.md` — Find-accountant page has directory-waitlist email capture
- `.planning/phases/01-project-scaffold/01-UI-SPEC.md` — Design tokens for form styling

### Existing Code
- `src/components/article/email-cta-placeholder.tsx` — Current placeholder to be replaced
- `src/app/page.tsx` — Homepage uses EmailCTAPlaceholder
- `src/app/guides/[slug]/page.tsx` — Article pages use EmailCTAPlaceholder
- `src/app/find-accountant/page.tsx` — Directory waitlist placeholder
- `src/app/privacy/page.tsx` — Already references double opt-in, consent, unsubscribe

### Planning
- `.planning/PROJECT.md` — Core project context
- `.planning/REQUIREMENTS.md` — EMAIL-01 through EMAIL-08

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `EmailCTAPlaceholder` — to be replaced by real `EmailCapture` component
- `cn()` utility — conditional class merging
- Tailwind design tokens — form input styling
- Lucide React icons — for loading/success/error states

### Established Patterns
- Server components by default, `"use client"` only for interactivity
- API routes via Next.js App Router (`src/app/api/`)
- Environment variables for secrets (Supabase URL/key, Resend API key)

### Integration Points
- New: `src/app/api/subscribe/route.ts` — subscription API
- New: `src/app/api/subscribe/confirm/route.ts` — confirmation handler
- New: `src/app/subscribe/confirm/page.tsx` — thank-you page
- New: `src/app/api/unsubscribe/route.ts` — unsubscribe handler
- New: `src/app/unsubscribe/page.tsx` — unsubscribe confirmation page
- New: `src/components/email/` — React Email templates
- Replace: `EmailCTAPlaceholder` → `EmailCapture` in 3 pages
- New: Supabase migration SQL for subscribers table

</code_context>

<specifics>
## Specific Ideas

- Form should feel premium and trustworthy — the consent checkbox and privacy link build trust
- Confirmation email should be simple and warm — "The Ledger" brand, one clear CTA button
- Rate limiting protects against spam without adding complexity
- Supabase env vars need to be set up (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- Resend env var (RESEND_API_KEY) needs to be configured

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-email-capture*
*Context gathered: 2026-04-04*
