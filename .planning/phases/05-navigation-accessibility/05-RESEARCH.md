# Phase 5: Navigation & Accessibility - Research

**Researched:** 2026-04-03
**Domain:** Responsive navigation, WCAG 2.1 AA accessibility, print styles, Next.js App Router layout patterns
**Confidence:** HIGH

## Summary

Phase 5 wraps the existing site content in a complete responsive layout shell. The scope is well-defined: a sticky header with "The Ledger" wordmark and 3 nav links, a 3-column footer with disclaimer, a full-screen mobile menu overlay, skip-to-content link, WCAG 2.1 AA compliance, and print-friendly article styles. All design tokens, components, and patterns already exist in the codebase -- this phase composes them into layout chrome.

The primary technical challenge is the client/server component boundary. The header needs `usePathname` for active link detection and the mobile menu needs `useState` for open/close state, but the root layout must remain a server component. The solution is to keep the root layout as a server component and extract `MobileMenu` and the navigation bar as client components. The footer and skip-to-content link can be pure server components.

A secondary concern is the `<main>` tag migration. Currently, every page wraps its own content in `<main className="min-h-screen bg-cream">`. Phase 5 moves `<main id="main-content">` to the root layout. Every page file must have its `<main>` wrapper removed and replaced with a plain wrapper (e.g., `<div>`). Additionally, all 9 page files that import `DisclaimerBar` must have that import and usage removed since the disclaimer moves into the footer.

**Primary recommendation:** Structure the work in 3 waves: (1) create layout components (header, footer, mobile menu, skip-to-content), (2) update root layout and migrate all pages (remove `<main>` tags and `DisclaimerBar` imports), (3) add print styles and verify accessibility.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- D-01: Header is sticky -- pinned to top on scroll. Must account for scroll-margin-top on article headings (already set to 6rem in Phase 3).
- D-02: Navigation links: Guides, Find an Accountant, About -- three main links. Contact and legal pages live in footer only.
- D-03: Logo is "The Ledger" text wordmark in Satoshi -- no image logo yet (placeholder per brand name decision D-11 from Phase 1).
- D-04: Footer uses 3-column layout + full-width disclaimer bar below. Column 1: brand name + tagline. Column 2: quick links (Guides, Find Accountant, About, Contact). Column 3: legal links (Privacy, Terms). Disclaimer bar from existing DisclaimerBar component.
- D-05: Existing DisclaimerBar component from Phase 4 moves into the footer -- remove standalone placement from individual pages.
- D-06: Mobile menu is a full-screen cream overlay -- hamburger opens immersive overlay with large nav links. Clean touch targets. Closes on link click or X button.
- D-07: Mobile breakpoint is lg (1024px) -- below this, show hamburger. Above, show desktop nav links inline.
- D-08: Skip-to-content link as first focusable element -- visually hidden until focused, jumps to #main-content.
- D-09: WCAG 2.1 AA baseline: semantic HTML landmarks, sufficient color contrast, focus indicators, aria-labels on interactive elements.
- D-10: Print stylesheet is article-focused -- hide header, footer, TOC sidebar, email CTA, related articles. Clean article body with readable font sizes.

### Claude's Discretion
- Header height and padding
- Logo wordmark sizing and weight
- Mobile overlay animation (CSS transitions vs motion library -- motion not yet installed)
- Footer tagline text
- Hamburger icon design (Lucide menu/x icons available)
- ARIA landmark specifics
- Print font sizes and margins
- Any scroll-margin-top adjustments for sticky header height

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| NAV-01 | Header with logo (placeholder), navigation links, mobile hamburger menu | Header component with wordmark, 3 desktop nav links, hamburger button. Mobile menu overlay as client component with focus trap. |
| NAV-02 | Footer with navigation, disclaimer, privacy/terms links, brand info | Footer server component with 3-column grid. DisclaimerBar integrated. Copyright line. |
| NAV-03 | Mobile-first responsive design across all pages | lg breakpoint (1024px) for desktop/mobile nav switch. Fixed header with pt-16 offset on main. 375px minimum viewport. |
| NAV-04 | Skip-to-content link and keyboard navigation support | Skip link as first focusable element in DOM. Focus trap on mobile overlay. Escape key closes overlay. |
| PERF-05 | WCAG 2.1 AA baseline: semantic HTML, color contrast, focus indicators, alt text | Semantic landmarks (header, nav, main, footer). ARIA labels on nav regions. Focus-visible styles already in globals.css. Color contrast verified in UI-SPEC. |
| PERF-06 | Print-friendly article styles (@media print) | @media print block in globals.css. Hide nav/footer/TOC. Serif fallback fonts. Page margins. URL display for external links. |

