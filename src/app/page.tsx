import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllGuides, getReadingTime } from '@/lib/content/queries';
import { getCategoryBySlug, CATEGORIES } from '@/lib/content/categories';
import { ArticleCard } from '@/components/shared/article-card';
import { CategoryCard } from '@/components/shared/category-card';
import { EmailCapture } from '@/components/email-capture';
import { JsonLd } from '@/components/seo/json-ld';
import { buildOrganisationSchema } from '@/lib/seo/schemas';
import { ScrollReveal } from '@/components/motion/scroll-reveal';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { type: 'website' },
  twitter: { card: 'summary' },
};

export default function Home() {
  const latestGuides = getAllGuides().slice(0, 6);
  const publishedCount = getAllGuides().length;

  const orgSchema = buildOrganisationSchema();

  return (
    <>
      <JsonLd data={orgSchema} />

      {/* ─── Hero ────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 pt-16">
          {/* Big warm radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 90% 70% at 50% 35%, rgba(232,114,12,0.10), transparent 70%), radial-gradient(ellipse 60% 50% at 75% 65%, rgba(232,114,12,0.06), transparent 60%), radial-gradient(ellipse 40% 30% at 20% 70%, rgba(232,114,12,0.04), transparent)',
            }}
          />

          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, #E8720C 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-burnt-orange-500 rounded-full px-5 py-2 mb-10 shadow-lg shadow-burnt-orange-500/20">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[12px] font-semibold text-white tracking-wide">
                72 expert guides for Irish business
              </span>
            </div>

            <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-charcoal">
              Accounting guidance that actually makes{' '}
              <span className="bg-gradient-to-r from-burnt-orange-500 to-burnt-orange-600 bg-clip-text text-transparent">
                sense.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto mt-8 leading-relaxed">
              Clear, jargon-free answers to every question Irish sole traders,
              company directors, and founders ask about tax, compliance, and
              costs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link
                href="/guides"
                className="group flex items-center gap-2 bg-burnt-orange-500 text-white font-semibold text-[15px] rounded-full px-9 py-4 hover:bg-burnt-orange-600 hover:shadow-xl hover:shadow-burnt-orange-500/25 hover:-translate-y-0.5 transition-all duration-300"
              >
                Browse guides
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link
                href="#subscribe"
                className="text-[15px] font-semibold text-burnt-orange-500 hover:text-burnt-orange-600 transition-colors duration-200 flex items-center gap-1"
              >
                Get updates →
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ─── Stats ───────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-28 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, #FFF7ED 0%, #FFF1E0 25%, #FFFFFF 50%, #FFF1E0 75%, #FFF7ED 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 15% 50%, rgba(232,114,12,0.10), transparent 40%), radial-gradient(circle at 85% 50%, rgba(232,114,12,0.10), transparent 40%)',
            }}
          />
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-burnt-orange-500/20 to-transparent" />
          <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-burnt-orange-500/20 to-transparent" />
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-3 gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-heading font-bold tracking-tight bg-gradient-to-br from-burnt-orange-500 to-burnt-orange-600 bg-clip-text text-transparent">
                  {publishedCount}
                </div>
                <div className="text-sm text-burnt-orange-400 mt-3 tracking-wide uppercase font-medium">
                  Expert Guides
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-heading font-bold tracking-tight bg-gradient-to-br from-burnt-orange-500 to-burnt-orange-600 bg-clip-text text-transparent">
                  8
                </div>
                <div className="text-sm text-burnt-orange-400 mt-3 tracking-wide uppercase font-medium">
                  Categories
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-heading font-bold tracking-tight bg-gradient-to-br from-burnt-orange-500 to-burnt-orange-600 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm text-burnt-orange-400 mt-3 tracking-wide uppercase font-medium">
                  Free
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ─── Latest Guides ───────────────────────────────────── */}
      <ScrollReveal>
        <section id="guides" className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div>
                <span className="text-[12px] font-bold tracking-widest uppercase text-white bg-burnt-orange-500 rounded-full px-3 py-1 inline-block mb-4">
                  Latest
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
                  Expert guides
                </h2>
                <div className="w-16 h-1.5 bg-gradient-to-r from-burnt-orange-500 to-burnt-orange-300 rounded-full mt-5" />
              </div>
              <Link
                href="/guides"
                className="hidden md:flex items-center gap-2 text-sm font-semibold text-burnt-orange-500 hover:text-burnt-orange-600 transition-colors bg-burnt-orange-50 rounded-full px-5 py-2.5 hover:bg-burnt-orange-100"
              >
                View all →
              </Link>
            </div>

            {latestGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestGuides.map((g) => (
                  <ArticleCard
                    key={g.slug}
                    slug={g.slug}
                    title={g.title}
                    description={g.description}
                    category={g.category}
                    categoryName={
                      getCategoryBySlug(g.category)?.name ?? g.category
                    }
                    readingTime={getReadingTime(g)}
                    isPillar={g.isPillar}
                  />
                ))}
              </div>
            ) : (
              <p className="text-base text-stone-500">
                Guides coming soon -- expert accounting content for Irish
                business owners.
              </p>
            )}
          </div>
        </section>
      </ScrollReveal>

      {/* ─── Divider ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div
          className="h-[2px] rounded-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(232,114,12,0.3), rgba(232,114,12,0.5), rgba(232,114,12,0.3), transparent)',
          }}
        />
      </div>

      {/* ─── Browse by Topic ─────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-28 px-6 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(232,114,12,0.04) 0%, rgba(232,114,12,0.08) 50%, rgba(232,114,12,0.04) 100%)',
            }}
          />
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <span className="text-[12px] font-bold tracking-widest uppercase text-white bg-burnt-orange-500 rounded-full px-3 py-1 inline-block mb-4">
                Browse
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">
                By topic
              </h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-burnt-orange-300 via-burnt-orange-500 to-burnt-orange-300 rounded-full mt-5 mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES.map((c) => (
                <CategoryCard
                  key={c.slug}
                  slug={c.slug}
                  name={c.name}
                  emoji={c.emoji}
                />
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ─── Email CTA ───────────────────────────────────────── */}
      <ScrollReveal>
        <section id="subscribe" className="py-32 px-6 relative overflow-hidden">
          {/* Orange ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(232,114,12,0.06), transparent)',
            }}
          />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <span className="text-[12px] font-bold tracking-widest uppercase text-white bg-burnt-orange-500 rounded-full px-3 py-1 inline-block mb-4">
              Stay informed
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Never miss an update.
            </h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-burnt-orange-300 via-burnt-orange-500 to-burnt-orange-300 rounded-full mx-auto mb-8" />
            <p className="text-stone-400 text-lg mb-12 leading-relaxed">
              Get new Irish accounting guides delivered to your inbox. No spam —
              just clear, useful guidance.
            </p>

            <EmailCapture source="homepage" />
          </div>
        </section>
      </ScrollReveal>
    </>
  );
}
