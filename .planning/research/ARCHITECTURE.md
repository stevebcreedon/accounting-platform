# Architecture Patterns

**Domain:** Content-first SEO platform (Irish accounting guidance)
**Researched:** 2026-04-03

## Recommended Architecture

### High-Level Overview

```
                        +------------------+
                        |   Vercel (Host)  |
                        |  Cron: daily     |
                        |  rebuild trigger |
                        +--------+---------+
                                 |
                    +------------+------------+
                    |   Next.js 14 App Router |
                    |   (Static + Edge)       |
                    +------------+------------+
                         |              |
              +----------+     +--------+--------+
              |                |                  |
     +--------v------+  +-----v------+   +-------v--------+
     | MDX Pipeline  |  | API Routes |   | OG Image Route |
     | (Velite +     |  | (Edge)     |   | (@vercel/og)   |
     | Build-time)   |  +-----+------+   +----------------+
     +---------------+        |
                         +----+----+
                         |         |
                   +-----v--+ +---v------+
                   |Supabase| | Resend   |
                   |  - analytics    |   |
                   |  - subscribers  |   |
                   |  - email_logs   |   |
                   +--------+ +----------+
```

### Rendering Strategy

**Static Site Generation (SSG) for everything public.** Every article, category page, the homepage, and static pages are pre-rendered at build time. No SSR. No ISR. The content is MDX files in the repository -- there is no dynamic data source that would benefit from revalidation. A daily cron-triggered rebuild on Vercel handles scheduled publishing (articles with future `publishDate` in frontmatter are excluded until their date arrives).

**Edge API Routes for writes only.** Three server-side endpoints handle the dynamic operations: analytics event ingestion, email subscription, and email confirmation. These are thin wrappers around Supabase and Resend calls.

**Confidence: HIGH** -- This is the standard pattern for content-first Next.js sites. Static generation gives perfect Lighthouse scores and eliminates cold starts.

## Component Boundaries

| Component | Responsibility | Communicates With | Rendering |
|-----------|---------------|-------------------|-----------|
| **MDX Pipeline (Velite)** | Parse MDX, validate frontmatter, generate typed content layer | Build system only (no runtime) | Build-time |
| **Page Shell (Layout)** | Header, footer, navigation, global providers | All page components | Static (Server Component) |
| **Article Page** | Render MDX content, breadcrumbs, TOC, FAQ, related articles, email CTA | MDX Pipeline output, JSON-LD generator | Static (Server Component) |
| **Category Page** | Filter and list articles by category, pillar badges | MDX Pipeline output | Static (Server Component) |
| **Guides Hub** | All articles with category filters, pagination | MDX Pipeline output | Static (Server Component) |
| **Homepage** | Hero, latest articles, category grid, email capture | MDX Pipeline output, Email Capture component | Static (Server Component) |
| **Email Capture** | Form UI, client-side validation, submit to API | API Route `/api/subscribe` | Client Component |
| **Analytics Tracker** | Fire page view events invisibly | API Route `/api/analytics` | Client Component (lightweight) |
| **JSON-LD Generator** | Build structured data for each page type | Article/category metadata | Utility (build-time render) |
| **OG Image Route** | Generate programmatic social images | Article metadata via URL params | Edge Route Handler |
| **API: /api/subscribe** | Validate, insert subscriber, trigger confirmation email | Supabase (subscribers table), Resend | Edge Route Handler |
| **API: /api/confirm** | Verify token, mark subscriber confirmed | Supabase (subscribers table) | Edge Route Handler |
| **API: /api/analytics** | Insert page view / event record | Supabase (analytics tables) | Edge Route Handler |
| **Sitemap/Robots** | Generate sitemap.xml and robots.txt from content index | MDX Pipeline output | Build-time (next-sitemap or App Router convention) |

## Data Flow

### 1. Content Flow (Build-Time)

```
MDX files in /content/
        |
        v
Velite (velite.config.ts)
  - Parses frontmatter (Zod schema validation)
  - Compiles MDX to serialised components
  - Filters by publishDate <= today
  - Generates .velite/ output with TypeScript types
        |
        v
Import in page components
  - import { articles } from '.velite'
  - Filter, sort, group by category
  - Pass to page components as props
        |
        v
Static HTML at build time
  - Full article pages at /guides/[category]/[slug]
  - Category archives at /guides/[category]
  - Hub at /guides
  - Homepage with latest articles
  - sitemap.xml with all published URLs
```

### 2. Analytics Flow (Runtime)

