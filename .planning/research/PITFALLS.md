# Domain Pitfalls

**Domain:** Content-first SEO platform (Next.js 14 + MDX, Ireland-targeted accounting content)
**Researched:** 2026-04-03

---

## Critical Pitfalls

Mistakes that cause rewrites, lost rankings, or legal exposure.

---

### Pitfall 1: Deploying on vercel.app Domain Tanks SEO From Day One

**What goes wrong:** Google treats `.vercel.app` as a shared subdomain used by thousands of developers and spammers. It deprioritizes and rate-limits crawling of these domains. You build 72 articles, wait months, and wonder why indexing is painfully slow or non-existent. The 6-9 month authority-building window gets wasted.

**Why it happens:** PROJECT.md explicitly says "Vercel default domain initially" and "no custom domain setup." This is fine for development, but content published on a vercel.app subdomain will not build domain authority. Every day content sits on vercel.app is a day of lost SEO compounding.

**Consequences:** Zero domain authority accumulation. When you eventually migrate to a custom domain, Google treats it as a brand new site. All the time spent "building authority" was wasted. Internal links, any backlinks earned, and Google Search Console history are all tied to the wrong domain.

**Warning signs:** Google Search Console shows very slow indexing (days to weeks per page). "Discovered - currently not indexed" status persists. Organic traffic stays at zero despite 20+ articles published.

**Prevention:**
- Buy the .ie domain before publishing any content. Even if the brand name is TBD, secure a domain early.
- If truly impossible, use `noindex` on vercel.app and treat it purely as a staging/preview environment. Do not expect SEO results from it.
- When a domain is chosen, set canonical URLs from day one. Never publish indexable content on vercel.app.

**Detection:** Check Google Search Console coverage report weekly after first article publish.

**Phase relevance:** Must be addressed before any content goes live. This is a Phase 1 blocker for the SEO strategy -- not a "nice to have."

**Confidence:** HIGH -- Vercel's own documentation warns about this, and multiple developer reports confirm deprioritization.

---

### Pitfall 2: GDPR Non-Compliance on Email Capture (Irish ePrivacy Regulations)

**What goes wrong:** Ireland enforces GDPR through the Data Protection Commission (DPC), which is the lead supervisory authority for many Big Tech companies and has issued billions in fines. Irish ePrivacy Regulations (SI 336/2011, Regulation 13) require explicit opt-in consent for electronic marketing. Getting this wrong exposes the business to enforcement action in one of the strictest GDPR jurisdictions in Europe.

**Why it happens:** Developers implement email capture with a single form submission and start sending marketing emails. They skip double opt-in, use pre-checked consent boxes, bundle marketing consent with service terms, or fail to provide granular consent options.

**Consequences:** DPC complaint (any subscriber can file one). Fines up to 4% of annual turnover or EUR 20 million. Resend account suspension if spam complaints spike. Reputational damage in a trust-dependent market (accounting).

**Warning signs:** No double opt-in confirmation flow. Privacy policy does not specifically describe email marketing consent. No unsubscribe link in emails. Consent checkbox is pre-checked or absent. No record of when/how consent was given.

**Prevention:**
- Implement double opt-in: form submission triggers confirmation email via Resend, subscriber only added to active list after clicking confirmation link.
- Store consent proof in Supabase: timestamp, IP address, consent text shown, source page.
- Consent checkbox must be unchecked by default with clear text like "I agree to receive accounting tips and updates by email."
- Every email must contain an unsubscribe link that works immediately.
- Privacy policy must specify: what data is collected, why, how long it is retained, how to request deletion.
- Separate marketing consent from any future account creation consent.

**Detection:** Audit email capture flow against DPC's "Rules for Direct Electronic Marketing" checklist before launch.

**Phase relevance:** Must be correct in initial email capture implementation. Retrofitting consent records is nearly impossible.

**Confidence:** HIGH -- DPC guidelines are explicit and publicly available.

---

### Pitfall 3: Supabase as Analytics Database Creates Performance and Cost Problems

**What goes wrong:** Supabase uses PostgreSQL, which is a row-oriented transactional database. It is fundamentally not optimized for analytics workloads (aggregations, time-series queries, funnel analysis). As page view volume grows, analytical queries slow down, potentially impacting the production database that also serves email subscriptions and other transactional operations.

