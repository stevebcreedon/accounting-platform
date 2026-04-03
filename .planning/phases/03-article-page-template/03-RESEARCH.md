# Phase 3: Article Page Template - Research

**Researched:** 2026-04-03
**Domain:** Next.js 14 App Router dynamic pages, MDX rendering, interactive components (TOC, accordion), JSON-LD structured data
**Confidence:** HIGH

## Summary

Phase 3 builds the complete article reading experience on top of Phase 1's design system and Phase 2's content pipeline. The primary technical challenges are: (1) wiring Velite's compiled MDX and TOC data into a `[slug]/page.tsx` dynamic route with `generateStaticParams`, (2) building an Intersection Observer-driven sticky TOC sidebar, (3) implementing a CSS grid-rows animated FAQ accordion with JSON-LD output, and (4) mapping custom MDX components (KeyTakeaways, FAQSection) through the existing MDXContent renderer.

The codebase is well-prepared. Velite already generates a `toc` array with `{title, url, items}` structure (confirmed from `.velite/guides.json`). The `getGuideBySlug()` query function, `MDXContent` component with its `sharedComponents` map, `cn()` utility, and all Tailwind design tokens (including `max-w-article`, `shadow-card`, prose overrides) are in place. Two new dependencies are needed: `lucide-react` for icons and `schema-dts` for type-safe JSON-LD.

**Primary recommendation:** Build components bottom-up (small reusable pieces first, page assembly last), use server components for everything except the FAQ accordion and TOC active tracking (which require client-side state/Intersection Observer).

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Table of Contents uses a sticky sidebar -- floats in a right sidebar, stays visible as user scrolls. Collapses to inline on mobile.
- D-02: Email CTA placement is Claude's discretion.
- D-03: Article body renders inside the existing `.article-content` prose class with `max-w-article` (48rem) width.
- D-04: FAQ accordion uses one-open-at-a-time behavior.
- D-05: TOC has active section highlighting via Intersection Observer.
- D-06: FAQ section includes JSON-LD FAQPage schema.
- D-07: "Last verified" badge uses tax year format: "Verified for 2025/26 tax year". Only shows when updatedDate exists.
- D-08: Category pill in meta line is a clickable link to `/guides/category/{slug}`.
- D-09: Meta line shows: published date, updated date (if exists), reading time, category pill, and verified badge (if updatedDate exists).
- D-10: Pillar articles get a "Comprehensive Guide" badge + enhanced header treatment.

### Claude's Discretion
- Email CTA exact placement and styling
- Specific section spacing and visual rhythm
- TOC sidebar width and breakpoint
- FAQ animation/transition style
- Related article card layout (use existing card shadow tokens)
- Breadcrumb separator and styling
- Key takeaways box design
- Enhanced header treatment details for pillar articles
- Mobile responsive adaptations for all sections

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ART-01 | Article page template renders MDX content with all 10 sections | Page layout pattern with server/client component split; Velite data flow; MDXContent component mapping |
| ART-02 | Auto-generated Table of Contents from H2 headings with anchor links | Velite `toc` field provides `{title, url, items}[]` array; rehype-slug already generates heading IDs; Intersection Observer for active tracking |
| ART-03 | KeyTakeaways MDX component: 3-5 bullet point summary box | Simple server component wrapping children with styled container; registered in sharedComponents map |
| ART-04 | FAQSection MDX component with collapsible Q&A and JSON-LD FAQPage schema | Client component with useState for one-open-at-a-time; CSS grid-rows animation; schema-dts types for FAQPage JSON-LD |
| ART-05 | RelatedArticles component showing 2-3 cards from frontmatter relatedSlugs | Server component; lookup via getGuideBySlug for each relatedSlug; graceful empty state |
| ART-06 | Breadcrumbs component: Home > Guides > {Category} > {Title} | Server component; getCategoryBySlug for category name; Lucide chevron-right separator |
| ART-07 | Meta line displaying published date, updated date, reading time, category pill | Server component; date formatting utility; getReadingTime; conditional rendering |
| ART-08 | "Last verified for [tax year]" badge on articles with updatedDate frontmatter | Conditional render when updatedDate exists; tax year calculation from updatedDate |
| CONT-04 | generateStaticParams pre-renders all published article pages at build time | getAllGuides() mapped to slug params; Next.js 14 static generation |

