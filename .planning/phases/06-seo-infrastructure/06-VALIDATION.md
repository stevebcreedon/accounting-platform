---
phase: 6
slug: seo-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-04
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js build + schema validation |
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

- [ ] `npm run build` — must succeed with all metadata and schemas
- [ ] `npm run lint` — must pass with zero errors

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| OG image renders correctly | SEO-10 | Visual output | Visit /api/og?title=Test&category=Tax, verify image |
| JSON-LD passes Rich Results Test | SEO-02, SEO-04 | External tool | Paste article URL into Google Rich Results Test |
| Sitemap lists all pages | SEO-06 | Content verification | Visit /sitemap.xml, count entries |
| Meta tags in page source | SEO-01 | Content verification | View source on article, verify og:title, twitter:card |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
