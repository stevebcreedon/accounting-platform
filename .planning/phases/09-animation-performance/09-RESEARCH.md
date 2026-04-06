# Phase 9: Animation & Performance - Research

**Researched:** 2026-04-06
**Domain:** Motion library (v12) integration, scroll animations, Core Web Vitals optimization
**Confidence:** HIGH

## Summary

Phase 9 adds a polish layer to a fully built Next.js 14 site using the `motion` library (v12, formerly Framer Motion). The site already has all pages, components, layouts, and functionality complete through 8 prior phases. This phase wraps existing elements in animation primitives (page fade transitions, scroll reveals, hover micro-interactions, reading progress bar) while maintaining Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1, Lighthouse mobile 90+).

The motion library provides `LazyMotion` with `domAnimation` features for tree-shaking the bundle down to ~5KB initial + ~15KB async features (vs ~34KB for the full `motion` component). The `m` component (imported from `motion/react-m`) must be used inside `LazyMotion` instead of `motion.div` for proper code-splitting. Several hover interactions (cards, buttons, nav links) use pure CSS rather than the motion library, keeping those components as server components.

**Primary recommendation:** Install `motion` ^12.38, create 4 new client components (`MotionProvider`, `PageTransition`, `ScrollReveal`, `ReadingProgressBar`), modify 8 existing files with CSS hover classes and ScrollReveal wrappers, and verify Lighthouse mobile 90+ after all changes.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Animation personality is "subtle editorial" -- gentle fade-ins (200-400ms), slight upward slides (10-20px), minimal bounce. Stripe/Linear/Monocle feel.
- D-02: FAQ accordion keeps CSS grid-rows animation -- no motion library replacement.
- D-03: All animations respect prefers-reduced-motion.
- D-04: Routes use simple fade transitions -- opacity fade-out/fade-in (200-300ms).
- D-05: Site is text-only currently -- no article hero images. Set up next/image patterns for future use but no immediate optimization.
- D-06: Fonts already optimized via next/font (PERF-04 from Phase 1).
- D-07: All content pages already use SSG via generateStaticParams (PERF-02 from Phases 2-4).
- D-08: LazyMotion with domAnimation features for minimal bundle. Strict client boundary.
- D-09: Target Lighthouse mobile score 90+.
- D-10: Progress bar at top of viewport, below sticky header -- thin burnt-orange bar filling left to right on scroll. Article pages only.

### Claude's Discretion
- Exact animation durations and easing curves
- Which homepage sections get scroll reveals (hero, articles, categories, CTA)
- Stagger delay between animated elements
- Hover animation specifics (scale, shadow transition, color shift)
- Reading progress bar height and opacity
- LazyMotion loading strategy (dynamic import pattern)
- Whether to wrap motion in a reusable component or use inline

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ANIM-01 | Page transitions between routes | LazyMotion + m.div opacity fade; PageTransition wrapper component |
| ANIM-02 | Scroll-triggered reveal animations on homepage sections and article components | whileInView with viewport: { once: true, amount: 0.2 }; ScrollReveal wrapper |
| ANIM-03 | Hover state micro-interactions on cards, buttons, navigation links | Pure CSS: hover:scale-[1.02], hover:-translate-y-1, active:scale-[0.98], underline slide-in |
| ANIM-04 | LazyMotion used to minimize JS bundle | domAnimation features via dynamic import; m components not motion; ~5KB initial |
| ANIM-05 | Reading progress indicator bar on article pages | useScroll targeting article element; scaleX transform; 4px burnt-orange bar |
| ANIM-06 | Smooth accordion animation on FAQ sections | Already complete -- CSS grid-rows animation kept as-is per D-02 |
| ANIM-07 | All animations respect prefers-reduced-motion | CSS media query + useReducedMotion() hook; dual approach |
| PERF-01 | Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1 | Lighthouse audit after all motion additions; LazyMotion keeps bundle small |
| PERF-02 | SSG for all content pages | Already complete from Phases 2-4; verify generateStaticParams still works after motion wrappers |
| PERF-03 | Image optimization via next/image | No images currently; add import pattern for future use only |
| PERF-04 | Font optimization via next/font | Already complete from Phase 1; no changes needed |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack:** `motion` ^12 (import from `motion/react`, NOT `framer-motion`)
- **Next.js:** 14.2.35 (App Router) -- do NOT upgrade to 15/16
- **Tailwind:** v3.4.x -- do NOT upgrade to v4
- **React:** 18.3.1
- **No third-party tracking scripts** -- custom Supabase analytics only
- **No personal author attribution** -- brand is the authority
- **Ireland-specific** content only

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.38.0 | React animations (LazyMotion, m, useScroll, whileInView) | Industry standard, rebranded from framer-motion. Import from `motion/react` and `motion/react-m`. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | -- | -- | All hover interactions use pure CSS/Tailwind, no additional libraries needed |

