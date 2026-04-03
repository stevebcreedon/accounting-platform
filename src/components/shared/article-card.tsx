import Link from 'next/link';

interface ArticleCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  readingTime: number;
  isPillar?: boolean;
}

export function ArticleCard({
  slug,
  title,
  description,
  categoryName,
  readingTime,
  isPillar,
}: ArticleCardProps) {
  return (
    <Link
      href={`/guides/${slug}`}
      className="block bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow duration-200 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-bold px-2 py-1 rounded-full bg-burnt-orange-50 text-burnt-orange-600">
            {categoryName}
          </span>
          {isPillar && (
            <span className="text-sm font-bold px-2 py-1 rounded-full bg-burnt-orange-500 text-white">
              Comprehensive Guide
            </span>
          )}
        </div>
        <h3 className="font-heading text-body font-bold text-charcoal mt-3 mb-2">
          {title}
        </h3>
        <p className="text-sm text-stone-700 line-clamp-2">{description}</p>
        <p className="text-sm text-stone-500 mt-3">{readingTime} min read</p>
      </div>
    </Link>
  );
}
