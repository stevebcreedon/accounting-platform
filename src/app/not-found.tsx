import Link from 'next/link';
import { Home } from 'lucide-react';
import { CATEGORIES } from '@/lib/content/categories';

export default function NotFound() {
  return (
    <>
      <div className="max-w-article mx-auto px-6 md:px-8 py-18 text-center">
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-4">
          Page Not Found
        </h1>
        <p className="text-body md:text-[1.125rem] text-stone-700 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="text-burnt-orange-500 hover:text-burnt-orange-600 font-bold inline-flex items-center gap-2"
        >
          <Home size={16} />
          Back to homepage
        </Link>

        <div className="mt-12">
          <p className="text-body font-bold text-charcoal mb-4">
            Or browse by topic:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/guides/category/${c.slug}`}
                className="rounded-full px-4 py-2 text-sm font-bold border border-stone-200 bg-white text-charcoal hover:bg-burnt-orange-50 hover:border-burnt-orange-200 transition-colors duration-150"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </>
  );
}
