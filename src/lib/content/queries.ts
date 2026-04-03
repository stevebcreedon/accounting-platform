import { guides } from '#site/content';

export type Guide = (typeof guides)[number];

/**
 * Check if a guide is published (publishDate <= today in UTC).
 * Uses string comparison to avoid timezone issues (Pitfall 3).
 * Velite's s.isodate() normalizes dates to ISO 8601.
 */
function isPublished(guide: Guide): boolean {
  return guide.publishDate.slice(0, 10) <= new Date().toISOString().slice(0, 10);
}

/**
 * Get all published guides, sorted by publishDate descending (newest first).
 */
export function getAllGuides(): Guide[] {
  return guides
    .filter(isPublished)
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
}

/**
 * Get a single guide by slug. Returns undefined if not found or not yet published.
 */
export function getGuideBySlug(slug: string): Guide | undefined {
  const guide = guides.find((g) => g.slug === slug);
  if (!guide || !isPublished(guide)) return undefined;
  return guide;
}

/**
 * Get all published guides in a specific category, sorted newest first.
 */
export function getGuidesByCategory(category: string): Guide[] {
  return getAllGuides().filter((g) => g.category === category);
}

/**
 * Get all available category slugs.
 */
export function getCategories(): string[] {
  return [
    'getting-started',
    'business-structures',
    'tax-obligations',
    'accounting-basics',
    'choosing-an-accountant',
    'costs-and-fees',
    'compliance-and-deadlines',
    'industry-guides',
  ];
}

/**
 * Get all published pillar guides.
 */
export function getPillarGuides(): Guide[] {
  return getAllGuides().filter((g) => g.isPillar);
}

/**
 * Get all published featured guides.
 */
export function getFeaturedGuides(): Guide[] {
  return getAllGuides().filter((g) => g.featured);
}

/**
 * Calculate reading time at 200 words per minute.
 * Uses wordCount from Velite metadata, not Velite's readingTime
 * (which may use a different WPM rate).
 */
export function getReadingTime(guide: Guide): number {
  return Math.ceil(guide.metadata.wordCount / 200);
}
