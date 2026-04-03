---
phase: 2
slug: content-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js built-in build + Velite compilation |
| **Config file** | velite.config.ts (created in this phase) |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | CONT-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CONT-02 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CONT-05 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | CONT-03 | build+verify | `npm run build` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | CONT-04 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 2 | CONT-06 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 02-02-04 | 02 | 2 | CONT-07 | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `velite.config.ts` — Velite configuration with Zod schema
- [ ] `npm run build` — must succeed with Velite compilation step
- [ ] `npm run lint` — must pass with zero errors

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Future-dated article hidden | CONT-03 | Requires date comparison at build | Set publishDate to tomorrow, build, verify article absent from output |
| Pillar vs spoke distinction | CONT-06 | Visual/data verification | Check query results include type field, verify different rendering |
| Reading time accuracy | CONT-07 | Calculation verification | Check article metadata shows correct reading time for word count |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