</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14.2.35 | App Router, SSG via generateStaticParams | Already installed, pinned |
| Velite | ^0.3.1 | MDX compilation, TOC generation, frontmatter | Already configured with full schema |
| Tailwind CSS | ^3.4.1 | Styling with design tokens | Already configured with brand palette |
| @tailwindcss/typography | ^0.5.19 | Prose styling for article content | Already configured with custom prose overrides |
| clsx + tailwind-merge | ^2.1.1 / ^3.5.0 | cn() utility | Already available in src/lib/utils.ts |

### New Dependencies
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lucide-react | ^1.7.0 | Tree-shakeable SVG icons (5 icons needed) | Standard icon library for Next.js. Only imports used icons. UI-SPEC specifies: chevron-down, chevron-right, clock, calendar, shield-check |
| schema-dts | ^2.0.0 | TypeScript types for Schema.org JSON-LD | Google-maintained. Type-safe FAQPage, Question, Answer schema. Prevents malformed structured data. Already in project stack spec. |

### Not Needed This Phase
| Library | Reason |
|---------|--------|
| motion | UI-SPEC explicitly states "Pure CSS grid-row animation -- no motion library needed for this phase. Motion library deferred to Phase 9." |
| @supabase/supabase-js | No database interaction in this phase |
| resend | No email in this phase |

**Installation:**
```bash
npm install lucide-react schema-dts
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   └── guides/
│       └── [slug]/
│           └── page.tsx          # Dynamic route with generateStaticParams + generateMetadata
├── components/
│   ├── article/
│   │   ├── breadcrumbs.tsx       # Server component
│   │   ├── meta-line.tsx         # Server component
│   │   ├── table-of-contents.tsx # Client component (Intersection Observer)
│   │   ├── key-takeaways.tsx     # Server component (MDX custom component)
│   │   ├── faq-section.tsx       # Client component (accordion state + JSON-LD)
│   │   ├── related-articles.tsx  # Server component
│   │   └── email-cta-placeholder.tsx # Server component
│   └── mdx/
│       └── mdx-content.tsx       # Updated: add KeyTakeaways + FAQSection to sharedComponents
└── lib/
    └── utils.ts                  # Existing cn(); add formatDate() utility
```

### Pattern 1: Server/Client Component Split
**What:** Most article components are server components (Breadcrumbs, MetaLine, KeyTakeaways, RelatedArticles, EmailCTAPlaceholder). Only TOC and FAQ require `"use client"` because they need browser APIs (Intersection Observer) or interactive state (accordion open/close).
**When to use:** Always in Next.js 14 App Router -- default to server, opt into client only when needed.
**Key rule:** The page.tsx itself is a server component. It imports client components which handle their own interactivity.

### Pattern 2: generateStaticParams for Build-Time Rendering
**What:** Export `generateStaticParams` from `page.tsx` to pre-render all published articles at build time.
**Example:**
```typescript
// src/app/guides/[slug]/page.tsx
import { getAllGuides, getGuideBySlug } from '@/lib/content/queries';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();
  // render article...
}
```

### Pattern 3: Velite TOC Data Structure
**What:** Velite's `s.toc()` generates a nested array from MDX headings. Each entry has `{title: string, url: string, items: TocEntry[]}`. H2s are top-level entries, H3s are nested in `items`.
**Confirmed from `.velite/guides.json`:**
```json
[
  {"title": "Who Must Register for VAT", "url": "#who-must-register-for-vat", "items": []},
  {"title": "How to Register for VAT", "url": "#how-to-register-for-vat", "items": [
    {"title": "Sole Traders", "url": "#sole-traders", "items": []},
    {"title": "Limited Companies", "url": "#limited-companies", "items": []}
  ]}
]
```
**Usage:** Pass `guide.toc` directly to the TableOfContents component. No parsing needed.

