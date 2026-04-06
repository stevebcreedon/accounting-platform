import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllGuides, getReadingTime } from '@/lib/content/queries';
import { getCategoryBySlug, CATEGORIES } from '@/lib/content/categories';
import { ArticleCard } from '@/components/shared/article-card';
import { CategoryCard } from '@/components/shared/category-card';
import { EmailCapture } from '@/components/email-capture';
import { JsonLd } from '@/components/seo/json-ld';
import { buildOrganisationSchema } from '@/lib/seo/schemas';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { type: 'website' },
  twitter: { card: 'summary' },
};

export default function Home() {
  const latestGuides = getAllGuides().slice(0, 6);

  const orgSchema = buildOrganisationSchema();

  return (
    <>
      <JsonLd data={orgSchema} />
      {/* Hero */}
      <ScrollReveal>
        <section className="max-w-3xl mx-auto text-center py-18 px-6 md:px-8">
          <h1 className="font-heading text-h1 md:text-[3rem] lg:text-[3.5rem] text-charcoal leading-[1.1]">
            The Ledger
          </h1>
          <p className="font-body text-body md:text-[1.25rem] text-stone-700 max-w-2xl mx-auto mt-6">
            Clear, jargon-free accounting guidance for Irish sole traders, company
            directors, and startup founders.
          </p>
          <Link
            href="/guides"
            className="text-burnt-orange-500 hover:text-burnt-orange-600 font-body text-body font-bold inline-flex items-center gap-2 mt-8"
          >
            Browse all guides <ArrowRight size={16} />
          </Link>
          <div className="h-px bg-stone-200 max-w-xs mx-auto mt-12" />
        </section>
      </ScrollReveal>

      {/* Latest Guides */}
      <ScrollReveal delay={0.1}>
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <h2 className="font-heading text-h2 text-charcoal mb-8">
            Latest Guides
          </h2>
          {latestGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestGuides.map((g) => (
                <ArticleCard
                  key={g.slug}
                  slug={g.slug}
                  title={g.title}
                  description={g.description}
                  category={g.category}
                  categoryName={
                    getCategoryBySlug(g.category)?.name ?? g.category
                  }
                  readingTime={getReadingTime(g)}
                  isPillar={g.isPillar}
                />
              ))}
            </div>
          ) : (
            <p className="text-base text-stone-500">
              Guides coming soon -- expert accounting content for Irish business
              owners.
            </p>
          )}
        </section>
      </ScrollReveal>

      {/* Browse by Topic */}
      <ScrollReveal delay={0.1}>
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-12">
          <h2 className="font-heading text-h2 text-charcoal mb-8">
            Browse by Topic
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((c) => (
              <CategoryCard
                key={c.slug}
                slug={c.slug}
                name={c.name}
                emoji={c.emoji}
              />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Email CTA */}
      <ScrollReveal delay={0.1}>
        <section className="max-w-article mx-auto px-6 md:px-8 py-12">
          <EmailCapture source="homepage" />
        </section>
      </ScrollReveal>

    </>
  );
}
