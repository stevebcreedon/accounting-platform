---
phase: 5
slug: navigation-accessibility
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-03
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + visual/a11y inspection |
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
| 05-01-01 | 01 | 1 | NAV-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | NAV-02 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 2 | NAV-03, NAV-04, PERF-05 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 2 | PERF-06 | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm run build` — must succeed with header/footer in layout
- [ ] `npm run lint` — must pass with zero errors

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sticky header stays visible on scroll | NAV-01 | Scroll behavior | Scroll article page, verify header remains fixed at top |
| Mobile hamburger opens overlay | NAV-01 | Interactive behavior | Resize to mobile, tap hamburger, verify full-screen overlay |
| Footer 3-column layout | NAV-02 | Visual layout | Verify brand, links, legal columns on desktop; stacked on mobile |
| Skip-to-content on Tab | NAV-04 | Keyboard behavior | Tab from page load, verify skip link appears, press Enter to jump |
| Focus indicators visible | PERF-05 | Keyboard navigation | Tab through all interactive elements, verify burnt-orange focus ring |
| Print article clean output | PERF-06 | Print preview | Ctrl+P on article page, verify no nav/footer, Georgia serif |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
