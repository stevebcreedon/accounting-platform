# Phase 6: SEO Infrastructure - Research

**Researched:** 2026-04-03
**Domain:** Next.js 14 App Router SEO -- metadata, structured data, sitemaps, OG images
**Confidence:** HIGH

## Summary

Phase 6 adds comprehensive SEO infrastructure to the existing Next.js 14 App Router site. The codebase already has partial foundations: a root layout with `metadata` title template (`%s | The Ledger`), FAQPage JSON-LD in `faq-section.tsx`, breadcrumb data in `breadcrumbs.tsx`, and content query functions in `queries.ts`. What is missing: `generateMetadata` on dynamic pages, Article/BreadcrumbList/Organisation JSON-LD schemas, `sitemap.ts`, `robots.ts`, programmatic OG images, and `metadataBase` in the root layout.

The technical approach is straightforward -- all tools are built into Next.js 14 or already in the dependency list (`schema-dts`). The one non-obvious pitfall is that `@vercel/og` does not support woff2 fonts, so the Satoshi font used for headings needs a TTF version downloaded from Fontshare specifically for OG image generation. The existing static `export const metadata` on pages like `/about`, `/privacy`, etc. need enhancement with `openGraph`, `twitter`, and canonical fields but do not need conversion to `generateMetadata` (only dynamic pages like `[slug]` need the function form).

**Primary recommendation:** Add `metadataBase` to root layout, `generateMetadata` to all dynamic route pages, create a reusable `JsonLd` component for type-safe structured data output, build `sitemap.ts` and `robots.ts` at the app root, and create an OG image route at `src/app/api/og/route.tsx` using `@vercel/og` with Satoshi TTF font.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** OG images use branded editorial design -- cream background, article title in Satoshi, category pill, "The Ledger" wordmark. Uses @vercel/og with custom fonts.
- **D-02:** Title tag format: "Article Title | The Ledger" -- article title first for keyword prominence, brand after pipe.
- **D-03:** Twitter card type: summary_large_image for articles, summary for static pages.
- **D-04:** JSON-LD Article author is brand as Organization: author: { @type: 'Organization', name: 'The Ledger' }. No personal attribution per CLAUDE.md.
- **D-05:** Publisher same as author: Organization "The Ledger".
- **D-06:** Existing FAQPage JSON-LD in faq-section.tsx (Phase 3) stays in place -- SEO-03 is already partially addressed.
- **D-07:** BreadcrumbList JSON-LD derives from the same breadcrumb data as the visual Breadcrumbs component (Phase 3).
- **D-08:** Article intros use structured intro pattern -- every article starts with a direct 1-2 sentence answer to the title question, then expands. First 30% is citation-ready.
- **D-09:** Heading hierarchy audit (SEO-12) -- verify all existing articles use proper H1 > H2 > H3 nesting.
- **D-10:** Standard setup -- built-in sitemap.ts listing all published pages with lastModified. robots.txt allows all crawlers, points to sitemap. No sitemap index needed.
- **D-11:** No AI crawler blocking -- allow GPTBot, CCBot, etc. Content visibility maximized.

