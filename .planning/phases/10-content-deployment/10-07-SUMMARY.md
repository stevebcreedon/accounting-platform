---
phase: 10-content-deployment
plan: 07
subsystem: content
tags: [mdx, choosing-an-accountant, spoke-articles, seo]

requires:
  - phase: 10-content-deployment-02
    provides: "Content schema, MDX format, article template pattern"
provides:
  - "8 spoke articles for choosing-an-accountant category"
  - "Complete choosing-an-accountant content cluster (pillar + 8 spokes)"
affects: [content-deployment, seo, directory-readiness]

tech-stack:
  added: []
  patterns: ["Spoke article format: 1500-2800 words, KeyTakeaways + FAQSection, Ireland-specific"]

key-files:
  created:
    - content/guides/accountant-vs-bookkeeper-ireland.mdx
    - content/guides/questions-to-ask-accountant-ireland.mdx
    - content/guides/when-to-hire-accountant-ireland.mdx
    - content/guides/switching-accountants-ireland.mdx
    - content/guides/online-accountant-ireland.mdx
    - content/guides/accountant-for-startups-ireland.mdx
    - content/guides/tax-agent-ireland-guide.mdx
    - content/guides/accountant-qualifications-ireland.mdx
  modified: []

key-decisions:
  - "All 8 spokes cross-link to pillar how-to-choose-accountant-ireland and related directory content"
  - "Publish dates staggered July 31 through August 25 2026 for sustained content rollout"

patterns-established:
  - "Spoke article pattern: category-consistent frontmatter, 3-5 FAQItems, 4-bullet KeyTakeaways"

requirements-completed: [WRITE-05, WRITE-06]

duration: 13min
completed: 2026-04-06
---

# Phase 10 Plan 07: Choosing an Accountant Spokes Summary

**8 spoke articles covering accountant evaluation, selection, qualifications, and working relationships for Irish business owners**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-06T11:22:28Z
- **Completed:** 2026-04-06T11:35:22Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- 8 spoke articles written for the choosing-an-accountant category, completing the content cluster
- All articles cross-linked to pillar and directory-relevant content via relatedSlugs
- Ireland-specific content covering CAI, CPA, ACCA, CIMA, Revenue/ROS, TAIN, EIIS, SURE, KEEP, R&D credits

## Task Commits

Each task was committed atomically:

1. **Task 1: Write Choosing an Accountant spokes 1-4** - `975557b` (feat)
2. **Task 2: Write Choosing an Accountant spokes 5-8** - `454feb7` (feat)

## Files Created/Modified
- `content/guides/accountant-vs-bookkeeper-ireland.mdx` - Role differences, qualifications, costs comparison
- `content/guides/questions-to-ask-accountant-ireland.mdx` - 10 essential hiring questions with red flags
- `content/guides/when-to-hire-accountant-ireland.mdx` - 7 signs you need professional help
- `content/guides/switching-accountants-ireland.mdx` - Professional clearance process and handover checklist
- `content/guides/online-accountant-ireland.mdx` - Online vs local accountant comparison
- `content/guides/accountant-for-startups-ireland.mdx` - Startup reliefs (EIIS, SURE, KEEP, R&D credit)
- `content/guides/tax-agent-ireland-guide.mdx` - TAIN system, ROS agent links, responsibilities
- `content/guides/accountant-qualifications-ireland.mdx` - CAI, CPA, ACCA, CIMA qualifications explained

## Decisions Made
- All 8 spokes cross-link to pillar how-to-choose-accountant-ireland and related directory content
- Publish dates staggered July 31 through August 25 2026 for sustained content rollout

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - all articles contain complete, substantive content.

## Next Phase Readiness
- Choosing-an-accountant category fully built out with pillar + 8 spokes
- Content cluster directly supports future directory product launch
- Remaining content plans can proceed independently

## Self-Check: PASSED

All 8 article files verified present. Both commits (975557b, 454feb7) verified in git log.

---
*Phase: 10-content-deployment*
*Completed: 2026-04-06*