```
User visits page
        |
        v
AnalyticsTracker component (Client Component)
  - Fires on mount via useEffect
  - Sends: pathname, referrer, timestamp
  - Uses navigator.sendBeacon for non-blocking
  - NO cookies, NO fingerprinting, NO PII
        |
        v
POST /api/analytics (Edge Route)
  - Validates payload
  - Extracts: country from Vercel headers (x-vercel-ip-country)
  - Inserts into Supabase page_views table
        |
        v
Supabase: page_views table
  - id (uuid, auto)
  - path (text)
  - referrer (text, nullable)
  - country (text, nullable)
  - created_at (timestamptz, auto)
```

**Why not middleware for analytics?** Middleware runs on every request including static assets, bots, and prefetches. A lightweight client component with `sendBeacon` is more accurate for actual human page views and avoids inflating numbers. It also avoids the complexity of filtering out non-page requests in middleware.

### 3. Email Subscription Flow (Runtime)

```
User enters email in Email Capture form
        |
        v
Client-side validation (email format)
        |
        v
POST /api/subscribe (Edge Route)
  - Server-side validation (email format, not already confirmed)
  - Generate confirmation token (crypto.randomUUID)
  - Insert into Supabase subscribers table
    (email, token, confirmed: false, source, created_at)
  - Send confirmation email via Resend
    (contains link: /confirm?token=xxx)
  - Return success (always, even if duplicate -- prevent enumeration)
        |
        v
User clicks confirmation link
        |
        v
GET /api/confirm?token=xxx (Edge Route)
  - Look up token in subscribers table
  - Set confirmed: true, confirmed_at: now()
  - Redirect to /confirmed (static thank-you page)
```

### 4. OG Image Flow (On-Demand)

```
Social platform requests /api/og?title=...&category=...
        |
        v
Edge Route Handler
  - Reads title and category from search params
  - Renders JSX layout using ImageResponse
    (brand colours, logo, category badge, title text)
  - Returns PNG (1200x630)
  - Cached at CDN edge by Vercel
        |
        v
Referenced in page metadata:
  export function generateMetadata() {
    return {
      openGraph: {
        images: [`/api/og?title=${encodeURIComponent(title)}&category=${category}`]
      }
    }
  }
```

## Project Structure

```
/
+-- content/
|   +-- getting-started/
|   |   +-- pillar-how-to-find-accountant-ireland.mdx
|   |   +-- what-does-accountant-do.mdx
|   +-- business-structures/
|   |   +-- pillar-sole-trader-vs-limited-company.mdx
|   |   +-- ...
|   +-- tax-obligations/
|   +-- accounting-basics/
|   +-- choosing-accountant/
|   +-- costs-fees/
|   +-- compliance-deadlines/
|   +-- industry-guides/
|
+-- src/
|   +-- app/
|   |   +-- layout.tsx              (root layout: fonts, metadata, analytics provider)
|   |   +-- page.tsx                (homepage)
|   |   +-- globals.css
|   |   +-- guides/
|   |   |   +-- page.tsx            (guides hub with filters)
|   |   |   +-- [category]/
|   |   |   |   +-- page.tsx        (category archive)
|   |   |   |   +-- [slug]/
|   |   |   |       +-- page.tsx    (article page)
|   |   +-- find-accountant/
|   |   |   +-- page.tsx            (waitlist placeholder)
|   |   +-- about/
|   |   +-- contact/
|   |   +-- privacy/
|   |   +-- terms/
|   |   +-- confirmed/
|   |   |   +-- page.tsx            (email confirmation thank-you)
|   |   +-- api/
|   |   |   +-- subscribe/
|   |   |   |   +-- route.ts
|   |   |   +-- confirm/
|   |   |   |   +-- route.ts
|   |   |   +-- analytics/
|   |   |   |   +-- route.ts
|   |   |   +-- og/
|   |   |       +-- route.tsx       (OG image generation)
|   |   +-- sitemap.ts              (dynamic sitemap generation)
|   |   +-- robots.ts               (robots.txt generation)
|   |
|   +-- components/
|   |   +-- layout/
|   |   |   +-- header.tsx
|   |   |   +-- footer.tsx
|   |   |   +-- navigation.tsx
|   |   +-- articles/
|   |   |   +-- article-card.tsx
|   |   |   +-- article-grid.tsx
|   |   |   +-- category-badge.tsx
|   |   |   +-- pillar-badge.tsx
|   |   |   +-- table-of-contents.tsx
|   |   |   +-- key-takeaways.tsx
|   |   |   +-- faq-section.tsx
|   |   |   +-- related-articles.tsx
|   |   |   +-- breadcrumbs.tsx
|   |   +-- email/
|   |   |   +-- email-capture-form.tsx   (Client Component)
|   |   +-- home/
|   |   |   +-- hero.tsx
|   |   |   +-- category-grid.tsx
|   |   |   +-- latest-articles.tsx
|   |   +-- analytics/
|   |   |   +-- analytics-tracker.tsx    (Client Component)
|   |   +-- mdx/
|   |   |   +-- mdx-components.tsx       (custom MDX component overrides)
|   |   |   +-- callout.tsx
|   |   |   +-- irish-tax-table.tsx
|   |   +-- ui/
|   |   |   +-- button.tsx
|   |   |   +-- input.tsx
|   |   |   +-- motion-wrapper.tsx       (Framer Motion helpers)
|   |
|   +-- lib/
|   |   +-- supabase/
|   |   |   +-- client.ts               (Supabase client init)
|   |   |   +-- analytics.ts            (insert page view, query helpers)
|   |   |   +-- subscribers.ts          (subscribe, confirm, check duplicate)
|   |   +-- resend/
|   |   |   +-- client.ts               (Resend client init)
|   |   |   +-- templates/
|   |   |       +-- confirmation-email.tsx  (React Email template)
|   |   +-- content/
|   |   |   +-- queries.ts              (getArticlesByCategory, getPillarArticles, etc.)
|   |   +-- seo/
|   |   |   +-- json-ld.ts              (schema generators: Article, FAQ, Breadcrumb, Organisation)
|   |   |   +-- metadata.ts             (generateMetadata helpers)
|   |   +-- utils/
|   |       +-- dates.ts
|   |       +-- slugify.ts
|   |
|   +-- types/
|       +-- content.ts                   (augment Velite-generated types if needed)
|       +-- analytics.ts
|       +-- subscriber.ts
|
+-- velite.config.ts                     (content schema, collections, plugins)
+-- next.config.mjs
+-- tailwind.config.ts
+-- tsconfig.json
+-- .env.local                           (Supabase URL/key, Resend key)
```

