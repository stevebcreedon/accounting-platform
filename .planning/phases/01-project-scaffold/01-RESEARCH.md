# Phase 1: Project Scaffold - Research

**Researched:** 2026-04-03
**Domain:** Next.js 14 project initialization, Tailwind CSS design system, custom typography, brand identity
**Confidence:** HIGH

## Summary

Phase 1 is a greenfield Next.js 14 App Router scaffold with a distinctive "warm editorial" brand identity. The core work is: (1) initialize the project with create-next-app@14, (2) configure Tailwind v3 with a custom design token system (cream backgrounds, burnt orange accents, charcoal text), (3) load two fonts -- DM Sans (body, via next/font/google) and Satoshi (headings, via next/font/local from Fontshare), and (4) set up @tailwindcss/typography with custom prose overrides for future MDX article content.

The technical risk is LOW. All technologies are mature and well-documented. The main complexity is font loading (Satoshi is not a Google Font so requires local font files) and getting the Tailwind typography prose styles right for the editorial feel. The brand direction is locked: warm editorial, burnt orange accent, cream backgrounds, "The Ledger" as working brand name.

**Primary recommendation:** Use `create-next-app@14` with `--app --typescript --tailwind --eslint --src-dir` flags, then layer on the custom design system through tailwind.config.ts theme extension and global CSS prose overrides.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Visual mood is **warm editorial** -- creamy backgrounds, muted earth tones, serif/geometric accents. Reference points: Monocle magazine, Stripe Press.
- **D-02:** Primary accent color is **burnt orange/amber** -- distinctive in the accounting/finance space where blue/green dominates.
- **D-03:** Background is **off-white/cream** (#FAF8F5 range) -- warm paper feel, not clinical white.
- **D-04:** Headings and primary text use **charcoal/near-black** (#1C1917 range) -- softer than pure black with warm undertone.
- **D-05:** Heading font is a **modern geometric sans-serif** -- Satoshi, General Sans, or Cabinet Grotto.
- **D-06:** Body font is **DM Sans** -- warm geometric sans-serif, slightly softer than Inter, more distinctive.
- **D-07:** Type scale is Claude's discretion -- lean dramatic for editorial impact.
- **D-08:** Whitespace is **generous** -- lots of breathing room between sections.
- **D-09:** Article content width is **medium (max-w-3xl)** -- slightly wider than optimal reading width.
- **D-10:** Article cards use **elevated style** -- white cards with subtle shadow on cream background, hover lift.
- **D-11:** Working brand name is **"The Ledger"** -- authoritative, editorial, accounting-native.

### Claude's Discretion
- Type scale specifics (hero sizes, heading scale, body size) -- should feel dramatic and editorial
- Exact hex values for the palette -- within the ranges specified (cream, burnt orange, charcoal)
- Tailwind config structure (custom theme extension vs full override)
- Font loading strategy (next/font configuration for chosen fonts)
- Any additional utility colors needed (success, error, warning states)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Next.js 14 App Router project initialized with TypeScript, Tailwind v3.4.x, and correct folder structure | create-next-app@14 with --app --typescript --tailwind --eslint flags; verified v14.2.35 available |
| FOUND-02 | Tailwind config extended with custom brand colour palette, typography scale, and design tokens | Tailwind v3.4.19 theme.extend pattern with custom colors, fontSize, spacing; typography plugin prose overrides |
| FOUND-03 | Root layout with font loaded via next/font, responsive meta viewport, and favicon | DM Sans via next/font/google, Satoshi via next/font/local; CSS variable approach for Tailwind integration |
| FOUND-04 | Brand identity system: fresh, distinctive palette, minimal/sleek/interactive direction | Locked decisions D-01 through D-11 define the brand; burnt orange + cream + charcoal palette |
| FOUND-05 | Global CSS with prose typography overrides for article content | @tailwindcss/typography v0.5.19 with custom prose theme overrides in tailwind.config.ts |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Stack locked:** Next.js 14 (App Router), TypeScript, Tailwind CSS v3, MDX, Supabase, Vercel, Resend
- **No Tailwind v4:** Explicitly forbidden. Use v3.4.x only.
- **No ESLint 9:** Stick with v8.x (flat config not supported by Next.js 14)
- **Pin Next.js to ^14.2.25:** Do not upgrade to 15/16
- **React 18.x only:** React 19 requires Next.js 15+
- **TypeScript ~5.5:** Avoid 5.7+ which may have peer dep issues with Next 14
- **Use `motion` not `framer-motion`:** But animation is Phase 9, not relevant here
- **Brand is the authority:** No personal author attribution
- **Ireland only:** Republic of Ireland, no UK/NI content
- **GDPR required:** Double opt-in, explicit consent (relevant for later phases, not scaffold)
- **Custom Supabase analytics only:** No third-party tracking scripts
- **Note on FOUND-03:** CLAUDE.md says "Inter font" but CONTEXT.md decisions override this to DM Sans (body) and Satoshi (headings). CONTEXT.md decisions take precedence as they are more recent and explicit.

## Standard Stack

### Core (Phase 1 Only)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 14.2.35 | App Router, SSG framework | Latest 14.x patch. Pinned to ^14.2.25 per project constraints. |
| react / react-dom | ^18 | UI library | Next.js 14 peer dependency. |
| typescript | ~5.5.4 | Type safety | Matches Next.js 14 bundled TS support. |
| tailwindcss | 3.4.19 | Utility-first CSS | Latest v3 release. Pinned to ^3.4.17 per constraints. |
| @tailwindcss/typography | 0.5.19 | Prose styling for MDX content | `prose` classes for article body. Critical for editorial typography. |
| clsx | 2.1.1 | Conditional class names | 234 bytes. Used in cn() utility. |
| tailwind-merge | 3.5.0 | Class conflict resolution | Resolves Tailwind class precedence when composing. |
| postcss | 8.5.8 | CSS processing | Required by Tailwind v3. |
| autoprefixer | 10.4.27 | Vendor prefixes | Required by Tailwind v3 PostCSS setup. |

### Dev Tooling
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| eslint | 8.57.1 | Linting | Included by create-next-app. Use v8 only. |
| eslint-config-next | (bundled) | Next.js ESLint rules | Comes with create-next-app. |
| prettier | 3.8.1 | Code formatting | Consistent style. |
| prettier-plugin-tailwindcss | 0.7.2 | Tailwind class sorting | Auto-sorts utility classes. |

### Not Needed in Phase 1
| Library | Phase | Why Deferred |
|---------|-------|-------------|
| velite | Phase 2 | Content pipeline not needed until MDX articles exist |
| @supabase/supabase-js | Phase 7+ | No database operations in scaffold |
| motion | Phase 9 | Animations deferred per roadmap |
| resend | Phase 7 | Email system not in scaffold |
| schema-dts | Phase 6 | SEO/structured data comes later |

**Installation (Phase 1):**
```bash
# Initialize project
npx create-next-app@14 . --app --typescript --tailwind --eslint --src-dir --import-alias "@/*"

# Add Phase 1 dependencies
npm install @tailwindcss/typography clsx tailwind-merge

# Add dev dependencies
npm install -D prettier prettier-plugin-tailwindcss
```

## Architecture Patterns

### Recommended Project Structure (Phase 1)
```
src/
  app/
    layout.tsx           # Root layout: fonts, metadata, global providers
    page.tsx             # Landing page (styled placeholder with brand identity)
    globals.css          # Tailwind directives + prose overrides + CSS variables
    favicon.ico          # Placeholder favicon
  lib/
    utils.ts             # cn() utility function
  components/            # Empty — ready for Phase 2+
public/
  fonts/
    Satoshi-Variable.woff2    # Local font file (Fontshare)
    Satoshi-VariableItalic.woff2
tailwind.config.ts       # Extended with brand design tokens
postcss.config.mjs       # PostCSS with Tailwind + autoprefixer
next.config.mjs          # Minimal Next.js config
tsconfig.json            # TypeScript config (create-next-app default)
.prettierrc              # Prettier config with Tailwind plugin
.eslintrc.json           # ESLint config (create-next-app default)
package.json
```

### Pattern 1: Font Loading with CSS Variables

**What:** Load DM Sans (Google) and Satoshi (local) via next/font, expose as CSS variables for Tailwind consumption.

**When to use:** Always. This is the standard Next.js 14 font optimization pattern.

**Example:**
```typescript
// src/app/layout.tsx
import { DM_Sans } from 'next/font/google';
import localFont from 'next/font/local';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Variable.woff2',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Satoshi-VariableItalic.woff2',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${satoshi.variable}`}>
      <body className="font-body bg-cream text-charcoal antialiased">
        {children}
      </body>
    </html>
  );
}
```

```typescript
// tailwind.config.ts — fontFamily section
fontFamily: {
  body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
  heading: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
},
```

### Pattern 2: cn() Utility Function

**What:** Combine clsx and tailwind-merge for conditional, conflict-free class names.

**When to use:** Every component that accepts className prop or has conditional styling.

**Example:**
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Pattern 3: Tailwind Design Token Extension

**What:** Extend (not replace) the default Tailwind theme with brand-specific design tokens via theme.extend.

**When to use:** Always for this project. Extension preserves defaults while adding brand layer.

**Example:**
```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        charcoal: '#1C1917',
        'burnt-orange': {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#E8720C',   // Primary accent
          600: '#C2590A',
          700: '#9A3412',
          800: '#7C2D12',
          900: '#431407',
        },
        slate: {
          // Extend with warm-tinted variants for body text
          600: '#57534E',   // Secondary text (stone-600)
          700: '#44403C',   // Body text (stone-700)
        },
      },
      fontFamily: {
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-satoshi)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Dramatic editorial scale
        'display': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }],
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'sm': ['0.875rem', { lineHeight: '1.6' }],
        'xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        // Generous editorial spacing
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'article': '48rem', // max-w-3xl equivalent for article content
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

