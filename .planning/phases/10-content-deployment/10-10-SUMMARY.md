---
phase: 10-content-deployment
plan: 10
subsystem: content
tags: [mdx, industry-guides, seo, irish-tax]

requires:
  - phase: 10-content-deployment-02
    provides: "Content structure and Velite schema for MDX articles"
provides:
  - "8 Industry Guides spoke articles covering Irish sector-specific accounting"
  - "Complete industry-guides content cluster"
affects: [content-deployment, seo]

tech-stack:
  added: []
  patterns: ["sector-specific Irish tax guidance with FAQSection and KeyTakeaways MDX components"]

key-files:
  created:
    - content/guides/accounting-for-freelancers-ireland.mdx
    - content/guides/accounting-for-landlords-ireland.mdx
    - content/guides/accounting-for-ecommerce-ireland.mdx
    - content/guides/accounting-for-farmers-ireland.mdx
    - content/guides/accounting-for-medical-professionals-ireland.mdx
    - content/guides/accounting-for-tradespeople-ireland.mdx
    - content/guides/accounting-for-hospitality-ireland.mdx
    - content/guides/accounting-for-creatives-ireland.mdx
  modified: []

key-decisions:
  - "All articles tailored to specific Irish industry regulations: RCT for trades, Artists Exemption for creatives, GMS for GPs, RTB for landlords"

patterns-established:
  - "Industry-specific spoke articles reference sector-specific Irish entities and tax reliefs"

requirements-completed: [WRITE-05, WRITE-06]

duration: 12min
completed: 2026-04-06
---

# Phase 10 Plan 10: Industry Guides Spokes Summary

**8 spoke articles covering sector-specific Irish accounting guidance: freelancers, landlords, e-commerce, farmers, medical professionals, tradespeople, hospitality, and creatives**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-06T11:42:12Z
- **Completed:** 2026-04-06T11:54:12Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- 8 Industry Guides spoke articles written with Irish-specific tax guidance per sector
- Each article covers sector-specific reliefs, obligations, and Revenue compliance considerations
- All articles include KeyTakeaways (4 bullets) and FAQSection (3-5 questions) MDX components
- Articles cross-linked via relatedSlugs to pillar content and other relevant guides

## Task Commits

Each task was committed atomically:

1. **Task 1: Write Industry Guides spokes 1-4** - `67baa7f` (feat)
2. **Task 2: Write Industry Guides spokes 5-8** - `a43d473` (feat)

## Files Created/Modified
- `content/guides/accounting-for-freelancers-ireland.mdx` - Freelancer tax registration, expenses, invoicing international clients, PRSA pensions
- `content/guides/accounting-for-landlords-ireland.mdx` - Rental income tax, mortgage interest deduction, RTB, CGT on disposal, rent-a-room relief
- `content/guides/accounting-for-ecommerce-ireland.mdx` - VAT on online sales, EU OSS/IOSS schemes, marketplace facilitator rules, multi-platform bookkeeping
- `content/guides/accounting-for-farmers-ireland.mdx` - Income averaging, stock relief, capital allowances, CAP payments, succession planning
- `content/guides/accounting-for-medical-professionals-ireland.mdx` - GMS payments, VAT exemption for medical services, multiple income streams, locum tax treatment
- `content/guides/accounting-for-tradespeople-ireland.mdx` - RCT obligations, construction VAT rates (13.5%/23%), two-thirds rule, tool/van expenses
- `content/guides/accounting-for-hospitality-ireland.mdx` - 9% hospitality VAT, tip taxation under 2022 Act, EPOS records, seasonal cash flow
- `content/guides/accounting-for-creatives-ireland.mdx` - Artists' Exemption (EUR 50k), Arts Council grants, royalties, Aosdana cnuas

## Decisions Made
- All articles tailored to specific Irish industry regulations and entities (Revenue, RTB, HSE, Arts Council, Teagasc, IMRO)

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None - all articles contain complete, substantive content.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Industry Guides content cluster complete with 8 spoke articles
- All articles use consistent MDX component patterns (KeyTakeaways, FAQSection/FAQItem)
- Ready for remaining content plans in Phase 10

---
*Phase: 10-content-deployment*
*Completed: 2026-04-06*