### Claude's Discretion
- OG image exact layout, font sizes, spacing
- generateMetadata description templates per page type
- Canonical URL base (use Vercel default domain until custom domain)
- Organisation schema details (logo placeholder, sameAs social links)
- Internal linking enforcement approach (SEO-11)
- Heading hierarchy audit method (SEO-12)
- Sample article intro rewrites for AI optimization (SEO-13)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | generateMetadata on every page: title, description, openGraph, twitter card, canonical URL | Root layout metadataBase + title template already exist; add generateMetadata to dynamic pages, enhance static metadata exports with OG/twitter/canonical fields |
| SEO-02 | JSON-LD Article schema on every guide page | schema-dts Article type with headline, author (Organization), publisher, datePublished, dateModified, wordCount |
| SEO-03 | JSON-LD FAQPage schema on articles with FAQ sections | Already implemented in faq-section.tsx -- verify output and validate with Rich Results Test |
| SEO-04 | JSON-LD BreadcrumbList schema on all guide pages | Reuse breadcrumbs.tsx data structure; output via reusable JsonLd component |
| SEO-05 | JSON-LD Organisation schema on homepage | schema-dts Organization type with areaServed Ireland, name "The Ledger" |
| SEO-06 | XML sitemap auto-generated via built-in sitemap.ts | Create src/app/sitemap.ts using getAllGuides(), getCategories(), static pages |
| SEO-07 | robots.txt allowing all crawlers | Create src/app/robots.ts with allow all, sitemap URL |
| SEO-08 | Canonical URLs on all pages | Set metadataBase in root layout; alternates.canonical in generateMetadata |
| SEO-09 | Open Graph and Twitter Card meta tags with programmatic OG images | OG images via route handler, referenced in generateMetadata openGraph.images |
| SEO-10 | Programmatic OG image generation via @vercel/og | Route handler at src/app/api/og/route.tsx with Satoshi TTF font, cream background, branded layout |
| SEO-11 | Internal linking: every article links to 2-3 related articles, pillar pages link to all spokes | relatedSlugs already in frontmatter; verify all articles have 2-3 relatedSlugs populated |
| SEO-12 | Clear heading hierarchy enforced (H1 > H2 > H3) | Audit existing MDX articles for heading nesting violations |
| SEO-13 | Concise introductory paragraphs with direct answers | Audit/rewrite article intros to follow structured intro pattern (D-08) |
</phase_requirements>

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 14.2.35 | App Router metadata API, sitemap.ts, robots.ts | Built-in generateMetadata, metadataBase, file conventions |
| schema-dts | ^2.0.0 | TypeScript types for JSON-LD | Google-maintained, type-safe Article/FAQPage/BreadcrumbList/Organization |

### To Install

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @vercel/og | ^0.11.1 | Programmatic OG image generation | JSX-to-PNG via ImageResponse. Bundled on Vercel but needs explicit install for local dev types and route handler usage. |

### Assets To Download

| Asset | Source | Purpose |
|-------|--------|---------|
| Satoshi-Variable.ttf | fontshare.com | OG image font -- @vercel/og does NOT support woff2, only ttf/otf/woff |

**Installation:**
```bash
npm install @vercel/og
```

**Font download:** Download Satoshi Variable TTF from fontshare.com and place at `public/fonts/Satoshi-Variable.ttf` (alongside existing woff2 files used by next/font).

## Architecture Patterns

### New Files to Create

```
src/
├── app/
│   ├── sitemap.ts              # SEO-06: Dynamic XML sitemap
│   ├── robots.ts               # SEO-07: robots.txt config
│   └── api/
│       └── og/
│           └── route.tsx        # SEO-10: OG image generation endpoint
├── components/
│   └── seo/
│       └── json-ld.tsx          # Reusable JSON-LD script component
└── lib/
    └── seo/
        ├── metadata.ts          # Shared generateMetadata helpers
        └── schemas.ts           # JSON-LD schema builder functions
```

### Files to Modify

```
src/
├── app/
│   ├── layout.tsx               # Add metadataBase
│   ├── page.tsx                 # Add Organisation JSON-LD, enhance metadata
│   ├── guides/
│   │   ├── [slug]/page.tsx      # Add generateMetadata, Article + BreadcrumbList JSON-LD
│   │   └── page.tsx             # Add metadata export with OG/canonical
│   ├── guides/category/[slug]/page.tsx  # Add generateMetadata
│   ├── about/page.tsx           # Enhance metadata with OG/canonical
│   ├── contact/page.tsx         # Enhance metadata with OG/canonical
│   ├── find-accountant/page.tsx # Enhance metadata with OG/canonical
│   ├── privacy/page.tsx         # Enhance metadata with OG/canonical
│   └── terms/page.tsx           # Enhance metadata with OG/canonical
content/
└── guides/*.mdx                 # SEO-11/12/13: Audit relatedSlugs, headings, intros
```

### Pattern 1: metadataBase in Root Layout

