import Link from 'next/link';
import { Navigation } from './navigation';

export function Header() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-burnt-orange-100/30"
      style={{
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        backgroundColor: 'rgba(255,255,255,0.72)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-h3 font-bold text-charcoal"
        >
          The <span className="text-burnt-orange-500">Ledger</span>
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
