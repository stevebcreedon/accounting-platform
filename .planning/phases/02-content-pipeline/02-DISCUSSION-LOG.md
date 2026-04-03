# Phase 2: Content Pipeline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-03
**Phase:** 02-content-pipeline
**Areas discussed:** Content structure, Frontmatter schema, Category taxonomy, Scheduled publishing

---

## Content Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Flat by slug | All 72 articles in one folder, category in frontmatter only | |
| Nested by category | Folder per category, category duplicated in folder + frontmatter | |
| You decide | Claude picks best approach for Velite | ✓ |

**User's choice:** Claude's discretion
**Notes:** User trusts Claude to pick the best file organization for Velite integration.

---

| Option | Description | Selected |
|--------|-------------|----------|
| 2-3 sample articles | One pillar + one spoke to verify pipeline end-to-end | ✓ |
| Pipeline only | Empty/placeholder content, real articles in Phase 10 | |
| 1 minimal stub | Single article with all frontmatter fields | |

**User's choice:** 2-3 sample articles
**Notes:** Gives something real to test against.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Real content (Recommended) | Actual Irish accounting guidance, doubles as early SEO content | ✓ |
| Placeholder content | Lorem ipsum, faster but no SEO value | |

**User's choice:** Real content
**Notes:** Doubles as early SEO content that can ship in Phase 10.

---

## Frontmatter Schema

| Option | Description | Selected |
|--------|-------------|----------|
| pillarOrSpoke flag | Explicitly mark articles as pillar or spoke | ✓ |
| relatedSlugs array | Manual list of related article slugs for cross-linking | ✓ |
| featured boolean | Flag to highlight specific articles | ✓ |
| You decide the full schema | Claude designs complete schema | ✓ |

**User's choice:** All options selected — include all three fields plus Claude designs the rest
**Notes:** User wants a comprehensive schema with Claude filling in remaining fields based on requirements and SEO best practices.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Strict (Recommended) | Reject unknown fields, catches typos | ✓ |
| Permissive | Allow unknown fields for flexibility | |

**User's choice:** Strict validation
**Notes:** Consistency across 72 articles is critical.

---

## Category Taxonomy

| Option | Description | Selected |
|--------|-------------|----------|
| Description + icon | Short description and icon/emoji per category | ✓ |
| Description only | Description but no icons, cleaner editorial look | |
| Name only | Just labels, simplest approach | |

**User's choice:** Description + icon
**Notes:** Makes category listing pages more informative.

---

| Option | Description | Selected |
|--------|-------------|----------|
| Badge + larger card | 'Comprehensive Guide' badge and wider/taller card | |
| Badge only | Small 'Pillar' badge, same card size | |
| Position + styling | Pinned to top with different background/border | |
| You decide | Claude picks best visual distinction for editorial brand | ✓ |

**User's choice:** Claude's discretion
**Notes:** User trusts Claude to pick the best visual distinction for the warm editorial brand.

---

## Scheduled Publishing

| Option | Description | Selected |
|--------|-------------|----------|
| Hidden completely (Recommended) | Excluded from ALL queries when publishDate > today | ✓ |
| Visible but flagged | Visible in admin/preview, hidden from public | |
| Draft status separate | Separate draft boolean from publishDate | |

**User's choice:** Hidden completely
**Notes:** Simple single-gate system — articles appear automatically when date arrives and site rebuilds.

---

| Option | Description | Selected |
|--------|-------------|----------|
| No drafts — publishDate only | Single gate, no publishDate = never published | ✓ |
| Add draft boolean | Two gates: non-draft AND publishDate <= today | |

**User's choice:** No drafts — publishDate only
**Notes:** Simplest approach, single gate.

---

## Claude's Discretion

- File organization on disk (flat vs nested)
- Complete frontmatter schema beyond specified fields
- Pillar/spoke visual distinction approach
- Velite config structure
- Query function implementation
- Category icon/emoji selection
- Sample article topics

## Deferred Ideas

None — discussion stayed within phase scope