## Supabase Schema Design

### Tables

**page_views** -- Raw analytics events. Append-only, no updates.

```sql
CREATE TABLE page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Index for querying by path and time range
CREATE INDEX idx_page_views_path ON page_views (path);
CREATE INDEX idx_page_views_created_at ON page_views (created_at);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from anon key (no reads from client)
CREATE POLICY "Allow anonymous inserts" ON page_views
  FOR INSERT TO anon WITH CHECK (true);
```

**subscribers** -- Email capture with double opt-in.

```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token UUID DEFAULT gen_random_uuid() NOT NULL,
  confirmed BOOLEAN DEFAULT false NOT NULL,
  source TEXT,                -- e.g., 'homepage', 'article-cta', 'find-accountant'
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  confirmed_at TIMESTAMPTZ,
  UNIQUE(email)
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Only allow inserts from anon key
CREATE POLICY "Allow anonymous inserts" ON subscribers
  FOR INSERT TO anon WITH CHECK (true);

-- Allow update (confirmation) only via service role in API route
-- No client-side read/update policies
```

**outbound_clicks** -- Optional: track clicks to external resources.

```sql
CREATE TABLE outbound_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,           -- page the click originated from
  target_url TEXT NOT NULL,     -- where the user clicked to
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE outbound_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON outbound_clicks
  FOR INSERT TO anon WITH CHECK (true);
```

**Design rationale:**
- **Append-only page_views** rather than aggregated counters. Raw events allow flexible querying (by day, by country, by referrer) without pre-committing to an aggregation strategy. At the expected traffic scale (hundreds to low thousands of daily views for a niche Irish site), raw events in Postgres are fine for years.
- **RLS restricts client access.** The anon key can only INSERT into analytics/subscriber tables. All reads happen server-side via the service role key in API routes or a future admin dashboard.
- **No PII in analytics.** No IP addresses, no user agents, no cookies. Country comes from Vercel's edge header, not from the client.

## Patterns to Follow

### Pattern 1: Content Query Layer

Abstract all content access behind a query layer in `lib/content/queries.ts`. Never import Velite output directly in page components.

**Why:** Isolates pages from the content pipeline. If you ever swap Velite for something else, only this file changes.

```typescript
// lib/content/queries.ts
import { articles } from '.velite';

export function getPublishedArticles() {
  return articles
    .filter(a => a.published && new Date(a.publishDate) <= new Date())
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export function getArticlesByCategory(category: string) {
  return getPublishedArticles().filter(a => a.category === category);
}

export function getPillarArticles() {
  return getPublishedArticles().filter(a => a.isPillar);
}

export function getRelatedArticles(slug: string, category: string, limit = 3) {
  return getArticlesByCategory(category)
    .filter(a => a.slug !== slug)
    .slice(0, limit);
}
```

