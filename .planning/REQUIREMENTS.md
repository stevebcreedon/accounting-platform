# Requirements: Irish Accountant Discovery Platform

**Defined:** 2026-04-03
**Core Value:** Irish small business owners find clear, jargon-free answers to every accounting question they'd Google — and trust this platform enough to sign up for the directory when it launches.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Scaffold

- [ ] **FOUND-01**: Next.js 14 App Router project initialized with TypeScript, Tailwind v3.4.x, and correct folder structure
- [ ] **FOUND-02**: Tailwind config extended with custom brand colour palette, typography scale, and design tokens
- [ ] **FOUND-03**: Root layout with Inter font loaded via next/font, responsive meta viewport, and favicon
- [ ] **FOUND-04**: Brand identity system: fresh, distinctive palette (not original spec), minimal/sleek/interactive direction
- [ ] **FOUND-05**: Global CSS with prose typography overrides for article content

### Content Pipeline

- [ ] **CONT-01**: Velite (or gray-matter fallback) configured with Zod schema validation for MDX frontmatter
- [ ] **CONT-02**: MDX content pipeline: getAllGuides(), getGuideBySlug(), getGuidesByCategory(), getCategories() utility functions
- [ ] **CONT-03**: Articles only render when publishDate <= current date (scheduled publishing)
- [ ] **CONT-04**: generateStaticParams pre-renders all published article pages at build time
- [ ] **CONT-05**: 8 content categories configured: Getting Started, Business Structures, Tax Obligations, Accounting Basics, Choosing an Accountant, Costs & Fees, Compliance & Deadlines, Industry Guides
- [ ] **CONT-06**: Pillar articles visually distinguished from spoke articles (badge, larger card)
- [ ] **CONT-07**: Reading time calculated from word count (200 wpm) and displayed on articles

### Article Pages

- [ ] **ART-01**: Article page template renders MDX content with all 10 sections: breadcrumbs, title, meta line, intro, TOC, body, key takeaways, FAQ, related articles, email CTA
- [ ] **ART-02**: Auto-generated Table of Contents from H2 headings with anchor links
- [ ] **ART-03**: KeyTakeaways MDX component: 3-5 bullet point summary box
- [ ] **ART-04**: FAQSection MDX component with collapsible Q&A and JSON-LD FAQPage schema
- [ ] **ART-05**: RelatedArticles component showing 2-3 cards from frontmatter relatedSlugs
- [ ] **ART-06**: Breadcrumbs component: Home > Guides > {Category} > {Title}
- [ ] **ART-07**: Meta line displaying published date, updated date, reading time, category pill
- [ ] **ART-08**: "Last verified for [tax year]" badge on articles with updatedDate frontmatter

### Site Structure & Pages

- [ ] **PAGE-01**: Homepage with hero section, latest articles (6), category grid (8), email capture section
- [ ] **PAGE-02**: Guides hub page with category filter pills (horizontally scrollable on mobile), article grid, pillar badges
- [ ] **PAGE-03**: Category archive pages at /guides/category/[slug] with filtered articles
- [ ] **PAGE-04**: Find-Accountant placeholder page at /find-accountant with waitlist email capture and feature preview
- [ ] **PAGE-05**: About page (brand mission and platform purpose — no personal bio)
- [ ] **PAGE-06**: Contact page with contact form or email
- [ ] **PAGE-07**: Privacy policy page (GDPR-compliant, references Irish DPC as supervisory authority)
- [ ] **PAGE-08**: Terms of service page
- [ ] **PAGE-09**: Custom 404 page with navigation and search/category links
- [ ] **PAGE-10**: Accounting disclaimer in footer and per-article notice ("educational, not professional advice")

### Navigation & Layout

- [ ] **NAV-01**: Header with logo (placeholder), navigation links, mobile hamburger menu
- [ ] **NAV-02**: Footer with navigation, disclaimer, privacy/terms links, brand info
- [ ] **NAV-03**: Mobile-first responsive design across all pages
- [ ] **NAV-04**: Skip-to-content link and keyboard navigation support

