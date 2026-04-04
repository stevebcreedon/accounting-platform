import type {
  Article,
  BreadcrumbList,
  Organization,
  WithContext,
} from 'schema-dts';
import type { Guide } from '@/lib/content/queries';

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://the-ledger.vercel.app';

export const BRAND_ORG = {
  '@type': 'Organization' as const,
  name: 'The Ledger',
  url: BASE_URL,
};

export function buildArticleSchema(guide: Guide): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishDate,
    ...(guide.updatedDate && { dateModified: guide.updatedDate }),
    author: BRAND_ORG,
    publisher: BRAND_ORG,
    url: `${BASE_URL}/guides/${guide.slug}`,
    wordCount: guide.metadata.wordCount,
    image: `${BASE_URL}/api/og?title=${encodeURIComponent(guide.title)}&category=${encodeURIComponent(guide.category)}`,
  };
}

export function buildBreadcrumbSchema(
  categorySlug: string,
  categoryName: string,
  articleTitle: string,
  articleSlug: string
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: `${BASE_URL}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryName,
        item: `${BASE_URL}/guides/category/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: articleTitle,
        item: `${BASE_URL}/guides/${articleSlug}`,
      },
    ],
  };
}

export function buildOrganisationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Ledger',
    url: BASE_URL,
    description:
      'Clear, jargon-free accounting guidance for Irish small businesses.',
    areaServed: {
      '@type': 'Country',
      name: 'Ireland',
      sameAs: 'https://en.wikipedia.org/wiki/Republic_of_Ireland',
    },
    // logo: `${BASE_URL}/logo.png`, // Add when logo is finalized
  };
}
