# ClearCount.ie — CLAUDE.md Build Spec

## Project Overview

**ClearCount.ie** is an independent Irish platform that helps small businesses find the right accountant. Phase 1 is a content-only SEO site with 72 scheduled articles, email capture, and a placeholder directory page.

- **Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, MDX, Supabase, Vercel, Resend
- **Domain:** clearcount.ie (working name — confirm before deployment)
- **Phase:** 1 — Content build only. No marketplace/directory functionality.

---

## Brand Identity

### Colours (Tailwind config)
```
navy: '#1A2F4B'        // Primary — headings, CTAs, navigation
teal: '#0D7C66'        // Accent — links, highlights, trust signals
paper: '#F7F5F2'        // Background
slate: '#4A5568'        // Body text
lightGray: '#E8E5E0'    // Borders, dividers
white: '#FFFFFF'         // Cards, content panels
```

### Typography
- **Headings:** Inter 700 (or Satoshi if available via next/font)
- **Body:** Inter 400/500
- **Article intros (optional):** Source Serif Pro or Newsreader for editorial feel

### Design Direction
Warm, editorial, minimal. Generous whitespace. Think: well-designed financial publication meets modern SaaS. Similar to stevecreedon.com aesthetic — warm neutrals, clean layout. Mobile-first.

---

## Directory Structure

```
/clearcount.ie
├── app/
│   ├── layout.tsx                    # Root layout: Inter font, Header, Footer
│   ├── page.tsx                      # Homepage
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── find-accountant/page.tsx      # Coming soon placeholder + email capture
│   ├── guides/
│   │   ├── page.tsx                  # Blog hub with category filters
│   │   ├── [slug]/page.tsx           # Individual MDX article pages
│   │   └── category/
│   │       └── [slug]/page.tsx       # Category archive pages
│   └── api/
│       └── subscribe/route.ts        # Email capture endpoint
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ArticleCard.tsx               # Card for article listings
│   ├── CategoryFilter.tsx            # Pill-style category filter buttons
│   ├── EmailCapture.tsx              # Reusable email signup form
│   ├── TableOfContents.tsx           # Auto-generated from MDX headings
│   ├── FAQSection.tsx                # FAQ with JSON-LD schema
│   ├── KeyTakeaways.tsx              # Summary box component
│   ├── RelatedArticles.tsx           # 2-3 related article cards
│   └── Breadcrumbs.tsx               # With JSON-LD breadcrumb schema
├── content/
│   └── guides/                       # MDX article files
│       ├── sole-trader-vs-limited-company-ireland.mdx
│       ├── how-much-does-accountant-cost-ireland.mdx
│       └── ... (72 total)
├── lib/
│   ├── mdx.ts                        # MDX processing: frontmatter parsing, content loading
│   ├── supabase.ts                   # Supabase client initialisation
│   └── constants.ts                  # Site metadata, categories, navigation
├── public/
│   ├── og/                           # Open Graph images per article
│   └── images/                       # Static images
├── tailwind.config.ts
├── next-sitemap.config.js
└── CLAUDE.md                         # This file
```

---

## Content System

### MDX Frontmatter Schema

Every article in `/content/guides/` must have this frontmatter:

```yaml
---
title: "Sole Trader vs Limited Company in Ireland: Which Is Right for You?"
description: "Compare sole trader and limited company structures in Ireland. Understand tax implications, liability, costs, and which is right for your business."
category: "business-structures"
publishDate: "2026-05-15"
updatedDate: "2026-05-15"
keywords:
  - sole trader
  - limited company
  - Ireland
  - business structure
author: "Steve Creedon"
featured: true
pillar: true
relatedSlugs:
  - how-to-become-sole-trader-ireland
  - set-up-limited-company-ireland
  - switch-sole-trader-to-limited-company-ireland
---
```

### Content Categories

