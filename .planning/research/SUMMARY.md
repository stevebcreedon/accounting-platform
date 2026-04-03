# Project Research Summary

**Project:** Irish Accountant Discovery Platform
**Domain:** Content-first SEO platform (Irish accounting guidance)
**Researched:** 2026-04-03
**Confidence:** HIGH

## Executive Summary

This is a content-first SEO platform targeting Irish small business owners with 72 educational accounting articles, building domain authority over 6-9 months before bolting on a paid accountant directory in Phase 2. The expert-recommended approach is straightforward: statically generate every page at build time using Next.js 14 App Router with MDX content managed through Velite (a typed content pipeline with Zod schema validation), style with Tailwind CSS v3 and the typography plugin for long-form readability, and deploy on Vercel with a daily cron rebuild for scheduled publishing. This is a well-trodden pattern with high confidence across all research areas.

The stack is deliberately conservative -- Next.js 14 (not 15/16), Tailwind v3 (not v4), ESLint 8 (not 9) -- to maintain consistency with the existing portfolio (SafeSkin, The Forum, Safe Smile) and avoid bleeding-edge breakage on a content-heavy project where stability matters more than novelty. The only Client Components in the entire site are the email capture form and an analytics tracker; everything else renders as zero-JS Server Components for maximum SEO performance.

The two highest-impact risks are: (1) deploying indexable content on a vercel.app subdomain, which wastes the entire 6-9 month authority-building window since Google deprioritizes shared subdomains, and (2) GDPR non-compliance on email capture in Ireland, where the DPC is one of Europe's strictest regulators. Both must be addressed before any content goes live. A custom .ie domain should be secured immediately, and the double opt-in email flow with consent proof storage must be correct from the first implementation -- retrofitting consent records is nearly impossible.

## Key Findings

### Recommended Stack

| Library / Tool | Version | Purpose | Rationale |
|---|---|---|---|
| Next.js | ^14.2.25 | Framework (App Router, SSG) | Portfolio consistency. Do NOT upgrade to 15/16 mid-project. |
| TypeScript | ~5.5 | Type safety | Matches Next.js 14 bundled support |
| React | ^18 | UI library | Next.js 14 peer dependency (React 19 requires Next 15+) |
| Velite | ^0.3.1 | MDX content pipeline | Type-safe Zod schemas, replaces abandoned Contentlayer. Handles frontmatter, reading time, slug generation, MDX compilation. |
| Tailwind CSS | ^3.4.17 | Styling | Use v3, NOT v4. v4 has breaking config changes and compatibility issues with Next.js 14 ecosystem. |
| @tailwindcss/typography | ^0.5.15 | Prose styling for articles | Critical for readable long-form accounting content |
| motion | ^12 | React animations | Framer Motion rebranded. Import from `motion/react`. |
| @supabase/supabase-js | ^2.101 | Database client | Email subscribers + custom analytics. Project already provisioned. |
| @supabase/ssr | ^0.6 | Server-side Supabase | Replaces deprecated auth-helpers. Required for App Router. |
| Resend | ^6.10 | Transactional email | Double opt-in confirmation + welcome. API key ready. |
| @react-email/components | ^1.0.10 | Email templates | Type-safe React components for emails |
| schema-dts | ^2.0.0 | JSON-LD types | Google-maintained TypeScript types for structured data |
| @vercel/og | ^0.11 | OG image generation | Programmatic social images for 72 articles |
| rehype-pretty-code | ^0.14 | Syntax highlighting | Server-side via Shiki, zero client JS |

**Key "do not use" decisions:** Contentlayer (abandoned), next-seo (Pages Router only), @supabase/auth-helpers (deprecated), Tailwind v4, ESLint 9, Google Analytics, third-party analytics. See STACK.md for full alternatives analysis.

### Table Stakes Features (Must-Have for v1)

