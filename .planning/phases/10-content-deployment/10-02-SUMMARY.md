---
phase: 10-content-deployment
plan: 02
subsystem: content
tags: [mdx, pillar-articles, seo, irish-tax, accountant, contractor, rct]

requires:
  - phase: 02-content-pipeline
    provides: Velite MDX pipeline with Zod schema validation
  - phase: 03-article-template
    provides: Article page template with KeyTakeaways, FAQSection components
provides:
  - 3 pillar articles completing all 8 category pillar coverage
  - Choosing an Accountant pillar (how-to-choose-accountant-ireland)
  - Compliance & Deadlines pillar (irish-tax-deadlines-calendar)
  - Industry Guides pillar (accounting-for-contractors-ireland)
affects: [10-content-deployment, seo, sitemap]

tech-stack:
  added: []
  patterns: [structured-intro-pattern, pillar-article-3000-4000-words]

key-files:
  created:
    - content/guides/how-to-choose-accountant-ireland.mdx
    - content/guides/irish-tax-deadlines-calendar.mdx
    - content/guides/accounting-for-contractors-ireland.mdx
  modified: []

key-decisions:
  - "All 3 articles follow structured intro pattern with direct factual answer in first sentence"
  - "Irish Tax Deadlines covers 2026/2027 with full bi-monthly VAT3 tables"
  - "Contractor guide covers RCT rates, sole trader vs company threshold guidance at EUR 75k-100k"

patterns-established:
  - "Pillar article pattern: 3000-4000 words, structured intro, KeyTakeaways (5 bullets), FAQSection (5 questions)"

requirements-completed: [WRITE-01, WRITE-02, WRITE-03, WRITE-04, WRITE-05]

duration: 7min
completed: 2026-04-06
---

# Phase 10 Plan 02: Pillar Articles Batch 2 Summary

**3 pillar articles completing all 8 category coverage: Choosing an Accountant (3544 words), Irish Tax Deadlines Calendar (3422 words), and Accounting for Contractors (3870 words)**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-06T11:08:13Z
- **Completed:** 2026-04-06T11:15:00Z
- **Tasks:** 2
- **Files created:** 3

## Accomplishments
- All 8 content categories now have pillar articles (combined with Plan 01's 5 articles)
- Choosing an Accountant pillar covers qualifications (CAI, CPA, ACCA), red flags, Letter of Engagement, switching process
- Irish Tax Deadlines Calendar covers pay-and-file, CT1, bi-monthly VAT3 dates, PAYE, CRO, RCT, DWT, penalties
- Accounting for Contractors covers employment status tests, RCT rates (0%/20%/35%), sole trader vs company, expenses, pension options

## Task Commits

Each task was committed atomically:

1. **Task 1: Write Choosing an Accountant and Compliance & Deadlines pillar articles** - `4b209b4` (feat)
2. **Task 2: Write Industry Guides pillar article** - `6f1e05f` (feat)

## Files Created/Modified
- `content/guides/how-to-choose-accountant-ireland.mdx` - Choosing an Accountant pillar (3544 words)
- `content/guides/irish-tax-deadlines-calendar.mdx` - Compliance & Deadlines pillar (3422 words)
- `content/guides/accounting-for-contractors-ireland.mdx` - Industry Guides pillar (3870 words)

## Decisions Made
- All 3 articles use structured intro pattern with direct factual answer in first 1-2 sentences for AI citation readiness
- Irish Tax Deadlines covers 2026/2027 calendar years with full bi-monthly VAT3 filing date tables
- Contractor guide includes EUR 75k-100k threshold guidance for sole trader vs limited company decision

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all 3 articles are complete with full Irish-specific content, no placeholder text.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 8 pillar articles complete across all categories
- Ready for spoke article writing in subsequent plans
- All articles use consistent frontmatter schema validated by Velite Zod config

## Self-Check: PASSED

All 3 article files confirmed on disk. Both task commits (4b209b4, 6f1e05f) verified in git log.

---
*Phase: 10-content-deployment*
*Completed: 2026-04-06*
