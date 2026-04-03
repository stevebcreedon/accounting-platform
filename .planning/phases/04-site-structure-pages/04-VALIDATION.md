---
phase: 4
slug: site-structure-pages
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + visual inspection |
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

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | PAGE-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | PAGE-10 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 1 | PAGE-02 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-02-02 | 02 | 1 | PAGE-03 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-03-01 | 03 | 2 | PAGE-04 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-03-02 | 03 | 2 | PAGE-05, PAGE-06 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-03-03 | 03 | 2 | PAGE-07, PAGE-08 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 04-03-04 | 03 | 2 | PAGE-09 | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm run build` — must succeed with all new routes
- [ ] `npm run lint` — must pass with zero errors

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Homepage hero renders with editorial feel | PAGE-01 | Visual verification | Open /, verify hero headline, latest articles, category grid, email CTA |
| Category filter pills work | PAGE-02 | Interactive behavior | Click filter pills on /guides, verify articles filter correctly |
| Find-accountant waitlist page | PAGE-04 | Visual + content | Open /find-accountant, verify feature previews and email capture |
| Privacy policy references Irish DPC | PAGE-07 | Content accuracy | Read /privacy, verify DPC address, GDPR rights listed |
| 404 page navigation | PAGE-09 | Visual + links | Visit /nonexistent, verify category links and home link |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
