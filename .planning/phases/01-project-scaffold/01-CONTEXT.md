# Phase 1: Project Scaffold - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a working Next.js 14 App Router project with the platform's distinctive brand identity baked into every design token — colors, typography, spacing, prose styles. The output is a scaffolded project that `npm run dev` serves with the correct visual foundation for all subsequent phases.

</domain>

<decisions>
## Implementation Decisions

### Brand Direction
- **D-01:** Visual mood is **warm editorial** — creamy backgrounds, muted earth tones, serif/geometric accents. Reference points: Monocle magazine, Stripe Press.
- **D-02:** Primary accent color is **burnt orange/amber** — distinctive in the accounting/finance space where blue/green dominates. Trust through warmth, not corporate coldness.
- **D-03:** Background is **off-white/cream** (#FAF8F5 range) — warm paper feel, not clinical white.
- **D-04:** Headings and primary text use **charcoal/near-black** (#1C1917 range) — softer than pure black with warm undertone.

### Typography
- **D-05:** Heading font is a **modern geometric sans-serif** — Satoshi, General Sans, or Cabinet Grotto. Clean and contemporary but warm. Bridges editorial and tech.
- **D-06:** Body font is **DM Sans** — warm geometric sans-serif, slightly softer than Inter, more distinctive.
- **D-07:** Type scale is **Claude's discretion** — lean dramatic for editorial impact (larger hero titles, clear hierarchy, breathing room).

### Spacing & Layout
- **D-08:** Whitespace is **generous** — lots of breathing room between sections. Premium editorial feel. Let the cream background show.
- **D-09:** Article content width is **medium (max-w-3xl)** — slightly wider than optimal reading width to accommodate tables and wider content.
- **D-10:** Article cards use **elevated style** — white cards with subtle shadow on cream background, hover lift animation for interactivity.

### Brand Name
- **D-11:** Working brand name is **"The Ledger"** — authoritative, editorial, accounting-native. To be used in all development as the primary brand. Domain to be confirmed (.ie preferred — theledger.ie).

### Claude's Discretion
- Type scale specifics (hero sizes, heading scale, body size) — should feel dramatic and editorial
- Exact hex values for the palette — within the ranges specified (cream, burnt orange, charcoal)
- Tailwind config structure (custom theme extension vs full override)
- Font loading strategy (next/font configuration for chosen fonts)
- Any additional utility colors needed (success, error, warning states)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Specs
- `CLAUDEacc.md` — Original build spec with directory structure, component list, content system, and SEO requirements. Brand colors/fonts are OVERRIDDEN by decisions above, but structure and component requirements remain valid.
- `ClearCount-ie-Complete-Spec.docx` — Full business spec with market analysis, content bible, and phase planning. Business context is valid; brand identity is overridden.

### Research
- `.planning/research/STACK.md` — Technology recommendations including Velite, Tailwind v3.4.17, motion v12, built-in sitemap.ts
- `.planning/research/ARCHITECTURE.md` — System architecture, component boundaries, project structure
- `.planning/research/PITFALLS.md` — Critical pitfalls including Framer Motion client boundaries, GDPR concerns

### Planning
- `.planning/PROJECT.md` — Core project context and constraints
- `.planning/REQUIREMENTS.md` — FOUND-01 through FOUND-05 are this phase's requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project. No existing components, hooks, or utilities.

### Established Patterns
- None yet. This phase ESTABLISHES the patterns all subsequent phases will follow.

### Integration Points
- Root layout (app/layout.tsx) will be consumed by every page in Phases 2-10
- Tailwind config (tailwind.config.ts) defines the design system for all components
- Global CSS establishes prose typography for MDX content rendering
- Font loading in layout.tsx affects every page's rendering

</code_context>

<specifics>
## Specific Ideas

- The brand name "The Ledger" should be reflected in the placeholder logo/wordmark
- Burnt orange accent is deliberately unusual for finance — this is a strategic choice to stand out
- DM Sans body text was specifically chosen over Inter for its warmth and distinctiveness
- The elevated card style with hover lift should feel premium, not generic Material Design

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-project-scaffold*
*Context gathered: 2026-04-03*
