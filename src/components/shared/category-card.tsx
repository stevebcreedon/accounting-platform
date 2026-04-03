import Link from 'next/link';

interface CategoryCardProps {
  slug: string;
  name: string;
  emoji: string;
}

export function CategoryCard({ slug, name, emoji }: CategoryCardProps) {
  return (
    <Link
      href={`/guides/category/${slug}`}
      className="bg-white rounded-xl border border-stone-200 p-4 text-center hover:bg-burnt-orange-50 hover:border-burnt-orange-200 transition-colors duration-150"
    >
      <span className="text-2xl mb-2 block">{emoji}</span>
      <span className="font-heading text-sm font-bold text-charcoal">
        {name}
      </span>
    </Link>
  );
}