### SEO Infrastructure

- [ ] **SEO-01**: generateMetadata on every page: title, description, openGraph, twitter card, canonical URL
- [ ] **SEO-02**: JSON-LD Article schema on every guide page (headline, author as brand, publisher, dates)
- [ ] **SEO-03**: JSON-LD FAQPage schema on articles with FAQ sections
- [ ] **SEO-04**: JSON-LD BreadcrumbList schema on all guide pages
- [ ] **SEO-05**: JSON-LD Organisation schema on homepage (areaServed: Ireland)
- [ ] **SEO-06**: XML sitemap auto-generated via built-in Next.js sitemap.ts
- [ ] **SEO-07**: robots.txt allowing all crawlers
- [ ] **SEO-08**: Canonical URLs on all pages
- [ ] **SEO-09**: Open Graph and Twitter Card meta tags with programmatic OG images
- [ ] **SEO-10**: Programmatic OG image generation via @vercel/og for each article
- [ ] **SEO-11**: Internal linking: every article links to 2-3 related articles, pillar pages link to all spokes
- [ ] **SEO-12**: Clear heading hierarchy enforced (H1 > H2 > H3) for AI search optimization
- [ ] **SEO-13**: Concise introductory paragraphs with direct answers (first 30% optimized for LLM citation)

### Email Capture System

- [ ] **EMAIL-01**: Supabase subscribers table with: id, email, source, confirmed, confirmation_token, created_at, confirmed_at, consent_text, consent_timestamp, ip_address
- [ ] **EMAIL-02**: API route (/api/subscribe) validates email, inserts to Supabase, sends confirmation via Resend
- [ ] **EMAIL-03**: Double opt-in: confirmation email with magic link, updates confirmed flag on click
- [ ] **EMAIL-04**: Source tracking: homepage, directory-waitlist, article-cta (hidden field with referring page)
- [ ] **EMAIL-05**: GDPR consent: explicit checkbox (not pre-checked), consent text stored, link to privacy policy
- [ ] **EMAIL-06**: Unsubscribe mechanism: link in every email, updates Supabase record
- [ ] **EMAIL-07**: Reusable EmailCapture component deployable on any page with configurable source
- [ ] **EMAIL-08**: Consent proof logging: timestamp, IP address, consent text version stored per subscriber

### Custom Analytics

- [ ] **ANAL-01**: Supabase page_views table: id, path, referrer, user_agent, country, created_at
- [ ] **ANAL-02**: Server-side API route for tracking page views (no client-side tracking cookies)
- [ ] **ANAL-03**: Bot filtering on analytics ingestion (exclude known crawlers)
- [ ] **ANAL-04**: Article read tracking: scroll depth or time-based trigger to distinguish visits from reads
- [ ] **ANAL-05**: Outbound click tracking for external links (Revenue.ie, CRO.ie, etc.)
- [ ] **ANAL-06**: Pre-aggregation strategy: materialized views or pg_cron rollups for daily/weekly summaries
- [ ] **ANAL-07**: RLS policies on analytics tables (insert via service role only)

### Animation & Interactions

- [ ] **ANIM-01**: Framer Motion (motion package v12) page transitions between routes
- [ ] **ANIM-02**: Scroll-triggered reveal animations on homepage sections and article components
- [ ] **ANIM-03**: Hover state micro-interactions on cards, buttons, and navigation links
- [ ] **ANIM-04**: LazyMotion used to minimize JS bundle — strict server/client component boundaries
- [ ] **ANIM-05**: Reading progress indicator bar on article pages (scroll-based)
- [ ] **ANIM-06**: Smooth accordion animation on FAQ sections
- [ ] **ANIM-07**: All animations respect prefers-reduced-motion media query

### Content Creation

