import Link from 'next/link';
import { Calendar, Clock, ShieldCheck } from 'lucide-react';
import { formatDate, getTaxYear } from '@/lib/utils';

interface MetaLineProps {
  publishDate: string;
  updatedDate?: string;
  readingTime: number;
  categorySlug: string;
  categoryName: string;
}

function Dot() {
  return <span className="text-stone-400 mx-2">{'\u00B7'}</span>;
}

export function MetaLine({
  publishDate,
  updatedDate,
  readingTime,
  categorySlug,
  categoryName,
}: MetaLineProps) {
  return (
    <div className="flex flex-wrap items-center gap-y-2 text-sm mb-4">
      {/* Published date */}
      <span className="flex items-center gap-1">
        <Calendar size={14} className="text-stone-500" />
        <span className="text-sm text-stone-600">{formatDate(publishDate)}</span>
      </span>

      {/* Updated date (conditional) */}
      {updatedDate && (
        <>
          <Dot />
          <span className="flex items-center gap-1">
            <span className="text-sm text-stone-600">
              Updated {formatDate(updatedDate)}
            </span>
          </span>
        </>
      )}

      <Dot />

      {/* Reading time */}
      <span className="flex items-center gap-1">
        <Clock size={14} className="text-burnt-orange-400" />
        <span className="text-sm text-burnt-orange-600">{readingTime} min read</span>
      </span>

      <Dot />

      {/* Category pill */}
      <Link
        href={`/guides/category/${categorySlug}`}
        className="text-sm font-bold px-2 py-1 rounded-full bg-burnt-orange-50 text-burnt-orange-600 hover:bg-burnt-orange-100 transition-colors"
      >
        {categoryName}
      </Link>

      {/* Verified badge (conditional) */}
      {updatedDate && (
        <>
          <Dot />
          <span className="flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-full bg-burnt-orange-50 text-burnt-orange-600">
            <ShieldCheck size={14} className="text-burnt-orange-500" />
            Verified for {getTaxYear(updatedDate)} tax year
          </span>
        </>
      )}
    </div>
  );
}
