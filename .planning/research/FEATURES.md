# Feature Landscape

**Domain:** Content-first SEO platform (Irish accounting guidance)
**Researched:** 2026-04-03
**Mode:** Ecosystem

## Table Stakes

Features users expect. Missing = product feels incomplete or untrustworthy.

### Content Delivery & Reading Experience

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Responsive article layout | 62%+ traffic is mobile. Unreadable on phone = instant bounce | Low | Tailwind handles this natively |
| Table of contents (auto-generated) | Long-form accounting guides (2000+ words) need scannable navigation. Google can pull ToC links as sitelinks | Low | Parse MDX headings at build time |
| Breadcrumb navigation | Signals site hierarchy to users and search engines. Google displays breadcrumbs in SERPs. Required for BreadcrumbList schema | Low | Category > Article pattern maps cleanly to pillar/spoke model |
| Reading time estimate | Sets expectations on long guides. Standard on every content site | Low | Word count / 200 wpm at build time |
| Key takeaways / TL;DR box | Users scanning for quick answers (especially from AI Overviews) need summary content at top of page. 44.2% of LLM citations come from the first 30% of text | Low | MDX component, placed after intro |
| Related articles | Keeps users on site, builds topical authority through internal linking. Essential for hub-and-spoke SEO | Medium | Based on category + manual curation via frontmatter |
| Category archive pages | Users browse by topic (Tax, Business Structures, etc.). Search engines need category landing pages for topical authority | Low | Static generation from frontmatter categories |
| Search functionality | Users searching for specific Irish tax terms (Form 11, CT1, VAT thresholds) expect to find answers fast | Medium | Client-side search index built at build time (no server needed). Use Fuse.js or similar against article frontmatter + headings |
| 404 page with navigation | Broken links from external sites are inevitable. A branded 404 with search/category links retains users | Low | |

### SEO Infrastructure

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| JSON-LD structured data (Article, FAQ, BreadcrumbList, Organisation) | Baseline requirement in 2026. Search engines and AI systems rely on structured data to surface content in rich results and AI Overviews. Pages with rich results see 82% higher CTR | Medium | Reusable MDX/React components that generate JSON-LD from frontmatter |
| XML sitemap (auto-generated) | Required for search engine discovery, especially with 72 articles publishing over 9 months | Low | Next.js App Router has built-in sitemap generation |
| robots.txt | Controls crawl behavior. Necessary for any public site | Low | Static file |
| Canonical URLs | Prevents duplicate content issues across category pages and direct article URLs | Low | Set in metadata per page |
| Meta titles and descriptions | Every page needs unique, keyword-targeted meta. Missing = Google generates its own (often poorly) | Low | From MDX frontmatter |
| Open Graph and Twitter Card meta | Social sharing previews. Missing = ugly link cards when shared | Low | From frontmatter + OG image |
| Programmatic OG images | Manual OG image creation for 72 articles is impractical. Generated images ensure consistent branding | Medium | @vercel/og at build time, already planned |
| Internal linking strategy | Topical clusters require deliberate cross-linking. Hub-and-spoke model demands pillar pages link to spokes and vice versa | Medium | Combination of automated (related articles) and manual (inline MDX links) |

### AI Search Optimization

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear heading hierarchy (H1 > H2 > H3) | AI models parse heading structure to understand content organization. Fragmented structure gets ignored | Low | Enforce via MDX linting or content guidelines |
| Concise introductory paragraphs with direct answers | LLMs cite intro content disproportionately. First 30% of text generates 44% of citations | Low | Content authoring discipline, not code |
| FAQ sections with schema | FAQ schema is the single most effective structured data for AI citation. Direct Q&A format maps perfectly to how LLMs retrieve answers | Low | MDX FAQ component + FAQPage JSON-LD |
| Entity-rich content | Mentioning specific Irish entities (Revenue Commissioners, CRO, PRSI, USC) helps LLMs associate content with authoritative Irish tax knowledge | Low | Content strategy, not code feature |
| Definition lists / glossary markup | AI systems prefer clearly structured information with logical hierarchies. Accounting jargon needs explicit definitions | Low | MDX component for term definitions |