**What:** Set `metadataBase` once in root layout; all child `generateMetadata` can use relative URLs.
**When to use:** Always -- it is the canonical base URL for the entire site.

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app'
  ),
  title: {
    default: 'The Ledger - Irish Accounting Guidance',
    template: '%s | The Ledger',
  },
  description: 'Clear, jargon-free accounting guidance for Irish small businesses, sole traders, and company directors.',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    siteName: 'The Ledger',
  },
  twitter: {
    card: 'summary',
  },
};
```

**Key detail:** The `title.template` pattern `'%s | The Ledger'` already exists in root layout. Child pages just export `title: 'Article Title'` and Next.js applies the template automatically. This fulfills D-02.

### Pattern 2: generateMetadata for Dynamic Pages

**What:** Export async `generateMetadata` function from dynamic route pages.
**When to use:** Any page with `[slug]` or data-dependent metadata.

```typescript
// src/app/guides/[slug]/page.tsx
import type { Metadata } from 'next';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.publishDate,
      modifiedTime: guide.updatedDate,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(guide.title)}&category=${encodeURIComponent(guide.category)}`,
          width: 1200,
          height: 630,
          alt: guide.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
  };
}
```

**Key detail:** Velite data access is synchronous (imported from `#site/content`), so `generateMetadata` does NOT need to be async. This is a performance benefit.

### Pattern 3: Reusable JSON-LD Component

**What:** A typed component that renders `<script type="application/ld+json">`.
**When to use:** Any page needing structured data.

```typescript
// src/components/seo/json-ld.tsx
import type { Thing, WithContext } from 'schema-dts';

interface JsonLdProps<T extends Thing> {
  data: WithContext<T>;
}

export function JsonLd<T extends Thing>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

**Note:** The existing `faq-section.tsx` already outputs JSON-LD inline. For Article and BreadcrumbList, use this reusable component in the article page. For Organisation, use it on the homepage. Do NOT refactor the existing FAQ implementation -- it works and is a client component that dynamically extracts Q&A from children.

### Pattern 4: OG Image Route Handler

**What:** An API route that returns an ImageResponse with branded design.
**When to use:** Called by openGraph.images URL in generateMetadata.

```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get('title') || 'The Ledger';
  const category = searchParams.get('category') || '';

  // Load Satoshi TTF for OG images (woff2 not supported by @vercel/og)
  const satoshiFont = await fetch(
    new URL('../../../public/fonts/Satoshi-Variable.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        backgroundColor: '#FAF8F5',
        padding: '60px',
        fontFamily: 'Satoshi',
      }}>
        {/* Category pill */}
        {category && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 20,
            color: '#E8720C',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {category.replace(/-/g, ' ')}
          </div>
        )}
        {/* Title */}
        <div style={{
          display: 'flex',
          fontSize: 52,
          fontWeight: 700,
          color: '#1C1917',
          lineHeight: 1.2,
          maxWidth: '90%',
        }}>
          {title}
        </div>
        {/* Brand */}
        <div style={{
          display: 'flex',
          fontSize: 24,
          fontWeight: 700,
          color: '#1C1917',
          opacity: 0.6,
        }}>
          The Ledger
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Satoshi',
          data: satoshiFont,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
```

**Critical pitfall:** `@vercel/og` only supports **ttf, otf, and woff** fonts. The project currently only has `Satoshi-Variable.woff2`. A TTF version must be downloaded from Fontshare.

**Font loading:** On Vercel Edge Runtime, use `fetch(new URL(...))` to load font files. The URL must be relative to the route file. On local dev, the file must be accessible at that path.

### Pattern 5: sitemap.ts

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllGuides } from '@/lib/content/queries';
import { getAllCategorySlugs } from '@/lib/content/categories';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getAllGuides().map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: guide.updatedDate || guide.publishDate,
    changeFrequency: 'monthly' as const,
    priority: guide.isPillar ? 0.9 : 0.7,
  }));

  const categories = getAllCategorySlugs().map((slug) => ({
    url: `${BASE_URL}/guides/category/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/guides`, priority: 0.8, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/about`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/contact`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/find-accountant`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE_URL}/privacy`, priority: 0.2, changeFrequency: 'yearly' as const },
    { url: `${BASE_URL}/terms`, priority: 0.2, changeFrequency: 'yearly' as const },
  ].map((p) => ({ ...p, lastModified: new Date().toISOString() }));

  return [...staticPages, ...guides, ...categories];
}
```

### Pattern 6: robots.ts

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### Anti-Patterns to Avoid

