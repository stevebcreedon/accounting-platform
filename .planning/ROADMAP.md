# Roadmap: Irish Accountant Discovery Platform

## Overview

This roadmap delivers a content-first SEO platform for Irish small business owners. The critical path flows from project scaffold through content pipeline to article template -- those three phases unlock everything else. SEO infrastructure ships early (Phase 6) because domain authority building is time-sensitive. Email capture and analytics layer onto existing pages. Animation and performance polish come after layouts stabilize. The final phase writes the 8 pillar articles and deploys to Vercel. 85 v1 requirements across 10 phases.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Project Scaffold** - Next.js 14 project with brand identity, Tailwind config, and root layout
- [x] **Phase 2: Content Pipeline** - Velite MDX pipeline with Zod validation, content queries, and scheduled publishing (completed 2026-04-03)
- [ ] **Phase 3: Article Page Template** - Full article renderer with TOC, FAQ, breadcrumbs, key takeaways, and related articles
- [x] **Phase 4: Site Structure & Pages** - Homepage, guides hub, category archives, find-accountant placeholder, and static pages (completed 2026-04-03)
- [ ] **Phase 5: Navigation & Accessibility** - Header, footer, mobile-responsive layout shell, keyboard navigation, and print styles
- [x] **Phase 6: SEO Infrastructure** - JSON-LD schemas, metadata, sitemap, robots.txt, canonical URLs, OG images, and AI search optimization (completed 2026-04-04)
- [ ] **Phase 7: Email Capture** - GDPR-compliant double opt-in email system with Supabase and Resend
- [x] **Phase 8: Custom Analytics** - Server-side page view tracking, read tracking, outbound clicks, and pre-aggregation (completed 2026-04-06)
- [ ] **Phase 9: Animation & Performance** - Framer Motion interactions, scroll animations, progress bar, and Core Web Vitals optimization
- [ ] **Phase 10: Content & Deployment** - 8 pillar articles written, Vercel deployment, daily rebuild cron, and launch verification

## Phase Details

### Phase 1: Project Scaffold
**Goal**: Developers have a working Next.js 14 project with the platform's distinctive brand identity baked into every design token
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05
**Success Criteria** (what must be TRUE):
  1. Running `npm run dev` serves a styled page with the brand's custom color palette and typography
  2. The root layout renders with Inter font, responsive viewport meta, and favicon
  3. Tailwind config includes all custom design tokens (colors, spacing, typography scale) matching the brand direction
  4. Global prose typography styles render correctly for long-form article content
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — Initialize Next.js 14 project with dependencies, font loading, root layout, and cn() utility
- [x] 01-02-PLAN.md — Configure Tailwind design tokens, prose typography overrides, and branded placeholder page
**UI hint**: yes

### Phase 2: Content Pipeline
**Goal**: MDX articles with validated frontmatter compile at build time and only appear when their publish date arrives
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-05, CONT-06, CONT-07
**Success Criteria** (what must be TRUE):
  1. A sample MDX article with complete frontmatter builds successfully with Zod schema validation catching any malformed fields
  2. Content query functions (getAllGuides, getGuideBySlug, getGuidesByCategory, getCategories) return typed data correctly
  3. An article with a future publishDate does not appear on the site; changing it to today makes it appear after rebuild
  4. All 8 categories are configured and queryable, and pillar articles are distinguishable from spoke articles in query results (data layer; visual distinction ships in Phase 3)
  5. Reading time is calculated and available in article metadata
**Plans**: 2 plans
Plans:
- [x] 02-01-PLAN.md — Velite MDX pipeline with Zod schema, Next.js integration, categories config, and MDX renderer
- [x] 02-02-PLAN.md — Content query functions with scheduled publishing and 3 sample Irish accounting articles

### Phase 3: Article Page Template
**Goal**: Visitors reading an article see a complete, structured page with navigation aids, summaries, FAQs, and related content
**Depends on**: Phase 2
**Requirements**: ART-01, ART-02, ART-03, ART-04, ART-05, ART-06, ART-07, ART-08, CONT-04
**Success Criteria** (what must be TRUE):
  1. An article page renders all 10 sections: breadcrumbs, title, meta line, intro, TOC, body, key takeaways, FAQ, related articles, email CTA placeholder
  2. The Table of Contents auto-generates from H2 headings and anchor links scroll to the correct section
  3. The FAQ section renders collapsible Q&A items
  4. Related articles display 2-3 cards based on frontmatter relatedSlugs
  5. Meta line shows published date, updated date, reading time, category pill, and "Last verified" badge when updatedDate exists
  6. generateStaticParams pre-renders all published article pages at build time (CONT-04)