</phase_requirements>

## Standard Stack

### Core (already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 14.2.35 | App Router, layout system | Already installed. `usePathname` hook for active link detection. |
| React | 18.x | UI components | Already installed. `useState`, `useEffect`, `useCallback` for mobile menu. |
| Tailwind CSS | 3.4.x | Responsive utilities, print styles | Already installed. `lg:` breakpoint, `@media print` via `print:` prefix or raw CSS. |
| lucide-react | 1.7.0 | Menu/X icons | Already installed. `Menu` and `X` icons for hamburger. |
| clsx + tailwind-merge | 2.1.1 / 3.5.0 | Class composition | Already installed. `cn()` utility in `src/lib/utils.ts`. |

### No New Dependencies

Phase 5 requires zero new npm packages. Everything needed is already installed:
- `next/link` for navigation links
- `next/navigation` for `usePathname` (active link detection)
- `lucide-react` for `Menu` and `X` icons
- All Tailwind utilities for responsive design and print styles

The UI-SPEC specifies CSS transitions (opacity fade 150ms) for the mobile overlay -- no motion library needed. This is the correct choice since `motion` is not yet installed and a simple fade does not justify adding a 30KB dependency.

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── header.tsx          # Server component wrapper
│   │   ├── navigation.tsx      # "use client" - usePathname for active links
│   │   ├── mobile-menu.tsx     # "use client" - useState for open/close, focus trap
│   │   ├── footer.tsx          # Server component
│   │   └── skip-to-content.tsx # Server component
│   ├── article/                # Existing (unchanged)
│   ├── mdx/                    # Existing (unchanged)
│   └── shared/                 # Existing (disclaimer-bar.tsx stays but is only used by footer)
├── app/
│   ├── layout.tsx              # Updated: adds SkipToContent, Header, <main>, Footer
│   ├── globals.css             # Updated: adds @media print block
│   └── ...                     # All pages: remove <main> wrapper, remove DisclaimerBar import
└── lib/
    └── utils.ts                # Existing cn() utility (unchanged)
