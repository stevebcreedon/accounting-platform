import { DisclaimerBar } from '@/components/shared/disclaimer-bar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About The Ledger',
  description:
    'The Ledger provides free, jargon-free accounting guidance for Irish small business owners. Learn about our mission.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="max-w-article mx-auto px-6 md:px-8 pt-12 pb-12">
        <h1 className="font-heading text-h1 md:text-[2.5rem] text-charcoal mb-8">
          About The Ledger
        </h1>
        <div className="article-content">
          <p>
            The Ledger exists to give every Irish business owner clear,
            trustworthy answers to accounting questions — without the jargon,
            without the fees, without the confusion.
          </p>

          <h2>Our Mission</h2>
          <p>
            Running a business in Ireland means navigating VAT thresholds,
            corporation tax, Revenue deadlines, and CRO filings — often with
            little guidance unless you can afford an accountant from day one.
          </p>
          <p>
            The Ledger was built to change that. We publish free, in-depth
            guides that cover every accounting question an Irish sole trader,
            limited company director, or startup founder would search for. Every
            article is written specifically for the Republic of Ireland, referencing
            Irish tax rates, Irish deadlines, and Irish regulatory bodies.
          </p>

          <h2>Who We Help</h2>
          <p>
            Whether you&apos;re registering your first business, deciding between
            sole trader and limited company, figuring out your VAT obligations,
            or simply trying to understand what an accountant should cost — The
            Ledger is here for you.
          </p>
          <ul>
            <li>
              <strong>Sole traders</strong> navigating self-assessment and
              Form 11 returns
            </li>
            <li>
              <strong>Limited company directors</strong> managing corporation
              tax, payroll, and annual returns
            </li>
            <li>
              <strong>Startup founders</strong> choosing the right structure and
              setting up their books from the start
            </li>
            <li>
              <strong>Contractors</strong> weighing up umbrella companies versus
              their own limited company
            </li>
          </ul>

          <h2>What Makes Us Different</h2>
          <p>
            Most accounting content online is written for the UK or is so generic
            it&apos;s useless. The Ledger is different:
          </p>
          <ul>
            <li>
              <strong>Ireland-specific</strong> — every article references Irish
              legislation, Revenue rules, and CRO requirements. No UK content, no
              Northern Ireland, no generic advice.
            </li>
            <li>
              <strong>Plain English</strong> — we explain things the way you&apos;d
              want a friend who happens to be an accountant to explain them.
            </li>
            <li>
              <strong>No upsells</strong> — our guides are free. No paywalls, no
              gated content, no mandatory sign-ups to read an article.
            </li>
            <li>
              <strong>Trustworthy</strong> — we cite Revenue.ie, the Companies
              Registration Office, and Irish legislation directly. You can verify
              everything we publish.
            </li>
          </ul>

          <h2>The Bigger Picture</h2>
          <p>
            We&apos;re also building an accountant directory — a place where
            Irish business owners can search for, compare, and review accountants
            by location and specialisation. When it launches, it will be the
            most comprehensive way to find the right accountant in Ireland.
          </p>
          <p>
            In the meantime, our guides are here to help you understand your
            obligations, make informed decisions, and feel confident about the
            financial side of your business.
          </p>
        </div>
        <DisclaimerBar />
      </div>
    </main>
  );
}
