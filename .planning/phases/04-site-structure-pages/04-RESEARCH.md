# Phase 4: Site Structure & Pages - Research

**Researched:** 2026-04-03
**Domain:** Next.js 14 App Router page creation, static generation, client-side filtering, legal content
**Confidence:** HIGH

## Summary

Phase 4 builds all browsable pages beyond the article template: homepage, guides hub, category archives, find-accountant placeholder, static pages (about, contact, privacy, terms), custom 404, and an accounting disclaimer bar. The technical surface is straightforward -- all pages are standard Next.js 14 App Router routes using server components by default, with one client component (filter pills on the guides hub). No new dependencies are required; all libraries are already installed.

The primary complexity is structural: 9 new route files, 4 shared components, and substantial legal copy for privacy/terms pages. The design system, content queries, and component patterns are fully established from Phases 1-3. This phase is essentially assembling existing primitives into page layouts per the UI-SPEC.

**Primary recommendation:** Build pages in dependency order -- shared components first (article-card, category-card, disclaimer-bar), then homepage (uses all shared components), then guides hub with filter pills (only client component), then static pages and 404 (simplest, standalone).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Hero section is editorial headline style -- large Satoshi heading with 1-2 line value proposition, subtle browse CTA, generous whitespace
- D-02: Category grid is 2x4 icon + name cards -- each card shows category emoji and name, clickable to category archive
- D-03: Latest articles section shows 6 articles using the white card design
- D-04: Email capture section reuses the existing EmailCTAPlaceholder component from Phase 3
- D-05: Article cards are white on cream with shadow-card token -- showing title, category pill, reading time, and first line of description. Pillar articles get "Comprehensive Guide" badge
- D-06: Guides hub shows all articles on one page (no pagination). Category filter pills for horizontal scrolling filtering
- D-07: Category archive pages at /guides/category/[slug] show filtered articles using the same card design
- D-08: Coming soon + email capture -- clear "Directory Coming Soon" heading, 3-4 feature preview items, email capture for early access
- D-09: About page focuses on brand mission -- no personal bio, brand is the authority
- D-10: Contact page is email link only -- simple mailto: link, no form
- D-11: Privacy and Terms pages have real content -- actual privacy policy referencing Irish DPC and GDPR, actual terms of service specific to Irish law
- D-12: 404 page with navigation and category links to help users find content
- D-13: Accounting disclaimer in footer -- reuse educational disclaimer text pattern from Phase 3 article pages

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

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAGE-01 | Homepage with hero section, latest articles (6), category grid (8), email capture section | Hero layout pattern, article card extraction from RelatedArticles, category card component, reuse EmailCTAPlaceholder |
| PAGE-02 | Guides hub page with category filter pills, article grid, pillar badges | Client-side filter pills component (only "use client" in phase), getAllGuides() query, pillar badge pattern from Phase 3 |
| PAGE-03 | Category archive pages at /guides/category/[slug] with filtered articles | generateStaticParams from CATEGORIES array, getGuidesByCategory() query, getCategoryBySlug() for metadata |
| PAGE-04 | Find-Accountant placeholder at /find-accountant with waitlist email capture and feature preview | Static page with Lucide icons (map-pin, search, star), EmailCTAPlaceholder reuse for waitlist CTA |
| PAGE-05 | About page (brand mission, no personal bio) | Static prose page using article-content class, brand voice from UI-SPEC |
| PAGE-06 | Contact page with email link | Minimal static page, mailto: link styled as burnt-orange inline link |
| PAGE-07 | Privacy policy page (GDPR, Irish DPC reference) | Long-form legal content, must reference Irish Data Protection Commission, GDPR Articles 13-22, right to lodge complaint |
| PAGE-08 | Terms of service page | Long-form legal content specific to Irish law, educational content disclaimer |
| PAGE-09 | Custom 404 page with navigation and category links | Next.js not-found.tsx convention at app root, category link pills |
| PAGE-10 | Accounting disclaimer in footer and per-article notice | Shared disclaimer-bar component, positioned at bottom of every page before Phase 5 footer |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS v3, MDX via Velite -- no alternatives
- **Content specificity**: Republic of Ireland only -- no UK, no Northern Ireland
- **GDPR**: Privacy policy must reference Irish DPC, explicit consent, double opt-in (email system is Phase 7 but privacy page content is Phase 4)
- **Brand**: No personal author attribution. Brand is the authority.
- **No third-party tracking**: Custom Supabase analytics only
- **Deployment**: Vercel default domain
- **Velite content pipeline**: Use `#site/content` import alias, queries from `src/lib/content/queries.ts`
- **Design tokens**: All defined in Phase 1 -- no new tokens in Phase 4
- **Server components by default**: Only use `"use client"` where browser APIs are needed (filter pills)

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Phase 4 Usage |
|---------|---------|---------|---------------|
| next | 14.2.35 | App Router, SSG | Page routes, generateStaticParams, not-found.tsx |
| react | ^18 | UI | Server components (all pages except filter pills) |
| typescript | ~5.5.4 | Type safety | Props interfaces for shared components |
| tailwindcss | ^3.4.1 | Styling | All page layouts per UI-SPEC |
| @tailwindcss/typography | ^0.5.19 | Prose | Static pages (about, privacy, terms) via article-content class |
| lucide-react | ^1.7.0 | Icons | search, map-pin, star, arrow-right, mail, home icons |
| clsx | ^2.1.1 | Conditional classes | Filter pill active/inactive states |
| tailwind-merge | ^3.5.0 | Class merging | cn() utility |