### Pattern 2: JSON-LD as Utility Functions

Generate structured data as plain objects from utility functions, then render as `<script type="application/ld+json">` in page components. NOT as a React component.

**Why:** Server Components render once. No hydration duplication risk. Keeps structured data logic testable and separate from UI.

```typescript
// lib/seo/json-ld.ts
export function articleJsonLd(article: Article, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    dateModified: article.updatedDate || article.publishDate,
    author: {
      '@type': 'Organization',
      name: 'Brand Name', // replace with actual brand
    },
    publisher: {
      '@type': 'Organization',
      name: 'Brand Name',
      logo: { '@type': 'ImageObject', url: `${url}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

### Pattern 3: Minimal Client Component Boundary

Only two Client Components in the entire site: `EmailCaptureForm` and `AnalyticsTracker`. Everything else is a Server Component.

**Why:** Minimises client-side JavaScript. Better Lighthouse scores. Better SEO. Content pages ship essentially zero JS beyond the two small interactive pieces.

```typescript
// components/analytics/analytics-tracker.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const data = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
    });
    navigator.sendBeacon('/api/analytics', data);
  }, [pathname]);

  return null;
}
```

### Pattern 4: Framer Motion with Server Components

Wrap animated elements in a thin Client Component wrapper. Do NOT make entire pages client components just for animation.

```typescript
// components/ui/motion-wrapper.tsx
'use client';

import { motion, type MotionProps } from 'framer-motion';
import { type HTMLAttributes } from 'react';

type Props = MotionProps & HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function MotionDiv({ children, ...props }: Props) {
  return <motion.div {...props}>{children}</motion.div>;
}
```

This allows Server Components to use animation by importing `MotionDiv` without needing `'use client'` on the entire page.

### Pattern 5: MDX Frontmatter Schema (Velite)