**Why it happens:** The project explicitly chose "custom Supabase analytics only" to avoid third-party tracking. This is a valid privacy decision, but the implementation must account for PostgreSQL's analytical limitations.

**Consequences:** Slow dashboard queries as data grows past tens of thousands of rows. Analytical queries (GROUP BY date, COUNT DISTINCT visitors) create I/O pressure on the same database serving subscriber operations. At scale, you either accept slow analytics or face a migration to a proper analytics store.

**Warning signs:** Analytics queries taking >1 second. Database CPU spikes correlating with analytics page loads. Subscriber-related operations slowing down during analytics queries.

**Prevention:**
- Design the analytics schema for write-heavy, read-light patterns: append-only `page_views` table with minimal indexes.
- Use materialized views or scheduled aggregation (Supabase cron/pg_cron) to pre-compute daily/weekly rollups rather than querying raw events.
- Add appropriate indexes: composite index on `(created_at, page_path)` for time-range queries.
- Set a data retention policy from day one (e.g., raw events for 90 days, aggregated data indefinitely). Use pg_cron to prune old raw events.
- Keep analytics tables in a separate schema from transactional tables.
- Use connection pooling (Supabase has this built-in via PgBouncer) to prevent analytics queries from monopolizing connections.

**Detection:** Monitor query execution times in Supabase dashboard. Alert if any analytics query exceeds 500ms.

**Phase relevance:** Schema design must be right from the start. Migrating analytics data after months of accumulation is painful.

**Confidence:** HIGH -- PostgreSQL's row-oriented limitation for analytics is well-documented. Supabase's own ecosystem acknowledges this (Tinybird integration exists specifically for this reason).

---

### Pitfall 4: MDX Content Pipeline Breaks at Scale Without Validation

**What goes wrong:** With 72 articles, each with complex frontmatter (title, description, keywords, category, publishDate, pillar status, FAQ schema data, related articles), inconsistencies creep in. A single malformed frontmatter field can break the build. Missing required fields silently produce broken pages. Typos in category names fragment the category system.

**Why it happens:** MDX frontmatter is untyped YAML by default. There is no schema validation. With 72 files authored over months, entropy is inevitable. Copy-paste errors, inconsistent date formats, misspelled category names, and missing fields accumulate.

**Consequences:** Build failures at deploy time with cryptic errors. Articles published without OG images because `description` was missing. Category pages showing wrong counts because "Tax Obligations" was spelled "Tax Obligation" in one file. FAQ schema generating invalid JSON-LD because the frontmatter structure was inconsistent.

**Warning signs:** First build failure caused by a frontmatter typo. Discovering an article was live without proper metadata. Category page counts not matching expected article counts.

**Prevention:**
- Define a TypeScript schema for frontmatter (use Zod or similar) and validate every MDX file at build time.
- Create a content validation script that runs in CI: checks required fields, validates date formats, confirms categories match allowed values, verifies related article slugs exist.
- Use a single `contentSchema.ts` file as the source of truth for all frontmatter types.
- Centralize category names as an enum/constant -- never use raw strings.
- Add a pre-commit hook or CI check that validates all MDX frontmatter before merge.

**Detection:** Build-time validation errors. A content audit script that can be run manually.

**Phase relevance:** Must be implemented before the first article is written. Adding validation after 20+ articles means fixing 20+ files retroactively.

**Confidence:** HIGH -- This is the most commonly reported pain point in MDX blog scaling.

---

### Pitfall 5: Framer Motion Bloats Client Bundle and Kills Core Web Vitals

**What goes wrong:** Framer Motion requires `"use client"` directives, meaning every component using it ships JavaScript to the browser. The project wants "micro-interactions throughout" -- hover states, page transitions, scroll reveals, animated elements. If every article page, category page, and layout component imports Framer Motion, the client-side JavaScript bundle balloons. This directly harms Largest Contentful Paint (LCP) and Total Blocking Time (TBT), which are Core Web Vitals that Google uses as ranking signals.

**Why it happens:** Framer Motion is a client-side animation library. In Next.js App Router, using it means wrapping components in `"use client"` boundaries, which opts those components (and their children) out of server-side rendering benefits. The temptation is to animate everything because it looks good in development.

**Consequences:** Poor Core Web Vitals scores. Google PageSpeed Insights flags JavaScript bundle size. LCP degrades because the browser must download, parse, and execute animation code before rendering content. On mobile (where most Irish small business owners browse), performance is noticeably worse. SEO rankings suffer because Google factors Core Web Vitals into ranking.

