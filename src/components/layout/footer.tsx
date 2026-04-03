import Link from 'next/link';

const QUICK_LINKS = [
  { label: 'Guides', href: '/guides' },
  { label: 'Find an Accountant', href: '/find-accountant' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export function Footer() {
  return (
    <footer className="bg-cream border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div>
            <p className="font-heading text-base font-bold text-charcoal">
              The Ledger
            </p>
            <p className="text-sm text-stone-600 mt-2">
              Clear accounting guidance for Irish business owners.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <p className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">
              EXPLORE
            </p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-600 hover:text-burnt-orange-500 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Legal */}
          <div>
            <p className="text-sm font-bold text-charcoal uppercase tracking-wider mb-4">
              LEGAL
            </p>
            <ul className="flex flex-col gap-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-600 hover:text-burnt-orange-500 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-stone-200 pt-6 mt-8">
          <p className="text-sm text-stone-500 max-w-3xl">
            The information on this site is for educational purposes only and
            does not constitute professional accounting, tax, or legal advice.
            For guidance specific to your situation, consult a qualified Irish
            accountant or tax adviser.
          </p>
        </div>

        {/* Copyright */}
        <p className="text-sm text-stone-500 mt-6">
          &copy; 2026 The Ledger. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
