import { DisclaimerBar } from '@/components/shared/disclaimer-bar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How The Ledger collects, uses, and protects your data. GDPR-compliant privacy policy for our Irish accounting guides platform.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-article mx-auto px-6 md:px-8 pt-12 pb-12">
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-8">
          Privacy Policy
        </h1>
        <p className="text-sm text-stone-500 mb-8">Last updated: April 2026</p>
        <div className="article-content">
          <h2>Who We Are</h2>
          <p>
            The Ledger is an online platform providing free educational
            accounting guides for Irish small business owners. You can contact
            us at{' '}
            <a href="mailto:hello@theledger.ie">hello@theledger.ie</a>.
          </p>

          <h2>What Data We Collect</h2>
          <p>We collect the following data:</p>
          <ul>
            <li>
              <strong>Email address</strong> — if you voluntarily subscribe to
              our newsletter or updates.
            </li>
            <li>
              <strong>Page view analytics</strong> — anonymised, server-side
              analytics that do not include personal data or use cookies. We
              record the page visited, referrer, and country (derived from IP
              address, which is not stored).
            </li>
          </ul>

          <h2>How We Use Your Data</h2>
          <ul>
            <li>
              <strong>Email address:</strong> to send you our newsletter,
              content updates, and notifications about new features such as our
              accountant directory. You can unsubscribe at any time.
            </li>
            <li>
              <strong>Analytics data:</strong> to understand which content is
              most useful, improve our guides, and measure site performance. This
              data is stored in aggregate and cannot be used to identify you.
            </li>
          </ul>

          <h2>Legal Basis for Processing</h2>
          <p>
            Under the General Data Protection Regulation (GDPR), we process your
            data on the following legal bases:
          </p>
          <ul>
            <li>
              <strong>Consent (Article 6(1)(a)):</strong> for collecting and
              using your email address. You provide explicit consent when you
              subscribe, and we use double opt-in to confirm your intention.
            </li>
            <li>
              <strong>Legitimate interest (Article 6(1)(f)):</strong> for
              collecting anonymised analytics data to improve our content and
              user experience. This processing is minimal, does not involve
              personal data, and does not use cookies.
            </li>
          </ul>

          <h2>Data Retention</h2>
          <ul>
            <li>
              <strong>Subscriber data:</strong> retained until you request
              removal by unsubscribing or emailing us. We delete your email
              address promptly upon request.
            </li>
            <li>
              <strong>Analytics data:</strong> retained in aggregate form
              indefinitely. Since it contains no personal data, it cannot be
              linked back to you.
            </li>
          </ul>

          <h2>Your Rights Under GDPR</h2>
          <p>
            Under the GDPR, you have the following rights regarding your
            personal data:
          </p>
          <ul>
            <li>
              <strong>Right of access (Article 15):</strong> you can request a
              copy of the personal data we hold about you.
            </li>
            <li>
              <strong>Right to rectification (Article 16):</strong> you can
              request correction of inaccurate personal data.
            </li>
            <li>
              <strong>Right to erasure (Article 17):</strong> you can request
              deletion of your personal data.
            </li>
            <li>
              <strong>Right to restriction (Article 18):</strong> you can
              request we limit how we process your data.
            </li>
            <li>
              <strong>Right to data portability (Article 20):</strong> you can
              request your data in a structured, machine-readable format.
            </li>
            <li>
              <strong>Right to object (Article 21):</strong> you can object to
              processing based on legitimate interest.
            </li>
          </ul>
          <p>
            To exercise any of these rights, email us at{' '}
            <a href="mailto:hello@theledger.ie">hello@theledger.ie</a>. We will
            respond within 30 days.
          </p>

          <h2>Right to Lodge a Complaint</h2>
          <p>
            You have the right to lodge a complaint with the Irish Data
            Protection Commission:
          </p>
          <p>
            Irish Data Protection Commission
            <br />
            21 Fitzwilliam Square South
            <br />
            Dublin 2, D02 RD28
            <br />
            Ireland
          </p>
          <p>
            Website:{' '}
            <a
              href="https://www.dataprotection.ie"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.dataprotection.ie
            </a>
          </p>

          <h2>Cookies</h2>
          <p>
            We do not use third-party tracking cookies. Our analytics are
            server-side and do not store cookies on your device.
          </p>

          <h2>Third-Party Processors</h2>
          <p>
            We use the following third-party services to operate The Ledger:
          </p>
          <ul>
            <li>
              <strong>Supabase</strong> — database hosting (EU region). Stores
              subscriber email addresses and anonymised analytics data.
            </li>
            <li>
              <strong>Resend</strong> — transactional email service. Used to
              send double opt-in confirmation emails and newsletters.
            </li>
            <li>
              <strong>Vercel</strong> — website hosting and content delivery
              network (CDN). Serves the website and handles server-side
              rendering.
            </li>
          </ul>

          <h2>International Data Transfers</h2>
          <p>
            Vercel may process data outside the European Economic Area (EEA) in
            the course of serving website content. Where this occurs, data
            transfers are protected by Standard Contractual Clauses (SCCs) as
            approved by the European Commission.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Changes will be posted
            on this page with an updated date. We encourage you to review this
            page periodically.
          </p>
        </div>
        <DisclaimerBar />
      </div>
    </main>
  );
}
