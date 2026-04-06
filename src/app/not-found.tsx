import Link from 'next/link';
import { Home } from 'lucide-react';
import { CATEGORIES } from '@/lib/content/categories';

export default function NotFound() {
  return (
    <>
      <div className="max-w-article mx-auto px-6 md:px-8 py-18 text-center">
        <p className="font-heading text-[6rem] md:text-[8rem] font-bold text-burnt-orange-500 leading-none mb-2">
          404
        </p>
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-4">
          Page Not Found
        </h1>
        <p className="text-body md:text-[1.125rem] text-stone-700 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-burnt-orange-500 text-white font-bold px-6 py-3 rounded-full hover:bg-burnt-orange-600 transition-colors duration-150"
        >
          <Home size={16} />
          Back to homepage
        </Link>

        <div className="mt-14">
          <p className="text-body font-bold text-charcoal mb-4">
            Or browse by topic:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/guides/category/${c.slug}`}
                className="rounded-full px-4 py-2 text-sm font-bold border border-burnt-orange-200 bg-white text-charcoal hover:bg-burnt-orange-500 hover:text-white hover:border-burnt-orange-500 transition-colors duration-150"
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
