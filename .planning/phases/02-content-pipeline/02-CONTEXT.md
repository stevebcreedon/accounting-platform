# Phase 2: Content Pipeline - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the MDX content pipeline: Velite compiles articles with Zod-validated frontmatter, typed query functions expose content data, and scheduled publishing gates article visibility by date. Includes 2-3 sample articles with real Irish accounting content to verify the pipeline end-to-end.

</domain>

<decisions>
## Implementation Decisions

### Content Structure
- **D-01:** File organization is **Claude's discretion** — pick the approach that works best with Velite and the query functions (flat by slug vs nested by category).
- **D-02:** Create **2-3 sample articles** with real Irish accounting content (one pillar, one or two spoke). These double as early SEO content for Phase 10.
- **D-03:** Sample articles must contain **real, accurate Irish accounting guidance** — not placeholder text.

### Frontmatter Schema
- **D-04:** Schema includes: title, description, slug, publishDate, category, **pillarOrSpoke flag**, **relatedSlugs array**, **featured boolean**, plus any additional fields Claude determines are needed for SEO and content management.
- **D-05:** Zod validation is **strict** — reject unknown fields. Catches typos and enforces consistency across 72 articles.
- **D-06:** Reading time calculated from word count at **200 wpm** (CONT-07).

### Category Taxonomy
- **D-07:** Each of the 8 categories gets a **short description (1-2 sentences) and an icon/emoji** for use on category listing pages.
- **D-08:** The 8 categories are: Getting Started, Business Structures, Tax Obligations, Accounting Basics, Choosing an Accountant, Costs & Fees, Compliance & Deadlines, Industry Guides (CONT-05).
- **D-09:** Pillar vs spoke visual distinction is **Claude's discretion** — pick the approach that best fits the warm editorial brand (badge, card size, positioning, or combination).

### Scheduled Publishing
- **D-10:** Future-dated articles are **hidden completely** — excluded from ALL queries, listings, sitemap, and any public-facing pages. They appear automatically when publishDate <= today and site rebuilds.
- **D-11:** **No separate draft status** — publishDate is the single gate. No publishDate = never published.

### Claude's Discretion
- File organization on disk (flat vs nested)
- Complete frontmatter schema beyond the fields specified above
- Pillar/spoke visual distinction approach
- Velite config structure and content collection setup
- Query function implementation details
- Category icon/emoji selection
- Sample article topics (must be real Irish accounting content)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDEacc.md` — Original build spec with content system requirements, article structure, and category definitions
- `ClearCount-ie-Complete-Spec.docx` — Full business spec with content bible, 72 article topics, and category breakdowns

### Research
- `.planning/research/STACK.md` — Velite configuration, MDX plugin stack (rehype-pretty-code, rehype-slug, rehype-autolink-headings, remark-gfm)
- `.planning/research/ARCHITECTURE.md` — Content layer architecture, component boundaries

### Prior Phase
- `.planning/phases/01-project-scaffold/01-CONTEXT.md` — Brand decisions (cream/charcoal/burnt-orange, Satoshi/DM Sans, editorial spacing)
- `tailwind.config.ts` — Current design tokens including `.article-content` prose overrides
- `src/app/globals.css` — Global styles with prose typography already configured

### Planning
- `.planning/PROJECT.md` — Core project context and constraints
- `.planning/REQUIREMENTS.md` — CONT-01 through CONT-07 are this phase's requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/utils.ts` — cn() utility for conditional class merging
- `src/app/globals.css` — `.article-content` prose class with brand overrides (Satoshi headings, burnt-orange links/blockquote borders)
- `tailwind.config.ts` — Full design token system (colors, typography scale, spacing, shadows, prose plugin)

### Established Patterns
- Tailwind v3 with custom theme extensions (not overrides)
- next/font for font loading (DM Sans via Google, Satoshi via local woff2)
- App Router with TypeScript throughout

### Integration Points
- `src/app/page.tsx` — Currently a placeholder, will eventually list articles
- `src/app/layout.tsx` — Root layout with brand fonts and metadata ("The Ledger")
- New routes needed: `/guides/[slug]` for individual articles, `/guides/category/[category]` for category pages (Phase 3-4)

</code_context>

<specifics>
## Specific Ideas

- Sample articles should cover real Irish accounting topics that will be useful in Phase 10 deployment
- The content system must handle 72 articles efficiently — query functions should be performant at that scale
- Ireland-specific content only — no UK, no generic advice

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-content-pipeline*
*Context gathered: 2026-04-03*
