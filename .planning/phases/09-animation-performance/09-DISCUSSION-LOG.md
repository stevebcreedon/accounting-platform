# Phase 9: Animation & Performance - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-04-06
**Phase:** 09-animation-performance
**Areas discussed:** Animation style & intensity, Page transitions, Performance targets, Reading progress bar

---

## Animation Style & Intensity

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle editorial (Recommended) | Gentle fades, slight slides, minimal bounce | ✓ |
| Energetic modern | Snappier, more pronounced, spring physics | |
| You decide | | |

**User's choice:** Subtle editorial

---

| Option | Description | Selected |
|--------|-------------|----------|
| Keep CSS (Recommended) | FAQ CSS grid-rows works fine | ✓ |
| Replace with motion | AnimatePresence for consistency | |
| You decide | | |

**User's choice:** Keep CSS for FAQ accordion

## Page Transitions

| Option | Description | Selected |
|--------|-------------|----------|
| Simple fade (Recommended) | Opacity 200-300ms, zero CLS risk | ✓ |
| Fade + slide up | More dynamic, CLS risk | |
| No page transitions | Focus on reveals/micro-interactions | |
| You decide | | |

**User's choice:** Simple fade

## Performance Targets

| Option | Description | Selected |
|--------|-------------|----------|
| Text-only currently (Recommended) | No images, set up patterns for future | ✓ |
| Add article hero images | Image sourcing needed | |
| You decide | | |

**User's choice:** Text-only, set up next/image for future

## Reading Progress Bar

| Option | Description | Selected |
|--------|-------------|----------|
| Top of viewport, below header (Recommended) | Thin burnt-orange bar, left to right | ✓ |
| Inside sticky header | Integrated in header bottom edge | |
| You decide | | |

**User's choice:** Top of viewport, below header

## Claude's Discretion

- Animation durations, easing, stagger delays
- Homepage section reveal order
- Card hover specifics (scale, shadow)
- Progress bar height/opacity
- LazyMotion loading pattern

## Deferred Ideas

None
