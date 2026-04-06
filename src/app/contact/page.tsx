import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with The Ledger. Questions, suggestions, or corrections — we would love to hear from you.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact',
    description:
      'Get in touch with The Ledger. Questions, suggestions, or corrections — we would love to hear from you.',
    type: 'website',
  },
  twitter: { card: 'summary' },
};

export default function ContactPage() {
  return (
    <>
      <div className="max-w-article mx-auto px-6 md:px-8 pt-16 pb-12">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-burnt-orange-500 bg-burnt-orange-50 px-3 py-1 rounded-full mb-4">
          Get in Touch
        </span>
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-3">
          Contact
        </h1>
        <div className="w-12 h-1 bg-burnt-orange-500 rounded-full mb-8" />
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
      </div>
    </>
  );
}
