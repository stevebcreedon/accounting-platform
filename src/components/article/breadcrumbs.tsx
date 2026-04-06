import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  categorySlug: string;
  categoryName: string;
  articleTitle?: string;
}

export function Breadcrumbs({
  categorySlug,
  categoryName,
  articleTitle,
}: BreadcrumbsProps) {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Guides', href: '/guides' },
    { label: categoryName, href: `/guides/category/${categorySlug}` },
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight size={14} className="text-burnt-orange-200" aria-hidden="true" />
            )}
            <Link
              href={item.href}
              className="text-sm text-stone-600 hover:text-burnt-orange-500 transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
        {articleTitle && (
          <li className="flex items-center gap-2">
            <ChevronRight size={14} className="text-burnt-orange-200" aria-hidden="true" />
            <span
              className="text-sm text-burnt-orange-500 max-w-[200px] truncate"
              aria-current="page"
            >
              {articleTitle}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
