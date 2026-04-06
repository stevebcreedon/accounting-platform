import Link from 'next/link';

interface RelatedGuide {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  readingTime: number;
}

interface RelatedArticlesProps {
  guides: RelatedGuide[];
}

export function RelatedArticles({ guides }: RelatedArticlesProps) {
  if (guides.length === 0) return null;

  return (
    <section>
      <h2 className="font-heading text-h3 text-charcoal mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="block group"
          >
            <div className="relative overflow-hidden bg-white rounded-2xl border border-burnt-orange-100/60 p-8 transition-all duration-500 group-hover:border-burnt-orange-300 group-hover:shadow-[0_12px_48px_-12px_rgba(232,114,12,0.18)] group-hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-burnt-orange-400 via-burnt-orange-500 to-burnt-orange-400 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-burnt-orange-500 bg-burnt-orange-50 rounded-full px-3 py-1">
                {guide.categoryName}
              </span>
              <h3 className="font-heading text-xl font-semibold text-charcoal leading-snug group-hover:text-burnt-orange-600 transition-colors duration-300 mt-3 mb-2">
                {guide.title}
              </h3>
              <p className="text-sm text-stone-700 line-clamp-2">
                {guide.description}
              </p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-burnt-orange-300 font-medium">
                  {guide.readingTime} min read
                </p>
                <span className="text-burnt-orange-500 text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Read →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