- **Do NOT use `next-sitemap`:** Built-in `sitemap.ts` is typed, zero-dependency, and integrates with Velite data. Locked in CLAUDE.md.
- **Do NOT use `next-seo`:** Designed for Pages Router. App Router's built-in `metadata` and `generateMetadata` are superior.
- **Do NOT use `async` generateMetadata when data is synchronous:** Velite imports are synchronous. Making `generateMetadata` async adds unnecessary complexity and could trigger suspense boundaries.
- **Do NOT hardcode the base URL in multiple places:** Use `NEXT_PUBLIC_SITE_URL` env var or a shared constant. `metadataBase` handles URL resolution for relative paths in metadata.
- **Do NOT refactor existing FAQ JSON-LD:** It works correctly in `faq-section.tsx` as a client component. Moving it to a server component would break the dynamic Q&A extraction from children.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| JSON-LD typing | Manual JSON objects | schema-dts `WithContext<Article>` etc. | Catches missing required fields, wrong types at compile time |
| OG image generation | Canvas/Sharp image manipulation | @vercel/og `ImageResponse` | JSX-to-PNG with built-in text wrapping, font loading, edge-optimized |
| Sitemap XML | String template sitemap | Next.js built-in `sitemap.ts` | Typed, cached, auto-served at /sitemap.xml |
| robots.txt | Static file | Next.js built-in `robots.ts` | Dynamic URL resolution, typed |
| URL resolution | Manual URL concatenation | `metadataBase` + relative paths | Next.js resolves all metadata URLs against metadataBase |

## Common Pitfalls

### Pitfall 1: Missing metadataBase

**What goes wrong:** OG images and canonical URLs resolve to relative paths instead of absolute URLs. Social media crawlers cannot fetch images.
**Why it happens:** `metadataBase` is not set in root layout, so `openGraph.images` with relative URLs like `/api/og?title=...` don't get a host prefix.
**How to avoid:** Set `metadataBase` in root layout.tsx as the first metadata property. Use `NEXT_PUBLIC_SITE_URL` env var.
**Warning signs:** OG images showing broken on social preview tools (Twitter Card Validator, Facebook Debugger).

### Pitfall 2: @vercel/og Font Format (woff2 Not Supported)

**What goes wrong:** OG images render with fallback system font instead of Satoshi.
**Why it happens:** `@vercel/og` ImageResponse only supports ttf, otf, and woff. The project only has woff2 fonts.
**How to avoid:** Download Satoshi-Variable.ttf from Fontshare. Place in `public/fonts/` alongside the existing woff2 files.
**Warning signs:** OG images look generic/different from the site design.

### Pitfall 3: Edge Runtime Font Loading Path

**What goes wrong:** Font file not found at runtime, causing 500 errors on the OG route.
**Why it happens:** Edge runtime resolves `new URL()` differently than Node.js. The path must be relative to the source file.
**How to avoid:** Use `new URL('../../../public/fonts/Satoshi-Variable.ttf', import.meta.url)` with the correct number of `../` segments. Test locally before deploying.
**Warning signs:** OG route returns 500 in production but works locally (or vice versa).

### Pitfall 4: Duplicate JSON-LD on FAQ Pages

**What goes wrong:** Google sees two FAQPage schemas on a page -- one from `faq-section.tsx` and another if someone adds it via a central schema helper.
**Why it happens:** The existing FAQ JSON-LD is rendered inside the client component. A new system might add it again.
**How to avoid:** Do NOT add FAQPage schema from the article page template. It already lives in `faq-section.tsx`. Only add Article and BreadcrumbList JSON-LD from the page level.
**Warning signs:** Google Search Console shows "Duplicate structured data" warnings.

### Pitfall 5: Title Template Double-Application

**What goes wrong:** Title shows as "Article Title | The Ledger | The Ledger".
**Why it happens:** Root layout has `title.template: '%s | The Ledger'`. If a child page's `generateMetadata` returns `title: 'Article Title | The Ledger'` (manually appending the brand), the template applies again.
**How to avoid:** Child pages should return ONLY the page-specific title (e.g., `title: guide.title`). The root template handles the ` | The Ledger` suffix.
**Warning signs:** Check rendered `<title>` tag in browser dev tools.

### Pitfall 6: Canonical URL Without metadataBase

**What goes wrong:** `alternates.canonical: '/about'` renders as a relative URL in the HTML, which is invalid for canonical tags (must be absolute).
**Why it happens:** `metadataBase` not set, so Next.js cannot resolve relative canonicals.
**How to avoid:** Always set `metadataBase` first. Then relative paths in `alternates.canonical` will be resolved to absolute URLs.
**Warning signs:** View page source, check if `<link rel="canonical">` has a full URL.

