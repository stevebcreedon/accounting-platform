# Phase 2: Content Pipeline - Research

**Researched:** 2026-04-03
**Domain:** MDX content pipeline with Velite, Zod validation, query functions, scheduled publishing
**Confidence:** HIGH

## Summary

Phase 2 builds the content backbone of the platform: Velite compiles MDX articles at build time with strict Zod frontmatter validation, typed query functions expose content data, and a date-based gate controls article visibility. The existing scaffold (Phase 1) provides Next.js 14 with App Router, Tailwind v3 with typography plugin, brand fonts (Satoshi/DM Sans), and a `cn()` utility -- all ready for content integration.

Velite 0.3.1 is the current stable release and provides all required features: `s.mdx()` for content compilation, `s.metadata()` for automatic reading time/word count, `s.slug()` for unique slug enforcement, `s.isodate()` for date parsing, and standard Zod types for all other schema fields. The MDX rendering pattern uses `new Function(code)` with `react/jsx-runtime` -- no heavy bundler needed at runtime.

**Primary recommendation:** Use Velite with strict Zod schema, a `src/lib/content/queries.ts` abstraction layer for all content access, and date comparison filtering (`publishDate <= today`) applied in every query function. Store MDX files in `content/` organized flat by slug (not nested by category) for simplicity with Velite's glob patterns.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: File organization is Claude's discretion
- D-02: Create 2-3 sample articles with real Irish accounting content (one pillar, one or two spoke)
- D-03: Sample articles must contain real, accurate Irish accounting guidance -- not placeholder text
- D-04: Schema includes: title, description, slug, publishDate, category, pillarOrSpoke flag, relatedSlugs array, featured boolean, plus additional fields Claude determines needed
- D-05: Zod validation is strict -- reject unknown fields
- D-06: Reading time calculated from word count at 200 wpm (CONT-07)
- D-07: Each of the 8 categories gets a short description (1-2 sentences) and an icon/emoji
- D-08: The 8 categories are: Getting Started, Business Structures, Tax Obligations, Accounting Basics, Choosing an Accountant, Costs & Fees, Compliance & Deadlines, Industry Guides
- D-09: Pillar vs spoke visual distinction is Claude's discretion
- D-10: Future-dated articles hidden completely -- excluded from ALL queries, listings, sitemap, and public-facing pages
- D-11: No separate draft status -- publishDate is the single gate. No publishDate = never published

### Claude's Discretion
- File organization on disk (flat vs nested)
- Complete frontmatter schema beyond the fields specified above
- Pillar/spoke visual distinction approach
- Velite config structure and content collection setup
- Query function implementation details
- Category icon/emoji selection
- Sample article topics (must be real Irish accounting content)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | Velite configured with Zod schema validation for MDX frontmatter | Velite config pattern with `s.object()` and strict mode; all schema types documented below |
| CONT-02 | getAllGuides(), getGuideBySlug(), getGuidesByCategory(), getCategories() utility functions | Query layer pattern in `src/lib/content/queries.ts` with typed returns |
| CONT-03 | Articles only render when publishDate <= current date | Date filtering in every query function; `new Date(a.publishDate) <= new Date()` |
| CONT-04 | generateStaticParams pre-renders all published article pages at build time | Static params from query functions; pattern documented below |
| CONT-05 | 8 content categories configured | Category enum in Zod schema + categories config object with descriptions/icons |
| CONT-06 | Pillar articles visually distinguished from spoke articles | `isPillar` boolean in schema; distinction available in query results for downstream phases |
| CONT-07 | Reading time calculated from word count (200 wpm) | Velite `s.metadata()` provides `readingTime` and `wordCount` automatically |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack locked:** Next.js 14 (App Router), TypeScript, Tailwind CSS v3, MDX, Velite
- **Content specificity:** Republic of Ireland only
- **Brand:** No personal author attribution. Brand is the authority.
- **Velite version:** Pin to `^0.3.1` (pre-1.0, avoid breaking changes)
- **Do NOT use:** Contentlayer, next-mdx-remote, @next/mdx, gray-matter (unless Velite fails)
- **Tailwind:** v3 only, NOT v4
- **next.config.mjs:** Already exists as ESM -- compatible with Velite top-level await pattern

## Standard Stack