**Warning signs:** PageSpeed Insights mobile score below 80. "Reduce unused JavaScript" warning mentioning framer-motion chunks. LCP >2.5 seconds on mobile. TBT >200ms.

**Prevention:**
- Create a strict client/server boundary: article content is a Server Component, animations are isolated in thin Client Component wrappers.
- Use `dynamic(() => import(...), { ssr: false })` for non-critical animations (scroll reveals, decorative elements).
- Limit page transition animations -- they require wrapping the entire layout in a client boundary.
- Prefer CSS animations for simple hover states and transitions. Reserve Framer Motion for complex, orchestrated animations.
- Use `LazyMotion` and `domAnimation` features to tree-shake unused Framer Motion features (reduces bundle by ~50%).
- Profile every animated component's impact on bundle size using `@next/bundle-analyzer`.
- Set a performance budget: mobile PageSpeed score must stay above 90.

**Detection:** Run Lighthouse CI on every deploy. Monitor Core Web Vitals in Google Search Console.

**Phase relevance:** Architecture decision in Phase 1. Retrofitting server/client boundaries after building 20 animated components is a significant refactor.

**Confidence:** HIGH -- framer/motion GitHub issues and Next.js discussions document these problems extensively.

---

## Moderate Pitfalls

---

### Pitfall 6: OG Image Generation Fails Silently in Production

**What goes wrong:** `@vercel/og` uses Edge Runtime with Satori (an SVG renderer), which has significant limitations: no CSS Grid, limited flexbox support, no external images without explicit fetching, font loading fails silently in production, and images exceeding platform size limits (WhatsApp: 300KB) get dropped.

**Why it happens:** OG images work perfectly in development but fail in production due to different runtime environments, font loading paths, and caching behavior. The `metadataBase` configuration is often missing, causing OG image URLs to resolve incorrectly.

**Prevention:**
- Always set `metadataBase` in the root layout's metadata export.
- Test OG images in production (not just dev) using Facebook Sharing Debugger and Twitter Card Validator.
- Keep OG image designs simple -- stick to flexbox layout, system-safe fonts, solid colors.
- If using custom fonts, bundle them as ArrayBuffer imports, not URL fetches.
- Add `Cache-Control` headers with reasonable TTL (e.g., 1 hour) to prevent stale images.
- Verify generated image file sizes stay under 300KB for maximum platform compatibility.

**Detection:** After each deploy, spot-check 3-5 article OG images using https://developers.facebook.com/tools/debug/ and opengraph.xyz.

**Phase relevance:** Implement and test during initial article template build. Do not defer to "later."

**Confidence:** MEDIUM -- well-documented in Next.js GitHub discussions but varies by implementation.

---

### Pitfall 7: Ireland-Specific Content Gets Diluted by Generic Advice

**What goes wrong:** Articles start strong with Irish-specific references (Revenue Commissioners, CRO, Form 11) but gradually drift toward generic accounting advice that could apply to any English-speaking country. Google does not reward this -- Irish searchers bounce when content does not match their specific context, and the site loses its differentiation signal.

**Why it happens:** Content creation fatigue over 72 articles. Writers (or AI-generated drafts) default to generic advice. No content review checklist enforces Irish specificity. Some topics feel "universal" (e.g., "what does an accountant do?") so writers skip localization.

**Consequences:** Higher bounce rates on Irish-specific searches. Loss of topical authority signal for Ireland. Competition from larger UK/US sites that rank for generic terms. Failure to capture the long-tail Irish queries that are the entire strategy.

**Prevention:**
- Create a content checklist requiring every article to reference at least: one Irish entity (Revenue, CRO, etc.), one Irish-specific threshold/rate, and one Irish deadline or regulation.
- Include Irish monetary formatting (EUR, not USD/GBP) throughout.
- Reference Irish tax year (January-December for companies, calendar year for income tax) explicitly.
- Use "Republic of Ireland" or "Ireland" (not "UK and Ireland" or "British Isles") consistently.
- Every article should include a "Key Irish Context" callout box with current rates/thresholds.
- Build a shared reference data file with current Irish tax rates, thresholds, and deadlines that all articles import -- when rates change, update once.

**Detection:** Content audit script that checks each MDX file for presence of Irish-specific terms (configurable keyword list).

**Phase relevance:** Content template and guidelines must be established before first article draft.