### Pattern 4: Prose Typography Overrides

**What:** Customize @tailwindcss/typography prose styles to match the warm editorial brand.

**When to use:** In tailwind.config.ts for article content styling, and in globals.css for fine-tuning.

**Example (in tailwind.config.ts theme.extend):**
```typescript
typography: {
  DEFAULT: {
    css: {
      '--tw-prose-body': '#44403C',        // stone-700 warm body
      '--tw-prose-headings': '#1C1917',    // charcoal
      '--tw-prose-links': '#E8720C',       // burnt-orange-500
      '--tw-prose-bold': '#1C1917',
      '--tw-prose-counters': '#57534E',
      '--tw-prose-bullets': '#57534E',
      '--tw-prose-hr': '#E7E5E4',
      '--tw-prose-quotes': '#1C1917',
      '--tw-prose-quote-borders': '#E8720C',
      '--tw-prose-code': '#1C1917',
      '--tw-prose-th-borders': '#D6D3D1',
      '--tw-prose-td-borders': '#E7E5E4',
      maxWidth: '48rem',
      h1: { fontFamily: 'var(--font-satoshi)' },
      h2: { fontFamily: 'var(--font-satoshi)' },
      h3: { fontFamily: 'var(--font-satoshi)' },
      h4: { fontFamily: 'var(--font-satoshi)' },
      a: {
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        '&:hover': { color: '#C2590A' },   // burnt-orange-600
      },
    },
  },
},
```