**Plans**: 3 plans
Plans:
- [x] 03-01-PLAN.md — Server components: Breadcrumbs, MetaLine, KeyTakeaways, EmailCTAPlaceholder, date utilities, lucide-react + schema-dts install
- [x] 03-02-PLAN.md — Client components: Table of Contents with Intersection Observer, FAQ accordion with JSON-LD schema
- [x] 03-03-PLAN.md — Page assembly: RelatedArticles, /guides/[slug]/page.tsx with generateStaticParams, sample MDX updates, visual verification
**UI hint**: yes

### Phase 4: Site Structure & Pages
**Goal**: Visitors can browse the full site -- homepage, guides hub, category archives, placeholder directory page, and all static pages
**Depends on**: Phase 2, Phase 3
**Requirements**: PAGE-01, PAGE-02, PAGE-03, PAGE-04, PAGE-05, PAGE-06, PAGE-07, PAGE-08, PAGE-09, PAGE-10
**Success Criteria** (what must be TRUE):
  1. Homepage displays hero section, 6 latest articles, 8-category grid, and an email capture section placeholder
  2. Guides hub page lists all published articles with horizontally scrollable category filter pills and pillar badges
  3. Category archive pages at /guides/category/[slug] show only articles in that category
  4. Find-accountant page at /find-accountant shows a waitlist email capture placeholder and feature preview
  5. About, Contact, Privacy (referencing Irish DPC), Terms, and 404 pages all render with correct content
**Plans**: 3 plans
Plans:
- [x] 04-01-PLAN.md — Shared components (ArticleCard, CategoryCard, DisclaimerBar) and homepage
- [x] 04-02-PLAN.md — Guides hub with filter pills and category archive pages
- [x] 04-03-PLAN.md — Find-accountant placeholder, static pages (about, contact, privacy, terms), and 404
**UI hint**: yes

### Phase 5: Navigation & Accessibility
**Goal**: The site has a complete responsive layout shell with proper navigation, accessibility support, and legal compliance elements
**Depends on**: Phase 1
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04, PERF-05, PERF-06
**Success Criteria** (what must be TRUE):
  1. Header displays logo, navigation links, and a working mobile hamburger menu
  2. Footer displays navigation, accounting disclaimer, privacy/terms links, and brand info
  3. All pages render correctly on mobile viewports (375px+) with no horizontal overflow
  4. Skip-to-content link and keyboard navigation work across all interactive elements
  5. Semantic HTML, sufficient color contrast, and focus indicators meet WCAG 2.1 AA baseline
**Plans**: 2 plans
Plans:
- [x] 05-01-PLAN.md — Create layout components (skip-to-content, header, navigation, mobile menu, footer)
- [x] 05-02-PLAN.md — Wire layout into root layout, migrate 9 pages, add print styles, verify accessibility
**UI hint**: yes

### Phase 6: SEO Infrastructure
**Goal**: Every page is fully optimized for Google, AI search engines, and social sharing with structured data, metadata, and programmatic images
**Depends on**: Phase 3, Phase 4
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, SEO-10, SEO-11, SEO-12, SEO-13
**Success Criteria** (what must be TRUE):
  1. Every page has generateMetadata producing correct title, description, openGraph, twitter card, and canonical URL
  2. Article pages include JSON-LD Article, FAQPage, and BreadcrumbList schemas that pass Google Rich Results Test
  3. Homepage includes JSON-LD Organisation schema with areaServed set to Ireland
  4. XML sitemap at /sitemap.xml lists all published pages, and robots.txt allows all crawlers
  5. Programmatic OG images generate via @vercel/og for each article with correct title and category
**Plans**: 3 plans
Plans:
- [x] 06-01-PLAN.md — SEO metadata, OG image route, and generateMetadata on all pages
- [x] 06-02-PLAN.md — JSON-LD structured data (Article, BreadcrumbList, Organisation), sitemap, robots.txt
- [x] 06-03-PLAN.md — Content audit: heading hierarchy, relatedSlugs, AI-optimized intros

### Phase 7: Email Capture
**Goal**: Visitors can subscribe to the platform with full GDPR compliance -- double opt-in, consent proof, and unsubscribe
**Depends on**: Phase 4
**Requirements**: EMAIL-01, EMAIL-02, EMAIL-03, EMAIL-04, EMAIL-05, EMAIL-06, EMAIL-07, EMAIL-08
**Success Criteria** (what must be TRUE):
  1. Submitting an email on any page inserts a record into Supabase subscribers table and sends a confirmation email via Resend
  2. Clicking the confirmation link in the email updates the subscriber's confirmed flag and shows a thank-you page
  3. Each subscription records the source (homepage, directory-waitlist, article-cta), consent text, timestamp, and IP address
  4. The consent checkbox is unchecked by default, links to the privacy policy, and submission is blocked without it
  5. Every email contains an unsubscribe link that updates the Supabase record