| Category Slug | Display Name | Pillar Article |
|---|---|---|
| getting-started | Getting Started | The Complete Guide to Starting a Business in Ireland |
| business-structures | Business Structures | Sole Trader vs Limited Company in Ireland |
| tax-obligations | Tax Obligations | A Complete Guide to Irish Tax for Small Businesses |
| accounting-basics | Accounting Basics | Bookkeeping for Small Businesses in Ireland |
| choosing-accountant | Choosing an Accountant | How to Choose an Accountant in Ireland |
| costs-fees | Costs & Fees | How Much Does an Accountant Cost in Ireland? |
| compliance-deadlines | Compliance & Deadlines | Irish Tax Deadlines Calendar 2026/2027 |
| industry-guides | Industry Guides | (No single pillar — 6 sector-specific articles) |

### MDX Processing (`lib/mdx.ts`)

```typescript
// Key functions needed:
getAllGuides()        // Returns all guides sorted by publishDate, filtered to published only
getGuideBySlug()     // Returns single guide with parsed MDX content
getGuidesByCategory() // Returns guides filtered by category
getCategories()       // Returns unique categories with counts
```

- Use `gray-matter` to parse frontmatter
- Use `next-mdx-remote` for MDX rendering
- Only display articles where `publishDate <= new Date()`
- Sort by publishDate descending (newest first) on hub pages
- Pillar articles should be visually distinguished (larger card, "Pillar Guide" badge)

### Article Page Template

Every article page (`/guides/[slug]`) renders in this order:

1. **Breadcrumbs** — Home > Guides > {Category} > {Title} (with JSON-LD)
2. **Title** (H1)
3. **Meta line** — Published date, updated date, reading time, category pill
4. **Introduction** — First 2-3 paragraphs of MDX content
5. **Table of Contents** — Auto-generated from H2 headings in MDX
6. **Article Body** — Full MDX content
7. **Key Takeaways** — `<KeyTakeaways>` component used in MDX
8. **FAQ Section** — `<FAQSection>` component with JSON-LD FAQ schema
9. **Related Articles** — 2-3 cards from `relatedSlugs` frontmatter
10. **Email CTA** — "Get notified when our accountant directory launches"

### Article Page SEO

```typescript
// generateMetadata for each article page:
export async function generateMetadata({ params }) {
  const guide = await getGuideBySlug(params.slug);
  return {
    title: `${guide.title} | ClearCount.ie`,
    description: guide.description,
    keywords: guide.keywords,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      publishedTime: guide.publishDate,
      modifiedTime: guide.updatedDate,
      authors: [guide.author],
      url: `https://clearcount.ie/guides/${guide.slug}`,
      images: [`https://clearcount.ie/og/${guide.slug}.png`],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
    alternates: {
      canonical: `https://clearcount.ie/guides/${guide.slug}`,
    },
  };
}
```

### JSON-LD Schemas

**Article schema** (on every guide page):
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{description}",
  "author": { "@type": "Person", "name": "{author}" },
  "publisher": { "@type": "Organization", "name": "ClearCount.ie" },
  "datePublished": "{publishDate}",
  "dateModified": "{updatedDate}",
  "mainEntityOfPage": "https://clearcount.ie/guides/{slug}"
}
```

**FAQ schema** (on articles with FAQ sections):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{question}",
      "acceptedAnswer": { "@type": "Answer", "text": "{answer}" }
    }
  ]
}
```

**Organisation schema** (on homepage):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ClearCount.ie",
  "url": "https://clearcount.ie",
  "description": "Ireland's accountant discovery platform. Find the right accountant for your business.",
  "areaServed": { "@type": "Country", "name": "Ireland" }
}
```

**Breadcrumb schema** (on all guide pages):
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://clearcount.ie" },
    { "@type": "ListItem", "position": 2, "name": "Guides", "item": "https://clearcount.ie/guides" },
    { "@type": "ListItem", "position": 3, "name": "{category}", "item": "https://clearcount.ie/guides/category/{slug}" },
    { "@type": "ListItem", "position": 4, "name": "{title}" }
  ]
}
```

---

## Email Capture System

### Supabase Table

```sql
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT NOT NULL DEFAULT 'homepage',
  confirmed BOOLEAN DEFAULT false,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

