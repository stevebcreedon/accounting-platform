import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service for The Ledger, an educational accounting platform for Irish businesses. Governed by the laws of the Republic of Ireland.',
};

export default function TermsPage() {
  return (
    <>
      <div className="max-w-article mx-auto px-6 md:px-8 pt-12 pb-12">
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-8">
          Terms of Service
        </h1>
        <p className="text-sm text-stone-500 mb-8">Last updated: April 2026</p>
        <div className="article-content">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing and using The Ledger, you agree to be bound by these
            Terms of Service. If you do not agree with any part of these terms,
            please do not use this website.
          </p>

          <h2>About This Site</h2>
          <p>
            The Ledger provides educational accounting content for Irish
            businesses. Our guides cover topics such as tax obligations, business
            structures, compliance deadlines, and choosing an accountant — all
            specific to the Republic of Ireland. This site does not provide
            professional accounting, tax, or legal advice.
          </p>

          <h2>Educational Content Disclaimer</h2>
          <p>
            All content on The Ledger is for general information and educational
            purposes only. It does not constitute professional accounting, tax,
            or legal advice. Tax laws, thresholds, and regulations change
            frequently, and individual circumstances vary.
          </p>
          <p>
            Always consult a qualified Irish accountant or tax adviser for
            guidance specific to your situation. Do not make financial decisions
            based solely on information found on this website.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content published on The Ledger — including articles, guides,
            graphics, and design elements — is owned by The Ledger and protected
            by copyright law. You may not reproduce, distribute, or republish
            any content without prior written permission.
          </p>
          <p>
            You are welcome to link to our articles and share them on social
            media with proper attribution.
          </p>

          <h2>User Obligations</h2>
          <p>When using The Ledger, you agree to:</p>
          <ul>
            <li>Use the site lawfully and in accordance with these terms</li>
            <li>
              Not scrape, copy, or systematically download content from this site
            </li>
            <li>
              Not attempt to interfere with the site&apos;s operation or
              security
            </li>
            <li>
              Not misrepresent our content as professional advice to others
            </li>
          </ul>

          <h2>Email Subscription</h2>
          <p>
            Subscribing to our email updates is entirely voluntary. When you
            subscribe, we use double opt-in to confirm your intention. You can
            unsubscribe at any time using the link in every email, or by
            contacting us at{' '}
            <a href="mailto:hello@theledger.ie">hello@theledger.ie</a>. Your
            GDPR rights apply — see our{' '}
            <a href="/privacy">Privacy Policy</a> for full details.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our articles may contain links to external websites such as
            Revenue.ie, the Companies Registration Office (CRO), Citizens
            Information, and other government or professional bodies. These links
            are provided for your convenience and reference.
          </p>
          <p>
            We are not responsible for the content, accuracy, or availability of
            external websites. Linking to a third-party site does not imply
            endorsement.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            The Ledger provides educational content on an &quot;as is&quot; and
            &quot;as available&quot; basis. We make no warranties or guarantees
            regarding the accuracy, completeness, or timeliness of the
            information published.
          </p>
          <p>
            To the fullest extent permitted by Irish law, The Ledger shall not
            be liable for any direct, indirect, incidental, or consequential
            damages arising from your use of this website or reliance on its
            content.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms of Service are governed by and construed in accordance
            with the laws of the Republic of Ireland. Any disputes arising from
            these terms or your use of The Ledger shall be subject to the
            exclusive jurisdiction of the courts of Ireland.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may update these Terms of Service from time to time. Changes will
            be posted on this page with an updated date. Continued use of the
            site after changes are posted constitutes acceptance of the revised
            terms.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about these Terms of Service, contact us at{' '}
            <a href="mailto:hello@theledger.ie">hello@theledger.ie</a>.
          </p>
        </div>
      </div>
    </>
  );
}