**Plans**: 2 plans
Plans:
- [x] 07-01-PLAN.md — Backend: Supabase admin client, rate limiter, React Email template, API routes (subscribe, confirm, unsubscribe), SQL migration
- [x] 07-02-PLAN.md — Frontend: EmailCapture component, replace placeholders on 3 pages, thank-you and unsubscribe pages

### Phase 8: Custom Analytics
**Goal**: The platform tracks page views, article reads, and outbound clicks in Supabase with no third-party scripts or cookies
**Depends on**: Phase 1
**Requirements**: ANAL-01, ANAL-02, ANAL-03, ANAL-04, ANAL-05, ANAL-06, ANAL-07
**Success Criteria** (what must be TRUE):
  1. Visiting any page fires a server-side API call that inserts a row into the Supabase page_views table (path, referrer, user_agent, country)
  2. Known bot user agents are filtered out and do not create page_view records
  3. Article pages track read completion (scroll depth or time-based) distinguishing visits from actual reads
  4. Clicking an external link (Revenue.ie, CRO.ie) logs the outbound click with destination URL
  5. RLS policies restrict analytics tables to insert-only via service role, and a pre-aggregation strategy exists for daily/weekly rollups
**Plans**: 2 plans
Plans:
- [x] 08-01-PLAN.md — Backend: SQL migration (3 event tables + 2 summary tables + RLS), bot filter, 3 analytics API routes
- [x] 08-02-PLAN.md — Frontend: PageViewTracker, ReadTracker, OutboundTracker components, cron rollup route, vercel.json

### Phase 9: Animation & Performance
**Goal**: The site delivers the "interactive, minimal, sleek" brand experience with Framer Motion while maintaining Core Web Vitals targets
**Depends on**: Phase 3, Phase 4, Phase 5
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06, ANIM-07, PERF-01, PERF-02, PERF-03, PERF-04
**Success Criteria** (what must be TRUE):
  1. Page transitions animate smoothly between routes using Framer Motion
  2. Homepage sections and article components reveal on scroll with staggered animations
  3. Cards, buttons, and navigation links have visible hover micro-interactions
  4. Article pages display a scroll-based reading progress indicator bar
  5. All animations respect prefers-reduced-motion, LazyMotion minimizes bundle size, and Lighthouse mobile score is 90+
**Plans**: TBD
**UI hint**: yes

### Phase 10: Content & Deployment
**Goal**: 8 pillar articles are live on Vercel with automated daily rebuilds for scheduled publishing
**Depends on**: Phase 6, Phase 7, Phase 8, Phase 9
**Requirements**: WRITE-01, WRITE-02, WRITE-03, WRITE-04, WRITE-05, WRITE-06, DEPLOY-01, DEPLOY-02, DEPLOY-03, DEPLOY-04
**Success Criteria** (what must be TRUE):
  1. All 8 pillar articles are published, each 3,000-4,000 words, hyper-specific to Republic of Ireland with correct Irish entities
  2. Every article has complete frontmatter (title, description, category, publishDate, keywords, author as brand, pillar flag, relatedSlugs) and 3-5 FAQ questions
  3. The site builds and deploys successfully on Vercel with all articles rendered
  4. A daily rebuild trigger fires at 06:00 UTC, and articles with future publishDate appear on schedule
  5. Remaining 64 articles have a defined publishing schedule (2/week) with the same quality standards

## Progress

**Execution Order:**
Phases execute in numeric order: 1 > 2 > 3 > 4 > 5 > 6 > 7 > 8 > 9 > 10
Note: Phases 1 and 5 have no dependency between them. Phases 2-4 are the strict content pipeline chain. Phases 6-8 can partially overlap once their dependencies are met.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Project Scaffold | 0/2 | Planning complete | - |
| 2. Content Pipeline | 2/2 | Complete   | 2026-04-03 |
| 3. Article Page Template | 2/3 | In Progress|  |
| 4. Site Structure & Pages | 3/3 | Complete   | 2026-04-03 |
| 5. Navigation & Accessibility | 1/2 | In Progress|  |
| 6. SEO Infrastructure | 3/3 | Complete   | 2026-04-04 |
| 7. Email Capture | 1/2 | In Progress|  |
| 8. Custom Analytics | 2/2 | Complete   | 2026-04-06 |
| 9. Animation & Performance | 0/? | Not started | - |
| 10. Content & Deployment | 0/? | Not started | - |
