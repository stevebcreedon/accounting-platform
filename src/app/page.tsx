export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero section with generous editorial spacing */}
      <div className="mx-auto max-w-article px-6 py-30 md:px-8">
        <h1 className="font-heading text-h1 md:text-[3rem] lg:text-hero text-charcoal mb-6">
          The Ledger
        </h1>
        <p className="font-body text-body-lg text-stone-700 max-w-2xl mb-12">
          Clear, jargon-free accounting guidance for Irish small businesses.
        </p>
        <div className="h-px bg-stone-200 max-w-xs mb-12" />
        <p className="font-body text-sm text-stone-600">
          Coming soon — expert guides for sole traders, company directors, and
          startup founders in Ireland.
        </p>
      </div>

      {/* Prose typography demo section (verifies article-content class works) */}
      <div className="mx-auto max-w-article px-6 pb-30 md:px-8">
        <div className="article-content">
          <h2>Design System Preview</h2>
          <p>
            This section demonstrates the prose typography configuration.
            Headings render in Satoshi, body text in DM Sans, and{' '}
            <a href="#links">links appear in burnt orange</a> with a subtle
            underline offset.
          </p>
          <blockquote>
            <p>
              Blockquotes use a burnt-orange left border to maintain brand
              consistency throughout long-form content.
            </p>
          </blockquote>
          <h3>Typography Hierarchy</h3>
          <ul>
            <li>H2 headings in Satoshi at 2rem</li>
            <li>H3 headings in Satoshi at 1.5rem</li>
            <li>Body text in DM Sans at 1rem with 1.7 line height</li>
            <li>Meta text in DM Sans at 0.875rem</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