### Email Capture (GDPR-Compliant)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Inline email signup form | Primary conversion action for Phase 1. Must appear on articles, homepage, and directory placeholder | Low | React component, Supabase backend |
| Double opt-in flow | Effectively required for Irish/EU compliance. Provides strong evidence of GDPR consent. Double opt-in lists see 25-35% open rates vs 15-20% single | Medium | Supabase + Resend transactional email for confirmation |
| Explicit consent language | GDPR requires specific, informed consent. No pre-checked boxes. Clear statement of what subscriber receives | Low | Copy and UI, not complex code |
| Unsubscribe mechanism | Required by GDPR. Every email must contain one-click unsubscribe | Low | Handled by Resend + Supabase flag |
| Consent record logging | GDPR requires demonstrable proof of consent (timestamp, IP, what was consented to) | Low | Supabase table with consent metadata |
| Source tracking on signup | Know which articles drive signups. Essential for content strategy optimization | Low | Hidden field with referring page URL |

### Legal & Compliance (Ireland/EU)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Privacy policy page | GDPR mandatory. Must detail what data is collected, how it is used, retention periods, user rights (access, deletion, portability) | Low | Static MDX page. Must reference Irish DPC as supervisory authority |
| Cookie consent banner | Irish ePrivacy Regulations (SI 336/2011) require prior informed consent before placing non-essential cookies. Consent expires every 6 months. Fines up to EUR 250,000 | Medium | Since the site uses only custom Supabase analytics (first-party, strictly necessary for site operation), cookie requirements may be minimal. BUT: if analytics cookies are not "strictly necessary," a consent banner is required. Err on the side of implementing one |
| Terms of service page | Standard legal protection. Expected on any site collecting data | Low | Static MDX page |
| GDPR data subject rights | Users must be able to request access to or deletion of their data | Low | Contact form or email address. Manual process is fine for Phase 1 |
| Accounting disclaimer | Content is educational, not professional advice. Required to avoid liability when discussing tax matters | Low | Footer disclaimer + per-article notice |
| European Accessibility Act compliance | EAA transposed into Irish law, effective June 2025. Requires POUR principles (Perceivable, Operable, Understandable, Robust). While primarily targeting e-commerce, banking, etc., building accessible from day one avoids future retrofit | Medium | WCAG 2.1 AA as baseline. Semantic HTML, keyboard navigation, color contrast, alt text, focus indicators |

### Performance

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Core Web Vitals passing scores | Google ranking factor. LCP < 2.5s, INP < 200ms, CLS < 0.1 | Medium | Static generation handles most of this. Key risks: font loading (CLS), image optimization (LCP), Framer Motion (INP) |
| Static site generation (SSG) | 72 articles with no dynamic content = perfect SSG candidate. Fastest possible delivery | Low | Next.js App Router default for MDX content |
| Image optimization | Prevents layout shift and slow loading. next/image handles this | Low | Built into Next.js |
| Font optimization | Web fonts cause layout shift if not handled. next/font prevents this | Low | Built into Next.js |

### Custom Analytics

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Page view tracking | Basic traffic measurement. Know which articles get traffic | Medium | Supabase insert on page load. Must handle: bot filtering, unique vs total views, referrer tracking |
| Article read tracking | Distinguish visits from actual reads (scroll depth or time on page) | Medium | Intersection observer or time-based trigger |
| Email signup attribution | Which articles drive conversions | Low | Already covered by source tracking on signup form |
| Outbound click tracking | Track clicks to external resources (Revenue.ie, CRO.ie). Useful for understanding user intent | Low | Event listener on external links, Supabase insert |

## Differentiators