### Pattern 4: MDX Custom Component Registration
**What:** The existing `MDXContent` component has a `sharedComponents` map (currently empty). Phase 3 adds KeyTakeaways and FAQSection to this map so MDX authors can use `<KeyTakeaways>` and `<FAQSection>` / `<FAQItem>` in articles.
**Example:**
```typescript
// src/components/mdx/mdx-content.tsx (updated)
import { KeyTakeaways } from '@/components/article/key-takeaways';
import { FAQSection, FAQItem } from '@/components/article/faq-section';

const sharedComponents = {
  KeyTakeaways,
  FAQSection,
  FAQItem,
};
```

### Pattern 5: CSS Grid-Rows Accordion Animation
**What:** Animate height from 0 to auto using `grid-template-rows: 0fr` to `1fr` transition. This is a pure CSS technique that avoids JavaScript height measurement.
**Why:** UI-SPEC explicitly defers motion library to Phase 9. CSS grid-rows is well-supported (all modern browsers).
**Example:**
```css
.accordion-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms ease;
  overflow: hidden;
}
.accordion-panel[data-open="true"] {
  grid-template-rows: 1fr;
}
.accordion-panel > div {
  overflow: hidden;
}
```
**In Tailwind:** Use arbitrary values: `grid grid-rows-[0fr] data-[open=true]:grid-rows-[1fr] transition-[grid-template-rows] duration-200 overflow-hidden`

### Pattern 6: Intersection Observer for TOC Active Tracking
**What:** A client component that observes all H2 elements and highlights the corresponding TOC link.
**Key details from UI-SPEC:** rootMargin of `-96px 0px -66%` (accounts for sticky top offset and focuses on upper third of viewport).
**Example:**
```typescript
'use client';
import { useEffect, useState } from 'react';

function useActiveHeading(headingIds: string[]) {
  const [activeId, setActiveId] = useState<string>('');
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-96px 0px -66% 0px' }
    );
    
    headingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [headingIds]);
  
  return activeId;
}
```

### Pattern 7: JSON-LD FAQPage Schema Output
**What:** The FAQSection component renders a `<script type="application/ld+json">` block alongside the visible FAQ.
**Google requirements (2025):** FAQPage rich results are limited to "well-known, authoritative" sites. Still worth implementing for SEO baseline -- the schema is valid regardless of rich result eligibility.
**Example with schema-dts:**
```typescript
import type { FAQPage, WithContext } from 'schema-dts';

function generateFaqSchema(items: {question: string; answer: string}[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
```

### Anti-Patterns to Avoid
- **Making page.tsx a client component:** The page itself MUST be a server component. Only interactive sub-components (TOC, FAQ) use `"use client"`.
- **Fetching guides in client components:** All Velite data access (`getGuideBySlug`, `getAllGuides`) happens in server components only. Velite data is a build-time Node.js import.
- **Using `useEffect` for initial data:** TOC data, related articles, and metadata are all available at build time. No client-side fetching needed.
- **Animating with max-height hack:** Use CSS grid-rows technique instead. `max-height: 999px` causes visible timing issues.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SVG icons | Custom SVG files | lucide-react | Tree-shakeable, consistent sizing, accessible defaults |
| JSON-LD types | Manual JSON objects | schema-dts | Google-maintained TypeScript types prevent schema errors |
| Heading ID generation | Custom slug function | rehype-slug (already configured) | Already generating IDs via Velite MDX pipeline |
| TOC data extraction | Custom MDX AST parser | Velite `s.toc()` (already configured) | Already generating TOC in `.velite/guides.json` |
| Date formatting | Custom date logic | Intl.DateTimeFormat or lightweight helper | Built-in browser API handles "3 Apr 2026" format |
| Class merging | Template literals | cn() utility (already exists) | Handles Tailwind class conflicts correctly |
| Reading time | Custom word counter | getReadingTime() (already exists) | Already calculates from Velite wordCount at 200 WPM |

