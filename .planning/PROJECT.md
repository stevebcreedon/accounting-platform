# Irish Accountant Discovery Platform

## What This Is

A content-first SEO platform targeting Irish small business owners who need accounting guidance. Phase 1 builds a library of 72 educational articles covering every accounting question an Irish sole trader, limited company director, or startup founder would search for — from "how to register for VAT in Ireland" to "how much does an accountant cost." The content layer builds domain authority over 6-9 months, then a paid accountant directory bolts on in Phase 2. Brand name TBD (placeholder used until domain is chosen). Deploys on Vercel's default domain initially.

## Core Value

Irish small business owners find clear, jargon-free answers to every accounting question they'd Google — and trust this platform enough to sign up for the directory when it launches.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Next.js 14 App Router site with TypeScript and Tailwind CSS
- [ ] Distinctive brand identity — interactive, minimal, sleek, clean (completely fresh design, not from original spec)
- [ ] Framer Motion micro-interactions: hover states, page transitions, scroll reveals, animated elements
- [ ] MDX content pipeline with frontmatter parsing, automated date-based publishing, category system
- [ ] 72 SEO-optimised articles hyper-specific to Republic of Ireland (8 pillar articles first)
- [ ] Brand-as-author (no personal attribution) across all content and schema markup
- [ ] Full SEO infrastructure: JSON-LD (Article, FAQ, Breadcrumb, Organisation), sitemap, robots.txt, canonical URLs, OG images
- [ ] AI SEO optimisation (structured for LLM citations — ChatGPT, Perplexity, etc.)
- [ ] Ireland-targeted SEO: Irish entities (Revenue, CRO), Irish tax rates/thresholds/deadlines, .ie positioning
- [ ] Email capture system: Supabase subscribers table, Resend double opt-in, GDPR-compliant, source tracking
- [ ] Custom analytics built directly in Supabase (page views, article reads, email signups, outbound clicks)
- [ ] Programmatic OG image generation via @vercel/og
- [ ] Homepage with hero, latest articles, category grid, email capture
- [ ] Guides hub with category filters, pillar badges, pagination
- [ ] Article page template with breadcrumbs, TOC, FAQ, key takeaways, related articles, email CTA
- [ ] Category archive pages
- [ ] Find-Accountant placeholder page with waitlist email capture
- [ ] Static pages: About (brand mission), Contact, Privacy (GDPR), Terms
- [ ] Daily rebuild trigger for scheduled article publishing
- [ ] Deployed on Vercel (default domain — no custom domain setup)

### Out of Scope

- Custom domain / DNS setup — deploying on Vercel domain until name decided
- Accountant directory functionality — Phase 2 after traffic justifies it
- Stripe payments / subscriptions — Phase 2
- Admin dashboard — Phase 2
- Dark mode — not needed for Phase 1
- Firm profiles, claim flow, reviews — Phase 2
- Comparison tool, cost calculator, accountant quiz — Phase 2
- Google Analytics or any third-party analytics — privacy-first, custom Supabase analytics instead
- Plausible / Umami — building own analytics
- Mobile app — web only
- County/service landing pages — Phase 2 directory SEO

## Context

- Part of a multi-site portfolio (SafeSkin, The Forum, Safe Smile) all using the same stack: Next.js 14, Supabase, Vercel, Resend
- Follows the "Safe Smile playbook" — content-first SEO build with automated publishing, directory bolted on later
- Target market: Republic of Ireland exclusively. All content must reference Irish-specific entities (Revenue Commissioners, CRO, Irish tax rates, thresholds, Form 11, Form CT1, etc.)
- 8 content categories with pillar/spoke model: Getting Started, Business Structures, Tax Obligations, Accounting Basics, Choosing an Accountant, Costs & Fees, Compliance & Deadlines, Industry Guides
- User personas: First-Time Founder (overwhelmed, needs education), Switching Sean (overcharged, needs benchmarks), Sole Trader Sarah (considering incorporation), Contractor Conor (umbrella vs limited)
- Supabase project already provisioned (keys in .env.local)
- Resend API key ready
- Complete article list with 72 titles, target keywords, and search intent documented in spec files
- Publishing cadence: 2 articles/week over ~9 months. Pillar pages first.
- Design direction: interactive, minimal, sleek, clean. Generous whitespace. Financial publication meets modern SaaS. Framer Motion throughout. NOT the original spec's colour palette — completely fresh.

## Constraints

- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, MDX, Supabase, Vercel, Resend — consistent with portfolio
- **Content specificity**: Republic of Ireland only — no UK, no Northern Ireland, no generic content
- **GDPR**: Double opt-in, explicit consent, privacy policy, no pre-checked boxes, unsubscribe in every email
- **SEO**: Every article must answer the most commonly asked questions on its topic. FAQ schema on all articles.
- **Brand**: No personal author attribution. Brand is the authority.
- **Analytics**: Custom Supabase analytics only. No third-party tracking scripts.
- **Deployment**: Vercel default domain. No custom domain configuration in this milestone.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Custom Supabase analytics over Plausible | Privacy-first positioning + full data ownership + no third-party dependency | — Pending |
| Brand-as-author, not personal | Platform authority positioning (like SafeSkin model) | — Pending |
| Fresh brand identity (not ClearCount spec) | User wants distinctive, interactive, sleek — original spec too basic | — Pending |
| Vercel default domain initially | Domain name TBD, avoid premature commitment | — Pending |
| Framer Motion for all interactions | User wants micro-interactions, transitions, scroll animations — all of the above | — Pending |
| @vercel/og for OG images | Programmatic generation at build time, no manual design needed | — Pending |
| MDX in repo (no headless CMS) | Simple, git-based content pipeline. Sufficient for Phase 1 scale. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-06 — Phase 10 (Content & Deployment) complete: 72 articles live on Vercel, daily rebuild cron, milestone v1.0 complete*