Features that set the platform apart. Not expected, but create competitive advantage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Ireland-specific content depth | No competitor covers ALL 72 Irish accounting topics with this specificity. Most accounting content is UK-centric or generic. Being the definitive Irish source is the core moat | High (content effort, not code) | This is a content strategy differentiator, not a technical feature. The code just delivers it well |
| Pillar page experience | Pillar articles (8 planned) get enhanced treatment: visual hub linking to all spoke articles, progress indicators, richer layout. Makes topical authority visible to users | Medium | Custom MDX layout for pillar pages. Visual distinction from regular articles |
| Date-based automated publishing | 2 articles/week over 9 months with zero manual deployment. Content appears automatically based on frontmatter publish date | Medium | Daily Vercel rebuild via cron. Articles with future dates excluded from build. Already planned |
| Irish tax deadline awareness | Surface upcoming deadlines contextually (e.g., "Corporation Tax deadline: September 23" on relevant articles). No competitor does this | Medium | Deadline data in config file. Component checks current date. Contextual display on relevant articles |
| "Last verified" dates on content | Irish tax rates and thresholds change yearly. Showing "Information verified for 2026/2027 tax year" builds trust that competitors with undated content lack | Low | Frontmatter field, displayed prominently |
| Content freshness signals | Display "Updated for [current tax year]" badges. Critical for YMYL (Your Money or Your Life) content where Google scrutinizes recency | Low | Frontmatter-driven badge component |
| Progressive email capture (non-aggressive) | Instead of popups, use contextual inline CTAs: "Get our free guide to VAT registration" within the VAT article. Higher relevance = higher conversion without annoying users | Low | Content-specific CTA components in MDX. Different offer per category |
| Reading progress indicator | Visual bar showing scroll progress through long articles. Subtle UX enhancement that signals modern, polished design | Low | Framer Motion scroll progress bar. Fits the "interactive, sleek" brand direction |
| Skip-to-content and keyboard navigation | Goes beyond basic compliance to genuinely good accessibility. Rare among Irish accounting sites (competitive advantage AND legal compliance) | Low | Semantic HTML + skip link + focus styles |
| Print-friendly article styles | Accountants and business owners print tax guides. A clean print stylesheet with proper page breaks is a small touch that builds loyalty | Low | CSS @media print rules |
| Social proof / trust indicators | "Trusted by X Irish business owners" once email list grows. Builds credibility for YMYL content | Low | Counter component pulling from Supabase subscriber count |

## Anti-Features

Features to explicitly NOT build in Phase 1. These are deliberate omissions, not oversights.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Comments section | Moderation burden. Spam magnet. Legal liability for user-generated content on financial topics. No SEO benefit for a content site this early | Use email capture as the engagement mechanism. Comments can be Phase 3 if ever |
| User accounts / login | Adds GDPR complexity (account deletion, data portability). No Phase 1 feature requires authentication. Overkill for email collection | Email-only signup. User accounts wait for directory in Phase 2 |
| Live chat / chatbot | Support burden with no revenue. AI chatbot giving wrong tax advice = liability nightmare | Contact page with email. FAQ content should answer questions |
| Pop-up email modals | Aggressive popups hurt UX, increase bounce rate, and conflict with "sleek, minimal" brand. Google penalizes intrusive interstitials on mobile | Inline contextual CTAs within articles. Exit-intent is acceptable only on desktop, and even then, defer to Phase 2 |
| Third-party analytics (GA4, Plausible, etc.) | Conflicts with privacy-first positioning. Adds cookie consent complexity. Custom Supabase analytics is already planned and provides full data ownership | Custom Supabase analytics as specified in PROJECT.md |
| Dark mode | Added complexity for Phase 1 with no SEO or conversion benefit. Explicitly out of scope per PROJECT.md | Ship with a clean light theme. Consider dark mode in a future quality-of-life update |
| Multi-language / Irish language | Adds massive content duplication burden. Target audience searches in English. Irish language version could be a future goodwill project but has negligible search volume for accounting terms | English only. All content optimized for how Irish users actually search |
| Accountant comparison tools / calculators | Phase 2 directory features. Building them before traffic exists wastes effort | Placeholder directory page with waitlist captures intent. Tools come with the directory |
| Newsletter archive page | No newsletter content exists yet. Building the page before sending emails is premature | Launch newsletter, then add archive after 5-10 editions exist |
| RSS feed | Low priority for this audience. Small business owners are not RSS users. AI crawlers and aggregators may benefit, but this is a minor optimization | Defer to post-launch. Can add in a day if needed |
| AMP pages | Google no longer prioritizes AMP. Next.js SSG already achieves top Core Web Vitals scores. AMP adds maintenance burden for zero benefit | Standard Next.js static pages with good performance |
| Breadcrumb-based pagination on archive pages | Over-engineering for 72 articles. Simple category pages with all articles listed is sufficient | Category pages with pillar-first ordering, then reverse chronological |

## Feature Dependencies