### Anti-Patterns to Avoid
- **Overriding Tailwind defaults instead of extending:** Use `theme.extend`, not bare `theme`. Overriding removes all default utilities.
- **Loading fonts via CSS @import:** Bypasses Next.js font optimization. Always use next/font.
- **Using Inter for body text:** CONTEXT.md explicitly chose DM Sans over Inter. The REQUIREMENTS.md says "Inter" but CONTEXT.md decisions override this.
- **Installing Phase 2+ dependencies now:** Keep Phase 1 minimal. Velite, Supabase, Resend, motion are all deferred.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class name merging | Manual template literals | cn() with clsx + tailwind-merge | Handles conditional classes and Tailwind specificity conflicts |
| Font loading | CSS @font-face manually | next/font/google + next/font/local | Automatic optimization, preloading, no layout shift |
| Prose article styling | Manual CSS for article content | @tailwindcss/typography | Handles headings, lists, tables, blockquotes, code -- hundreds of edge cases |
| CSS variable plumbing | Hardcoded font names in Tailwind | CSS variable pattern with next/font | Enables font swap/testing without config changes |

## Common Pitfalls

### Pitfall 1: Satoshi Font Not Available via Google Fonts
**What goes wrong:** Developer tries `import { Satoshi } from 'next/font/google'` and gets an error.
**Why it happens:** Satoshi is an Indian Type Foundry font distributed via Fontshare, not Google Fonts.
**How to avoid:** Download Satoshi woff2 files from fontshare.com, place in public/fonts/, use `next/font/local`.
**Warning signs:** Build error mentioning font not found in Google Fonts manifest.