### No New Dependencies Required

Phase 4 uses only libraries already in package.json. No installation step needed.

## Architecture Patterns

### Project Structure (New Files)

```
src/
  app/
    page.tsx                           # Homepage (REPLACE existing placeholder)
    not-found.tsx                      # Custom 404 (NEW)
    guides/
      page.tsx                         # Guides hub (NEW)
      [slug]/page.tsx                  # Article pages (EXISTS from Phase 3)
      category/
        [slug]/page.tsx                # Category archives (NEW)
    find-accountant/
      page.tsx                         # Directory placeholder (NEW)
    about/
      page.tsx                         # About page (NEW)
    contact/
      page.tsx                         # Contact page (NEW)
    privacy/
      page.tsx                         # Privacy policy (NEW)
    terms/
      page.tsx                         # Terms of service (NEW)
  components/
    shared/
      article-card.tsx                 # Extracted from RelatedArticles pattern (NEW)
      category-card.tsx                # Category emoji + name card (NEW)
      filter-pills.tsx                 # Client component for guides hub filtering (NEW)
      disclaimer-bar.tsx               # Accounting disclaimer bar (NEW)
```

### Pattern 1: Server Component Pages (Default)

All pages are server components. Data resolution is synchronous via Velite's compiled content. No async/await needed for content queries.

```typescript
// Example: Category archive page (server component)
import { getGuidesByCategory } from '@/lib/content/queries';
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/content/categories';
import { ArticleCard } from '@/components/shared/article-card';

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();
  const guides = getGuidesByCategory(params.slug);
  // ... render
}
```

**Source:** Existing pattern in `src/app/guides/[slug]/page.tsx`

### Pattern 2: Single Client Component (Filter Pills)

The guides hub filter pills are the ONLY client component in Phase 4. They manage active filter state and filter the displayed article list without a page reload.

```typescript
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FilterPillsProps {
  categories: { slug: string; name: string }[];
  allGuides: SerializedGuide[];  // Must be serializable (no functions)
}

export function FilterPills({ categories, allGuides }: FilterPillsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const filteredGuides = activeCategory
    ? allGuides.filter((g) => g.category === activeCategory)
    : allGuides;
  // ... render pills + article grid
}
```

**Critical:** The parent page (guides/page.tsx) is a server component. It passes serialized guide data as props to the client FilterPills component. Guide objects from Velite contain MDX body content -- strip this before passing to the client component to avoid bloating the client bundle.

### Pattern 3: Shared Article Card Extraction

The RelatedArticles component in Phase 3 contains the article card pattern inline. Phase 4 extracts this into a shared `ArticleCard` component used by homepage, guides hub, and category archives. The interface should match what the Phase 3 RelatedArticles already uses:

```typescript
interface ArticleCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  readingTime: number;
  isPillar?: boolean;
}
```