**Confidence:** HIGH -- fundamental to the project's value proposition per PROJECT.md.

---

### Pitfall 8: Canonical URL and Duplicate Content Mismanagement

**What goes wrong:** Without explicit canonical tags on every page, Google may index multiple URLs for the same content: with/without trailing slashes, with query parameters (UTM tags, pagination), and potentially both vercel.app and custom domain versions. Duplicate content dilutes ranking signals across multiple URLs instead of concentrating them on one.

**Why it happens:** Next.js App Router does not automatically set canonical URLs. Developers assume the framework handles it. Category pages with pagination create multiple URLs for overlapping content. UTM parameters from email campaigns create duplicate indexed URLs.

**Prevention:**
- Set canonical URLs explicitly in the metadata export for every page and layout.
- Use `trailingSlash: false` (or `true` -- pick one and enforce it) in `next.config.js`.
- Add `robots: { index: false }` to pagination pages beyond page 1, or use `rel="next"`/`rel="prev"`.
- Strip UTM parameters from canonical URLs.
- If deploying on vercel.app initially, set canonical to the intended final domain, or use `noindex` until the real domain is live.

**Detection:** Google Search Console "Pages" report showing duplicate pages or "Duplicate without user-selected canonical" warnings.

**Phase relevance:** Must be configured in the initial layout and page templates. Fixing after Google has indexed duplicates takes weeks of re-crawling.

**Confidence:** HIGH -- explicitly documented in Next.js SEO guides and Vercel KB.

---

### Pitfall 9: Email Deliverability Destroyed by Improper Resend Configuration

**What goes wrong:** Confirmation emails and marketing emails land in spam. Subscribers never complete double opt-in because the confirmation email was filtered. The email list appears to grow (form submissions) but actual confirmed subscribers are a fraction.

**Why it happens:** Sending from a domain without proper DNS records (SPF, DKIM, DMARC). Using link tracking on transactional emails (confirmation links go through a tracking domain, triggering spam filters). Mismatched "from" domain and link domains in email body. Sending to unvalidated email addresses, accumulating hard bounces.

**Consequences:** Low confirmation rates on double opt-in (below 50% instead of expected 70-80%). Sender reputation degrades. Eventually Resend may throttle or suspend the account.

**Prevention:**
- Set up SPF, DKIM, and DMARC DNS records for the sending domain before sending any emails. Resend's dashboard guides this.
- Disable open tracking and link tracking for transactional emails (confirmation, welcome). Only enable for marketing emails if needed.
- Ensure the "from" address domain matches the domain in email body links.
- Validate email format client-side before submission. Consider a simple MX record check server-side.
- Start with low volume and increase gradually -- do not batch-send to a large list on a fresh domain.
- Monitor bounce rates in Resend dashboard. Remove hard bounces immediately.

**Detection:** Track confirmation rate (confirmed / submitted). If below 60%, investigate deliverability. Check Resend's deliverability insights dashboard.

**Phase relevance:** DNS records must be configured before first email send. This is a prerequisite for the email capture feature.

**Confidence:** MEDIUM -- Resend's own blog documents these practices, but specific confirmation rates depend on implementation.

---

### Pitfall 10: next-sitemap vs Built-in Sitemap API Confusion

**What goes wrong:** The project references `next-sitemap` (an npm package), but Next.js App Router has built-in sitemap generation via `app/sitemap.ts`. Using the external package with App Router creates conflicts: route groups are not supported, the build-time postbuild script fights with the App Router's file-based conventions, and generated sitemaps miss dynamically created pages.

**Why it happens:** `next-sitemap` was the standard for Pages Router. Many tutorials and the project spec reference it. But App Router introduced native `sitemap.ts` support that is simpler, more reliable, and does not require a postbuild step.

**Prevention:**
- Use the built-in `app/sitemap.ts` file convention instead of `next-sitemap`.
- Export a `sitemap()` function that reads the MDX article list and generates entries with proper `lastModified`, `changeFrequency`, and `priority` values.
- Use tiered priority: homepage (1.0), pillar articles (0.9), category pages (0.8), regular articles (0.7), static pages (0.5).
- Similarly, use `app/robots.ts` instead of a static `robots.txt` file for dynamic control.

**Detection:** After build, verify `/sitemap.xml` contains all expected URLs with correct priorities and dates.

