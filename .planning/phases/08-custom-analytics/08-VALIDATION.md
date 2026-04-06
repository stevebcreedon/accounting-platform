---
phase: 8
slug: custom-analytics
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 8 — Validation Strategy

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

- [ ] `npm install isbot` — bot detection dependency
- [ ] Supabase analytics tables created via SQL migration
- [ ] `npm run build` — must succeed

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Page view inserted to Supabase | ANAL-01, ANAL-02 | Requires running Supabase | Visit page, check page_views table |
| Bot filtering works | ANAL-03 | Requires bot user agent | curl with Googlebot UA, verify no row inserted |
| Article read fires at 75% scroll | ANAL-04 | Interactive behavior | Scroll article to bottom, check article_reads table |
| Outbound click logged | ANAL-05 | Interactive behavior | Click Revenue.ie link, check outbound_clicks table |
| Cron rollup executes | ANAL-06 | Requires Vercel deployment | Trigger /api/cron/rollup with CRON_SECRET, check summary tables |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
