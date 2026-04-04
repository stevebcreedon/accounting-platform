# Phase 6: SEO Infrastructure - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Full SEO optimization: generateMetadata on every page, JSON-LD structured data (Article, FAQ, Breadcrumb, Organisation), XML sitemap via built-in sitemap.ts, robots.txt, programmatic OG images via @vercel/og, internal linking audit, heading hierarchy enforcement, and AI search optimization of article intros.

</domain>

<decisions>
## Implementation Decisions

### Metadata & OG Images
- **D-01:** OG images use **branded editorial design** — cream background, article title in Satoshi, category pill, "The Ledger" wordmark. Uses `@vercel/og` with custom fonts.
- **D-02:** Title tag format: **"Article Title | The Ledger"** — article title first for keyword prominence, brand after pipe.
- **D-03:** Twitter card type: `summary_large_image` for articles, `summary` for static pages.

### Structured Data
- **D-04:** JSON-LD Article author is **brand as Organization**: `author: { @type: 'Organization', name: 'The Ledger' }`. No personal attribution per CLAUDE.md.
- **D-05:** Publisher same as author: Organization "The Ledger".
- **D-06:** Existing FAQPage JSON-LD in `faq-section.tsx` (Phase 3) stays in place — SEO-03 is already partially addressed.
- **D-07:** BreadcrumbList JSON-LD derives from the same breadcrumb data as the visual Breadcrumbs component (Phase 3).

### AI Search Optimization
- **D-08:** Article intros use **structured intro pattern** — every article starts with a direct 1-2 sentence answer to the title question, then expands. First 30% is citation-ready: clear, factual, jargon-free. This is a content writing guideline enforced through sample article updates.
- **D-09:** Heading hierarchy audit (SEO-12) — verify all existing articles use proper H1 > H2 > H3 nesting.

### Sitemap & Robots
- **D-10:** **Standard setup** — built-in `sitemap.ts` listing all published pages with lastModified. `robots.txt` allows all crawlers, points to sitemap. No sitemap index needed for ~80 pages.
- **D-11:** No AI crawler blocking — allow GPTBot, CCBot, etc. Content visibility maximized.

### Claude's Discretion
- OG image exact layout, font sizes, spacing
- generateMetadata description templates per page type
- Canonical URL base (use Vercel default domain until custom domain)
- Organisation schema details (logo placeholder, sameAs social links)
- Internal linking enforcement approach (SEO-11)
- Heading hierarchy audit method (SEO-12)
- Sample article intro rewrites for AI optimization (SEO-13)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDEacc.md` — SEO requirements, schema-dts recommendation, @vercel/og recommendation
- `CLAUDE.md` — Stack: next/metadata built-in, built-in sitemap.ts (not next-sitemap), schema-dts, @vercel/og

### Prior Phase Artifacts
- `.planning/phases/01-project-scaffold/01-UI-SPEC.md` — Design tokens for OG image styling
- `.planning/phases/03-article-page-template/03-CONTEXT.md` — FAQ JSON-LD already in faq-section.tsx

### Existing Code
- `src/components/article/faq-section.tsx` — Already outputs JSON-LD FAQPage schema (SEO-03)
- `src/components/article/breadcrumbs.tsx` — Breadcrumb data structure, reuse for BreadcrumbList
- `src/lib/content/queries.ts` — getAllGuides, getGuideBySlug for sitemap and metadata
- `src/lib/content/categories.ts` — Category metadata for OG images
- `src/app/layout.tsx` — Root metadata (currently minimal)
- `velite.config.ts` — Content schema with all metadata fields

### Planning
- `.planning/PROJECT.md` — Core project context
- `.planning/REQUIREMENTS.md` — SEO-01 through SEO-13

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `schema-dts` — already installed for typed JSON-LD
- `faq-section.tsx` — FAQPage schema already outputs correctly
- `breadcrumbs.tsx` — data structure maps directly to BreadcrumbList schema
- `categories.ts` — category names/slugs for OG images and sitemap
- `queries.ts` — all content query functions for sitemap generation

### Established Patterns
- `generateMetadata` export from Next.js 14 App Router
- JSON-LD via `<script type="application/ld+json">` (established in Phase 3)
- `@vercel/og` recommended in CLAUDE.md, needs explicit install

### Integration Points
- Every page file needs `generateMetadata` export added
- Article page needs Article + BreadcrumbList JSON-LD
- Homepage needs Organisation JSON-LD
- New route: `src/app/api/og/route.tsx` for OG image generation
- New files: `src/app/sitemap.ts`, `src/app/robots.ts`

</code_context>

<specifics>
## Specific Ideas

- OG images should look premium — cream background matches the site, Satoshi font makes them distinctive vs generic blue/white OG cards
- Article schema should include datePublished, dateModified (from updatedDate), and wordCount
- Sitemap should include all article pages, category pages, and static pages
- Ireland-specific: Organisation areaServed should be "Ireland" / "IE"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-seo-infrastructure*
*Context gathered: 2026-04-04*
