# Requirements: Irish Accountant Discovery Platform

**Defined:** 2026-04-03
**Core Value:** Irish small business owners find clear, jargon-free answers to every accounting question they'd Google -- and trust this platform enough to sign up for the directory when it launches.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation & Scaffold

- [x] **FOUND-01**: Next.js 14 App Router project initialized with TypeScript, Tailwind v3.4.x, and correct folder structure
- [x] **FOUND-02**: Tailwind config extended with custom brand colour palette, typography scale, and design tokens
- [x] **FOUND-03**: Root layout with Inter font loaded via next/font, responsive meta viewport, and favicon
- [x] **FOUND-04**: Brand identity system: fresh, distinctive palette (not original spec), minimal/sleek/interactive direction
- [x] **FOUND-05**: Global CSS with prose typography overrides for article content

### Content Pipeline

- [x] **CONT-01**: Velite (or gray-matter fallback) configured with Zod schema validation for MDX frontmatter
- [x] **CONT-02**: MDX content pipeline: getAllGuides(), getGuideBySlug(), getGuidesByCategory(), getCategories() utility functions
- [x] **CONT-03**: Articles only render when publishDate <= current date (scheduled publishing)
- [x] **CONT-04**: generateStaticParams pre-renders all published article pages at build time
- [x] **CONT-05**: 8 content categories configured: Getting Started, Business Structures, Tax Obligations, Accounting Basics, Choosing an Accountant, Costs & Fees, Compliance & Deadlines, Industry Guides
- [x] **CONT-06**: Pillar articles visually distinguished from spoke articles (badge, larger card)
- [x] **CONT-07**: Reading time calculated from word count (200 wpm) and displayed on articles

### Article Pages

- [x] **ART-01**: Article page template renders MDX content with all 10 sections: breadcrumbs, title, meta line, intro, TOC, body, key takeaways, FAQ, related articles, email CTA
- [x] **ART-02**: Auto-generated Table of Contents from H2 headings with anchor links
- [x] **ART-03**: KeyTakeaways MDX component: 3-5 bullet point summary box
- [x] **ART-04**: FAQSection MDX component with collapsible Q&A and JSON-LD FAQPage schema
- [x] **ART-05**: RelatedArticles component showing 2-3 cards from frontmatter relatedSlugs
- [x] **ART-06**: Breadcrumbs component: Home > Guides > {Category} > {Title}
- [x] **ART-07**: Meta line displaying published date, updated date, reading time, category pill
- [x] **ART-08**: "Last verified for [tax year]" badge on articles with updatedDate frontmatter

### Site Structure & Pages

- [x] **PAGE-01**: Homepage with hero section, latest articles (6), category grid (8), email capture section
- [x] **PAGE-02**: Guides hub page with category filter pills (horizontally scrollable on mobile), article grid, pillar badges
- [x] **PAGE-03**: Category archive pages at /guides/category/[slug] with filtered articles
- [x] **PAGE-04**: Find-Accountant placeholder page at /find-accountant with waitlist email capture and feature preview
- [x] **PAGE-05**: About page (brand mission and platform purpose -- no personal bio)
- [x] **PAGE-06**: Contact page with contact form or email
- [x] **PAGE-07**: Privacy policy page (GDPR-compliant, references Irish DPC as supervisory authority)
- [x] **PAGE-08**: Terms of service page
- [x] **PAGE-09**: Custom 404 page with navigation and search/category links
- [x] **PAGE-10**: Accounting disclaimer in footer and per-article notice ("educational, not professional advice")

### Navigation & Layout

- [x] **NAV-01**: Header with logo (placeholder), navigation links, mobile hamburger menu
- [x] **NAV-02**: Footer with navigation, disclaimer, privacy/terms links, brand info
- [x] **NAV-03**: Mobile-first responsive design across all pages
- [x] **NAV-04**: Skip-to-content link and keyboard navigation support

### SEO Infrastructure

- [x] **SEO-01**: generateMetadata on every page: title, description, openGraph, twitter card, canonical URL
- [x] **SEO-02**: JSON-LD Article schema on every guide page (headline, author as brand, publisher, dates)
- [x] **SEO-03**: JSON-LD FAQPage schema on articles with FAQ sections
- [x] **SEO-04**: JSON-LD BreadcrumbList schema on all guide pages
- [x] **SEO-05**: JSON-LD Organisation schema on homepage (areaServed: Ireland)
- [x] **SEO-06**: XML sitemap auto-generated via built-in Next.js sitemap.ts
- [x] **SEO-07**: robots.txt allowing all crawlers
- [x] **SEO-08**: Canonical URLs on all pages
- [x] **SEO-09**: Open Graph and Twitter Card meta tags with programmatic OG images
- [x] **SEO-10**: Programmatic OG image generation via @vercel/og for each article
- [x] **SEO-11**: Internal linking: every article links to 2-3 related articles, pillar pages link to all spokes
- [x] **SEO-12**: Clear heading hierarchy enforced (H1 > H2 > H3) for AI search optimization
- [x] **SEO-13**: Concise introductory paragraphs with direct answers (first 30% optimized for LLM citation)

### Email Capture System