### Pattern 4: Static Prose Pages

About, privacy, terms, and contact pages use the `article-content` prose class for consistent typography. These are plain TSX files with hardcoded content (not MDX), wrapped in the same max-width container.

```typescript
export default function PrivacyPage() {
  return (
    <main className="max-w-article mx-auto px-6 md:px-8 pt-12 pb-12">
      <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-8">
        Privacy Policy
      </h1>
      <div className="article-content">
        {/* Hardcoded privacy policy content as JSX */}
      </div>
    </main>
  );
}
```

### Pattern 5: Custom 404 Page

Next.js 14 App Router uses `src/app/not-found.tsx` for the global 404 page. This is automatically rendered when `notFound()` is called from any page or when a route is not matched. It must export a default component (not a named export).

```typescript
// src/app/not-found.tsx
export default function NotFound() {
  return (
    <main className="max-w-article mx-auto px-6 md:px-8 py-18 text-center">
      {/* 404 content */}
    </main>
  );
}
```

**Confidence:** HIGH -- this pattern is already used in the existing `guides/[slug]/page.tsx` via `notFound()` import.

### Pattern 6: Disclaimer Bar Placement

Phase 5 builds the full footer with navigation. Phase 4 creates a `DisclaimerBar` component that will later be incorporated into the footer. For now, it is placed at the bottom of each page layout directly. When Phase 5 ships, the disclaimer moves into the footer component.

### Anti-Patterns to Avoid

- **Passing full Velite guide objects to client components:** Guide objects contain the compiled MDX `body` field which is large. Strip to only needed fields before passing as props.
- **Using `"use client"` on page files:** All page files should be server components. Only the filter-pills component needs client state.
- **Adding new design tokens:** Phase 4 UI-SPEC explicitly states no new tokens. Use existing Phase 1 tokens only.
- **Creating MDX files for static pages:** About, privacy, terms, contact are hardcoded TSX. They do not go through the Velite content pipeline.
- **URL-based filtering on guides hub:** The decision is client-side filtering. URL stays at `/guides` -- no query params or route changes when filtering.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Article card component | Inline card JSX in every page | Shared `ArticleCard` component extracted from Phase 3 RelatedArticles | 3 pages use identical card design |
| Category data | Hardcoded category arrays in pages | `CATEGORIES` array from `src/lib/content/categories.ts` | Single source of truth for slugs, names, emojis |
| Content queries | Custom file reading | `getAllGuides()`, `getGuidesByCategory()` etc from `src/lib/content/queries.ts` | Already handles publish-gating and sorting |
| Class merging | Template literals | `cn()` from `src/lib/utils` | Handles Tailwind class conflicts |
| Date formatting | Manual date strings | `formatDate()` from `src/lib/utils` | Consistent Irish date format |
| Privacy policy from scratch | Writing legal content from memory | Reference Irish DPC website structure for GDPR privacy policy requirements | Must reference specific GDPR articles and Irish DPC as supervisory authority |

## Common Pitfalls

### Pitfall 1: Serialization Boundary for Client Components

**What goes wrong:** Passing non-serializable data (functions, class instances, or excessively large objects) from server components to client components causes runtime errors or massive bundle sizes.
**Why it happens:** Velite guide objects include the compiled MDX `body` field and `metadata` object. Passing the full array to FilterPills bloats the client JS.
**How to avoid:** Map guide objects to a lightweight serializable interface before passing to FilterPills. Only include: slug, title, description, category, categoryName, readingTime, isPillar.
**Warning signs:** Client bundle size spikes, hydration warnings in console.

### Pitfall 2: Missing generateStaticParams for Category Archives

**What goes wrong:** Category archive pages at `/guides/category/[slug]` return 404 in production if `generateStaticParams` is not defined.
**Why it happens:** Next.js 14 with `output: 'export'` or default SSG requires static params for dynamic routes. Without it, pages are not pre-rendered.
**How to avoid:** Export `generateStaticParams()` from the category archive page using `getAllCategorySlugs()` from categories.ts.
**Warning signs:** Pages work in dev but 404 in production build.

### Pitfall 3: Empty State When No Articles Published