**Key insight:** Phase 2 built most of the data layer. Phase 3 is primarily a UI/component assembly phase with two interactive behaviors (TOC tracking, FAQ accordion).

## Common Pitfalls

### Pitfall 1: Velite Import in Client Components
**What goes wrong:** Importing from `#site/content` in a `"use client"` component causes build errors because Velite output is server-only.
**Why it happens:** Velite generates Node.js module output that can't be bundled for the browser.
**How to avoid:** All Velite data must be passed as props from server components to client components. The page.tsx (server) reads the guide, then passes `guide.toc` as a prop to the TOC client component.
**Warning signs:** Build error mentioning "Module not found" or "Can't resolve '#site/content'" in client bundle.

### Pitfall 2: Intersection Observer SSR Crash
**What goes wrong:** `IntersectionObserver` is a browser API. Using it outside a `useEffect` or without a `"use client"` directive causes SSR errors.
**Why it happens:** Server-side rendering has no DOM.
**How to avoid:** Always wrap Intersection Observer in `useEffect`. The TOC component MUST have `"use client"` directive. Check `typeof window !== 'undefined'` if needed.
**Warning signs:** "IntersectionObserver is not defined" during build.

### Pitfall 3: FAQ Accordion Re-renders Killing Animation
**What goes wrong:** If FAQ state management causes full re-renders, the CSS transition gets interrupted.
**Why it happens:** React re-renders the entire component tree on state change if not structured correctly.
**How to avoid:** Use a single `openIndex` state (number | null) in the parent FAQSection. Toggle by comparing index. Don't unmount/remount answer panels -- toggle visibility via data attributes or className.
**Warning signs:** Accordion "jumps" instead of smoothly animating.

### Pitfall 4: generateStaticParams Returns Future Articles
**What goes wrong:** Articles with `publishDate` in the future get pre-rendered and are accessible via direct URL.
**Why it happens:** `generateStaticParams` runs at build time; if it includes unpublished slugs, the pages exist.
**How to avoid:** Use `getAllGuides()` which already filters by `isPublished()`. The page function also calls `getGuideBySlug()` which checks publication date. Double protection.
**Warning signs:** Visiting `/guides/some-future-article` returns content instead of 404.

### Pitfall 5: scroll-behavior: smooth Conflicts with Instant Navigation
**What goes wrong:** `html { scroll-behavior: smooth }` (already in globals.css) can cause slow scroll when clicking TOC links far apart.
**Why it happens:** Browser smoothly scrolls through entire page content.
**How to avoid:** This is generally fine for TOC anchor links. If it becomes an issue, TOC links can use `element.scrollIntoView({ behavior: 'smooth' })` with JavaScript for more control. Leave CSS smooth scrolling as-is for now.
**Warning signs:** Users complain TOC clicks are "slow" on very long articles.

### Pitfall 6: Category Link to Non-Existent Pages
**What goes wrong:** Category pill links to `/guides/category/{slug}` but these pages don't exist until Phase 4.
**Why it happens:** Phase 3 builds article pages before category archive pages.
**How to avoid:** This is intentional per CONTEXT.md D-08. The link is a standard `<a>` tag -- it will show Next.js default 404 until Phase 4 creates the pages. No special handling needed. Do NOT add `onClick={e => e.preventDefault()}` or disable the link.
**Warning signs:** None -- this is expected behavior documented in the phase decisions.