**Content delivery:**
- Responsive article layout with auto-generated table of contents
- Breadcrumb navigation (required for BreadcrumbList schema)
- Reading time estimates, key takeaways / TL;DR boxes
- Related articles based on category + manual curation
- Category archive pages and guides hub
- Client-side search (Fuse.js against article frontmatter + headings)

**SEO infrastructure:**
- JSON-LD structured data: Article, FAQ, BreadcrumbList, Organisation
- Auto-generated XML sitemap (built-in `app/sitemap.ts`, NOT next-sitemap)
- Canonical URLs on every page, programmatic OG images
- AI search optimization: answer-first content structure, FAQ schema, clear heading hierarchy

**Email capture (GDPR-compliant):**
- Inline signup forms with explicit unchecked consent checkbox
- Double opt-in via Resend confirmation email
- Consent record logging (timestamp, source, consent text)
- Unsubscribe in every email

**Legal (Ireland/EU):**
- Privacy policy referencing Irish DPC
- Cookie consent banner (err on side of implementing one)
- Terms of service, accounting disclaimer
- European Accessibility Act compliance (WCAG 2.1 AA baseline)

**Custom analytics:**
- Page view tracking (sendBeacon to API route, Supabase insert)
- Email signup attribution (source tracking)
- Outbound click tracking

### Differentiators (Competitive Advantages)

- **Ireland-specific content depth** -- no competitor covers all 72 topics with this specificity; most content is UK-centric
- **Pillar page enhanced experience** -- 8 pillar articles get visual hub layout, progress indicators, richer treatment
- **Date-based automated publishing** -- 2 articles/week for 9 months with zero manual deployment
- **Irish tax deadline awareness** -- contextual deadline display on relevant articles (no competitor does this)
- **"Last verified" dates** -- "Verified for 2026/2027 tax year" builds trust on YMYL content
- **Progressive email capture** -- contextual inline CTAs ("Get our free VAT registration guide" in the VAT article) instead of aggressive popups
- **Reading progress indicator** -- scroll progress bar via Motion

### Architecture Overview

Pure SSG architecture with Edge API routes for writes only. All 72 articles, category pages, homepage, and static pages are pre-rendered at build time from MDX files processed through Velite. Only two Client Components exist: `EmailCaptureForm` and `AnalyticsTracker`. Three Edge API routes handle runtime operations: `/api/subscribe` (email capture), `/api/confirm` (double opt-in), `/api/analytics` (page view ingestion via sendBeacon). A daily Vercel cron triggers a rebuild for scheduled publishing based on frontmatter `publishDate`.

**Major components:**

1. **MDX Pipeline (Velite)** -- Parses MDX, validates frontmatter via Zod, generates typed content layer at build time
2. **Content Query Layer** (`lib/content/queries.ts`) -- Abstracts all content access; isolates pages from pipeline internals
3. **Article Page Template** -- Server Component rendering MDX content, breadcrumbs, TOC, FAQ, related articles, JSON-LD, email CTA
4. **Email Capture System** -- Client Component form + Edge API routes + Supabase subscribers table + Resend confirmation flow
5. **Analytics System** -- Lightweight sendBeacon Client Component + Edge API route + Supabase page_views table (append-only, no PII)
6. **SEO Layer** -- JSON-LD utility functions, generateMetadata helpers, sitemap.ts, robots.ts, OG image Edge route
7. **Page Shell** -- Header, footer, navigation as Server Components; Motion wrapper for animations

**Data flow:** Content flows at build time (MDX -> Velite -> typed imports -> static HTML). Analytics and email flow at runtime (client sendBeacon/POST -> Edge API -> Supabase/Resend). OG images are generated on-demand at the edge and CDN-cached.

**Supabase tables:** `page_views` (append-only analytics), `subscribers` (email with double opt-in), `outbound_clicks` (external link tracking). All with RLS: anon key can only INSERT, reads via service role only.

### Critical Pitfalls (Top 5)

