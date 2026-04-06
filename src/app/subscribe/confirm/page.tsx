import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Subscription Confirmed',
  description: 'Your email subscription has been confirmed.',
  alternates: { canonical: '/subscribe/confirm' },
};

export default function SubscribeConfirmPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams.error === 'invalid';

  if (hasError) {
    return (
      <div className="max-w-article mx-auto px-6 md:px-8 pt-12 pb-12">
        <div className="article-content text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-4">
            Invalid Confirmation Link
          </h1>
          <p className="text-body text-stone-600 mb-8">
            This confirmation link is invalid or has expired. Please try
            subscribing again.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-burnt-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-burnt-orange-600"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-article mx-auto px-6 md:px-8 pt-12 pb-12">
      <div className="article-content text-center">
        <CheckCircle2 size={48} className="mx-auto text-burnt-orange-500 mb-4" />
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-4">
          Subscription Confirmed
        </h1>
        <p className="text-body text-stone-600 mb-8">
          Thank you for confirming your email. You&apos;ll receive our latest
          Irish accounting guides and insights.
        </p>
        <Link
          href="/guides"
          className="inline-block rounded-full bg-burnt-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-burnt-orange-600"
        >
          Browse Our Guides
        </Link>
      </div>
    </div>
  );
}