-- RLS policy: insert only via service role
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
```

### API Route (`/api/subscribe/route.ts`)

1. Validate email format
2. Insert into Supabase `subscribers` table with `source` field
3. Send confirmation email via Resend with magic link
4. Return success response
5. On confirmation link click: update `confirmed = true`, `confirmed_at = now()`

### Source Tracking

| Source Value | Location |
|---|---|
| `homepage` | Homepage email capture form |
| `directory-waitlist` | /find-accountant placeholder page |
| `article-cta` | Bottom of every article |
| `article-inline` | Mid-article email capture (optional) |

### GDPR Requirements

- Explicit consent checkbox: "I agree to receive updates about ClearCount.ie. You can unsubscribe at any time."
- Link to privacy policy next to checkbox
- Double opt-in required (confirmation email)
- Unsubscribe link in every email
- No pre-checked boxes

---

## Pages

### Homepage (`/page.tsx`)

**Hero section:**
- Headline: "Find the right accountant for your Irish business"
- Subheading: "Expert guides to help you understand your accounting obligations, compare options, and make confident decisions."
- Primary CTA: "Browse Guides" → /guides
- Secondary CTA: "Get Notified When Our Directory Launches" → email capture

**Latest Articles section:**
- 6 most recent articles as cards
- "View All Guides" link

**Category section:**
- Grid of 8 category cards with icons
- Each links to category page

**Email capture section:**
- "Join 0 Irish business owners getting accounting insights" (update number as subscribers grow)
- Email input + submit

### Guides Hub (`/guides/page.tsx`)

- Page title: "Guides for Irish Business Owners"
- Category filter pills (horizontally scrollable on mobile)
- Article grid: cards with title, description, category pill, reading time
- Pillar articles visually distinguished (badge or larger card)
- Paginated or infinite scroll if > 20 articles

### Find Accountant Placeholder (`/find-accountant/page.tsx`)

- Headline: "Ireland's Most Useful Accountant Directory — Coming Soon"
- Body: "We're building a directory that helps Irish businesses find, compare, and connect with the right accountant. No more guesswork."
- Email capture: "Get early access when we launch"
- Feature preview list: Search by location, specialisation, and service | Compare firms side by side | Read verified reviews | Get quotes directly

---

## Sitemap & SEO Config

### next-sitemap.config.js

```javascript
module.exports = {
  siteUrl: 'https://clearcount.ie',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
  },
};
```

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://clearcount.ie
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=clearcount.ie
```

---

## Deployment

- **Hosting:** Vercel (linked to GitHub repo)
- **DNS:** Cloudflare (consistent with safeskin.ie, theforum.ie)
- **Build:** `next build` (static generation for all guide pages)
- **Rebuild trigger:** Push to main branch. New articles are MDX files committed to repo.

---

## Automated Publishing

Articles are MDX files with a `publishDate` in frontmatter. The site only renders articles where `publishDate <= today`. To schedule articles:

1. Write MDX file with future `publishDate`
2. Commit to repo
3. Set up daily Vercel cron (or GitHub Action) to trigger rebuild at 06:00 UTC
4. Article appears automatically on its publish date

This allows batch-writing weeks of content in advance and having it publish automatically — same pipeline as Safe Smile.

---

## Phase 2 Notes (Not Part of This Build)

When traffic justifies the directory build, the following will be added:
- `/find-accountant` becomes a full search/filter directory
- `/find-accountant/[county]` county landing pages
- `/find-accountant/[service]` service landing pages
- Supabase tables for firms, reviews, subscriptions
- Stripe integration for accountant subscriptions (Free / Professional €49/mo / Featured €149/mo)
- Firm claim flow (email verification)
- Admin dashboard for managing listings
- Comparison tool, cost calculator, accountant quiz

These are documented in the full business spec but should NOT be built in Phase 1.
