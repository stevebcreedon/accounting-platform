import Link from 'next/link';
import { Navigation } from './navigation';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-cream/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-h3 font-bold text-charcoal"
        >
          The Ledger
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