- [x] **EMAIL-01**: Supabase subscribers table with: id, email, source, confirmed, confirmation_token, created_at, confirmed_at, consent_text, consent_timestamp, ip_address
- [x] **EMAIL-02**: API route (/api/subscribe) validates email, inserts to Supabase, sends confirmation via Resend
- [x] **EMAIL-03**: Double opt-in: confirmation email with magic link, updates confirmed flag on click
- [x] **EMAIL-04**: Source tracking: homepage, directory-waitlist, article-cta (hidden field with referring page)
- [x] **EMAIL-05**: GDPR consent: explicit checkbox (not pre-checked), consent text stored, link to privacy policy
- [x] **EMAIL-06**: Unsubscribe mechanism: link in every email, updates Supabase record
- [x] **EMAIL-07**: Reusable EmailCapture component deployable on any page with configurable source
- [x] **EMAIL-08**: Consent proof logging: timestamp, IP address, consent text version stored per subscriber

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
- [ ] **ANIM-04**: LazyMotion used to minimize JS bundle -- strict server/client component boundaries
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
- [x] **PERF-05**: WCAG 2.1 AA baseline: semantic HTML, color contrast, focus indicators, alt text
- [x] **PERF-06**: Print-friendly article styles (@media print)

### Deployment

- [ ] **DEPLOY-01**: Deployed on Vercel (default domain -- no custom domain)
- [ ] **DEPLOY-02**: Environment variables configured in Vercel dashboard
- [ ] **DEPLOY-03**: Daily rebuild trigger (Vercel cron or GitHub Action) at 06:00 UTC for scheduled publishing
- [ ] **DEPLOY-04**: Build succeeds with all 8+ pillar articles rendered

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Directory (Phase 2)

- **DIR-01**: Full accountant directory with search/filter by county, service, specialisation
- **DIR-02**: Firm profiles with claim flow and email verification
- **DIR-03**: Subscription tiers (Free / Professional E49/mo / Featured E149/mo)
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
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| FOUND-04 | Phase 1 | Complete |
| FOUND-05 | Phase 1 | Complete |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 3 | Complete |
| CONT-05 | Phase 2 | Complete |
| CONT-06 | Phase 2 | Complete |
| CONT-07 | Phase 2 | Complete |
| ART-01 | Phase 3 | Complete |
| ART-02 | Phase 3 | Complete |
| ART-03 | Phase 3 | Complete |
| ART-04 | Phase 3 | Complete |
| ART-05 | Phase 3 | Complete |
| ART-06 | Phase 3 | Complete |
| ART-07 | Phase 3 | Complete |
| ART-08 | Phase 3 | Complete |
| PAGE-01 | Phase 4 | Complete |
| PAGE-02 | Phase 4 | Complete |
| PAGE-03 | Phase 4 | Complete |
| PAGE-04 | Phase 4 | Complete |
| PAGE-05 | Phase 4 | Complete |
| PAGE-06 | Phase 4 | Complete |
| PAGE-07 | Phase 4 | Complete |
| PAGE-08 | Phase 4 | Complete |
| PAGE-09 | Phase 4 | Complete |
| PAGE-10 | Phase 4 | Complete |
| NAV-01 | Phase 5 | Complete |
| NAV-02 | Phase 5 | Complete |
| NAV-03 | Phase 5 | Complete |
| NAV-04 | Phase 5 | Complete |
| PERF-05 | Phase 5 | Complete |
| PERF-06 | Phase 5 | Complete |
| SEO-01 | Phase 6 | Complete |
| SEO-02 | Phase 6 | Complete |
| SEO-03 | Phase 6 | Complete |
| SEO-04 | Phase 6 | Complete |
| SEO-05 | Phase 6 | Complete |
| SEO-06 | Phase 6 | Complete |
| SEO-07 | Phase 6 | Complete |
| SEO-08 | Phase 6 | Complete |
| SEO-09 | Phase 6 | Complete |
| SEO-10 | Phase 6 | Complete |
| SEO-11 | Phase 6 | Complete |
| SEO-12 | Phase 6 | Complete |
| SEO-13 | Phase 6 | Complete |
| EMAIL-01 | Phase 7 | Complete |
| EMAIL-02 | Phase 7 | Complete |
| EMAIL-03 | Phase 7 | Complete |
| EMAIL-04 | Phase 7 | Complete |
| EMAIL-05 | Phase 7 | Complete |
| EMAIL-06 | Phase 7 | Complete |
| EMAIL-07 | Phase 7 | Complete |
| EMAIL-08 | Phase 7 | Complete |
| ANAL-01 | Phase 8 | Pending |
| ANAL-02 | Phase 8 | Pending |
| ANAL-03 | Phase 8 | Pending |
| ANAL-04 | Phase 8 | Pending |
| ANAL-05 | Phase 8 | Pending |
| ANAL-06 | Phase 8 | Pending |
| ANAL-07 | Phase 8 | Pending |
| ANIM-01 | Phase 9 | Pending |
| ANIM-02 | Phase 9 | Pending |
| ANIM-03 | Phase 9 | Pending |
| ANIM-04 | Phase 9 | Pending |
| ANIM-05 | Phase 9 | Pending |
| ANIM-06 | Phase 9 | Pending |
| ANIM-07 | Phase 9 | Pending |
| PERF-01 | Phase 9 | Pending |
| PERF-02 | Phase 9 | Pending |
| PERF-03 | Phase 9 | Pending |
| PERF-04 | Phase 9 | Pending |
| WRITE-01 | Phase 10 | Pending |
| WRITE-02 | Phase 10 | Pending |
| WRITE-03 | Phase 10 | Pending |
| WRITE-04 | Phase 10 | Pending |
| WRITE-05 | Phase 10 | Pending |
| WRITE-06 | Phase 10 | Pending |
| DEPLOY-01 | Phase 10 | Pending |
| DEPLOY-02 | Phase 10 | Pending |
| DEPLOY-03 | Phase 10 | Pending |
| DEPLOY-04 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 85 total
- Mapped to phases: 85
- Unmapped: 0

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after roadmap creation*