**What goes wrong:** Homepage shows empty "Latest Guides" section, guides hub shows empty grid.
**Why it happens:** All articles have future publishDates, or no MDX content files exist yet in the content directory.
**How to avoid:** Handle empty states gracefully. The UI-SPEC defines empty state copy: "Guides coming soon" for the hub, "No articles yet" for category archives. Always check `guides.length === 0` before rendering grids.
**Warning signs:** Blank sections on page during development.

### Pitfall 4: Scrollbar Visibility on Filter Pills

**What goes wrong:** Horizontal scrollbar appears on the filter pills strip on mobile, breaking the clean design.
**Why it happens:** `overflow-x-auto` shows the browser's default scrollbar.
**How to avoid:** Add scrollbar-hiding CSS. Either add a `scrollbar-hide` utility class in globals.css or use `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]` inline.
**Warning signs:** Visible scrollbar on mobile viewport in dev tools.

### Pitfall 5: Incorrect Heading Hierarchy on Static Pages

**What goes wrong:** Multiple H1s on a page, or H3 used before H2 in privacy/terms content.
**Why it happens:** Long legal content with many sections. Easy to lose track of heading levels.
**How to avoid:** Each page has exactly one H1 (the page title). Within the `article-content` prose body, use H2 for major sections and H3 for subsections. Never skip levels.
**Warning signs:** Lighthouse accessibility warnings about heading hierarchy.

### Pitfall 6: Stale Category Slugs Between Files

**What goes wrong:** Category slug used in `generateStaticParams` does not match what `getGuidesByCategory()` expects.
**Why it happens:** Using different slug formats or hardcoding slugs instead of using the shared CATEGORIES array.
**How to avoid:** Always derive slugs from `getAllCategorySlugs()` or `CATEGORIES.map(c => c.slug)`. Never hardcode slug strings in page files.
**Warning signs:** Category pages render with 0 articles despite articles existing.

## Code Examples

### Extracting Lightweight Guide Data for Client Components

```typescript
// In guides/page.tsx (server component)
import { getAllGuides, getReadingTime } from '@/lib/content/queries';
import { getCategoryBySlug } from '@/lib/content/categories';

// Serialize guides for client component (strip MDX body)
const guides = getAllGuides().map((g) => ({
  slug: g.slug,
  title: g.title,
  description: g.description,
  category: g.category,
  categoryName: getCategoryBySlug(g.category)?.name ?? g.category,
  readingTime: getReadingTime(g),
  isPillar: g.isPillar,
}));
```

**Source:** Existing pattern in `src/app/guides/[slug]/page.tsx` lines 22-31

### generateStaticParams for Category Archives

```typescript
// In guides/category/[slug]/page.tsx
import { getAllCategorySlugs } from '@/lib/content/categories';

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}
```

**Source:** Pattern matches `src/app/guides/[slug]/page.tsx` generateStaticParams

### Scrollbar-Hide Utility