1. **Vercel.app domain tanks SEO** -- Google deprioritizes shared subdomains. Every day content sits on vercel.app is wasted authority-building time. **Prevent:** Secure a .ie domain before publishing any content. Use `noindex` on vercel.app. Use `NEXT_PUBLIC_SITE_URL` env var for all absolute URLs.

2. **GDPR non-compliance on email capture** -- Ireland's DPC is one of Europe's strictest regulators. Missing double opt-in, pre-checked consent boxes, or absent consent records invite enforcement. **Prevent:** Double opt-in with Resend confirmation email. Store consent proof (timestamp, IP, text shown). Unchecked consent checkbox. Unsubscribe in every email. Audit against DPC checklist before launch.

3. **MDX frontmatter breaks at scale** -- 72 articles with complex frontmatter (title, description, category, publishDate, FAQs, keywords) will have inconsistencies. A single malformed field breaks the build. **Prevent:** Velite's Zod schema validation catches this at build time. Centralize category names as enum. Run validation in CI.

4. **Framer Motion bloats client bundle** -- `"use client"` for animations opts components out of Server Component benefits. Animating everything kills Core Web Vitals. **Prevent:** Thin `MotionDiv` wrapper component. Never make entire pages client components. Use `LazyMotion` + `domAnimation` features. Prefer CSS for simple hover states. Performance budget: mobile PageSpeed above 90.

5. **Supabase analytics performance degrades** -- PostgreSQL is row-oriented, not optimized for analytics aggregations. At scale, analytical queries pressure the same DB serving subscribers. **Prevent:** Append-only schema with minimal indexes. Pre-compute rollups via materialized views / pg_cron. 90-day raw data retention policy. Separate analytics schema from transactional tables.

## Implications for Roadmap

### Phase 1: Foundation and Content Pipeline
**Rationale:** Everything depends on the project scaffold and content pipeline. Cannot render pages without layout, styling, or MDX processing. Velite config with Zod schema validation must exist before the first article is written (Pitfall 4).
**Delivers:** Next.js 14 project with Tailwind v3, Velite content pipeline, article page template (TOC, breadcrumbs, reading time, key takeaways, FAQ section, related articles), MDX component library.
**Features:** Content delivery table stakes, MDX pipeline, article template
**Avoids:** Pitfall 4 (frontmatter validation from day one), Pitfall 5 (establish server/client boundary patterns early)

### Phase 2: Site Structure and Navigation
**Rationale:** With content pipeline working, build the pages that aggregate and present articles. Homepage, guides hub, category archives, and static pages need the content query layer from Phase 1.
**Delivers:** Homepage (hero, latest articles, category grid), guides hub with filters, category archive pages, static pages (about, contact, privacy, terms), find-accountant waitlist placeholder, navigation.
**Features:** Category archives, guides hub, homepage, legal pages, 404 page
**Avoids:** Pitfall 7 (establish Irish content guidelines and checklist before first article draft)

### Phase 3: SEO Infrastructure
**Rationale:** Pages must exist before adding metadata. JSON-LD references article data. OG images need titles and categories. Sitemap needs all routes. This phase makes the content discoverable.
**Delivers:** JSON-LD structured data (Article, FAQ, Breadcrumb, Organisation), generateMetadata for all routes, sitemap.ts, robots.ts, canonical URLs, OG image generation route.
**Features:** All SEO infrastructure table stakes, AI search optimization structure
**Avoids:** Pitfall 6 (test OG images in production early), Pitfall 8 (canonical URLs from day one), Pitfall 10 (use built-in sitemap.ts, not next-sitemap), Pitfall 11 (typed JSON-LD builders)

### Phase 4: Email Capture System
**Rationale:** Independent feature layered onto existing pages. Needs pages to exist for contextual form placement. Must be GDPR-correct from first implementation -- no room for "fix it later."
**Delivers:** Supabase subscribers table, subscribe/confirm API routes, Resend integration, confirmation email template, EmailCaptureForm component, confirmed thank-you page, find-accountant waitlist.
**Features:** Email capture table stakes, progressive email capture differentiator
**Avoids:** Pitfall 2 (GDPR double opt-in with consent proof), Pitfall 9 (DNS records for email deliverability before first send)

