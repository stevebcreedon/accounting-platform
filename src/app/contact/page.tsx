import { DisclaimerBar } from '@/components/shared/disclaimer-bar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with The Ledger. Questions, suggestions, or corrections — we would love to hear from you.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-article mx-auto px-6 md:px-8 pt-12 pb-12">
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-8">
          Contact
        </h1>
        <div className="article-content">
          <p>
            Have a question, suggestion, or correction? We&apos;d love to hear
            from you.
          </p>
          <p>
            Email us at{' '}
            <a
              href="mailto:hello@theledger.ie"
              className="text-burnt-orange-500 hover:text-burnt-orange-600 underline underline-offset-2"
            >
              hello@theledger.ie
            </a>
          </p>
          <p>We aim to respond within 2 business days.</p>
        </div>
        <DisclaimerBar />
      </div>
    </main>
  );
}
