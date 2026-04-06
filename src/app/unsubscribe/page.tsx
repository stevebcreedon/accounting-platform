import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Unsubscribed',
  description: 'You have been unsubscribed from The Ledger.',
  alternates: { canonical: '/unsubscribe' },
};

export default function UnsubscribePage({
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
            Invalid Unsubscribe Link
          </h1>
          <p className="text-body text-stone-600 mb-8">
            This unsubscribe link is invalid or has expired. If you need help,
            please contact us at{' '}
            <a
              href="mailto:hello@theledger.ie"
              className="text-burnt-orange-500 underline hover:text-burnt-orange-600"
            >
              hello@theledger.ie
            </a>
            .
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
          You&apos;ve Been Unsubscribed
        </h1>
        <p className="text-body text-stone-600 mb-8">
          You won&apos;t receive any more emails from The Ledger. If this was a
          mistake, you can resubscribe at any time.
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