### Pitfall 7: Tax Year Calculation Edge Cases
**What goes wrong:** Displaying wrong tax year format (e.g., "2025/26" vs "2024/25").
**Why it happens:** Irish tax years run January-December for most individuals. The "2025/26" format in the UI-SPEC appears to reference fiscal year. Need a clear formula.
**How to avoid:** Use the `updatedDate` year directly. If updatedDate is in 2025, show "Verified for 2025/26 tax year" (current year / next year's last 2 digits). Simple formula: `${year}/${(year+1).toString().slice(-2)}`.
**Warning signs:** Badge shows wrong year after January transitions.

## Code Examples

### Date Formatting Utility
```typescript
// src/lib/utils.ts (add to existing file)
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getTaxYear(dateString: string): string {
  const year = new Date(dateString).getFullYear();
  return `${year}/${(year + 1).toString().slice(-2)}`;
}
```

### generateStaticParams + Page Structure
```typescript
// src/app/guides/[slug]/page.tsx
import { getAllGuides, getGuideBySlug, getReadingTime } from '@/lib/content/queries';
import { getCategoryBySlug } from '@/lib/content/categories';
import { notFound } from 'next/navigation';
import { MDXContent } from '@/components/mdx/mdx-content';
// ... import article components

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();
  
  const category = getCategoryBySlug(guide.category);
  const readingTime = getReadingTime(guide);
  const relatedGuides = guide.relatedSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter(Boolean);

  return (
    <article>
      <Breadcrumbs category={category} title={guide.title} />
      {/* ... title, meta, TOC, body, takeaways, FAQ, CTA, related */}
    </article>
  );
}
```

### Velite TOC Type (for component props)
```typescript
// Type derived from Velite's s.toc() output
export interface TocEntry {
  title: string;
  url: string;        // e.g., "#who-must-register-for-vat"
  items: TocEntry[];  // nested H3s under this H2
}
```

### FAQ JSON-LD Output Pattern
```typescript
// Inside FAQSection component
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateFaqSchema(items)),
  }}
/>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| max-height accordion animation | CSS grid-template-rows 0fr/1fr | 2023+ (broad browser support) | Smooth height:auto transitions without JS measurement |
| FAQPage rich results for all sites | FAQPage limited to authoritative/gov/health sites | Aug 2023 Google update | Still implement for valid schema; rich results not guaranteed |
| Contentlayer for MDX TOC | Velite s.toc() | 2024 (Contentlayer abandoned) | Velite generates identical TOC structure with active maintenance |
| Client-side route data fetching | Server components with build-time data | Next.js 13+ App Router | Zero client JS for data; Velite imports work only server-side |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Not yet configured (Wave 0 gap) |
| Config file | none -- see Wave 0 |
| Quick run command | TBD after framework setup |
| Full suite command | TBD after framework setup |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ART-01 | Article page renders all 10 sections | integration | Render test checking for section landmarks | No -- Wave 0 |
| ART-02 | TOC auto-generates from H2 headings with anchor links | unit | Verify TOC data maps to rendered links | No -- Wave 0 |
| ART-03 | KeyTakeaways renders bullet list with styled container | unit | Snapshot or assertion on rendered output | No -- Wave 0 |
| ART-04 | FAQSection renders collapsible Q&A + JSON-LD | unit | Check accordion behavior + JSON-LD script tag | No -- Wave 0 |
| ART-05 | RelatedArticles shows cards from relatedSlugs | unit | Verify card rendering with mock guide data | No -- Wave 0 |
| ART-06 | Breadcrumbs render correct path | unit | Assert Home > Guides > Category > Title structure | No -- Wave 0 |
| ART-07 | Meta line shows dates, reading time, category | unit | Assert conditional rendering logic | No -- Wave 0 |
| ART-08 | Verified badge shows tax year when updatedDate exists | unit | Test with/without updatedDate | No -- Wave 0 |
| CONT-04 | generateStaticParams returns all published slugs | unit | Call function, verify slug array matches published guides | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** Quick validation via `npm run build` (catches type errors + static generation)
- **Per wave merge:** Full build + manual visual check of rendered article page
- **Phase gate:** `npm run build` succeeds with all 3 sample articles rendering correctly

### Wave 0 Gaps
- [ ] Test framework selection and installation (Jest + React Testing Library, or Vitest)
- [ ] Test configuration for Next.js 14 App Router components
- [ ] Mock setup for Velite `#site/content` imports in test environment

Note: Given the heavy UI focus of this phase, `npm run build` is the most valuable automated check -- it verifies TypeScript types, static generation, and component compilation. Visual validation supplements build verification.

## Open Questions

1. **Test framework choice**
   - What we know: No test framework is configured yet. The project uses Next.js 14 + TypeScript.
   - What's unclear: Whether to use Jest + RTL (traditional, more setup for App Router) or Vitest (faster, better ESM support).
   - Recommendation: Defer formal test setup to a later phase unless the planner wants Wave 0 to include it. `npm run build` provides strong validation for static components.

2. **Smooth scroll offset for sticky header**
   - What we know: CSS `scroll-behavior: smooth` is already set. TOC links use `#hash` anchors.
   - What's unclear: Whether there will be a sticky header (Phase 5 NAV-01) that overlaps anchor targets.
   - Recommendation: Add `scroll-margin-top: 96px` to H2 elements (matching TOC sticky `top-24`). This ensures anchors don't scroll behind a future sticky header.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build + dev | Assumed available | -- | -- |
| npm | Package install | Assumed available | -- | -- |
| lucide-react | Icons in 5 components | Not installed | -- | Install via npm |
| schema-dts | FAQ JSON-LD types | Not installed | -- | Install via npm |

**Missing dependencies with no fallback:**
- None -- both new packages are straightforward npm installs.

**Missing dependencies with fallback:**
- None needed.

## Project Constraints (from CLAUDE.md)

- **Stack lock:** Next.js 14 (App Router), TypeScript, Tailwind CSS v3, Velite for MDX. No upgrades.
- **Ireland only:** All content, date formats, tax year references specific to Republic of Ireland.
- **No personal author:** Brand is the authority. No individual attribution.
- **No third-party tracking:** No analytics scripts in this phase.
- **GDPR:** Not directly relevant to this phase (no forms/data collection).
- **Deployment:** Vercel default domain. No custom domain.
- **GSD workflow:** All changes through GSD commands.
- **Conventions:** Use existing patterns (cn(), article-content class, max-w-article, Satoshi headings, DM Sans body).

## Sources

### Primary (HIGH confidence)
- `.velite/guides.json` -- Confirmed Velite TOC structure: `{title, url, items}[]` with nested H3 support
- `src/lib/content/queries.ts` -- Existing query functions confirmed: getAllGuides, getGuideBySlug, getReadingTime
- `src/components/mdx/mdx-content.tsx` -- Existing MDX renderer with empty sharedComponents map ready for Phase 3
- `velite.config.ts` -- Confirmed schema: toc, body, relatedSlugs, isPillar, updatedDate fields
- `tailwind.config.ts` -- Confirmed design tokens: max-w-article, shadow-card, prose overrides, burnt-orange palette
- [Next.js generateStaticParams docs](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) -- Official API reference
- [Google FAQPage structured data](https://developers.google.com/search/docs/appearance/structured-data/faqpage) -- Current requirements and eligibility

### Secondary (MEDIUM confidence)
- [CSS grid-rows accordion technique](https://css-tricks.com/css-grid-can-do-auto-height-transitions/) -- Well-documented technique, broad browser support
- [Tailwind grid-rows discussion](https://github.com/tailwindlabs/tailwindcss/discussions/11186) -- Tailwind arbitrary value syntax for grid-rows

### Tertiary (LOW confidence)
- None -- all findings verified against codebase or official documentation.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all dependencies verified against existing package.json and npm registry
- Architecture: HIGH -- patterns derived from existing codebase (Velite config, MDXContent, queries.ts) and confirmed Next.js 14 App Router conventions
- Pitfalls: HIGH -- derived from direct codebase inspection (Velite server-only imports, existing smooth scroll CSS, date handling patterns from Phase 2)

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable -- no fast-moving dependencies)
