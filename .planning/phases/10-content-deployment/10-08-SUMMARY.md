---
phase: 10-content-deployment
plan: 08
subsystem: content
tags: [mdx, costs-and-fees, seo, pricing, irish-accounting]

# Dependency graph
requires:
  - phase: 10-content-deployment-01
    provides: "Pillar articles and MDX content pipeline"
provides:
  - "8 Costs & Fees spoke articles with Irish-specific pricing data"
  - "Complete costs-and-fees content cluster (pillar + 8 spokes)"
affects: [content-deployment, seo, directory-prep]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Costs & Fees spoke pattern: EUR pricing tables, fee ranges, comparison guidance"]

key-files:
  created:
    - content/guides/accountant-fees-sole-trader-ireland.mdx
    - content/guides/accountant-fees-limited-company-ireland.mdx
    - content/guides/tax-return-cost-ireland.mdx
    - content/guides/bookkeeper-cost-ireland.mdx
    - content/guides/company-formation-cost-ireland.mdx
    - content/guides/payroll-cost-ireland.mdx
    - content/guides/audit-cost-ireland.mdx
    - content/guides/accountant-fees-what-is-included-ireland.mdx
  modified: []

key-decisions:
  - "All 8 spokes target high-intent pricing queries that feed directly into future directory product"
  - "Specific EUR amounts used throughout for AI citation readiness and search snippet optimization"

patterns-established:
  - "Costs & Fees spoke pattern: fee range tables, breakdown by business size, comparison guidance, hidden charges warnings"

requirements-completed: [WRITE-05, WRITE-06]

# Metrics
duration: 13min
completed: 2026-04-06
---

# Phase 10 Plan 08: Costs & Fees Spoke Articles Summary

**8 spoke articles covering Irish accounting service pricing: sole trader fees, limited company fees, tax return costs, bookkeeper costs, company formation, payroll, audit, and what's included in accountant fees**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-06T11:22:07Z
- **Completed:** 2026-04-06T11:35:19Z
- **Tasks:** 2
- **Files created:** 8

## Accomplishments
- Wrote 8 Costs & Fees spoke articles with specific Irish pricing data (EUR amounts throughout)
- Each article includes KeyTakeaways and FAQSection MDX components with 3-5 FAQ items
- All articles linked to pillar via relatedSlugs referencing what-does-an-accountant-cost-ireland
- Complete coverage of high-intent pricing queries: sole trader fees (EUR 300-800), limited company fees (EUR 1,500-3,500), tax returns (EUR 200-1,500), bookkeepers (EUR 25-50/hr), company formation (EUR 50-600), payroll (EUR 5-15/employee), audit (EUR 3,000-15,000), fee inclusions

## Task Commits

Each task was committed atomically:

1. **Task 1: Write Costs & Fees spokes 1-4** - `3a0ad10` (feat)
2. **Task 2: Write Costs & Fees spokes 5-8** - `12cddba` (feat)

## Files Created/Modified
- `content/guides/accountant-fees-sole-trader-ireland.mdx` - Sole trader accounting fees EUR 300-800/year
- `content/guides/accountant-fees-limited-company-ireland.mdx` - Limited company fees EUR 1,500-3,500/year
- `content/guides/tax-return-cost-ireland.mdx` - Form 11, CT1, VAT return preparation costs
- `content/guides/bookkeeper-cost-ireland.mdx` - Bookkeeper hourly rates and monthly packages
- `content/guides/company-formation-cost-ireland.mdx` - CRO fees, formation agents, first-year costs
- `content/guides/payroll-cost-ireland.mdx` - Payroll processing fees, employer costs, software
- `content/guides/audit-cost-ireland.mdx` - Statutory audit costs and exemption thresholds
- `content/guides/accountant-fees-what-is-included-ireland.mdx` - Standard vs premium packages, hidden charges

## Decisions Made
- All articles use specific EUR pricing ranges based on current Irish market rates
- Publish dates staggered across August-September 2026 for 2/week cadence

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Costs & Fees content cluster complete (1 pillar + 8 spokes)
- All spokes reference the pillar article via relatedSlugs
- High-intent pricing content ready for directory product conversion in Phase 2

---
*Phase: 10-content-deployment*
*Completed: 2026-04-06*
