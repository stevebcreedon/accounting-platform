<!-- GSD:project-start source:PROJECT.md -->
## Project

**Irish Accountant Discovery Platform**

A content-first SEO platform targeting Irish small business owners who need accounting guidance. Phase 1 builds a library of 72 educational articles covering every accounting question an Irish sole trader, limited company director, or startup founder would search for — from "how to register for VAT in Ireland" to "how much does an accountant cost." The content layer builds domain authority over 6-9 months, then a paid accountant directory bolts on in Phase 2. Brand name TBD (placeholder used until domain is chosen). Deploys on Vercel's default domain initially.

**Core Value:** Irish small business owners find clear, jargon-free answers to every accounting question they'd Google — and trust this platform enough to sign up for the directory when it launches.

### Constraints

- **Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, MDX, Supabase, Vercel, Resend — consistent with portfolio
- **Content specificity**: Republic of Ireland only — no UK, no Northern Ireland, no generic content
- **GDPR**: Double opt-in, explicit consent, privacy policy, no pre-checked boxes, unsubscribe in every email
- **SEO**: Every article must answer the most commonly asked questions on its topic. FAQ schema on all articles.
- **Brand**: No personal author attribution. Brand is the authority.
- **Analytics**: Custom Supabase analytics only. No third-party tracking scripts.
- **Deployment**: Vercel default domain. No custom domain configuration in this milestone.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 14.2.25+ (14.x latest) | App Router, SSG, ISR | Portfolio consistency (SafeSkin, Safe Smile, The Forum all use 14). Security patches through 14.2.35. Do NOT upgrade to 15/16 mid-project -- different React version requirements and breaking changes. Pin to `^14.2.25`. | HIGH |
| TypeScript | ~5.5 | Type safety | Matches Next.js 14 bundled TS support. Avoid 5.7+ which may have peer dep issues with Next 14. | HIGH |
| React | 18.x | UI library | Next.js 14 ships with React 18. React 19 requires Next.js 15+. | HIGH |
### Content Layer
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Velite | ^0.3.1 | MDX content pipeline | Type-safe content layer with Zod schema validation. Replaces abandoned Contentlayer. Handles frontmatter parsing, reading time, slug generation, and MDX compilation in one tool. Eliminates need for gray-matter + manual file orchestration. Built-in file watching for dev. | MEDIUM |
| @mdx-js/react | ^3.1 | MDX React integration | Required for custom component mapping in MDX content. | HIGH |
| rehype-pretty-code | ^0.14 | Syntax highlighting | Server-side highlighting via Shiki. Zero client JS. Critical for code snippets in tax/accounting articles (e.g., spreadsheet formulas, JSON examples). | HIGH |
| rehype-slug | ^6.0 | Heading IDs | Auto-generates IDs for headings. Required for table of contents linking. | HIGH |
| rehype-autolink-headings | ^7.1 | Heading links | Adds anchor links to headings for shareability and TOC navigation. | HIGH |
| remark-gfm | ^4.0 | GitHub Flavored Markdown | Tables, strikethrough, task lists. Needed for comparison tables in accounting articles. | HIGH |
- **Contentlayer**: Abandoned. Primary dev allocates 1 day/month. PRs closed without merge. Do not use.
- **gray-matter + manual**: Works but requires ~200 lines of boilerplate for file reading, frontmatter parsing, sorting, filtering. Velite handles this declaratively.
- **next-mdx-remote**: Designed for remote content. Overkill for local files in App Router where server components can read files directly.
- **@next/mdx**: Too basic. No frontmatter support, no content querying, no type generation. Fine for a 5-page site, not 72 articles with categories and pillar/spoke relationships.
### Styling
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^3.4.17 | Utility-first CSS | Use v3, NOT v4. Tailwind v4 is a ground-up rewrite with breaking config changes (no tailwind.config.js, CSS-first config, PostCSS plugin changes). Next.js 14 docs reference v3 setup. The portfolio's other sites likely use v3. Avoid the upgrade risk on a content-heavy project where styling stability matters. | HIGH |
| tailwindcss-animate | ^1.0.7 | Animation utilities | Provides utility classes for common animations. Integrates with Tailwind v3 config. | HIGH |
| @tailwindcss/typography | ^0.5.15 | Prose styling | `prose` classes for MDX article content. Critical for readable long-form accounting articles. Handles headings, lists, tables, blockquotes out of the box. | HIGH |
| clsx | ^2.1 | Conditional classes | Lightweight (234 bytes) utility for conditional class names. Preferred over classnames (larger) or template literals (messy). | HIGH |
| tailwind-merge | ^2.6 | Class merging | Resolves Tailwind class conflicts when composing components. Use with clsx via a `cn()` utility function. | HIGH |
- v4 requires PostCSS plugin migration (`@tailwindcss/postcss` replaces `tailwindcss`)
- v4 uses CSS `@import` config instead of `tailwind.config.js` -- different mental model
- v4 auto-scans project (no `content` array) -- can cause unexpected style inclusion
- v4 has documented issues with `tailwindcss-animate` compatibility
- v3.4.17 is the final v3 release, fully stable, well-documented with Next.js 14
- Portfolio consistency -- other sites almost certainly use v3
### Animation
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| motion | ^12.38 | React animations | Framer Motion rebranded to Motion. Import from `motion/react` not `framer-motion`. API is identical. Provides: page transitions, scroll reveals, hover states, layout animations. The `framer-motion` npm package still works (re-exports from motion) but new projects should use `motion` directly. | HIGH |
### Database & Backend Services
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @supabase/supabase-js | ^2.101 | Supabase client | Core client for DB operations. Email subscribers table + custom analytics writes. Project already provisioned with keys. | HIGH |
| @supabase/ssr | ^0.6 | Server-side Supabase | Creates server/client Supabase instances for App Router. Replaces deprecated `@supabase/auth-helpers`. Required for server component DB access and middleware. | HIGH |
- `page_views`: timestamp, path, referrer, user_agent (hashed), country
- `article_reads`: timestamp, article_slug, read_duration, scroll_depth
- `email_subscribers`: email, confirmed, source, created_at, gdpr_consent_at
- `outbound_clicks`: timestamp, article_slug, target_url, link_text
### Email
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| resend | ^6.10 | Email API | Transactional email (double opt-in confirmation, welcome). API key already provisioned. 100 emails/day on free tier -- sufficient for early growth. | HIGH |
| @react-email/components | ^1.0.10 | Email templates | Build email templates as React components. Type-safe, preview-able. Pairs with Resend. | HIGH |
| @react-email/render | ^2.0.4 | Email rendering | Renders React email components to HTML string for Resend API. | HIGH |
### SEO & Metadata
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| next/metadata (built-in) | -- | Page metadata | Next.js 14 built-in `generateMetadata` and `metadata` exports. No external package needed. Handles title, description, OG tags, canonical URLs. | HIGH |
| Built-in sitemap.ts | -- | Sitemap generation | Use Next.js App Router's native `app/sitemap.ts` instead of next-sitemap. Returns `MetadataRoute.Sitemap`. Zero dependencies. Supports ISR caching. | HIGH |
| schema-dts | ^2.0.0 | JSON-LD types | Google's TypeScript types for Schema.org. Type-safe Article, FAQ, Breadcrumb, Organisation schema. Prevents malformed structured data. | HIGH |
| @vercel/og | ^0.11 | OG image generation | Programmatic OG images using JSX-to-PNG. Bundled with Next.js on Vercel but install explicitly for type support. Supports custom fonts (use a clean sans-serif for financial authority). | HIGH |
- next-sitemap is a postbuild script -- separate build step, separate config file
- Built-in `sitemap.ts` is a route handler with full TypeScript support
- Integrates with `generateStaticParams` -- same data source as your routes
- No additional dependency. Community is migrating away from next-sitemap for App Router projects.
- For 72 articles, a single sitemap file is sufficient (no sitemap index needed)
### Infrastructure
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel | -- | Hosting & deployment | Zero-config Next.js deployment. Built-in ISR, edge functions, image optimization. Already used across portfolio. Free tier sufficient for Phase 1. | HIGH |
| Vercel Cron | -- | Daily rebuild trigger | Vercel cron jobs trigger ISR revalidation for scheduled article publishing. Configure in vercel.json. Free tier allows 1 cron job. | MEDIUM |
### Dev Tooling
| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| ESLint | ^8.x | Linting | Next.js 14 ships eslint-config-next. Use with @typescript-eslint. Do not upgrade to ESLint 9 flat config -- Next.js 14 uses legacy config format. | HIGH |
| Prettier | ^3.4 | Formatting | Consistent code style. Use prettier-plugin-tailwindcss for class sorting. | HIGH |
| prettier-plugin-tailwindcss | ^0.6 | Tailwind class sorting | Auto-sorts Tailwind classes in consistent order. Reduces bikeshedding. | HIGH |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Content layer | Velite | Contentlayer | Abandoned. Last meaningful update 2023. |
| Content layer | Velite | gray-matter + manual | Too much boilerplate for 72 articles with categories, pillars, reading time. |
| Content layer | Velite | next-mdx-remote | Designed for remote content. Local files in App Router don't need it. |
| Styling | Tailwind v3 | Tailwind v4 | Breaking config changes. Compatibility issues with Next.js 14 and tailwindcss-animate. |
| Animation | motion | react-spring | Smaller ecosystem, less documentation for page transitions. motion/framer-motion is industry standard. |
| Animation | motion | GSAP | Overkill for micro-interactions. License considerations for commercial use. |
| Sitemap | Built-in sitemap.ts | next-sitemap | Unnecessary dependency. Built-in is simpler, typed, zero-config. |
| Email | Resend + React Email | Nodemailer | Resend abstracts deliverability, DNS, bounce handling. API key already provisioned. |
| Email | Resend + React Email | SendGrid | Resend has better DX, React Email integration, simpler API. |
| Analytics | Custom Supabase | Plausible | Project requirement: full data ownership, no third-party scripts. |
| Analytics | Custom Supabase | Umami | Same as above. Custom analytics is a deliberate privacy-first choice. |
| JSON-LD | schema-dts | next-seo | next-seo hasn't kept up with App Router metadata API. Schema-dts is Google-maintained and type-safe. |
| OG images | @vercel/og | Manual design | 72 articles need programmatic generation. Manual doesn't scale. |
| Hosting | Vercel | Netlify | Portfolio already on Vercel. Zero-config Next.js support is better. |
## What NOT to Use
| Package | Why Not |
|---------|---------|
| `contentlayer` | Abandoned. Will break with future Node/Next updates. |
| `next-seo` | Designed for Pages Router. App Router has built-in metadata API that's better. |
| `@supabase/auth-helpers-nextjs` | Deprecated. Replaced by `@supabase/ssr`. |
| `framer-motion` (as npm package) | Still works but is a re-export shim. Install `motion` directly. |
| `next-sitemap` | Unnecessary with App Router's built-in sitemap.ts. |
| `classnames` | 6x larger than clsx with identical API. Use clsx. |
| `tailwindcss@4` | Breaking changes, compatibility issues with Next.js 14 ecosystem. |
| `eslint@9` | Flat config not supported by Next.js 14's eslint-config-next. |
| Google Analytics / gtag | Contradicts privacy-first positioning. Custom Supabase analytics instead. |
| `cookie-consent` libraries | With no third-party cookies/tracking, a simple GDPR notice for essential cookies (if any) suffices. No complex consent management needed. |
## Installation
# Core framework
# Content layer
# MDX plugins
# Styling
# Animation
# Database & email
# SEO
# @vercel/og is bundled with Next.js on Vercel but install for local dev types:
# Dev tooling
## Key Configuration Notes
### Velite content schema (velite.config.ts)
### Tailwind v3 setup
### GDPR considerations
### Supabase analytics approach
## Version Pinning Strategy
| Package | Pin Strategy | Reason |
|---------|-------------|--------|
| next | `^14.2.25` | Stay on 14.x, get security patches, avoid 15.x auto-upgrade |
| react, react-dom | `^18` | Next.js 14 peer dep. React 19 requires Next 15. |
| tailwindcss | `^3.4.17` | Stay on v3. Caret won't cross major version. |
| motion | `^12` | Stable API. v12 is current major. |
| velite | `^0.3` | Pre-1.0. Pin to minor to avoid breaking changes. |
| @supabase/supabase-js | `^2` | v2 is current stable. v3 would be breaking. |
## Sources
- [Next.js MDX Guide](https://nextjs.org/docs/pages/guides/mdx) - Official MDX documentation
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Structured data best practices
- [Next.js sitemap.ts](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Built-in sitemap generation
- [Velite GitHub](https://github.com/zce/velite) - Content layer tool, actively maintained
- [Velite Next.js Integration](https://velite.js.org/guide/with-nextjs) - Official integration guide
- [Motion Upgrade Guide](https://motion.dev/docs/react-upgrade-guide) - framer-motion to motion migration
- [Contentlayer Abandonment](https://www.wisp.blog/blog/contentlayer-has-been-abandoned-what-are-the-alternatives) - Why not to use Contentlayer
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) - v4 breaking changes documentation
- [Supabase SSR Docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client) - @supabase/ssr setup
- [schema-dts GitHub](https://github.com/google/schema-dts) - Google's Schema.org TypeScript types
- [Rehype Pretty Code](https://rehype-pretty.pages.dev/) - Server-side syntax highlighting
- [React Email](https://react.email/) - Email templates as React components
- [next-sitemap to built-in migration](https://mikebifulco.com/posts/migrate-from-next-sitemap-to-app-directory-sitemap) - Migration rationale
- [@vercel/og npm](https://www.npmjs.com/package/@vercel/og) - OG image generation
- [Resend npm](https://www.npmjs.com/package/resend) - Email API
- [Tailwind v3 docs](https://v3.tailwindcss.com/) - v3 documentation (still maintained)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
