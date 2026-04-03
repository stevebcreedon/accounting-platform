import { notFound } from 'next/navigation';
import { getAllGuides, getGuideBySlug, getReadingTime } from '@/lib/content/queries';
import type { Guide } from '@/lib/content/queries';
import { getCategoryBySlug } from '@/lib/content/categories';
import { Breadcrumbs } from '@/components/article/breadcrumbs';
import { MetaLine } from '@/components/article/meta-line';
import { TableOfContents } from '@/components/article/table-of-contents';
import { EmailCTAPlaceholder } from '@/components/article/email-cta-placeholder';
import { RelatedArticles } from '@/components/article/related-articles';
import { MDXContent } from '@/components/mdx/mdx-content';

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) notFound();

  const category = getCategoryBySlug(guide.category);
  const readingTime = getReadingTime(guide);
  const relatedGuides = guide.relatedSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is Guide => g !== undefined)
    .map((g) => ({
      slug: g.slug,
      title: g.title,
      description: g.description,
      category: g.category,
      categoryName: getCategoryBySlug(g.category)?.name ?? g.category,
      readingTime: getReadingTime(g),
    }));

  return (
    <article className="pt-12 pb-12">
      {/* Full-width container for breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <Breadcrumbs
          categorySlug={guide.category}
          categoryName={category?.name ?? guide.category}
          articleTitle={guide.title}
        />
      </div>

      {/* Two-column layout: content + TOC sidebar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:flex lg:gap-12">
        {/* Main content column */}
        <div className="max-w-article flex-1 min-w-0">

          {/* Pillar enhancement: accent bar + badge */}
          {guide.isPillar && (
            <div className="border-t-[3px] border-burnt-orange-500 pt-6 mb-4">
              <span className="inline-block text-sm font-bold px-3 py-1 rounded-full bg-burnt-orange-500 text-white mb-3">
                Comprehensive Guide
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading text-h1 md:text-[2.5rem] md:leading-[1.15] text-charcoal mb-4">
            {guide.title}
          </h1>

          {/* Meta line */}
          <MetaLine
            publishDate={guide.publishDate}
            updatedDate={guide.updatedDate}
            readingTime={readingTime}
            categorySlug={guide.category}
            categoryName={category?.name ?? guide.category}
          />

          {/* Mobile TOC (shown below lg) */}
          <div className="lg:hidden">
            <TableOfContents toc={guide.toc} />
          </div>

          {/* Article body */}
          <div className="article-content mb-12">
            <MDXContent code={guide.body} />
          </div>

          {/* Disclaimer */}
          <p className="text-sm text-stone-500 italic mb-12">
            This article is for educational purposes only and does not constitute professional accounting advice. For guidance specific to your situation, consult a qualified Irish accountant.
          </p>

          {/* Email CTA placeholder */}
          <EmailCTAPlaceholder />
        </div>

        {/* TOC sidebar (desktop only) */}
        <aside className="hidden lg:block flex-shrink-0">
          <TableOfContents toc={guide.toc} />
        </aside>
      </div>

      {/* Related articles (full width) */}
      {relatedGuides.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
          <RelatedArticles guides={relatedGuides} />
        </div>
      )}
    </article>
  );
}
