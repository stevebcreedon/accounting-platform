'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface EmailCaptureProps {
  source: 'homepage' | 'directory-waitlist' | 'article-cta';
  heading?: string;
  description?: string;
}

const DEFAULT_HEADINGS: Record<EmailCaptureProps['source'], string> = {
  homepage: 'Stay Updated on Irish Accounting',
  'directory-waitlist': 'Get Early Access',
  'article-cta': 'Stay Updated',
};

const DEFAULT_DESCRIPTIONS: Record<EmailCaptureProps['source'], string> = {
  homepage:
    'Get the latest guides and insights for Irish business owners delivered to your inbox.',
  'directory-waitlist':
    'Be the first to know when our accountant directory launches.',
  'article-cta': 'Get more guides like this delivered to your inbox.',
};

const CONSENT_TEXT =
  'I agree to receive email updates from The Ledger. View our Privacy Policy.';

export function EmailCapture({ source, heading, description }: EmailCaptureProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const displayHeading = heading ?? DEFAULT_HEADINGS[source];
  const displayDescription = description ?? DEFAULT_DESCRIPTIONS[source];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;

    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, consentText: CONSENT_TEXT }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-burnt-orange-50/50 border border-burnt-orange-100 p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-burnt-orange-500 mb-4" />
        <h3 className="font-heading text-h3 text-charcoal mb-2">
          Check Your Email
        </h3>
        <p className="text-body text-stone-600">
          We&apos;ve sent a confirmation link to your email address. Click it to
          complete your subscription.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-burnt-orange-50/30 border border-burnt-orange-100 p-8 text-center">
      <h3 className="font-heading text-h3 text-charcoal mb-2">
        {displayHeading}
      </h3>
      <p className="text-body text-stone-600 mb-6">{displayDescription}</p>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="w-full rounded-full border-2 border-burnt-orange-200 px-5 py-3 text-base focus:border-burnt-orange-500 focus:outline-none focus:ring-4 focus:ring-burnt-orange-500/10"
        />

        <label className="flex items-start gap-3 text-left text-sm text-stone-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-burnt-orange-300 text-burnt-orange-500 focus:ring-burnt-orange-500 accent-burnt-orange-500"
          />
          <span>
            I agree to receive email updates from The Ledger. View our{' '}
            <a
              href="/privacy"
              className="text-burnt-orange-600 underline hover:text-burnt-orange-700"
            >
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          disabled={!consent || status === 'loading'}
          className="w-full rounded-full bg-burnt-orange-500 px-6 py-3 font-medium text-white transition-all hover:bg-burnt-orange-600 hover:shadow-xl hover:shadow-burnt-orange-500/25 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>

        {status === 'error' && (
          <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