**Installation:**
```bash
npm install motion@^12.38.0
```

**Version verification:** `motion` latest is 12.38.0 (verified 2026-04-06 via npm registry).

## Architecture Patterns

### New Component Structure
```
src/components/motion/
  motion-provider.tsx     # "use client" - LazyMotion wrapper with dynamic domAnimation import
  page-transition.tsx     # "use client" - m.div opacity fade for route transitions  
  scroll-reveal.tsx       # "use client" - whileInView wrapper with stagger support
  reading-progress-bar.tsx # "use client" - useScroll-based progress indicator
```

### Pattern 1: LazyMotion Provider with Dynamic Import
**What:** Wrap the app in LazyMotion with async-loaded domAnimation features to minimize initial bundle.
**When to use:** Root layout only -- single provider for the entire app.
**Example:**
```typescript
// src/components/motion/motion-provider.tsx
"use client";

import { LazyMotion } from "motion/react";

const loadFeatures = () =>
  import("motion/dom-animation").then((mod) => mod.default);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
```

**Important:** The UI-SPEC specifies `import("motion/dom-animation").then(m => m.default)` as the dynamic import path. However, based on official Motion docs, the synchronous path is `import { domAnimation } from "motion/react"`. For dynamic import, the pattern is to create a features file that re-exports domAnimation, OR use the `"motion/dom-animation"` subpath export directly. Verify the subpath works at install time -- if not, use the re-export pattern:

```typescript
// src/lib/motion-features.ts
import { domAnimation } from "motion/react";
export default domAnimation;

// Then in provider:
const loadFeatures = () => import("@/lib/motion-features").then(m => m.default);
```