```css
/* Add to globals.css @layer utilities */
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### Irish Privacy Policy Key Sections

The privacy policy must include these sections to comply with GDPR (Articles 13-14):

1. **Identity and contact details** -- The Ledger (brand), contact email
2. **Data we collect** -- email address (for newsletter), page view analytics (anonymized, no cookies)
3. **Legal basis** -- Consent (Article 6(1)(a)) for email; Legitimate interest (Article 6(1)(f)) for analytics
4. **Data retention** -- How long subscriber data is kept
5. **Your rights** -- Access, rectification, erasure, restriction, portability, objection (Articles 15-22)
6. **Right to lodge a complaint** -- Irish Data Protection Commission, 21 Fitzwilliam Square South, Dublin 2, D02 RD28, www.dataprotection.ie
7. **Cookies** -- State that no third-party tracking cookies are used. Only essential cookies if any.
8. **Third-party processors** -- Supabase (database), Resend (email), Vercel (hosting) with brief description
9. **International transfers** -- Note if any processor stores data outside EEA
10. **Changes to this policy** -- How changes are communicated

**Confidence:** HIGH -- GDPR Articles 13-14 requirements are well-established law.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router `pages/404.tsx` | App Router `app/not-found.tsx` | Next.js 13+ | Different file convention, auto-triggered by `notFound()` |
| `getStaticPaths` | `generateStaticParams` | Next.js 13+ | Simpler API, returns array of param objects |
| Client-side routing for filters | Server Components + client islands | Next.js 13+ | Only the filter pills need "use client", not the whole page |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

No test framework is currently installed in the project. The most practical validation for Phase 4 is build verification:

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PAGE-01 | Homepage renders hero, 6 articles, 8 categories, email CTA | build + manual | `npm run build` | N/A |
| PAGE-02 | Guides hub renders all articles with filter pills | build + manual | `npm run build` | N/A |
| PAGE-03 | Category archives render filtered articles | build + manual | `npm run build` (checks generateStaticParams) | N/A |
| PAGE-04 | Find-accountant page renders placeholder | build + manual | `npm run build` | N/A |
| PAGE-05 | About page renders brand mission content | build + manual | `npm run build` | N/A |
| PAGE-06 | Contact page renders email link | build + manual | `npm run build` | N/A |
| PAGE-07 | Privacy page renders GDPR content with DPC reference | build + manual | `npm run build` | N/A |
| PAGE-08 | Terms page renders ToS content | build + manual | `npm run build` | N/A |
| PAGE-09 | 404 page renders with category links | build + manual | `npm run build` | N/A |
| PAGE-10 | Disclaimer bar renders on pages | build + manual | `npm run build` | N/A |

### Sampling Rate

- **Per task commit:** `npm run build` (ensures all pages compile and static params resolve)
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Successful build + lint clean before verification

### Wave 0 Gaps

- No test framework installed -- build verification (`npm run build`) is the automated gate
- No unit tests needed for Phase 4 (all pages are declarative JSX with no complex logic beyond filter state)
- Filter pills could benefit from a unit test but framework setup is not warranted for a single useState

## Open Questions

1. **Email address for contact page and privacy policy**
   - What we know: UI-SPEC says "hello@theledger.ie" but domain is not yet purchased
   - What's unclear: Whether to use a placeholder email or the actual planned email
   - Recommendation: Use "hello@theledger.ie" as specified in UI-SPEC. It is the intended address and can be updated when domain is live.

2. **Disclaimer bar temporary placement**
   - What we know: Phase 5 builds the full footer. Phase 4 creates the disclaimer component.
   - What's unclear: Where exactly to place the disclaimer in Phase 4 before the footer exists.
   - Recommendation: Add DisclaimerBar directly in each page's JSX at the bottom, or add it to the root layout. Root layout is cleaner -- avoids repeating in every page. Phase 5 will move it into the footer component.

3. **RelatedArticles component refactor**
   - What we know: Phase 3 has inline card JSX in RelatedArticles. Phase 4 extracts ArticleCard as shared.
   - What's unclear: Whether to update RelatedArticles to use the new shared ArticleCard.
   - Recommendation: Yes, refactor RelatedArticles to use ArticleCard for consistency. This is a small change (extract, then import).

## Sources

### Primary (HIGH confidence)
- Project codebase -- `src/app/guides/[slug]/page.tsx`, `src/lib/content/queries.ts`, `src/lib/content/categories.ts`, `src/components/article/related-articles.tsx` (existing patterns)
- Phase 4 UI-SPEC -- `.planning/phases/04-site-structure-pages/04-UI-SPEC.md` (complete visual contract)
- Phase 4 CONTEXT.md -- `.planning/phases/04-site-structure-pages/04-CONTEXT.md` (all decisions)
- Phase 1 UI-SPEC -- `.planning/phases/01-project-scaffold/01-UI-SPEC.md` (design tokens)

### Secondary (MEDIUM confidence)
- GDPR Articles 13-14 requirements for privacy policy content (well-established EU law)
- Irish DPC contact details (publicly available at dataprotection.ie)

### Tertiary (LOW confidence)
- None -- all findings verified against existing codebase or established legal requirements

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all dependencies already installed and verified in package.json
- Architecture: HIGH -- all patterns derived from existing Phase 3 code
- Pitfalls: HIGH -- based on direct codebase analysis (serialization boundary, empty states, static params)
- Legal content: MEDIUM -- GDPR requirements are well-known but exact Irish DPC details should be verified at implementation time

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable -- no dependency changes, no fast-moving tech)