## Code Examples

### JSON-LD Schema Builders

```typescript
// src/lib/seo/schemas.ts
import type { Article, BreadcrumbList, Organization, WithContext } from 'schema-dts';
import type { Guide } from '@/lib/content/queries';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-app.vercel.app';

const BRAND_ORG = {
  '@type': 'Organization' as const,
  name: 'The Ledger',
  url: BASE_URL,
};

export function buildArticleSchema(guide: Guide): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishDate,
    ...(guide.updatedDate && { dateModified: guide.updatedDate }),
    author: BRAND_ORG,
    publisher: BRAND_ORG,
    url: `${BASE_URL}/guides/${guide.slug}`,
    wordCount: guide.metadata.wordCount,
    image: `${BASE_URL}/api/og?title=${encodeURIComponent(guide.title)}&category=${encodeURIComponent(guide.category)}`,
  };
}

export function buildBreadcrumbSchema(
  categorySlug: string,
  categoryName: string,
  articleTitle: string,
  articleSlug: string
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: `${BASE_URL}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${BASE_URL}/guides/category/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: articleTitle,
        item: `${BASE_URL}/guides/${articleSlug}`,
      },
    ],
  };
}

export function buildOrganisationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Ledger',
    url: BASE_URL,
    description: 'Clear, jargon-free accounting guidance for Irish small businesses.',
    areaServed: {
      '@type': 'Country',
      name: 'Ireland',
      sameAs: 'https://en.wikipedia.org/wiki/Republic_of_Ireland',
    },
    // logo: `${BASE_URL}/logo.png`, // Add when logo is finalized
  };
}
```

### Static Page Metadata Enhancement

```typescript
// Pattern for static pages (about, contact, privacy, terms, etc.)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About The Ledger',
  description: 'The Ledger provides free, jargon-free accounting guidance for Irish small business owners.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About The Ledger',
    description: 'The Ledger provides free, jargon-free accounting guidance for Irish small business owners.',
    type: 'website',
  },
  twitter: {
    card: 'summary', // D-03: summary for static pages
  },
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| next-seo package | Built-in metadata/generateMetadata | Next.js 13.2+ (2023) | No extra dependency, full App Router support |
| next-sitemap postbuild | Built-in sitemap.ts route | Next.js 13.3+ (2023) | Zero config, typed, same data source as routes |
| Manual OG image design | @vercel/og ImageResponse | 2022 | Programmatic, scalable to 72+ articles |
| framer-motion import | motion import | 2024 | Not relevant to this phase |

## Open Questions

1. **Vercel default domain for metadataBase**
   - What we know: No custom domain yet (D-10 in CONTEXT.md). Vercel assigns a `.vercel.app` subdomain.
   - What's unclear: The exact Vercel project URL (e.g., `ledger-scaffold.vercel.app` or similar).
   - Recommendation: Use `NEXT_PUBLIC_SITE_URL` env var. Set it in `.env.local` for dev and in Vercel dashboard for production. Default fallback in code to prevent build failures.

2. **Organisation schema logo**
   - What we know: "The Ledger" is the brand name. No final logo exists yet.
   - What's unclear: Whether to include a logo property or omit it.
   - Recommendation: Include a commented-out logo line in the Organisation schema. Add it when logo is finalized. Google does not require logo for Organization schema.

3. **Internal linking completeness (SEO-11)**
   - What we know: `relatedSlugs` frontmatter field exists and `RelatedArticles` component is built.
   - What's unclear: Whether all 3 existing articles have adequate relatedSlugs and whether pillar articles link to all spokes.
   - Recommendation: Audit existing MDX files for relatedSlugs. With only 3 articles, each should reference the other two.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Next.js 14 | All SEO features | Yes | 14.2.35 | -- |
| schema-dts | JSON-LD typing | Yes | ^2.0.0 | -- |
| @vercel/og | OG images | No (not installed) | 0.11.1 (latest) | Must install |
| Satoshi TTF | OG image font | No (only woff2) | -- | Must download from Fontshare |
| NEXT_PUBLIC_SITE_URL | metadataBase, canonical URLs | No (env var) | -- | Hardcoded fallback in code |

