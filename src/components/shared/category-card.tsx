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
      className="group bg-white rounded-xl border-2 border-burnt-orange-200 p-4 text-center hover:bg-burnt-orange-500 hover:text-white hover:border-burnt-orange-500 hover:shadow-lg hover:shadow-burnt-orange-500/20 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
    >
      <span className="text-2xl mb-2 block">{emoji}</span>
      <span className="font-heading text-sm font-bold text-charcoal group-hover:text-white">
        {name}
      </span>
    </Link>
  );
}
