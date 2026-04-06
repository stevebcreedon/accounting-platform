import type { Metadata } from 'next';
import { getAllGuides, getReadingTime } from '@/lib/content/queries';
import { getCategoryBySlug, CATEGORIES } from '@/lib/content/categories';
import { FilterPills } from '@/components/shared/filter-pills';
import type { SerializedGuide } from '@/components/shared/filter-pills';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export const metadata: Metadata = {
  title: 'All Guides',
  description:
    'Browse all Irish accounting guides -- from VAT registration to choosing an accountant.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'All Guides',
    description:
      'Browse all Irish accounting guides -- from VAT registration to choosing an accountant.',
    type: 'website',
  },
  twitter: { card: 'summary' },
};

export default function GuidesPage() {
  const guides: SerializedGuide[] = getAllGuides().map((g) => ({
    slug: g.slug,
    title: g.title,
    description: g.description,
    category: g.category,
    categoryName: getCategoryBySlug(g.category)?.name ?? g.category,
    readingTime: getReadingTime(g),
    isPillar: g.isPillar,
  }));

  const categoryList = CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }));

  return (
    <>
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-burnt-orange-500 bg-burnt-orange-50 px-3 py-1 rounded-full mb-4">
            All Guides
          </span>
          <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-3">
            Accounting Guides
          </h1>
          <div className="w-12 h-1 bg-burnt-orange-500 rounded-full mb-4" />
          <p className="text-body md:text-[1.125rem] text-stone-700 mb-8 max-w-2xl">
            Expert guidance on tax, compliance, costs, and everything in between
            -- written for Irish business owners.
          </p>
          <FilterPills categories={categoryList} allGuides={guides} />
        </div>
      </ScrollReveal>
    </>
  );
}