**Missing dependencies with no fallback:**
- @vercel/og must be installed (`npm install @vercel/og`)
- Satoshi-Variable.ttf must be downloaded from Fontshare

**Missing dependencies with fallback:**
- NEXT_PUBLIC_SITE_URL env var -- code includes fallback URL string

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Not yet established |
| Config file | none -- see Wave 0 |
| Quick run command | `npx next build` (validates metadata at build time) |
| Full suite command | `npx next build && curl localhost:3000/sitemap.xml` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | Every page has generateMetadata with title, desc, OG, twitter, canonical | smoke | `npx next build` (build fails if generateMetadata has type errors) | N/A |
| SEO-02 | Article pages have Article JSON-LD | manual | View source on article page, validate at search.google.com/test/rich-results | N/A |
| SEO-03 | FAQ pages have FAQPage JSON-LD | manual | Already exists -- validate at Rich Results Test | N/A |
| SEO-04 | Guide pages have BreadcrumbList JSON-LD | manual | View source, validate at Rich Results Test | N/A |
| SEO-05 | Homepage has Organisation JSON-LD | manual | View source on homepage | N/A |
| SEO-06 | /sitemap.xml lists all pages | smoke | `curl localhost:3000/sitemap.xml \| grep "<url>"` | N/A |
| SEO-07 | /robots.txt allows all crawlers | smoke | `curl localhost:3000/robots.txt` | N/A |
| SEO-08 | Canonical URLs on all pages | manual | View source, check `<link rel="canonical">` | N/A |
| SEO-09 | OG and Twitter meta tags present | manual | View source, check `<meta property="og:...">` | N/A |
| SEO-10 | OG images generate correctly | smoke | `curl -I localhost:3000/api/og?title=Test` returns 200 + image/png | N/A |
| SEO-11 | Articles link to 2-3 related articles | manual | Check MDX frontmatter relatedSlugs | N/A |
| SEO-12 | Heading hierarchy H1>H2>H3 | manual | Grep MDX files for heading patterns | N/A |
| SEO-13 | Article intros answer the title question | manual | Review first paragraphs | N/A |

### Sampling Rate

- **Per task commit:** `npx next build` (catches type errors and metadata issues)
- **Per wave merge:** Build + manual inspection of generated HTML source
- **Phase gate:** All pages inspected via view-source, OG images verified via social preview tools

### Wave 0 Gaps

- No test framework established -- SEO validation is primarily build-time (Next.js build catches metadata type errors) and manual (Rich Results Test, social preview tools)
- Consider adding a simple build-time script that validates JSON-LD output if desired, but this is optional given the small page count

## Sources

### Primary (HIGH confidence)
- Next.js 14.2.35 installed in project -- metadata API, sitemap.ts, robots.ts are built-in
- schema-dts ^2.0.0 installed -- Google-maintained TypeScript types for Schema.org
- Existing codebase: `faq-section.tsx`, `breadcrumbs.tsx`, `queries.ts`, `categories.ts`, `layout.tsx`

### Secondary (MEDIUM confidence)
- [Next.js generateMetadata docs](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) -- Full metadata API
- [Next.js sitemap.ts docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) -- Built-in sitemap
- [Next.js robots.ts docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) -- Built-in robots
- [Next.js ImageResponse docs](https://nextjs.org/docs/app/api-reference/functions/image-response) -- OG image generation
- [Vercel custom fonts in OG](https://vercel.com/kb/guide/using-custom-font) -- Font loading for ImageResponse
- [Vercel OG image generation](https://vercel.com/docs/og-image-generation) -- @vercel/og overview
- [Next.js JSON-LD guide](https://nextjs.org/docs/app/guides/json-ld) -- Structured data best practices
- [schema-dts GitHub](https://github.com/google/schema-dts) -- Type definitions
- [Fontshare Satoshi](https://www.fontshare.com/fonts/satoshi) -- TTF download source

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already specified in CLAUDE.md, versions verified against npm registry
- Architecture: HIGH -- patterns follow official Next.js docs and existing codebase conventions
- Pitfalls: HIGH -- font format limitation verified via official @vercel/og docs, other pitfalls from direct codebase inspection

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable -- Next.js 14 metadata API is mature)
