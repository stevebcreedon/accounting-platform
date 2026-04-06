# Phase 7: Email Capture - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-04-04
**Phase:** 07-email-capture
**Areas discussed:** Subscription flow & UX, GDPR & consent, Email templates, Backend & Supabase

---

## Subscription Flow & UX

| Option | Description | Selected |
|--------|-------------|----------|
| Inline form (Recommended) | Email + checkbox + button, replaces placeholder | ✓ |
| Modal/popup on scroll | Triggered after scroll/time | |
| You decide | | |

**User's choice:** Inline form

---

| Option | Description | Selected |
|--------|-------------|----------|
| Inline success message (Recommended) | Form replaces with confirmation text | ✓ |
| Redirect to thank-you page | Navigate to /subscribe/thank-you | |
| You decide | | |

**User's choice:** Inline success message

---

## GDPR & Consent

| Option | Description | Selected |
|--------|-------------|----------|
| Stored string per subscriber (Recommended) | Exact consent text stored per record | ✓ |
| Version number + lookup table | Separate version tracking | |
| You decide | | |

**User's choice:** Stored string per subscriber

---

## Email Templates

| Option | Description | Selected |
|--------|-------------|----------|
| Confirmation only (Recommended) | One email, stays within free tier | ✓ |
| Confirmation + welcome | Two emails per subscriber | |
| You decide | | |

**User's choice:** Confirmation only

---

## Backend & Supabase

| Option | Description | Selected |
|--------|-------------|----------|
| Simple in-memory rate limit (Recommended) | IP-based, 5/min/IP | ✓ |
| No rate limiting | Rely on service limits | |
| You decide | | |

**User's choice:** Simple in-memory rate limit

---

## Claude's Discretion

- Form styling, loading/error states
- Confirmation email HTML layout
- Supabase RLS policies, API error handling
- Unsubscribe page design

## Deferred Ideas

None