```
MDX Content Pipeline
  |-> Article Page Template
  |     |-> Table of Contents (parse headings)
  |     |-> Reading Time (parse word count)
  |     |-> Breadcrumbs (parse category)
  |     |-> Related Articles (parse frontmatter)
  |     |-> FAQ Section + Schema (parse FAQ frontmatter)
  |     |-> Key Takeaways component
  |     |-> JSON-LD structured data (parse all frontmatter)
  |     |-> OG Image generation (parse title + category)
  |
  |-> Category Archive Pages (aggregate by category)
  |-> Guides Hub (aggregate all, filter by category)
  |-> Homepage Latest Articles (aggregate by date)
  |-> XML Sitemap (aggregate all URLs)
  |-> Search Index (aggregate titles + headings)

Supabase Setup
  |-> Email Capture (subscribers table)
  |     |-> Double Opt-in (Resend confirmation email)
  |     |-> Consent Logging (consent metadata)
  |     |-> Source Tracking (referrer field)
  |
  |-> Custom Analytics (page_views table)
  |     |-> Page View Tracking
  |     |-> Article Read Tracking
  |     |-> Outbound Click Tracking

Vercel Deployment
  |-> Daily Rebuild Cron (scheduled publishing)
  |-> OG Image API Route (@vercel/og)

Legal Pages (no dependencies, can ship independently)
  |-> Privacy Policy
  |-> Terms of Service
  |-> Cookie Consent Banner (if non-essential cookies used)
```

## MVP Recommendation

### Must Ship (Week 1-2 priorities)

1. **MDX content pipeline with frontmatter parsing** -- everything else depends on this
2. **Article page template** (ToC, breadcrumbs, reading time, key takeaways, FAQ, related articles) -- the core product
3. **JSON-LD structured data** (Article, FAQ, BreadcrumbList, Organisation) -- baseline for 2026 SEO
4. **Email capture with double opt-in** -- primary Phase 1 conversion mechanism
5. **Homepage, Guides Hub, Category pages** -- site navigation structure
6. **Privacy policy + cookie consent** -- legal requirement before going live
7. **XML sitemap + robots.txt + canonical URLs** -- search engine discovery basics
8. **OG image generation** -- social sharing from day one
9. **Custom Supabase analytics** (page views, signup attribution) -- must measure from launch

### Ship Soon After (Week 3-4)

10. **Search functionality** -- becomes important as article count grows past 20
11. **Pillar page enhanced layout** -- 8 pillar articles publish first, should look distinctive
12. **Daily rebuild cron** -- needed once scheduled publishing begins
13. **Print stylesheet** -- low effort, high impression for the target audience
14. **Reading progress indicator** -- fits "interactive, sleek" brand with minimal effort

### Defer

- **Article read tracking (scroll depth)** -- nice analytics but not launch-critical
- **Irish tax deadline component** -- needs deadline data curation, add after initial content is live
- **Social proof counters** -- meaningless until subscriber count is substantial
- **Exit-intent desktop CTA** -- test inline CTAs first, optimize later

## Sources

- [First Page Sage: SEO Content Best Practices 2026](https://firstpagesage.com/seo-blog/seo-content-best-practices/)
- [Kevin Indig: State of AI Search Optimization 2026](https://www.growth-memo.com/p/state-of-ai-search-optimization-2026)
- [Dataslayer: LLM SEO 4-Point Audit 2026](https://www.dataslayer.ai/blog/llm-seo-audit-chatgpt-gemini-perplexity)
- [Irish DPC: Cookie Guidance](https://www.dataprotection.ie/en/dpc-guidance/guidance-cookies-and-other-tracking-technologies)
- [Mason Hayes Curran: EAA in Irish Law](https://www.mhc.ie/latest/insights/european-accessibility-act-implemented-into-irish-law)
- [NDA: European Accessibility Act](https://nda.ie/accessibility/european-accessibility-act)
- [Next.js: Core Web Vitals](https://nextjs.org/learn/seo/web-performance)
- [Yoast: 2026 SEO Predictions](https://yoast.com/2026-seo-predictions-by-yoast-experts/)
- [Neel Networks: AEO vs GEO vs AIO vs LLMO Guide](https://www.neelnetworks.com/blog/aeo-geo-aio-llmo-complete-ai-search-optimization-guide/)
- [MailerLite: GDPR Sign-Up Forms](https://www.mailerlite.com/blog/how-to-create-opt-in-forms-that-still-work-under-gdpr)
- [Level Access: WCAG 2.2 Checklist](https://www.levelaccess.com/blog/wcag-2-2-aa-summary-and-checklist-for-website-owners/)
