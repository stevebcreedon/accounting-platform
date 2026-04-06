import { MapPin, Search, Star } from 'lucide-react';
import { EmailCapture } from '@/components/email-capture';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find an Accountant in Ireland',
  description:
    "Search Ireland's most comprehensive accountant directory by location, specialisation, and reviews. Coming soon.",
  alternates: { canonical: '/find-accountant' },
  openGraph: {
    title: 'Find an Accountant in Ireland',
    description:
      "Search Ireland's most comprehensive accountant directory by location, specialisation, and reviews. Coming soon.",
    type: 'website',
  },
  twitter: { card: 'summary' },
};

export default function FindAccountantPage() {
  return (
    <>
      {/* Hero with warm gradient */}
      <div className="bg-gradient-to-b from-burnt-orange-50/60 to-white">
        <div className="max-w-4xl mx-auto text-center pt-20 pb-16 px-6 md:px-8">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-burnt-orange-500 bg-white/80 border border-burnt-orange-200 px-4 py-1.5 rounded-full mb-6">
            Coming Soon
          </span>
          <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal">
            Find an Accountant in Ireland
          </h1>
          <div className="w-12 h-1 bg-burnt-orange-500 rounded-full mx-auto mt-4 mb-6" />
          <p className="text-body md:text-[1.125rem] text-stone-700 max-w-2xl mx-auto">
            We&apos;re building Ireland&apos;s most comprehensive accountant
            directory. Search by location, specialisation, and reviews to find the
            right accountant for your business.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 pb-18">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-burnt-orange-100/60 p-8 text-center transition-shadow duration-200 hover:shadow-lg hover:shadow-burnt-orange-100/40">
            <MapPin size={32} className="mx-auto text-burnt-orange-500 mb-3" />
            <h3 className="font-heading text-body font-bold text-charcoal mb-2">
              Search by Location
            </h3>
            <p className="text-sm text-stone-700">
              Find accountants in your county — Dublin, Cork, Galway, and all 26
              counties.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-burnt-orange-100/60 p-8 text-center transition-shadow duration-200 hover:shadow-lg hover:shadow-burnt-orange-100/40">
            <Search size={32} className="mx-auto text-burnt-orange-500 mb-3" />
            <h3 className="font-heading text-body font-bold text-charcoal mb-2">
              Filter by Specialisation
            </h3>
            <p className="text-sm text-stone-700">
              Tax planning, bookkeeping, company formation, payroll, and more.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-burnt-orange-100/60 p-8 text-center transition-shadow duration-200 hover:shadow-lg hover:shadow-burnt-orange-100/40">
            <Star size={32} className="mx-auto text-burnt-orange-500 mb-3" />
            <h3 className="font-heading text-body font-bold text-charcoal mb-2">
              Verified Reviews
            </h3>
            <p className="text-sm text-stone-700">
              Read reviews from real Irish business owners before you choose.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-14">
          <EmailCapture source="directory-waitlist" />
        </div>
      </div>

    </>
  );
}