```

### Pattern 1: Server/Client Component Split for Navigation

**What:** The header is a server component that renders the wordmark and wraps a client component for navigation. Active link detection requires `usePathname()` which only works in client components.

**When to use:** Any time navigation needs to know the current route.

**Implementation approach:**

```typescript
// src/components/layout/header.tsx (server component)
import Link from 'next/link';
import { Navigation } from './navigation';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-cream/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        <Link href="/" className="font-heading text-h3 font-bold text-charcoal">
          The Ledger
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
```

```typescript
// src/components/layout/navigation.tsx ("use client")
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MobileMenu } from './mobile-menu';
// ... active link logic using pathname
```

**Why this split:** Keeps the header itself as a server component (no JS shipped for the wordmark/link). Only the navigation bar and mobile menu are client components. Minimizes client JS bundle.

### Pattern 2: Focus Trap for Mobile Overlay

**What:** When the mobile menu overlay is open, Tab key must cycle only through the close button and nav links. Background elements must not receive focus.

**Implementation approach:**

```typescript
// Focus trap implementation inside mobile-menu.tsx
useEffect(() => {
  if (!isOpen) return;
  
  const overlay = overlayRef.current;
  if (!overlay) return;
  
  const focusableElements = overlay.querySelectorAll<HTMLElement>(
    'a[href], button, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  // Auto-focus close button
  firstFocusable?.focus();
  
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onClose]);
```

**Why not a library:** Focus trap logic is ~25 lines. Libraries like `focus-trap-react` add complexity and bundle size for a single modal. Hand-rolling is appropriate here.

### Pattern 3: Page Migration -- Removing `<main>` Wrappers

**What:** All 9 page files currently wrap their content in `<main className="min-h-screen bg-cream">`. Since Phase 5 adds `<main id="main-content">` to the root layout, every page must remove its own `<main>` tag.

**Files requiring `<main>` tag removal:**
1. `src/app/page.tsx` (homepage)
2. `src/app/about/page.tsx`
3. `src/app/contact/page.tsx`
4. `src/app/find-accountant/page.tsx`
5. `src/app/guides/page.tsx`
6. `src/app/guides/category/[slug]/page.tsx`
7. `src/app/privacy/page.tsx`
8. `src/app/terms/page.tsx`
9. `src/app/not-found.tsx`

**Note:** The article page (`src/app/guides/[slug]/page.tsx`) uses `<article>` not `<main>`, so it does not need this change. However, it does not have a `<main>` wrapper to remove either -- it renders directly inside the root layout's `<main>`.

**Replacement strategy:** Replace `<main className="min-h-screen bg-cream">` with a plain fragment `<>` or `<div className="min-h-screen">`. The `bg-cream` is already on `<body>` in the root layout so it can be dropped. The `min-h-screen` may need to stay on the root `<main>` or on individual pages depending on footer positioning.

### Pattern 4: DisclaimerBar Migration

**What:** 9 page files import and render `DisclaimerBar`. Since it moves to the footer, all imports and usages must be removed.

**Files requiring DisclaimerBar removal:**
1. `src/app/page.tsx`
2. `src/app/about/page.tsx`
3. `src/app/contact/page.tsx`
4. `src/app/find-accountant/page.tsx`
5. `src/app/guides/page.tsx`
6. `src/app/guides/category/[slug]/page.tsx`
7. `src/app/privacy/page.tsx`
8. `src/app/terms/page.tsx`
9. `src/app/not-found.tsx`

The `disclaimer-bar.tsx` component file itself stays -- it is imported by the new Footer component.

### Anti-Patterns to Avoid

- **Making the entire header a client component:** Only the navigation needs client-side hooks. The wordmark and header container can be server-rendered.
- **Using `window.location.pathname` instead of `usePathname()`:** The Next.js hook integrates with the router and updates on client-side navigation. `window.location` does not.
- **Inline print styles in components:** All print styles belong in one `@media print` block in `globals.css`. Scattering `print:hidden` across components is harder to maintain.
- **Forgetting body scroll lock cleanup:** The mobile menu locks body scroll with `overflow: hidden`. The cleanup must run both on close AND on component unmount (user navigates while menu is open).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Active link detection | Custom URL parsing | `usePathname()` from `next/navigation` | Handles client-side navigation, SSR-safe |
| Class composition | Template literals | `cn()` utility (clsx + tailwind-merge) | Already established pattern in codebase |
| Responsive breakpoints | Custom media queries | Tailwind `lg:` prefix | Consistent with existing codebase patterns |
| Hamburger/close icons | SVG markup | `Menu` and `X` from lucide-react | Already installed, consistent icon library |

**Key insight:** This phase has no "deceptively complex" problems. The focus trap is the most involved piece of logic, and at ~25 lines it is appropriate to implement directly rather than adding a dependency.

## Common Pitfalls

### Pitfall 1: Nested `<main>` Elements
**What goes wrong:** Adding `<main id="main-content">` to root layout while page files still have their own `<main>` tags creates invalid HTML (only one `<main>` per page).
**Why it happens:** Forgetting to update all 9 page files when changing the layout structure.
**How to avoid:** The page migration (removing `<main>` wrappers and DisclaimerBar imports) MUST be done in the same task or immediately after adding the root layout `<main>`.
**Warning signs:** HTML validator errors, accessibility tools reporting multiple main landmarks.

### Pitfall 2: Fixed Header Obscuring Content
**What goes wrong:** The fixed header (64px) overlaps page content at the top. Anchor links scroll headings behind the header.
**Why it happens:** `position: fixed` removes the header from document flow.
**How to avoid:** Add `pt-16` (64px) to the `<main>` element. The existing `scroll-margin-top: 6rem` (96px) on headings already accounts for a header -- verified correct (96px - 64px = 32px breathing room). The TOC `sticky top-24` (96px) also clears the header correctly.
**Warning signs:** First section of each page hidden behind header on load.

### Pitfall 3: Body Scroll Not Restored After Navigation
**What goes wrong:** User opens mobile menu, taps a nav link (which navigates and closes menu), but `overflow: hidden` remains on body.
**Why it happens:** The component unmounts during navigation before the cleanup runs if not handled correctly.
**How to avoid:** Use a `useEffect` cleanup function that removes `overflow: hidden` from body. React's cleanup runs before unmount, which handles the navigation case.
**Warning signs:** Pages appear frozen/unscrollable after using mobile nav.

### Pitfall 4: Missing `aria-expanded` State Toggle
**What goes wrong:** Screen readers always announce the hamburger button as "collapsed" even when menu is open.
**Why it happens:** Forgetting to toggle `aria-expanded` between `"true"` and `"false"` based on menu state.
**How to avoid:** Bind `aria-expanded={isOpen}` directly to the hamburger button.
**Warning signs:** VoiceOver/NVDA testing shows incorrect state announcements.

### Pitfall 5: Print Styles Overridden by Tailwind
**What goes wrong:** `@media print` rules in globals.css don't take effect because Tailwind utility classes have higher specificity.
**Why it happens:** Tailwind utilities use single-class selectors which may not be overridden by element-based print selectors.
**How to avoid:** Use `!important` sparingly in print styles, or target specific classes (e.g., `.article-content`). Alternatively, use Tailwind's `print:` variant for simple hide/show, and raw `@media print` for typography overrides.
**Warning signs:** Elements still visible when printing, wrong fonts in printout.

## Code Examples

### Root Layout Integration

```typescript
// src/app/layout.tsx (updated)
import { SkipToContent } from '@/components/layout/skip-to-content';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${satoshi.variable}`}>
      <body className="font-body bg-cream text-charcoal antialiased">
        <SkipToContent />
        <Header />
        <main id="main-content" className="pt-16 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

### Skip-to-Content Link

```typescript
// src/components/layout/skip-to-content.tsx (server component)
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-burnt-orange-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold focus:shadow-lg"
    >
      Skip to content
    </a>
  );
}
```

### Active Link Detection

```typescript
// Inside navigation.tsx client component
const pathname = usePathname();

