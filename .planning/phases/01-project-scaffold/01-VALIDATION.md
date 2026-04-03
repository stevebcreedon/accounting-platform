---
phase: 1
slug: project-scaffold
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest 29.x / Next.js built-in |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npm run lint`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FOUND-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 1 | FOUND-02 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUND-03 | build+visual | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | FOUND-04 | build+visual | `npm run build` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | FOUND-05 | lint | `npm run lint` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm run build` — must succeed after scaffold
- [ ] `npm run lint` — must pass with zero errors
- [ ] `npm run dev` — must serve styled page on localhost

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Brand colors render correctly | FOUND-03 | Visual verification | Open localhost, verify cream background, charcoal text, burnt-orange accents |
| Inter/Satoshi fonts load | FOUND-04 | Visual + network tab | Check DevTools network tab for font files, verify rendering |
| Prose typography for articles | FOUND-05 | Visual verification | Add sample prose content, verify heading sizes, line heights, link colors |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