### Phase 5: Custom Analytics
**Rationale:** Last feature to avoid tracking development/testing traffic. Independent of other features. Schema design must be right from the start.
**Delivers:** Supabase analytics tables (page_views, outbound_clicks), analytics API route, AnalyticsTracker component in root layout, data retention policy.
**Features:** Page view tracking, outbound click tracking, signup attribution
**Avoids:** Pitfall 3 (append-only schema, pre-aggregation strategy, separate analytics schema)

### Phase 6: Animation, Search, and Polish
**Rationale:** Animations are additive polish -- adding them earlier creates churn when layouts change. Search becomes important as article count grows. This phase transforms a functional site into the "interactive, minimal, sleek" brand experience.
**Delivers:** Motion micro-interactions (hover states, scroll reveals), reading progress indicator, client-side search (Fuse.js), pillar page enhanced layout, print stylesheet, final design polish, error boundaries, loading states.
**Features:** Differentiators (reading progress, pillar page experience), search functionality
**Avoids:** Pitfall 5 (Motion added to stable layouts), Pitfall 14 (avoid AnimatePresence page transitions)

### Phase 7: Pre-Launch Hardening
**Rationale:** Final verification before content goes live. Domain migration, performance auditing, structured data validation, accessibility audit.
**Delivers:** Custom .ie domain configuration, 301 redirects from vercel.app, Google Search Console setup, Core Web Vitals verification, Rich Results Test validation, accessibility audit (WCAG 2.1 AA), daily rebuild cron configuration, cookie consent banner.
**Features:** Performance table stakes, legal compliance, European Accessibility Act
**Avoids:** Pitfall 1 (domain before content goes live), Pitfall 15 (migration plan executed), Pitfall 13 (rebuild cron with error notifications)

### Phase Ordering Rationale

- **Dependency chain:** Content pipeline (1) -> Page structure (2) -> SEO layer (3) is a strict dependency. Cannot add metadata to pages that do not exist, and pages need content to render.
- **Email before analytics:** Email capture (4) ships before analytics (5) because it is the primary conversion mechanism and must be live when the first article publishes. Analytics can be added just before launch.
- **Animation last:** The project emphasizes "interactive, sleek" design, but animating unstable layouts wastes effort. Phase 6 animates a stable, functional site.
- **Pre-launch hardening:** Domain and compliance verification are the final gate. No content should be indexable until the .ie domain is live and all legal requirements are met.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 1 (Content Pipeline):** Velite is pre-1.0 (^0.3.1) with MEDIUM confidence. Its Next.js integration and build performance with 72 articles should be validated early. Have a fallback plan (gray-matter + manual pipeline).
- **Phase 4 (Email Capture):** GDPR consent flow has legal implications. The DPC checklist should be reviewed by someone familiar with Irish data protection law. DNS records (SPF/DKIM/DMARC) for email deliverability need domain-specific configuration.
- **Phase 7 (Pre-Launch):** Domain migration from vercel.app to custom domain needs careful planning. Cookie consent requirements depend on whether custom analytics constitutes "strictly necessary" processing under Irish ePrivacy Regulations.