```typescript
// velite.config.ts
import { defineConfig, s } from 'velite';

export default defineConfig({
  root: 'content',
  collections: {
    articles: {
      name: 'Article',
      pattern: '**/*.mdx',
      schema: s.object({
        title: s.string(),
        description: s.string().max(160),
        category: s.enum([
          'getting-started',
          'business-structures',
          'tax-obligations',
          'accounting-basics',
          'choosing-accountant',
          'costs-fees',
          'compliance-deadlines',
          'industry-guides',
        ]),
        slug: s.slug('articles'),
        publishDate: s.isodate(),
        updatedDate: s.isodate().optional(),
        isPillar: s.boolean().default(false),
        published: s.boolean().default(true),
        targetKeyword: s.string(),
        searchIntent: s.enum(['informational', 'commercial', 'navigational']),
        faqs: s.array(
          s.object({
            question: s.string(),
            answer: s.string(),
          })
        ).default([]),
        keyTakeaways: s.array(s.string()).default([]),
        body: s.mdx(),
      }),
    },
  },
});
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Using ISR or SSR for Static Content
**What:** Setting `revalidate` on pages that are sourced from local MDX files.
**Why bad:** Adds complexity and cold-start latency for zero benefit. The content only changes when you push new MDX files and rebuild.
**Instead:** Pure SSG with a daily cron rebuild via Vercel.

### Anti-Pattern 2: Contentlayer
**What:** Using Contentlayer as the MDX processor.
**Why bad:** Contentlayer is abandoned (unmaintained since Stackbit's acquisition by Netlify). Known incompatibilities with recent Next.js versions.
**Instead:** Use Velite -- actively maintained, Zod-based schemas, TypeScript-first, same mental model.

### Anti-Pattern 3: Client-Side Analytics via Third-Party Scripts
**What:** Loading analytics.js or similar client-side tracking.
**Why bad:** Blocks rendering, increases bundle size, privacy concerns, GDPR complexity. Defeats the "privacy-first" positioning.
**Instead:** Lightweight `sendBeacon` call to own API route, server-side insert to Supabase.

### Anti-Pattern 4: Aggregated View Counters Instead of Raw Events
**What:** A single `view_count` column on an articles table, incremented on each view.
**Why bad:** Loses all analytical dimensions (time, referrer, country). Race conditions on concurrent updates. Cannot answer "what was traffic last Tuesday?" or "which referrers drive the most views?"
**Instead:** Append-only `page_views` table. Aggregate in queries when needed.

### Anti-Pattern 5: Making Entire Pages Client Components for Framer Motion
**What:** Adding `'use client'` to page.tsx to use `motion.div`.
**Why bad:** Converts the entire page tree to client rendering. Massively increases JavaScript bundle. Destroys SEO advantages of Server Components.
**Instead:** Thin `MotionDiv` wrapper component (see Pattern 4).

## Suggested Build Order

The following order respects dependencies -- each phase builds on what came before.

### Phase 1: Foundation (must be first)
**Build:** Next.js project scaffold, Tailwind config, Velite config, content schema, basic layout (header/footer), global styles, typography.
**Why first:** Everything depends on this. Cannot render pages without the layout or content pipeline.
**Depends on:** Nothing.

### Phase 2: Content Pipeline + Article Template
**Build:** Velite integration, MDX component overrides, article page template (breadcrumbs, TOC, key takeaways, FAQ section, related articles), category pages, guides hub.
**Why second:** This is the core product. The 8 pillar articles need a home before anything else matters.
**Depends on:** Phase 1 (layout, Velite config).

### Phase 3: Homepage + Navigation
**Build:** Homepage (hero, latest articles, category grid), navigation with category links, static pages (about, contact, privacy, terms).
**Why third:** Needs the content pipeline working to display articles. Needs article pages to link to.
**Depends on:** Phase 2 (content query layer, article cards).

### Phase 4: SEO Infrastructure
**Build:** JSON-LD structured data (Article, FAQ, Breadcrumb, Organisation), generateMetadata for all routes, sitemap.ts, robots.ts, canonical URLs, OG image route.
**Why fourth:** Pages must exist to add metadata to. JSON-LD references article data from the content pipeline. OG images need article titles/categories.
**Depends on:** Phases 2-3 (all page routes exist).

### Phase 5: Email Capture
**Build:** Supabase subscribers table, API routes (subscribe, confirm), Resend integration, confirmation email template, EmailCaptureForm component, find-accountant waitlist page, confirmed page.
**Why fifth:** This is an independent feature that can be layered onto existing pages. Needs the pages to exist so forms can be placed contextually.
**Depends on:** Phase 3 (pages where forms are placed), Supabase project.

### Phase 6: Analytics
**Build:** Supabase page_views table (and outbound_clicks), API route, AnalyticsTracker component, add tracker to root layout.
**Why sixth:** Should be the last feature added to avoid tracking development/testing traffic. Independent of other features.
**Depends on:** Phase 1 (root layout), Supabase project.

### Phase 7: Animation + Polish
**Build:** Framer Motion micro-interactions (hover states, page transitions, scroll reveals), MotionDiv wrapper, loading states, error boundaries, final design polish.
**Why last:** Animations are additive polish. Adding them earlier creates churn when layouts change. Better to animate a stable design.
**Depends on:** All prior phases (stable page structure).

## Scalability Considerations

| Concern | At launch (100/day) | At 1K/day | At 10K/day |
|---------|---------------------|-----------|------------|
| **Page load** | Static CDN, instant | Same | Same -- SSG scales infinitely |
| **Analytics writes** | Raw inserts, trivial | Fine, ~30K rows/month | Consider monthly partitioning or periodic archival |
| **Analytics reads** | Direct queries | Direct queries | Add materialized views for dashboards |
| **Supabase free tier** | Well within limits | Fine (500MB DB, 2GB bandwidth) | May need Pro plan (~$25/month) |
| **Email subscribers** | Trivial | Fine | Resend free tier supports 3K emails/month; may need paid plan |
| **Build time** | ~30s for 72 articles | Same (content doesn't change with traffic) | Same |

At the expected scale of an Irish accounting niche site, raw Postgres analytics will be sufficient for the foreseeable future. The architecture supports a future migration to aggregated tables or a proper analytics warehouse (Supabase Analytics Buckets with Apache Iceberg) without changing the ingestion path.

## Sources

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx)
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld)
- [Next.js Metadata & OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Velite Documentation](https://velite.js.org/guide/with-nextjs)
- [Velite MDX Support](https://velite.js.org/guide/using-mdx)
- [Velite GitHub](https://github.com/zce/velite)
- [Contentlayer Alternatives Analysis](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives)
- [Supabase + Next.js Analytics Pattern](https://maxleiter.com/blog/supabase-next-analytics)
- [Resend + Supabase Integration](https://resend.com/supabase)
- [Supabase Architecture](https://supabase.com/docs/guides/getting-started/architecture)
- [Dub.co Migration to Content Collections](https://dub.co/blog/content-collections) (Confidence: MEDIUM -- alternative to Velite worth noting)
