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
      className="block group"
    >
      <div className="relative overflow-hidden bg-white rounded-2xl border border-burnt-orange-100/60 p-8 transition-all duration-500 group-hover:border-burnt-orange-300 group-hover:shadow-[0_12px_48px_-12px_rgba(232,114,12,0.18)] group-hover:-translate-y-1">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-burnt-orange-400 via-burnt-orange-500 to-burnt-orange-400 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-burnt-orange-500 bg-burnt-orange-50 rounded-full px-3 py-1">
            {categoryName}
          </span>
          {isPillar && (
            <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-burnt-orange-500 rounded-full px-3 py-1">
              Comprehensive Guide
            </span>
          )}
        </div>
        <h3 className="font-heading text-xl font-semibold text-charcoal leading-snug group-hover:text-burnt-orange-600 transition-colors duration-300 mt-3 mb-2">
          {title}
        </h3>
        <p className="text-sm text-stone-700 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-burnt-orange-300 font-medium">{readingTime} min read</p>
          <span className="text-burnt-orange-500 text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">Read →</span>
        </div>
      </div>
    </Link>
  );
}
