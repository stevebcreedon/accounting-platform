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
    <footer className="bg-white">
      {/* Orange gradient top border */}
      <div
        className="h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(232,114,12,0.3), rgba(232,114,12,0.5), rgba(232,114,12,0.3), transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1: Brand */}
          <div>
            <p className="font-heading text-base font-bold text-charcoal">
              The <span className="text-burnt-orange-500">Ledger</span>
            </p>
            <p className="text-sm text-stone-500 mt-2">
              Clear accounting guidance for Irish business owners.
            </p>
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on X"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-burnt-orange-50 text-burnt-orange-500 hover:bg-burnt-orange-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on LinkedIn"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-burnt-orange-50 text-burnt-orange-500 hover:bg-burnt-orange-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <p className="text-xs font-bold text-burnt-orange-400 uppercase tracking-widest mb-4">
              Explore
            </p>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-stone-500 hover:text-burnt-orange-500 transition-colors duration-150"
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
            <p className="text-xs font-bold text-burnt-orange-400 uppercase tracking-widest mb-4">
              Legal
            </p>
            <ul className="flex flex-col gap-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-500 hover:text-burnt-orange-500 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Subscribe */}
          <div>
            <p className="text-xs font-bold text-burnt-orange-400 uppercase tracking-widest mb-4">
              Stay Updated
            </p>
            <p className="text-sm text-stone-500">
              Get Irish accounting tips delivered to your inbox.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-burnt-orange-100/50 pt-6 mt-8">
          <p className="text-sm text-stone-400 max-w-3xl">
            The information on this site is for educational purposes only and
            does not constitute professional accounting, tax, or legal advice.
            For guidance specific to your situation, consult a qualified Irish
            accountant or tax adviser.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6">
          <p className="text-sm text-stone-300">
            &copy; 2026 The Ledger. All rights reserved.
          </p>
          <p className="text-sm text-stone-300 mt-1 sm:mt-0">
            Made in Ireland &#127470;&#127466;
          </p>
        </div>
      </div>
    </footer>
  );
}