**Phases with standard patterns (skip research-phase):**
- **Phase 2 (Site Structure):** Standard Next.js App Router page composition. Well-documented.
- **Phase 3 (SEO Infrastructure):** JSON-LD, sitemap, metadata are well-documented in Next.js official guides.
- **Phase 5 (Analytics):** Supabase insert patterns are straightforward. sendBeacon is a standard browser API.
- **Phase 6 (Animation):** Motion/Framer Motion with Next.js is well-documented. LazyMotion patterns are established.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies are established, version-pinned, and consistent with existing portfolio. Only risk: Velite is pre-1.0 (MEDIUM for that specific tool). |
| Features | HIGH | Table stakes well-defined from competitive analysis. Feature dependency tree is clear. GDPR requirements are explicit from DPC guidance. |
| Architecture | HIGH | Pure SSG + Edge API routes is the standard pattern for content-first Next.js sites. Supabase schema is well-designed with proper RLS. |
| Pitfalls | HIGH | All critical pitfalls sourced from official documentation (Vercel KB, DPC guidelines, Next.js docs, Framer Motion issues). Prevention strategies are specific and actionable. |

**Overall confidence: HIGH**

### Gaps to Address

- **Brand name and .ie domain:** Not yet chosen. This is the single biggest blocker for SEO. Domain must be secured before any content is published. Email sender domain configuration (SPF/DKIM/DMARC) also depends on this.
- **Velite stability:** Pre-1.0 library. If it proves unstable with 72 articles or incompatible with the exact Next.js 14.2.x version, the fallback is a manual gray-matter + file reading pipeline (~200 lines of boilerplate). This should be validated in Phase 1 sprint 1.
- **Cookie consent requirements:** Whether custom Supabase analytics (server-side inserts, no client cookies) qualifies as "strictly necessary" under Irish ePrivacy Regulations is a legal question, not a technical one. The research recommends erring on the side of implementing a consent banner.
- **Content authoring workflow:** 72 articles over 9 months is a significant content effort. The technical pipeline is well-researched, but the content production process (who writes, review process, Irish-specificity enforcement) is outside the scope of this technical research.
- **Resend free tier limits:** 100 emails/day on free tier. Sufficient for early growth, but if the email list grows quickly, the paid plan will be needed. Monitor confirmation email volume.

## Open Questions Requiring Decisions

1. **Domain name:** Must be decided before content goes live. Affects email configuration, canonical URLs, Google Search Console, and the entire SEO timeline. This is a business decision, not a technical one, but it blocks Phase 7.
2. **Cookie consent scope:** Implement a full consent banner or a minimal privacy notice? The technical recommendation is to implement a banner, but the decision depends on legal interpretation of whether first-party analytics API calls require consent under Irish ePrivacy Regulations.
3. **Motion scope vs. performance budget:** The project wants "micro-interactions throughout" but Core Web Vitals must stay above 90 on mobile. These goals may conflict. The recommendation is to start minimal (hover states, scroll reveals) and add more only if the performance budget allows.
4. **Pillar article publishing order:** The 8 pillar articles should publish first to establish topical authority, but the specific order within those 8 affects which category pages are populated first. This is a content strategy decision.

## Sources

### Primary (HIGH confidence)
- Next.js 14 App Router Documentation -- framework patterns, metadata API, sitemap conventions
- Vercel KB -- vercel.app domain SEO implications, OG image generation
- Irish DPC -- GDPR email marketing rules, ePrivacy Regulations
- Supabase Documentation -- SSR setup, RLS patterns, schema design
- Tailwind CSS v3 Documentation -- configuration, typography plugin
- schema-dts (Google) -- JSON-LD TypeScript types

### Secondary (MEDIUM confidence)
- Velite Documentation and GitHub -- content pipeline patterns (pre-1.0 library)
- Resend Documentation -- email deliverability, React Email integration
- First Page Sage, Kevin Indig, Dataslayer -- AI search optimization / LLM citation patterns
- Framer Motion GitHub Issues -- bundle size impact, CSS accumulation, Next.js integration
- Tinybird Blog -- Supabase analytics limitations analysis

### Tertiary (LOW confidence)
- Cookie consent requirements for first-party server-side analytics (legal interpretation needed)
- LLM citation optimization patterns (rapidly evolving field, current research may not reflect 2026 reality)

---
*Research completed: 2026-04-03*
*Ready for roadmap: yes*