- [ ] **WRITE-01**: 8 pillar articles written, SEO-optimized, hyper-specific to Republic of Ireland
- [ ] **WRITE-02**: Each pillar article: 3,000-4,000 words, answers most commonly asked questions on the topic
- [ ] **WRITE-03**: Each article has complete frontmatter: title, description, category, publishDate, updatedDate, keywords, author (brand), featured, pillar, relatedSlugs
- [ ] **WRITE-04**: FAQ sections in every article with 3-5 real Irish search queries as questions
- [ ] **WRITE-05**: All articles reference Irish-specific entities (Revenue, CRO, Irish tax rates, thresholds, deadlines, forms)
- [ ] **WRITE-06**: Remaining 64 articles written with same quality standards (2 articles/week publishing schedule)

### Performance & Accessibility

- [ ] **PERF-01**: Core Web Vitals passing: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] **PERF-02**: Static site generation (SSG) for all content pages
- [ ] **PERF-03**: Image optimization via next/image where applicable
- [ ] **PERF-04**: Font optimization via next/font (prevent layout shift)
- [ ] **PERF-05**: WCAG 2.1 AA baseline: semantic HTML, color contrast, focus indicators, alt text
- [ ] **PERF-06**: Print-friendly article styles (@media print)

### Deployment

- [ ] **DEPLOY-01**: Deployed on Vercel (default domain — no custom domain)
- [ ] **DEPLOY-02**: Environment variables configured in Vercel dashboard
- [ ] **DEPLOY-03**: Daily rebuild trigger (Vercel cron or GitHub Action) at 06:00 UTC for scheduled publishing
- [ ] **DEPLOY-04**: Build succeeds with all 8+ pillar articles rendered

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Directory (Phase 2)

- **DIR-01**: Full accountant directory with search/filter by county, service, specialisation
- **DIR-02**: Firm profiles with claim flow and email verification
- **DIR-03**: Subscription tiers (Free / Professional €49/mo / Featured €149/mo)
- **DIR-04**: Stripe integration for accountant payments
- **DIR-05**: County landing pages (/find-accountant/dublin, etc.)
- **DIR-06**: Service landing pages (/find-accountant/bookkeeping, etc.)
- **DIR-07**: Comparison tool: select 2-3 firms side-by-side
- **DIR-08**: Cost calculator: estimate fees based on business size/structure
- **DIR-09**: Accountant quiz: guided recommendation
- **DIR-10**: Review system with verified reviews
- **DIR-11**: Admin dashboard for managing listings

### Enhanced Features (Future)

- **ENH-01**: Client-side search via Fuse.js (once article count > 20)
- **ENH-02**: Irish tax deadline awareness widget (contextual deadline display)
- **ENH-03**: Newsletter archive page (once 5-10 editions exist)
- **ENH-04**: Dark mode
- **ENH-05**: RSS feed
- **ENH-06**: Social proof counter ("Trusted by X Irish business owners")
- **ENH-07**: Custom domain migration and DNS setup

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Comments section | Moderation burden, spam, legal liability on financial topics |
| User accounts / login | Adds GDPR complexity, no Phase 1 feature needs auth |
| Live chat / chatbot | AI chatbot giving wrong tax advice = liability. Support burden with no revenue |
| Pop-up email modals | Conflicts with "sleek, minimal" brand. Google penalizes intrusive interstitials |
| Third-party analytics (GA4, Plausible, Umami) | Privacy-first positioning. Custom Supabase analytics provides full data ownership |
| Multi-language / Irish language | Massive content duplication. Target audience searches in English |
| AMP pages | Google no longer prioritizes. Next.js SSG achieves same performance |
| OAuth / social login | Email capture only. No user accounts in Phase 1 |
| Mobile app | Web only |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (Populated by roadmapper) | | |

**Coverage:**
- v1 requirements: 72 total
- Mapped to phases: 0
- Unmapped: 72

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after initial definition*
