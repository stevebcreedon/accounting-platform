import type { MetadataRoute } from 'next';
import { getAllGuides } from '@/lib/content/queries';
import { getAllCategorySlugs } from '@/lib/content/categories';

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://the-ledger.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const guides = getAllGuides().map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: guide.updatedDate || guide.publishDate,
    changeFrequency: 'monthly' as const,
    priority: guide.isPillar ? 0.9 : 0.7,
  }));

  const categories = getAllCategorySlugs().map((slug) => ({
    url: `${BASE_URL}/guides/category/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      priority: 1.0,
      changeFrequency: 'daily',
      lastModified: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/guides`,
      priority: 0.8,
      changeFrequency: 'daily',
      lastModified: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/find-accountant`,
      priority: 0.6,
      changeFrequency: 'monthly',
      lastModified: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/about`,
      priority: 0.5,
      changeFrequency: 'monthly',
      lastModified: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/contact`,
      priority: 0.4,
      changeFrequency: 'monthly',
      lastModified: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/privacy`,
      priority: 0.2,
      changeFrequency: 'yearly',
      lastModified: new Date().toISOString(),
    },
    {
      url: `${BASE_URL}/terms`,
      priority: 0.2,
      changeFrequency: 'yearly',
      lastModified: new Date().toISOString(),
    },
  ];

  return [...staticPages, ...guides, ...categories];
}