**Phase relevance:** Decide during initial project setup. Switching from next-sitemap to built-in after launch requires careful redirect handling.

**Confidence:** HIGH -- Next.js official documentation recommends the built-in approach for App Router.

---

## Minor Pitfalls

---

### Pitfall 11: JSON-LD Schema Markup Generates Invalid Structured Data

**What goes wrong:** Article, FAQ, Breadcrumb, and Organisation schema markup is generated from frontmatter data but contains errors: missing required fields, incorrect types (string instead of array), or outdated schema.org vocabulary. Google Search Console reports "unparsable structured data" errors, and rich results are not displayed.

**Prevention:**
- Use a typed helper function that builds JSON-LD from validated frontmatter, not string concatenation.
- Test with Google's Rich Results Test (https://search.google.com/test/rich-results) for every article template.
- FAQ schema requires `mainEntity` as an array of `Question` objects, each with `acceptedAnswer` -- validate this structure.
- Organisation schema needs `name`, `url`, `logo`, and `sameAs` at minimum.

**Detection:** Google Search Console "Enhancements" section. Run Rich Results Test on first 3 articles before bulk publishing.

**Phase relevance:** Article template implementation.

**Confidence:** HIGH.

---

### Pitfall 12: LLM/AI Citation Optimization is Ignored

**What goes wrong:** The project spec mentions "AI SEO optimisation (structured for LLM citations)" but this is easy to deprioritize. Current research shows 44.2% of LLM citations come from the first 30% of content. If articles bury the answer after lengthy introductions, they will never be cited by ChatGPT, Perplexity, or Google AI Overviews.

**Prevention:**
- Every article must lead with an answer-first summary (TL;DR) in the first 2-3 paragraphs.
- Use descriptive H2/H3 headings that match likely questions (not clever/creative headings).
- Include structured data (tables, lists, definition-style formatting) that LLMs can extract.
- Make sections self-contained -- each H2 section should be independently quotable.
- Include specific numbers, dates, and Irish entity names as "anchor points" for citation.
- Add FAQ schema (already planned) -- this directly feeds AI Overview citations.

**Detection:** Test articles by asking ChatGPT and Perplexity the target query. Check if your content is cited.

**Phase relevance:** Content template design and article writing guidelines.

**Confidence:** MEDIUM -- LLM citation patterns are rapidly evolving, but the structural recommendations are well-supported by current research.

---

### Pitfall 13: Scheduled Publishing via Daily Rebuild is Fragile

**What goes wrong:** The project plans "daily rebuild trigger for scheduled article publishing" using frontmatter `publishDate`. If the cron job fails, articles do not appear on schedule. If the build fails (e.g., due to a frontmatter error in a newly dated article), no articles publish that day and existing ones might show a stale build.

**Prevention:**
- Use Vercel's built-in cron support via `vercel.json` with a daily API route trigger, not an external cron service.
- The rebuild trigger should be a lightweight API route that calls `res.revalidate()` (ISR) rather than triggering a full rebuild.
- Add error notifications (Resend email to admin) if a build/revalidation fails.
- The content validation script (Pitfall 4) should run before any scheduled publish to catch errors in advance.
- Keep a "last successful build" timestamp visible somewhere (admin-only page or API endpoint).

**Detection:** Missing article on expected publish date. Build logs showing failures.

**Phase relevance:** Publishing pipeline implementation.

**Confidence:** MEDIUM.

---

### Pitfall 14: CSS Accumulation from Framer Motion Page Transitions

**What goes wrong:** When using AnimatePresence for page transitions in Next.js, CSS from previous pages accumulates and is not cleaned up. After navigating through many pages, the browser becomes sluggish and can crash. This is especially problematic for a content site where users navigate between many articles.

**Prevention:**
- Avoid AnimatePresence page transitions entirely for a content-heavy site. The SEO and performance cost outweighs the visual benefit.
- If page transitions are required, use minimal opacity/transform transitions only (no layout animations).
- Use Tailwind CSS (already planned) rather than CSS Modules with Framer Motion -- this avoids the CSS Module accumulation bug.
- Test by navigating through 20+ pages rapidly and monitoring browser memory usage.

**Detection:** Browser memory increasing linearly with each page navigation. Site becoming unresponsive after 10+ navigations.

**Phase relevance:** Animation architecture decisions.

**Confidence:** HIGH -- documented in framer/motion GitHub issues.

---