**Source:** [Motion LazyMotion docs](https://motion.dev/docs/react-lazy-motion)

### Pattern 2: m Component (Not motion)
**What:** Use `m.div` instead of `motion.div` inside LazyMotion for tree-shaking.
**When to use:** All animated elements within LazyMotion scope.
**Example:**
```typescript
import * as m from "motion/react-m";

// Inside a component wrapped by LazyMotion:
<m.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.25 }}
/>
```
**Source:** [Motion LazyMotion docs](https://motion.dev/docs/react-lazy-motion)

### Pattern 3: ScrollReveal with whileInView
**What:** Scroll-triggered fade+slide animations that fire once per element.
**When to use:** Homepage sections, article page sections (key takeaways, related articles).
**Example:**
```typescript
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: prefersReducedMotion ? 0.2 : 0.4,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </m.div>
  );
}
```
**Source:** [Motion scroll animations](https://motion.dev/docs/react-scroll-animations)

### Pattern 4: useScroll for Reading Progress
**What:** Scroll-linked progress bar tracking article content scroll position.
**When to use:** Article pages only (`/guides/[slug]`).
**Example:**
```typescript
"use client";

import { useScroll, useTransform } from "motion/react";
import * as m from "motion/react-m";
import { useRef } from "react";

export function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <m.div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={0} // Would need dynamic value
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-16 left-0 right-0 z-49 h-1 bg-burnt-orange-500 origin-left"
      style={{
        scaleX: scrollYProgress,
        opacity,
      }}
    />
  );
}
```

**Note:** For tracking the `<article>` element specifically (not the full page), pass a `target` ref to `useScroll({ target: articleRef })`. This requires the article page to pass a ref down or use a wrapper approach.

**Source:** [Motion useScroll docs](https://motion.dev/docs/react-use-scroll)

### Pattern 5: Page Transition with Opacity Fade
**What:** Simple fade transition wrapping page content. No AnimatePresence needed for a basic fade.
**When to use:** Root layout wraps children.
**Example:**
```typescript
"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: "easeOut",
      }}
    >
      {children}
    </m.div>
  );
}
```

**Limitation:** Without `AnimatePresence`, there is no exit animation (no fade-out before fade-in). The UI-SPEC mentions exit: `opacity: 0` but this requires `AnimatePresence` which adds bundle size. The recommendation is to implement entrance fade only, which satisfies the "route transition feel" at minimal cost. If exit animation is critical, `AnimatePresence` from `motion/react` can be added -- but test bundle impact.

### Anti-Patterns to Avoid
- **Using `motion.div` inside LazyMotion:** This imports the full bundle (~34KB) and defeats the purpose of LazyMotion. Always use `m.div` from `motion/react-m`.
- **Making server components into client components unnecessarily:** Card hover and button press use CSS only -- do NOT convert `article-card.tsx` or `category-card.tsx` to client components.
- **Re-triggering scroll animations:** Use `viewport: { once: true }` to animate elements in once and leave them visible.
- **Animating layout-affecting properties:** Do not animate `width`, `height`, `top`, `left` etc. Use `transform` (scale, translate) and `opacity` only for zero CLS and GPU-accelerated performance.
- **Wrapping non-animated content in m components:** Only wrap elements that actually animate. Unnecessary m wrappers add overhead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll progress tracking | Custom scroll event listener + state | `useScroll` from motion | Handles RAF, cleanup, SSR, reduced motion; hardware-accelerated via ScrollTimeline API |
| Viewport detection | Custom IntersectionObserver | `whileInView` prop on m components | Built-in with motion, handles cleanup, SSR-safe, configurable amount/margin |
| Reduced motion detection | Custom matchMedia listener | `useReducedMotion()` from motion | SSR-safe, reactive, handles server/client mismatch |
| Spring physics | Custom easing functions | `useSpring` from motion (if needed) | Physically accurate, hardware-accelerated |

**Key insight:** The motion library already handles all the hard parts (SSR, cleanup, reduced motion, hardware acceleration). Every custom scroll/intersection observer would be reimplementing what motion provides out of the box.

## Common Pitfalls

### Pitfall 1: m Component Import Path
**What goes wrong:** Importing `m` from `motion/react` instead of `motion/react-m` loads the full bundle.
**Why it happens:** Documentation sometimes shows both paths; the separate `motion/react-m` entry point exists specifically for tree-shaking.
**How to avoid:** Always import `import * as m from "motion/react-m"` for the m component. Import hooks (`useScroll`, `useReducedMotion`, `LazyMotion`) from `motion/react`.
**Warning signs:** Bundle analyzer shows motion chunk > 20KB.

### Pitfall 2: CLS from Fade-In Animations
**What goes wrong:** Elements with `initial={{ opacity: 0 }}` cause CLS if they affect layout flow before animating in.
**Why it happens:** The element reserves space but is invisible; when it appears, surrounding content may shift.
**How to avoid:** All animated elements should already have their final dimensions in the DOM. The `y: 16` slide is a transform (not layout-affecting), so it does not cause CLS. Never animate `height`, `margin`, or `padding`.
**Warning signs:** CLS > 0.1 in Lighthouse after adding scroll reveals.

### Pitfall 3: LazyMotion Features Not Loading
**What goes wrong:** Animations don't work because domAnimation features failed to load asynchronously.
**Why it happens:** Incorrect dynamic import path or module resolution issue.
**How to avoid:** Test the dynamic import path works. If `import("motion/dom-animation")` fails, use a local re-export file pattern (see Architecture Pattern 1 above). There was a GitHub issue (#3091) about LazyMotion not working in early v12 -- current v12.38 should be fine but verify at install time.
**Warning signs:** Console errors about missing features, animations rendering as static.

### Pitfall 4: Client Component Boundary Proliferation
**What goes wrong:** Converting too many components to `"use client"` to add motion wrappers, breaking the server component tree.
**Why it happens:** Desire to add motion to everything instead of strategic placement.
**How to avoid:** Only 4 new files need `"use client"`. Card/button/nav hover effects use pure CSS. The `ScrollReveal` wrapper is a client component but its children remain server-rendered (passed as `children` prop). `article-card.tsx` and `category-card.tsx` stay as server components with CSS-only hover classes.
**Warning signs:** Pages that were server-rendered now show in the client bundle.

### Pitfall 5: Reading Progress Bar Z-Index Conflict
**What goes wrong:** Progress bar appears above or below the header incorrectly.
**Why it happens:** Header is `z-50`, progress bar needs to be `z-49` (below header but above content).
**How to avoid:** Use `top-16` (matching header height of 64px) and `z-[49]` for the progress bar. Verify visually that it sits directly below the header border.
**Warning signs:** Progress bar hidden behind header, or appearing above header content.

### Pitfall 6: useScroll SSR Mismatch
**What goes wrong:** Hydration error because scroll values are 0 on server but non-zero on client.
**Why it happens:** useScroll depends on browser scroll position which doesn't exist during SSR.
**How to avoid:** The `ReadingProgressBar` component must be `"use client"`. Motion's hooks are SSR-safe (they return 0 on server), but the component must be marked as client.
**Warning signs:** React hydration mismatch warnings in console.

## Code Examples

### CSS-Only Card Hover (No motion library)
```typescript
// Add to article-card.tsx and category-card.tsx className:
// Before: "transition-shadow duration-200"
// After:  "transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1"
// 
// For reduced motion, add to globals.css:
// @media (prefers-reduced-motion: reduce) { 
//   *, *::before, *::after { transition-duration: 0.01s !important; }
// }
```

### CSS-Only Nav Link Underline Slide
```css
/* Navigation link hover underline - add via Tailwind or globals.css */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #E8720C;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 200ms ease-out;
}
.nav-link:hover::after {
  transform: scaleX(1);
}
```

### Global Reduced Motion CSS
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01s !important;
    transition-duration: 0.01s !important;
  }
}
```

### Layout Integration
```typescript
// src/app/layout.tsx modification:
import { MotionProvider } from '@/components/motion/motion-provider';
import { PageTransition } from '@/components/motion/page-transition';

// In the return:
<main id="main-content" className="pt-16 min-h-screen">
  <MotionProvider>
    <PageTransition>
      {children}
    </PageTransition>
  </MotionProvider>
</main>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { motion } from "framer-motion"` | `import * as m from "motion/react-m"` | mid-2025 | New package name, new import paths |
| Full motion bundle (~34KB) | LazyMotion + m (~5KB initial) | motion v12 | Critical for Core Web Vitals on content sites |
| CSS-only animations | motion for complex, CSS for simple | ongoing | Hybrid approach minimizes bundle while enabling scroll-linked animations |
| IntersectionObserver API | whileInView prop | motion v6+ | Built-in, SSR-safe, less boilerplate |
| Custom scroll listeners | useScroll hook | motion v6+ | Hardware-accelerated via ScrollTimeline API |

## Open Questions

1. **Dynamic import path for domAnimation**
   - What we know: Official docs show `import { domAnimation } from "motion/react"` for sync import. Dynamic import pattern shown as re-export file.
   - What's unclear: Whether `import("motion/dom-animation")` works as a direct subpath export in v12.38 (UI-SPEC assumes it does).
   - Recommendation: Try `import("motion/dom-animation")` first. If it fails, use the re-export file pattern (create `src/lib/motion-features.ts`).

2. **AnimatePresence for exit animations**
   - What we know: Page fade-in works without AnimatePresence. Exit (fade-out) requires it.
   - What's unclear: Bundle impact of adding AnimatePresence. UI-SPEC Performance Contract says "No AnimatePresence if it significantly increases bundle."
   - Recommendation: Implement entrance-only fade. Add AnimatePresence only if exit animation is specifically requested and bundle stays under target.

3. **z-index 49 in Tailwind**
   - What we know: Tailwind v3 does not have a `z-49` utility class built-in.
   - What's unclear: Whether to use `z-[49]` arbitrary value or extend tailwind.config.ts.
   - Recommendation: Use `z-[49]` arbitrary value -- single-use, not worth a config extension.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/dev | Yes | 24.14.1 | -- |
| npm | Package install | Yes | 11.11.0 | -- |
| Next.js | Framework | Yes | 14.2.35 | -- |
| motion (npm) | Animations | Not installed | 12.38.0 (registry) | Install in Wave 0 |
| Lighthouse CLI | Performance verification | Check at runtime | -- | Chrome DevTools Lighthouse |

**Missing dependencies with no fallback:**
- None blocking

**Missing dependencies with fallback:**
- `motion` package not yet installed -- install step required in first plan

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | None |
| Quick run command | `npm run build` (build verification) |
| Full suite command | `npm run build && npx lighthouse http://localhost:3000 --output json --chrome-flags="--headless"` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ANIM-01 | Page transitions render | manual | Visual inspection in browser | -- |
| ANIM-02 | Scroll reveals trigger once | manual | Scroll test in browser | -- |
| ANIM-03 | Hover interactions visible | manual | Hover test in browser | -- |
| ANIM-04 | Bundle size < 15KB gzipped | build | `npm run build` (check .next output) | -- |
| ANIM-05 | Progress bar tracks scroll | manual | Scroll article page in browser | -- |
| ANIM-06 | FAQ accordion unchanged | build | `npm run build` (no regression) | -- |
| ANIM-07 | Reduced motion respected | manual | Enable reduced motion in OS, verify | -- |
| PERF-01 | Lighthouse mobile 90+ | lighthouse | Lighthouse CLI or DevTools | -- |
| PERF-02 | SSG still works | build | `npm run build` (generateStaticParams) | -- |
| PERF-03 | next/image pattern ready | build | `npm run build` | -- |
| PERF-04 | Fonts still optimized | build | `npm run build` (no regression) | -- |

### Sampling Rate
- **Per task commit:** `npm run build` (must succeed)
- **Per wave merge:** `npm run build` + visual inspection of animations
- **Phase gate:** Lighthouse mobile 90+ verified before phase completion

### Wave 0 Gaps
- [ ] `npm install motion@^12.38.0` -- motion library not yet installed
- No test framework to install -- this phase is primarily visual/performance verified via build + Lighthouse

## Sources

### Primary (HIGH confidence)
- [Motion LazyMotion docs](https://motion.dev/docs/react-lazy-motion) - LazyMotion API, m component, domAnimation features, bundle optimization
- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll) - useScroll API, scrollYProgress, target option
- [Motion scroll animations](https://motion.dev/docs/react-scroll-animations) - whileInView API, viewport options (once, amount)
- [Motion React component docs](https://motion.dev/docs/react-motion-component) - viewport prop options: once, root, margin, amount
- npm registry (motion@12.38.0) - Verified current version

### Secondary (MEDIUM confidence)
- [GitHub issue #3091](https://github.com/motiondivision/motion/issues/3091) - LazyMotion bug in early v12, likely resolved in v12.38

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - single library (motion), verified version, official docs consulted
- Architecture: HIGH - UI-SPEC is extremely prescriptive, all patterns verified against official docs
- Pitfalls: HIGH - common issues well-documented in Motion ecosystem, verified against current API

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (motion v12 is stable, unlikely to break)