### Pitfall 2: Font CSS Variables Not Reaching Tailwind
**What goes wrong:** Font classes like `font-heading` don't apply the correct font.
**Why it happens:** The CSS variable (e.g., `--font-satoshi`) is set on the `<html>` element via className but the Tailwind config references it incorrectly.
**How to avoid:** Ensure the variable name in `next/font` config `variable` prop matches exactly what tailwind.config.ts references in `fontFamily`. Apply both variable classes to `<html>`.
**Warning signs:** Font inspector shows system font instead of custom font.

### Pitfall 3: Tailwind Typography Plugin Overriding Custom Fonts
**What goes wrong:** Prose content uses the default sans-serif/serif instead of Satoshi for headings.
**Why it happens:** @tailwindcss/typography sets its own font-family on headings. Custom fontFamily in the prose config is needed.
**How to avoid:** Set `h1`, `h2`, `h3`, `h4` fontFamily explicitly in the typography plugin config (see Pattern 4 above).
**Warning signs:** Article headings render in Inter/system font instead of Satoshi.

### Pitfall 4: create-next-app Overwrites Existing Files
**What goes wrong:** Running create-next-app in a directory with existing files (like .planning/) fails or overwrites.
**Why it happens:** create-next-app expects an empty or non-existent directory.
**How to avoid:** Either (a) run in a temp directory and move files, or (b) manually initialize with `npm init` and install dependencies. Option (a) is recommended -- scaffold in temp, copy generated files into project root, preserving .planning/ and other existing files.
**Warning signs:** Error about directory not being empty.

### Pitfall 5: DM Sans Variable Font Weight Range
**What goes wrong:** Font renders but weight variations don't work.
**Why it happens:** DM Sans on Google Fonts is a variable font but next/font needs explicit weight values specified.
**How to avoid:** Specify weights array: `['400', '500', '600', '700']` in the DM_Sans config.
**Warning signs:** All text renders at the same weight regardless of font-weight CSS.

## Code Examples

### Global CSS (src/app/globals.css)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  /* Smooth scrolling for anchor links */
  html {
    scroll-behavior: smooth;
  }

  /* Selection color matching brand */
  ::selection {
    background-color: rgba(232, 114, 12, 0.15);
    color: #1C1917;
  }

  /* Focus visible for accessibility */
  :focus-visible {
    outline: 2px solid #E8720C;
    outline-offset: 2px;
  }
}

@layer components {
  /* Article content wrapper */
  .article-content {
    @apply prose prose-lg max-w-article mx-auto;
    @apply prose-headings:font-heading;
    @apply prose-a:text-burnt-orange-500 prose-a:underline-offset-2;
    @apply prose-blockquote:border-burnt-orange-500;
  }
}
```

### Root Layout Metadata
```typescript
// src/app/layout.tsx — metadata export
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'The Ledger — Irish Accounting Guidance',
    template: '%s | The Ledger',
  },
  description: 'Clear, jargon-free accounting guidance for Irish small businesses, sole traders, and company directors.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF8F5',
};
```

### Placeholder Landing Page
```typescript
// src/app/page.tsx — minimal branded page to verify scaffold
export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="mx-auto max-w-article px-6 py-30">
        <h1 className="font-heading text-hero text-charcoal mb-6">
          The Ledger
        </h1>
        <p className="font-body text-body-lg text-stone-700 max-w-2xl">
          Clear, jargon-free accounting guidance for Irish small businesses.
        </p>
      </div>
    </main>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @next/font (separate package) | next/font (built-in) | Next.js 13.2+ | Import from 'next/font/google' or 'next/font/local' directly |
