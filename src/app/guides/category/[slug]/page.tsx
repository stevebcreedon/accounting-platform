import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getGuidesByCategory,
  getReadingTime,
} from '@/lib/content/queries';
import {
  getCategoryBySlug,
  getAllCategorySlugs,
} from '@/lib/content/categories';
import { ArticleCard } from '@/components/shared/article-card';
import { Breadcrumbs } from '@/components/article/breadcrumbs';

type Props = { params: { slug: string } };

export function generateMetadata({ params }: Props): Metadata {
  const category = getCategoryBySlug(params.slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/guides/category/${params.slug}` },
    openGraph: {
      title: category.name,
      description: category.description,
      type: 'website',
    },
    twitter: { card: 'summary' },
  };
}

export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const guides = getGuidesByCategory(params.slug);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-12">
        <Breadcrumbs
          categorySlug={category.slug}
          categoryName={category.name}
        />
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-4 mt-6">
          {category.name}
        </h1>
        <p className="text-body md:text-[1.125rem] text-stone-700 mb-8 max-w-2xl">
          {category.description}
        </p>

        {guides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((g) => (
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
          <div className="text-center py-12">
            <h2 className="font-heading text-h3 text-stone-500 mb-2">
              No articles yet
            </h2>
            <p className="text-sm text-stone-400">
              We&apos;re working on guides for this topic. Check back soon or
              browse other categories.
            </p>
          </div>
        )}

      </div>
    </>
  );
}
