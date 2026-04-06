# Phase 10: Content & Deployment - Context

**Gathered:** 2026-04-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Write all 72 articles (8 pillar + 64 spoke) with real Irish accounting content, deploy to Vercel, configure environment variables, set up daily rebuild at 06:00 UTC for scheduled publishing. This is the content-heavy final phase that makes the site live with a complete content library.

</domain>

<decisions>
## Implementation Decisions

### Pillar Article Topics
- **D-01:** **One pillar per category** — each of the 8 categories gets exactly one pillar article as its cornerstone. 3 already exist from Phase 2 (Tax Obligations: VAT registration, Business Structures: sole trader vs limited company, Costs & Fees: accountant costs). 5 new pillars needed.
- **D-02:** The 5 new pillar topics should cover: Getting Started, Accounting Basics, Choosing an Accountant, Compliance & Deadlines, Industry Guides.

### Content Quality & Style
- **D-03:** Articles are **AI-generated with Irish specificity** — Claude writes using real Irish entities (Revenue, CRO, Irish tax rates, thresholds, deadlines, forms). Structured intro pattern from Phase 6. Factual, jargon-free. Review for accuracy recommended before going live.
- **D-04:** Pillar articles: **3,000-4,000 words** each, comprehensive coverage of the topic.
- **D-05:** Spoke articles: **1,500-2,500 words** each, focused on specific questions within a category.
- **D-06:** Every article has **3-5 FAQ questions** based on real Irish search queries.
- **D-07:** Every article uses the **structured intro pattern** (direct answer first) for AI citation optimization.

### Deployment
- **D-08:** Deploy on **Vercel default domain** — no custom domain in this milestone.
- **D-09:** Daily rebuild at **06:00 UTC** — 6am/7am Irish time. Articles with today's publishDate appear in the morning.
- **D-10:** Environment variables configured in Vercel dashboard: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, NEXT_PUBLIC_SITE_URL, CRON_SECRET.

### Publishing Schedule
- **D-11:** **All 64 spoke articles written in this phase** — complete content library at launch. Articles have future publishDates set to 2/week schedule.
- **D-12:** Publishing cadence: 2 articles per week, starting from launch date. Future-dated articles automatically appear when the daily rebuild runs past their publishDate.

### Claude's Discretion
- Exact pillar topic titles for the 5 new categories
- Spoke article topics (8 per category to total 64)
- Article publishing order and date assignments
- relatedSlugs cross-linking strategy across all 72 articles
- Keywords selection per article
- Whether to update the 3 existing sample articles or keep them as-is

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDEacc.md` — Original build spec with 72 article topics, content bible, category definitions
- `ClearCount-ie-Complete-Spec.docx` — Full business spec with article topics and content guidelines
- `CLAUDE.md` — Deployment: Vercel default domain, no custom domain. Content: Republic of Ireland only.

### Prior Phase Artifacts
- `.planning/phases/02-content-pipeline/02-CONTEXT.md` — Content schema, 8 categories, publishing gate
- `.planning/phases/06-seo-infrastructure/06-CONTEXT.md` — SEO decisions, structured intro pattern

### Existing Code
- `velite.config.ts` — Content schema with all frontmatter fields
- `content/guides/` — 3 existing sample articles
- `src/lib/content/queries.ts` — Query functions with scheduled publishing filter
- `src/lib/content/categories.ts` — 8 category definitions
- `vercel.json` — Already has cron config for analytics rollup
- `src/app/sitemap.ts` — Auto-generates from published content

### Planning
- `.planning/PROJECT.md` — Core project context
- `.planning/REQUIREMENTS.md` — WRITE-01 through WRITE-06, DEPLOY-01 through DEPLOY-04

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Velite MDX pipeline handles compilation automatically
- Zod schema validates all frontmatter on build
- generateStaticParams pre-renders all published articles
- Sitemap auto-updates from published content
- OG images auto-generate per article

### Established Patterns
- MDX files in `content/guides/` with strict Zod frontmatter
- KeyTakeaways + FAQSection as custom MDX components
- relatedSlugs for cross-linking
- publishDate as single gate for visibility

### Integration Points
- `content/guides/` — 69 new MDX files (5 pillar + 64 spoke)
- `vercel.json` — add daily rebuild cron alongside existing analytics cron
- `.env.local` → Vercel dashboard env vars
- Build must succeed with 72 articles through Velite pipeline

</code_context>

<specifics>
## Specific Ideas

- Content should be genuinely useful to Irish business owners — not generic advice wrapped in Irish keywords
- Reference real Irish entities: Revenue Commissioners, Companies Registration Office (CRO), Irish tax rates/thresholds/deadlines
- FAQ questions should be actual questions people Google about Irish accounting
- The 3 existing articles may need updating to match the quality level of new content
- Cross-linking (relatedSlugs) should create a strong internal link web across all 72 articles

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-content-deployment*
*Context gathered: 2026-04-06*
