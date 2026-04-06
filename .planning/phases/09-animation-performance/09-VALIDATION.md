---
phase: 9
slug: animation-performance
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-06
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + Lighthouse audit |
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

- [ ] `npm install motion` — motion library installed
- [ ] `npm run build` — must succeed with LazyMotion provider

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Page fade transition | ANIM-01 | Visual behavior | Navigate between pages, verify fade |
| Scroll reveals on homepage | ANIM-02 | Scroll interaction | Scroll homepage, verify sections animate in |
| Card hover micro-interactions | ANIM-03 | Hover interaction | Hover cards, verify scale + shadow lift |
| Reading progress bar | ANIM-05 | Scroll behavior | Scroll article, verify burnt-orange bar fills |
| Reduced motion | ANIM-07 | System setting | Enable prefers-reduced-motion, verify no animations |
| Lighthouse 90+ mobile | PERF-01 | External tool | Run Lighthouse in Chrome DevTools on article page |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
