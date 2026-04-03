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
            className="block bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden"
          >
            <div className="p-6">
              <span className="text-sm font-bold px-2 py-1 rounded-full bg-burnt-orange-50 text-burnt-orange-600">
                {guide.categoryName}
              </span>
              <h3 className="font-heading text-body font-bold text-charcoal mt-3 mb-2">
                {guide.title}
              </h3>
              <p className="text-sm text-stone-700 line-clamp-2">
                {guide.description}
              </p>
              <p className="text-sm text-stone-500 mt-3">
                {guide.readingTime} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