### Core (Phase 2 additions)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| velite | 0.3.1 | MDX content pipeline + Zod validation | Type-safe content layer, replaces abandoned Contentlayer, handles frontmatter/MDX/types in one tool |
| zod | 3.24.x | Schema validation (Velite dependency) | Already used internally by Velite; explicit install for custom validators |
| @mdx-js/react | 3.1.1 | MDX React component mapping | Required for custom component overrides in MDX content |
| rehype-pretty-code | 0.14.3 | Syntax highlighting | Server-side via Shiki, zero client JS |
| rehype-slug | 6.0.0 | Heading anchor IDs | Required for TOC linking (Phase 3) |
| rehype-autolink-headings | 7.1.0 | Heading permalink anchors | Shareable section links |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown | Tables, strikethrough for accounting comparison content |
| shiki | 4.0.2 | Syntax highlighting engine | Required by rehype-pretty-code |

### Already Installed (Phase 1)
| Library | Version | Purpose |
|---------|---------|---------|
| next | 14.2.35 | App Router framework |
| react / react-dom | ^18 | UI library |
| tailwindcss | ^3.4.1 | Styling |
| @tailwindcss/typography | ^0.5.19 | Prose classes for article content |
| clsx + tailwind-merge | ^2.1.1 / ^3.5.0 | cn() utility |

**Installation:**
```bash
npm install velite zod @mdx-js/react rehype-pretty-code shiki rehype-slug rehype-autolink-headings remark-gfm
```

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)
```
/
├── content/
│   └── guides/
│       ├── how-to-register-for-vat-in-ireland.mdx     (pillar)
│       ├── what-does-an-accountant-cost-ireland.mdx    (spoke)
│       └── sole-trader-vs-limited-company-ireland.mdx  (spoke)
├── velite.config.ts
├── src/
│   ├── lib/
│   │   └── content/
│   │       ├── queries.ts          # getAllGuides, getGuideBySlug, etc.
│   │       └── categories.ts       # Category config (descriptions, icons)
│   └── components/
│       └── mdx/
│           └── mdx-content.tsx     # MDX renderer component
├── .velite/                        # Generated output (gitignored)
└── next.config.mjs                 # Updated with Velite integration
```

### Pattern 1: Velite Configuration with Strict Zod Schema
**What:** Define a single `guides` collection in `velite.config.ts` with strict schema validation.
**When to use:** Always -- this is the content pipeline foundation.

```typescript
// velite.config.ts
import { defineConfig, s } from 'velite';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:8].[ext]',
    clean: true,
  },
  collections: {
    guides: {
      name: 'Guide',
      pattern: 'guides/**/*.mdx',
      schema: s.object({
        title: s.string().max(70),
        description: s.string().max(160),
        slug: s.slug('guides'),
        publishDate: s.isodate(),
        updatedDate: s.isodate().optional(),
        category: s.enum([
          'getting-started',
          'business-structures',
          'tax-obligations',
          'accounting-basics',
          'choosing-an-accountant',
          'costs-and-fees',
          'compliance-and-deadlines',
          'industry-guides',
        ]),
        isPillar: s.boolean().default(false),
        featured: s.boolean().default(false),
        relatedSlugs: s.array(s.string()).default([]),
        keywords: s.array(s.string()).default([]),
        metadata: s.metadata(),   // auto readingTime + wordCount
        toc: s.toc(),             // auto table of contents
        body: s.mdx(),            // compiled MDX function body
      }),
    },
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: 'github-light' }],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
});
```

**Source:** [Velite docs - velite-schemas](https://velite.js.org/guide/velite-schemas), [Velite docs - with-nextjs](https://velite.js.org/guide/with-nextjs)

### Pattern 2: Next.js Integration (Top-Level Await)
**What:** Trigger Velite build from `next.config.mjs` using top-level await.
**When to use:** Always -- this is the recommended approach for Next.js 14.

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */

const isDev = process.argv.indexOf('dev') !== -1;
const isBuild = process.argv.indexOf('build') !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1';
  const { build } = await import('velite');
  await build({ watch: isDev, clean: !isDev });
}

const nextConfig = {};

export default nextConfig;
```

**Source:** [Velite Next.js integration guide](https://velite.js.org/guide/with-nextjs)

### Pattern 3: Content Query Abstraction Layer
**What:** All content access goes through typed query functions. Never import `.velite` directly in page components.
**When to use:** Every page that needs content data.

```typescript
// src/lib/content/queries.ts
import { guides } from '#site/content';  // Velite path alias

export type Guide = (typeof guides)[number];

function isPublished(guide: Guide): boolean {
  return new Date(guide.publishDate) <= new Date();
}

