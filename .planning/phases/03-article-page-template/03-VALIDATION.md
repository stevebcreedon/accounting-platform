---
phase: 3
slug: article-page-template
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + visual inspection |
| **Config file** | next.config.mjs (existing) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 25 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | ART-06, ART-07, ART-08, CONT-04 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | ART-02 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | ART-03 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | ART-04 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 2 | ART-05, ART-01 | build+visual | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm run build` — must succeed with article route
- [ ] `npm run lint` — must pass with zero errors
- [ ] `npm run dev` — must serve article pages on localhost

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 10 sections render correctly | ART-01 | Visual layout verification | Open article page, verify all 10 sections present in order |
| TOC scroll tracking highlights active section | ART-02 | Intersection Observer behavior | Scroll through article, verify TOC sidebar highlights current H2 |
| FAQ accordion one-at-a-time | ART-04 | Interactive behavior | Click multiple FAQ items, verify only one opens at a time |
| Related article cards display | ART-05 | Visual + data verification | Check 2-3 related cards appear with correct article data |
| Pillar article enhanced header | CONT-06 (data) | Visual distinction | Open pillar article, verify Comprehensive Guide badge + accent bar |
| JSON-LD FAQ schema in page source | ART-04 | Schema validation | View page source, find FAQPage JSON-LD, validate structure |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
