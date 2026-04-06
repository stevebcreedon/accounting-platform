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
      <div className="max-w-4xl mx-auto text-center py-18 px-6 md:px-8">
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal">
          Find an Accountant in Ireland
        </h1>
        <p className="font-heading text-h3 text-stone-600 mt-4">
          Directory Coming Soon
        </p>
        <p className="text-body md:text-[1.125rem] text-stone-700 max-w-2xl mx-auto mt-6">
          We&apos;re building Ireland&apos;s most comprehensive accountant
          directory. Search by location, specialisation, and reviews to find the
          right accountant for your business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center">
            <MapPin size={32} className="mx-auto text-stone-600 mb-3" />
            <h3 className="font-heading text-body font-bold text-charcoal mb-2">
              Search by Location
            </h3>
            <p className="text-sm text-stone-700">
              Find accountants in your county — Dublin, Cork, Galway, and all 26
              counties.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center">
            <Search size={32} className="mx-auto text-stone-600 mb-3" />
            <h3 className="font-heading text-body font-bold text-charcoal mb-2">
              Filter by Specialisation
            </h3>
            <p className="text-sm text-stone-700">
              Tax planning, bookkeeping, company formation, payroll, and more.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6 text-center">
            <Star size={32} className="mx-auto text-stone-600 mb-3" />
            <h3 className="font-heading text-body font-bold text-charcoal mb-2">
              Verified Reviews
            </h3>
            <p className="text-sm text-stone-700">
              Read reviews from real Irish business owners before you choose.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-12">
          <EmailCapture source="directory-waitlist" />
        </div>
      </div>

    </>
  );
}
