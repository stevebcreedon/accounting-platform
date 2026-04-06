'use client';

import { useState } from 'react';
import { ArticleCard } from '@/components/shared/article-card';

export interface SerializedGuide {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  readingTime: number;
  isPillar: boolean;
}

interface FilterPillsProps {
  categories: { slug: string; name: string }[];
  allGuides: SerializedGuide[];
}

export function FilterPills({ categories, allGuides }: FilterPillsProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredGuides = activeCategory
    ? allGuides.filter((g) => g.category === activeCategory)
    : allGuides;

  const pillBase =
    'rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap transition-all duration-200';
  const pillActive = `${pillBase} bg-burnt-orange-500 text-white border-2 border-burnt-orange-500 shadow-md shadow-burnt-orange-500/20`;
  const pillInactive = `${pillBase} border-2 border-burnt-orange-200 bg-white text-stone-600 hover:bg-burnt-orange-500 hover:text-white hover:border-burnt-orange-500`;

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-2 overflow-x-auto py-3 -mx-6 px-6 md:mx-0 md:px-4 md:flex-wrap scrollbar-hide bg-burnt-orange-50/40 rounded-xl"
      >
        <button
          role="tab"
          aria-selected={activeCategory === null}
          aria-controls="guides-grid"
          className={activeCategory === null ? pillActive : pillInactive}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            role="tab"
            aria-selected={activeCategory === cat.slug}
            aria-controls="guides-grid"
            className={activeCategory === cat.slug ? pillActive : pillInactive}
            onClick={() => setActiveCategory(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id="guides-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
      >
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <ArticleCard
              key={guide.slug}
              slug={guide.slug}
              title={guide.title}
              description={guide.description}
              category={guide.category}
              categoryName={guide.categoryName}
              readingTime={guide.readingTime}
              isPillar={guide.isPillar}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
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
    </div>
  );
}
