---
phase: 7
slug: email-capture
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-04
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + API route testing |
| **Config file** | next.config.mjs (existing) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Wave 0 Requirements

- [ ] `npm install @supabase/supabase-js resend @react-email/components` — packages installed
- [ ] Supabase subscribers table created via SQL migration
- [ ] `npm run build` — must succeed

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Submit form inserts to Supabase | EMAIL-01, EMAIL-02 | Requires running Supabase | Submit email on homepage, check Supabase table |
| Confirmation email arrives | EMAIL-03 | Requires Resend delivery | Check inbox after submission |
| Confirmation link works | EMAIL-03 | End-to-end flow | Click link, verify confirmed flag updates |
| Consent checkbox blocks submission | EMAIL-05 | Interactive behavior | Try submitting without checkbox checked |
| Unsubscribe link works | EMAIL-06 | End-to-end flow | Click unsubscribe link in email |
| Rate limiting | EMAIL-02 | Requires rapid requests | Submit 6 times in 1 minute, verify 429 on 6th |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
