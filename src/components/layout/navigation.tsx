'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileMenu } from './mobile-menu';

const NAV_LINKS = [
  {
    label: 'Guides',
    href: '/guides',
    match: (p: string) => p.startsWith('/guides'),
  },
  {
    label: 'Find an Accountant',
    href: '/find-accountant',
    match: (p: string) => p === '/find-accountant',
  },
  {
    label: 'About',
    href: '/about',
    match: (p: string) => p === '/about',
  },
];

export { NAV_LINKS };

export function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="hidden lg:flex items-center gap-8"
      >
        {NAV_LINKS.map((link) => {
          const isActive = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-bold transition-colors duration-150 py-1',
                isActive
                  ? 'text-charcoal border-b-2 border-burnt-orange-500'
                  : 'text-stone-600 hover:text-burnt-orange-500'
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <button
        className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2"
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu className="h-6 w-6 text-charcoal" />
      </button>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