### Pitfall 15: Missing Vercel.app to Custom Domain Migration Plan

**What goes wrong:** When the custom domain is finally chosen and configured, the migration creates SEO disruption: Google has indexed vercel.app URLs, internal links point to the old domain, cached OG images reference old URLs, email confirmation links in previously sent emails break, and Google Search Console needs reconfiguration.

**Prevention:**
- From day one, use environment variables for all absolute URLs (`NEXT_PUBLIC_SITE_URL`). Never hardcode the domain.
- If any content is indexed on vercel.app, prepare 301 redirects (though vercel.app redirects are limited).
- Better: keep vercel.app behind `noindex` until custom domain is ready. Accept that SEO does not start until the real domain is live.
- Plan the migration checklist now: DNS, SSL, Google Search Console verification, sitemap resubmission, social media profile updates, email sender domain update.

**Detection:** Hardcoded domain strings in codebase. Absolute URLs in content files.

**Phase relevance:** Initial project configuration and eventual domain migration.

**Confidence:** HIGH.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Project setup / config | Vercel.app domain SEO waste (Pitfall 1) | Secure .ie domain before content goes live |
| Project setup / config | next-sitemap vs built-in confusion (Pitfall 10) | Use App Router built-in `sitemap.ts` |
| Email capture implementation | GDPR non-compliance (Pitfall 2) | Double opt-in with consent proof storage |
| Email capture implementation | Deliverability failures (Pitfall 9) | DNS records (SPF/DKIM/DMARC) before first send |
| Analytics implementation | Supabase performance (Pitfall 3) | Pre-aggregation schema with materialized views |
| Content pipeline / MDX setup | Frontmatter validation (Pitfall 4) | Zod schema validation at build time |
| Content pipeline / MDX setup | Ireland content dilution (Pitfall 7) | Content checklist with Irish-specificity requirements |
| Content template design | LLM citation structure (Pitfall 12) | Answer-first format, self-contained sections |
| Animation / UI implementation | Framer Motion bundle bloat (Pitfall 5) | Strict server/client boundaries, LazyMotion |
| Animation / UI implementation | CSS accumulation (Pitfall 14) | Avoid page transitions, prefer CSS for simple animations |
| SEO infrastructure | Canonical URL management (Pitfall 8) | Explicit canonicals on every page from day one |
| SEO infrastructure | OG image failures (Pitfall 6) | Test in production with social debuggers |
| SEO infrastructure | JSON-LD errors (Pitfall 11) | Typed schema builders, Rich Results Test validation |
| Publishing pipeline | Rebuild fragility (Pitfall 13) | ISR revalidation over full rebuilds, error notifications |
| Domain migration (future) | Migration disruption (Pitfall 15) | Environment variables for all URLs, noindex until ready |

---

## Sources

- [Vercel KB: Avoiding duplicate content with vercel.app URLs](https://vercel.com/kb/guide/avoiding-duplicate-content-with-vercel-app-urls)
- [DPC Ireland: Rules for Direct Electronic Marketing](https://www.dataprotection.ie/en/organisations/rules-electronic-and-direct-marketing)
- [Tinybird: Can I use Supabase for analytics?](https://www.tinybird.co/blog/can-i-use-supabase-for-user-facing-analytics)
- [Next.js Docs: MDX Configuration](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [Next.js Docs: Sitemap File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Framer Motion Next.js Optimization Issue #2206](https://github.com/framer/motion/issues/2206)
- [FocusReactive: Next.js SEO Pitfalls 2024](https://focusreactive.com/typical-next-js-seo-pitfalls-to-avoid-in-2024/)
- [Resend: Four Ways to Hurt Your Sender Reputation](https://resend.com/blog/four-ways-to-hurt-your-sender-reputation)
- [Resend: Top 10 Email Deliverability Tips](https://resend.com/blog/top-10-email-deliverability-tips)
- [Vercel: OG Image Generation Docs](https://vercel.com/docs/og-image-generation)
- [Dataslayer: LLM SEO Audit for AI Citation](https://www.dataslayer.ai/blog/llm-seo-audit-chatgpt-gemini-perplexity)
- [SecurePrivacy: 11 GDPR Marketing Mistakes](https://secureprivacy.ai/blog/11-gdpr-marketing-mistakes-and-how-to-fix-them)
- [Strapi: Complete Next.js SEO Guide](https://strapi.io/blog/nextjs-seo)