| Pages Router _app.tsx font loading | App Router layout.tsx with CSS variables | Next.js 13+ | Fonts go in root layout, applied via className on html element |
| tailwind.config.js (JavaScript) | tailwind.config.ts (TypeScript) | Tailwind v3.3+ | Type-safe config with Config type import |
| @tailwindcss/typography v0.4 | v0.5.x | 2022 | CSS variable-based theming, easier customization |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 14 | Yes | v24.14.1 | -- |
| npm | Package management | Yes | 11.11.0 | -- |
| npx | create-next-app | Yes | 11.11.0 | -- |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

Note: Node.js v24.14.1 is well above Next.js 14's minimum requirement (v18.17.0). No issues expected.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None yet -- greenfield project |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (type-check + build verification) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | Project builds successfully with Next.js 14 + TypeScript + Tailwind | smoke | `npm run build` | N/A (build system) |
| FOUND-02 | Tailwind config has custom colors, fontSize, fontFamily tokens | manual | Visual inspection of dev server | N/A |
| FOUND-03 | Root layout loads DM Sans + Satoshi fonts, has viewport meta | smoke | `npm run build` (will fail if font files missing) | N/A |
| FOUND-04 | Brand palette renders correctly (cream bg, charcoal text, orange accent) | manual | Visual inspection | N/A |
| FOUND-05 | Prose typography renders with correct fonts and colors | manual | Visual inspection of placeholder content | N/A |

### Sampling Rate
- **Per task commit:** `npm run build && npm run lint`
- **Per wave merge:** `npm run build && npm run lint`
- **Phase gate:** Build succeeds, dev server renders branded page, lint passes

### Wave 0 Gaps
- [ ] Prettier config (.prettierrc) with tailwind plugin
- [ ] No unit test framework needed for Phase 1 -- this is a scaffold phase verified by build success and visual inspection
- [ ] Satoshi font files must be downloaded from fontshare.com before font loading can work

## Open Questions

1. **Satoshi vs General Sans vs Cabinet Grotesk**
   - What we know: User listed three options (D-05). Satoshi is free from Fontshare with commercial license. General Sans is also from Fontshare. Cabinet Grotesk is from Fontshare too.
   - What's unclear: Which specific geometric sans-serif the user prefers most.
   - Recommendation: Use **Satoshi** -- it is the most distinctive of the three, has excellent variable font support, and has the "Swiss modernist meets warm geometric" character that fits the editorial direction. It is listed first in the user's options. If the user prefers another, the font swap is trivial (replace woff2 files + update config).

2. **Existing files in project root**
   - What we know: The project root has CLAUDE.md, CLAUDEacc.md, ClearCount-ie-Complete-Spec.docx, and the .planning/ directory.
   - What's unclear: Whether create-next-app will cleanly handle a non-empty directory.
   - Recommendation: Scaffold into a temporary directory, then copy generated files into the project root. This preserves all existing planning artifacts safely.

## Sources

### Primary (HIGH confidence)
- npm registry -- verified versions: next@14.2.35, tailwindcss@3.4.19, @tailwindcss/typography@0.5.19, clsx@2.1.1, tailwind-merge@3.5.0, prettier@3.8.1, prettier-plugin-tailwindcss@0.7.2
- [Next.js Font Optimization docs](https://nextjs.org/docs/14/app/building-your-application/optimizing/fonts) -- next/font/google and next/font/local patterns
- [DM Sans on Google Fonts](https://fonts.google.com/specimen/DM+Sans) -- confirmed available via next/font/google
- [Satoshi on Fontshare](https://www.fontshare.com/fonts/satoshi) -- free for commercial use, WOFF2 available
- [Tailwind CSS Typography GitHub](https://github.com/tailwindlabs/tailwindcss-typography) -- prose customization patterns

### Secondary (MEDIUM confidence)
- WebSearch verified create-next-app@14 flags and behavior
- CLAUDEacc.md build spec -- directory structure reference (brand identity overridden by CONTEXT.md)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified on npm registry with exact versions
- Architecture: HIGH -- standard Next.js 14 App Router patterns, well-documented
- Pitfalls: HIGH -- font loading gotchas are well-known, create-next-app behavior verified

**Research date:** 2026-04-03
**Valid until:** 2026-05-03 (30 days -- stable technologies, unlikely to change)