export function getAllGuides(): Guide[] {
  return guides
    .filter(isPublished)
    .sort((a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
}

export function getGuideBySlug(slug: string): Guide | undefined {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide || !isPublished(guide)) return undefined;
  return guide;
}

export function getGuidesByCategory(category: string): Guide[] {
  return getAllGuides().filter((g) => g.category === category);
}

export function getCategories(): string[] {
  return [
    'getting-started',
    'business-structures',
    'tax-obligations',
    'accounting-basics',
    'choosing-an-accountant',
    'costs-and-fees',
    'compliance-and-deadlines',
    'industry-guides',
  ];
}

export function getPillarGuides(): Guide[] {
  return getAllGuides().filter((g) => g.isPillar);
}

export function getFeaturedGuides(): Guide[] {
  return getAllGuides().filter((g) => g.featured);
}
```

### Pattern 4: MDX Content Renderer
**What:** A reusable component that renders Velite's compiled MDX function-body strings.
**When to use:** Every article page.

```typescript
// src/components/mdx/mdx-content.tsx
import * as runtime from 'react/jsx-runtime';

const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

// Global component overrides for MDX
const sharedComponents = {
  // Add custom components here as they're built in Phase 3
};

interface MDXContentProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return (
    <Component components={{ ...sharedComponents, ...components }} />
  );
}
```

**Source:** [Velite MDX guide](https://velite.js.org/guide/using-mdx)

### Pattern 5: Category Configuration
**What:** Central config object for category metadata (descriptions, icons/emoji).
**When to use:** Category listing pages, navigation, article badges.

```typescript
// src/lib/content/categories.ts
export interface CategoryConfig {
  slug: string;
  name: string;
  description: string;
  emoji: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    description: 'First steps for new Irish business owners navigating accounting.',
    emoji: '🚀',
  },
  {
    slug: 'business-structures',
    name: 'Business Structures',
    description: 'Sole trader, limited company, and partnership comparisons for Ireland.',
    emoji: '🏢',
  },
  // ... remaining 6 categories
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
```

### Pattern 6: generateStaticParams for Article Pages
**What:** Pre-render all published articles at build time using Velite data.
**When to use:** Article page routes (Phase 3-4, but the query functions support it now).

```typescript
// Example for future /guides/[slug]/page.tsx
import { getAllGuides } from '@/lib/content/queries';

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({
    slug: guide.slug,
  }));
}
```

### Anti-Patterns to Avoid
- **Importing `.velite` directly in pages:** Always go through `queries.ts`. If Velite is ever swapped, only one file changes.
- **Forgetting date filtering:** Every public-facing query MUST filter by `publishDate <= today`. One unfiltered query leaks unpublished content.
- **Using `s.boolean().default(true)` for published field:** Decision D-11 says no separate published flag. `publishDate` IS the gate. If no publishDate, the article should not exist (Zod will reject it since `publishDate` is required).
- **Nested category directories for content files:** Velite's `s.slug('guides')` enforces uniqueness across the whole collection. Nesting by category adds complexity (slug includes directory path) with no benefit since category is a frontmatter field, not a filesystem concern.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reading time calculation | Manual word count + division | `s.metadata()` from Velite | Returns `readingTime` and `wordCount` automatically from document body |
| Table of contents extraction | Regex or rehype plugin to parse headings | `s.toc()` from Velite | Returns structured TOC array from document, handles nesting |
| Slug generation/validation | Manual slugify + uniqueness check | `s.slug('guides')` from Velite | Enforces unique slugs across collection, validates format |
| Date parsing/normalization | Manual Date constructor calls | `s.isodate()` from Velite | Normalizes various date formats to ISO 8601 |
| Frontmatter parsing | gray-matter + manual types | Velite collection schema | Zod validation, TypeScript types, computed fields all in one |
| MDX compilation | @next/mdx or next-mdx-remote setup | `s.mdx()` from Velite | Compiles to function-body string, no runtime bundler |

**Key insight:** Velite's `s.metadata()` and `s.toc()` schema types eliminate the two most common hand-rolled features in MDX pipelines. Using them means reading time and TOC are available as data at build time, not computed at render time.

## Common Pitfalls

### Pitfall 1: Velite Path Alias Not Configured
**What goes wrong:** Import `from '.velite'` fails with module not found.
**Why it happens:** Velite outputs to `.velite/` directory but TypeScript/Next.js don't know about it.
**How to avoid:** Add path alias in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "#site/content": ["./.velite"]
    }
  }
}
```
And ensure `.velite` is in `.gitignore` (it's generated output).
**Warning signs:** `Cannot find module '.velite'` or `Cannot find module '#site/content'` errors.

### Pitfall 2: Velite Output Not Gitignored
**What goes wrong:** Generated `.velite/` directory gets committed, causing merge conflicts and stale data.
**Why it happens:** Velite creates `.velite/` at project root; default `.gitignore` doesn't include it.
**How to avoid:** Add `.velite` to `.gitignore` before first build.
**Warning signs:** Large JSON files appearing in git diff after build.

### Pitfall 3: Date Comparison Timezone Issues
**What goes wrong:** Articles appear a day early or late depending on build server timezone.
**Why it happens:** `new Date('2026-04-15')` creates a date at midnight UTC. Comparing with `new Date()` uses local time.
**How to avoid:** Use UTC-only comparison. Velite's `s.isodate()` normalizes to ISO 8601 with timezone. Compare dates as strings (`guide.publishDate <= new Date().toISOString()`) or ensure consistent UTC handling.
**Warning signs:** Articles appearing on different dates locally vs. on Vercel (which uses UTC).

### Pitfall 4: Strict Schema Blocks Build on Typos
**What goes wrong:** Entire build fails because one article has a typo in category enum.
**Why it happens:** Velite with `strict: true` (or strict Zod enums) rejects the whole collection on any validation error.
**How to avoid:** This is actually DESIRED behavior per D-05. Use descriptive Zod error messages. Keep `strict: true` in config. The point is to catch errors at build time, not serve broken content.
**Warning signs:** Build failure with Zod validation errors -- read the error message, fix the frontmatter.

### Pitfall 5: MDX Content Rendering Without jsx-runtime
**What goes wrong:** `TypeError: Cannot read properties of undefined (reading 'jsx')` when rendering MDX.
**Why it happens:** The `useMDXComponent` function needs `react/jsx-runtime` passed to the compiled function.
**How to avoid:** Import `* as runtime from 'react/jsx-runtime'` and pass it to the function constructor as shown in Pattern 4.
**Warning signs:** Runtime errors on article pages, blank content areas.

### Pitfall 6: Category Slug Mismatch Between Schema and Config
**What goes wrong:** Articles with category `choosing-accountant` don't match queries filtering for `choosing-an-accountant`.
**Why it happens:** Category slugs defined in two places (Zod enum and categories config) can drift.
**How to avoid:** Define category slugs in one canonical place and reference from both. The Zod enum in velite.config.ts is authoritative; the categories config in `categories.ts` must use identical slugs.
**Warning signs:** Empty category pages, articles not appearing in expected categories.

## Code Examples

### Sample MDX Article Frontmatter
```yaml
---
title: "How to Register for VAT in Ireland"
description: "Step-by-step guide to VAT registration for Irish sole traders and limited companies, including thresholds, forms, and timelines."
slug: "how-to-register-for-vat-in-ireland"
publishDate: "2026-04-01"
category: "tax-obligations"
isPillar: true
featured: true
relatedSlugs:
  - "what-does-an-accountant-cost-ireland"
  - "sole-trader-vs-limited-company-ireland"
keywords:
  - "vat registration ireland"
  - "how to register for vat"
  - "vat threshold ireland"
---
```

### Velite + Next.js Build Integration
```javascript
// next.config.mjs -- full file
/** @type {import('next').NextConfig} */

const isDev = process.argv.indexOf('dev') !== -1;
const isBuild = process.argv.indexOf('build') !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1';
  const { build } = await import('velite');
  await build({ watch: isDev, clean: !isDev });
}

const nextConfig = {};

export default nextConfig;
```

### TypeScript Path Alias for Velite
```json
// tsconfig.json paths addition
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "#site/content": ["./.velite"]
    }
  }
}
```

### Reading Time Display (using s.metadata())
```typescript
// The metadata field provides readingTime automatically
// In a component:
function ArticleMeta({ guide }: { guide: Guide }) {
  const minutes = Math.ceil(guide.metadata.readingTime);
  return <span>{minutes} min read</span>;
}
```

**Note on reading time:** Velite's `s.metadata()` calculates reading time from the document body. The decision specifies 200 wpm. Velite's default reading speed may differ -- verify the output and adjust with a custom computed field if Velite uses a different WPM rate. If Velite's reading time does not match 200 wpm, compute it manually from `metadata.wordCount`:

```typescript
// Fallback: compute from wordCount at 200 wpm
const readingTime = Math.ceil(guide.metadata.wordCount / 200);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contentlayer | Velite | 2024 | Contentlayer abandoned; Velite is spiritual successor with Zod |
| gray-matter + manual pipeline | Velite declarative config | 2024 | Eliminates ~200 lines of boilerplate |
| next-mdx-remote for all MDX | Velite s.mdx() for local files | 2024 | Simpler, build-time only, no runtime bundler |
| @next/mdx | Velite | 2024 | @next/mdx lacks frontmatter, querying, type generation |

## Open Questions

1. **Velite s.metadata() WPM rate**
   - What we know: `s.metadata()` returns `readingTime` and `wordCount`. Decision D-06 requires 200 wpm.
   - What's unclear: Velite's default WPM rate may not be 200. Documentation does not specify the rate.
   - Recommendation: Use `metadata.wordCount / 200` as the canonical reading time. Ignore `metadata.readingTime` if it differs from 200 wpm calculation. LOW confidence on Velite's default rate.

2. **Velite strict mode behavior**
   - What we know: Config has `strict: boolean` option. Zod enums inherently reject invalid values.
   - What's unclear: Whether `strict: true` at config level adds additional validation beyond Zod (e.g., rejecting unknown frontmatter fields).
   - Recommendation: Set `strict: true` in config AND use `s.object({...}).strict()` on the schema to reject unknown fields per D-05.

3. **Content path alias convention**
   - What we know: Velite docs show `import { posts } from '@/.velite'` and `#site/content` patterns.
   - What's unclear: Which alias pattern works best with Next.js 14 path resolution.
   - Recommendation: Use `#site/content` as the path alias -- it's a Node.js subpath import pattern that avoids confusion with `@/` prefix used for `src/`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (recommended -- fastest for Next.js/TypeScript) |
| Config file | None -- see Wave 0 |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | Velite builds with valid frontmatter, rejects invalid | integration | `npx vitest run src/lib/content/__tests__/schema.test.ts -t "schema"` | Wave 0 |
| CONT-02 | Query functions return correct typed data | unit | `npx vitest run src/lib/content/__tests__/queries.test.ts` | Wave 0 |
| CONT-03 | Future-dated articles excluded from all queries | unit | `npx vitest run src/lib/content/__tests__/queries.test.ts -t "scheduled"` | Wave 0 |
| CONT-04 | generateStaticParams returns published slugs only | unit | `npx vitest run src/lib/content/__tests__/queries.test.ts -t "staticParams"` | Wave 0 |
| CONT-05 | All 8 categories configured and queryable | unit | `npx vitest run src/lib/content/__tests__/categories.test.ts` | Wave 0 |
| CONT-06 | Pillar articles distinguishable in query results | unit | `npx vitest run src/lib/content/__tests__/queries.test.ts -t "pillar"` | Wave 0 |
| CONT-07 | Reading time calculated at 200 wpm | unit | `npx vitest run src/lib/content/__tests__/queries.test.ts -t "readingTime"` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Install vitest: `npm install -D vitest`
- [ ] `vitest.config.ts` -- framework config with path aliases
- [ ] `src/lib/content/__tests__/queries.test.ts` -- covers CONT-02, CONT-03, CONT-04, CONT-06, CONT-07
- [ ] `src/lib/content/__tests__/categories.test.ts` -- covers CONT-05
- [ ] `src/lib/content/__tests__/schema.test.ts` -- covers CONT-01 (requires build step)

**Note:** CONT-01 (Velite schema validation) is best tested as an integration test by running Velite build with valid and invalid sample content. Unit tests for query functions can mock the Velite output.

## Sources

### Primary (HIGH confidence)
- [Velite Next.js Integration](https://velite.js.org/guide/with-nextjs) - Build integration patterns, top-level await approach
- [Velite Schema Types](https://velite.js.org/guide/velite-schemas) - s.metadata(), s.toc(), s.slug(), s.isodate(), s.mdx() APIs
- [Velite MDX Guide](https://velite.js.org/guide/using-mdx) - MDX rendering pattern with react/jsx-runtime
- [Velite Config Reference](https://velite.js.org/reference/config) - defineConfig, collections, output options
- npm registry -- velite 0.3.1, zod 3.24.x, all rehype/remark plugins verified current

### Secondary (MEDIUM confidence)
- `.planning/research/ARCHITECTURE.md` -- Project-specific content flow and query layer patterns
- `.planning/research/STACK.md` -- Stack decisions and version pinning rationale

### Tertiary (LOW confidence)
- Velite `s.metadata()` reading WPM rate -- not documented, needs runtime verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified on npm, versions current, Velite 0.3.1 confirmed latest stable
- Architecture: HIGH -- patterns from official Velite docs, verified with project's existing architecture research
- Pitfalls: HIGH -- based on documented Velite behavior and common MDX pipeline issues

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (Velite is pre-1.0 but stable at 0.3.1; 1.0.0-alpha.1 exists but should not be used)
