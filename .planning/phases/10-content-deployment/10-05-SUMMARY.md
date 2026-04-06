---
phase: 10-content-deployment
plan: 05
subsystem: content
tags: [mdx, tax-obligations, irish-tax, vat, corporation-tax, income-tax, paye, usc, prsi, cgt, rct]

requires:
  - phase: 10-content-deployment-01
    provides: "Pillar articles and MDX content patterns"
provides:
  - "8 Tax Obligations spoke articles covering VAT returns, corporation tax, income tax, PAYE, USC/PRSI, CGT, RCT, and tax credits"
affects: [10-content-deployment remaining plans, SEO indexing, tax-obligations category page]

tech-stack:
  added: []
  patterns: [spoke article MDX format with KeyTakeaways and FAQSection components]

key-files:
  created:
    - content/guides/vat-returns-ireland-guide.mdx
    - content/guides/corporation-tax-ireland-guide.mdx
    - content/guides/income-tax-self-employed-ireland.mdx
    - content/guides/paye-employer-guide-ireland.mdx
    - content/guides/usc-prsi-explained-ireland.mdx
    - content/guides/capital-gains-tax-ireland.mdx
    - content/guides/relevant-contracts-tax-ireland.mdx
    - content/guides/tax-credits-reliefs-ireland.mdx
  modified: []

key-decisions:
  - "All spoke articles use consistent MDX structure: frontmatter, structured intro, detailed sections, KeyTakeaways, FAQSection"
  - "Each article references specific Irish tax rates, Revenue forms, and ROS filing processes"

patterns-established:
  - "Tax spoke article pattern: specific rates/thresholds, Revenue form names, ROS deadlines, practical examples with EUR amounts"

requirements-completed: [WRITE-05, WRITE-06]

duration: 13min
completed: 2026-04-06
---

# Phase 10 Plan 05: Tax Obligations Spokes Summary

**8 spoke articles for Tax Obligations category covering VAT returns, corporation tax, income tax, PAYE, USC/PRSI, CGT, RCT, and business tax credits/reliefs**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-06T11:22:13Z
- **Completed:** 2026-04-06T11:35:13Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- Wrote 8 Tax Obligations spoke articles, completing the category's content cluster
- Each article references specific Irish tax rates, Revenue forms (VAT3, CT1, Form 11, RPN), and ROS filing deadlines
- All articles include KeyTakeaways (4 bullets each) and FAQSection (3-5 questions each) with Ireland-specific answers
- Published dates staggered across June 2026 (5th, 9th, 12th, 16th, 19th, 23rd, 26th, 30th)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write Tax Obligations spokes 1-4** - `7370d23` (feat)
2. **Task 2: Write Tax Obligations spokes 5-8** - `2bddc8e` (feat)

## Files Created/Modified
- `content/guides/vat-returns-ireland-guide.mdx` - VAT3 form, bi-monthly filing, ROS process, penalties
- `content/guides/corporation-tax-ireland-guide.mdx` - 12.5% rate, CT1 return, preliminary tax, R&D credit, start-up relief
- `content/guides/income-tax-self-employed-ireland.mdx` - Tax rates/bands, Form 11, USC, PRSI Class S, allowable expenses
- `content/guides/paye-employer-guide-ireland.mdx` - Employer registration, PAYE Modernisation, RPNs, employer PRSI, BIK
- `content/guides/usc-prsi-explained-ireland.mdx` - USC rates/bands, PRSI classes A/S/J/M, self-employment surcharge
- `content/guides/capital-gains-tax-ireland.mdx` - 33% rate, entrepreneur relief (10%), retirement relief, payment dates
- `content/guides/relevant-contracts-tax-ireland.mdx` - Construction/forestry/meat processing, 0%/20%/35% rates
- `content/guides/tax-credits-reliefs-ireland.mdx` - R&D credit, start-up relief, EIIS, KEEP, capital allowances

## Decisions Made
- All spoke articles follow the same MDX structure as existing pillar articles (structured intro, detailed sections, KeyTakeaways, FAQSection)
- Each article references specific Irish tax rates, Revenue form names, and ROS deadlines for maximum Ireland-specific SEO value
- relatedSlugs cross-link within tax-obligations category and to pillar articles

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Tax Obligations category now has 1 pillar + 8 spoke articles (9 total)
- All spokes cross-reference pillar article (how-to-register-for-vat-in-ireland) and related spokes
- Remaining content plans can proceed independently

---
*Phase: 10-content-deployment*
*Completed: 2026-04-06*
