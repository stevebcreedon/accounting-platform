# Phase 4: Site Structure & Pages - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all site pages beyond the article template: homepage (hero, latest articles, category grid, email CTA), guides hub (all articles with filter pills), category archives, find-accountant waitlist placeholder, static pages (about, contact, privacy, terms, 404), and accounting disclaimer. Visitors can browse the full site after this phase.

</domain>

<decisions>
## Implementation Decisions

### Homepage
- **D-01:** Hero section is **editorial headline** style — large Satoshi heading with 1-2 line value proposition, subtle browse CTA, generous whitespace. Clean, confident, Stripe-Press-meets-Monocle feel.
- **D-02:** Category grid is **2x4 icon + name cards** — each card shows category emoji and name, clickable to category archive. Clean and scannable.
- **D-03:** Latest articles section shows **6 articles** using the white card design.
- **D-04:** Email capture section reuses the existing `EmailCTAPlaceholder` component from Phase 3.

### Guides Hub & Category Pages
- **D-05:** Article cards are **white on cream** with `shadow-card` token — showing title, category pill, reading time, and first line of description. Pillar articles get "Comprehensive Guide" badge.
- **D-06:** Guides hub shows **all articles on one page** (no pagination) — better for SEO with 72 articles. Category filter pills for horizontal scrolling filtering.
- **D-07:** Category archive pages at `/guides/category/[slug]` show filtered articles using the same card design.

### Find-Accountant Placeholder
- **D-08:** **Coming soon + email capture** — clear "Directory Coming Soon" heading, 3-4 feature preview items (search by location, specialisation, reviews), email capture for early access. Sets expectations without overpromising.

### Static Pages & Legal
- **D-09:** About page focuses on **brand mission** — platform's purpose, who it helps, what makes it different. No personal bio, brand is the authority.
- **D-10:** Contact page is **email link only** — simple mailto: link, no form. Avoids GDPR form handling complexity.
- **D-11:** Privacy and Terms pages have **real content** — actual privacy policy referencing Irish DPC and GDPR rights, actual terms of service, both specific to The Ledger and Irish law.
- **D-12:** 404 page with navigation and category links to help users find content.
- **D-13:** Accounting disclaimer in footer (PAGE-10) — reuse the educational disclaimer text pattern from Phase 3 article pages.

### Claude's Discretion
- Homepage section ordering and spacing
- Hero headline copy and CTA text
- Category card hover states
- Guides hub filter pill interaction (client-side filtering vs URL-based)
- Find-accountant feature preview content and layout
- About page copy and structure
- Contact page copy
- Privacy/terms content (must reference Irish DPC, GDPR)
- 404 page design and helpful links
- Footer disclaimer placement and styling

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDEacc.md` — Original build spec with page structure, component list
- `ClearCount-ie-Complete-Spec.docx` — Full business spec with page requirements, content guidelines

### Prior Phase Artifacts
- `.planning/phases/01-project-scaffold/01-UI-SPEC.md` — Design tokens (spacing, typography, color, card shadows)
- `.planning/phases/02-content-pipeline/02-CONTEXT.md` — Content pipeline decisions, 8 categories
- `.planning/phases/03-article-page-template/03-CONTEXT.md` — Article page decisions, component patterns
- `.planning/phases/03-article-page-template/03-UI-SPEC.md` — Article component UI specs

### Existing Code
- `src/lib/content/queries.ts` — getAllGuides, getGuidesByCategory, getCategories, getPillarGuides, getFeaturedGuides
- `src/lib/content/categories.ts` — 8 categories with slugs, descriptions, emoji
- `src/components/article/email-cta-placeholder.tsx` — Reusable email CTA placeholder
- `src/components/article/meta-line.tsx` — Date formatting, category pill pattern
- `src/components/article/breadcrumbs.tsx` — Breadcrumb pattern
- `tailwind.config.ts` — shadow-card, shadow-card-hover tokens, full design system

### Planning
- `.planning/PROJECT.md` — Core project context and constraints
- `.planning/REQUIREMENTS.md` — PAGE-01 through PAGE-10 are this phase's requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `EmailCTAPlaceholder` — reuse directly for homepage and find-accountant page
- `MetaLine` pattern — date formatting, category pill, reading time display
- `Breadcrumbs` — reuse for all new pages
- `cn()` utility — conditional class merging
- `categories.ts` — full category metadata (slug, name, description, emoji)
- Query functions — `getAllGuides()`, `getGuidesByCategory()`, `getCategories()`, `getFeaturedGuides()`, `getPillarGuides()`

### Established Patterns
- Server components by default (App Router)
- White cards on cream with shadow-card token
- `.article-content` prose class for long-form content
- `max-w-article` (48rem) for content width
- Tailwind v3 utility classes throughout

### Integration Points
- `src/app/page.tsx` — currently placeholder, will become homepage
- New routes: `/guides`, `/guides/category/[slug]`, `/find-accountant`, `/about`, `/contact`, `/privacy`, `/terms`
- `src/app/not-found.tsx` — custom 404
- Footer component needed (disclaimer goes here) — Phase 5 builds nav, but footer disclaimer content is Phase 4

</code_context>

<specifics>
## Specific Ideas

- Homepage hero should feel authoritative and warm — "The Ledger" brand front and center
- Category grid should make it obvious this site covers all accounting topics an Irish business owner would need
- Find-accountant page should build anticipation for the directory without making promises
- Privacy policy must reference Irish Data Protection Commission (DPC) as supervisory authority
- All legal content is Ireland-specific — no UK references

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-site-structure-pages*
*Context gathered: 2026-04-03*