const NAV_LINKS = [
  { label: 'Guides', href: '/guides', match: (p: string) => p.startsWith('/guides') },
  { label: 'Find an Accountant', href: '/find-accountant', match: (p: string) => p === '/find-accountant' },
  { label: 'About', href: '/about', match: (p: string) => p === '/about' },
];

// Render with active state
{NAV_LINKS.map((link) => {
  const isActive = link.match(pathname);
  return (
    <Link
      key={link.href}
      href={link.href}
      className={cn(
        'text-sm font-bold transition-colors duration-150 py-1',
        isActive
          ? 'text-charcoal border-b-2 border-burnt-orange-500'
          : 'text-stone-600 hover:text-burnt-orange-500'
      )}
    >
      {link.label}
    </Link>
  );
})}
```

### Print Styles

```css
/* In globals.css */
@media print {
  @page {
    margin: 2cm;
  }

  body {
    background: white !important;
    color: black !important;
    font-family: Georgia, 'Times New Roman', serif !important;
    font-size: 12pt !important;
    line-height: 1.6 !important;
  }

  header, footer, nav,
  .lg\\:block.sticky,  /* TOC sidebar */
  .lg\\:hidden          /* Mobile TOC */ {
    display: none !important;
  }

  main {
    padding-top: 0 !important;
  }

  .article-content a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 10pt;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router `useRouter().pathname` | App Router `usePathname()` from `next/navigation` | Next.js 13 (2023) | Import path changed |
| `focus-trap-react` for modals | Native focus trap in ~25 lines | Ongoing | One fewer dependency |
| CSS `position: sticky` for header | CSS `position: fixed` with body padding | Persistent pattern | Fixed is more reliable for full-width sticky headers with backdrop-blur |

**No deprecated patterns in use.** All approaches are current for Next.js 14.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed |
| Config file | None |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| NAV-01 | Header renders with wordmark, 3 nav links, hamburger on mobile | manual | Visual inspection at desktop and mobile viewports | N/A |
| NAV-02 | Footer renders 3 columns, disclaimer, copyright | manual | Visual inspection | N/A |
| NAV-03 | No horizontal overflow at 375px; responsive breakpoint at 1024px | manual | Chrome DevTools responsive mode | N/A |
| NAV-04 | Skip link focuses and jumps to main; keyboard tab order correct; focus trap in overlay | manual | Tab through page with keyboard, test Escape key | N/A |
| PERF-05 | Semantic landmarks present; contrast ratios met; focus indicators visible | manual | Lighthouse accessibility audit, axe DevTools extension | N/A |
| PERF-06 | Print output hides nav/footer/TOC; shows clean article with serif fonts | manual | Ctrl+P / Cmd+P on article page | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (catches TypeScript errors, missing imports)
- **Per wave merge:** Visual inspection at 375px, 768px, 1024px, 1440px viewports
- **Phase gate:** Lighthouse accessibility score, keyboard navigation walkthrough, print preview

### Wave 0 Gaps
- No test framework installed -- all validation is manual (build + visual + keyboard + Lighthouse)
- This is acceptable for Phase 5 since all requirements are visual/interactive and not testable via unit tests

## Open Questions

1. **`min-h-screen` placement after migration**
   - What we know: Currently on each page's `<main>`. After migration, pages lose their `<main>` wrapper.
   - What's unclear: Should `min-h-screen` go on the root layout `<main>` or stay on individual page root divs?
   - Recommendation: Put `min-h-screen` on the root layout `<main>` element. This ensures the footer always sits at the bottom even on short pages (contact, 404). Individual pages don't need it.

2. **Homepage hero section top padding**
   - What we know: The homepage has a hero section that currently starts at the top of its `<main>`. With `pt-16` on the root layout `<main>`, there will be 64px before the hero.
   - What's unclear: Whether the homepage hero should sit right below the header or have additional padding.
   - Recommendation: The hero already has its own internal padding (`pt-12`). The root `pt-16` provides the header offset. Total top padding will be 64px + 48px = 112px, which is appropriate for a content page. If the hero should feel "right below the header," the hero can use negative margin or the root `<main>` padding can be handled per-page -- but the UI-SPEC does not call for this.

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/app/layout.tsx`, `src/app/globals.css`, `tailwind.config.ts`, all page files
- 05-UI-SPEC.md: Complete visual specification with exact Tailwind classes, dimensions, colors
- 05-CONTEXT.md: Locked decisions D-01 through D-10

### Secondary (MEDIUM confidence)
- Next.js 14 App Router documentation: `usePathname` hook, server/client component boundaries, root layout patterns
- WCAG 2.1 AA guidelines: semantic landmarks, focus management, color contrast ratios

### Tertiary (LOW confidence)
- None -- all findings verified against codebase and official specifications

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all packages already installed and verified in package.json
- Architecture: HIGH - patterns derived from existing codebase conventions and UI-SPEC specifications
- Pitfalls: HIGH - identified from direct codebase analysis (9 files with `<main>` tags, 9 files with DisclaimerBar)

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (stable -- no moving parts, all dependencies pinned)
