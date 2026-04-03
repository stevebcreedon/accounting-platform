import { defineConfig, s } from 'velite';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:8].[ext]',
    clean: true,
  },
  collections: {
    guides: {
      name: 'Guide',
      pattern: 'guides/**/*.mdx',
      schema: s
        .object({
          title: s.string().max(70),
          description: s.string().max(160),
          slug: s.slug('guides'),
          publishDate: s.isodate(),
          updatedDate: s.isodate().optional(),
          category: s.enum([
            'getting-started',
            'business-structures',
            'tax-obligations',
            'accounting-basics',
            'choosing-an-accountant',
            'costs-and-fees',
            'compliance-and-deadlines',
            'industry-guides',
          ]),
          isPillar: s.boolean().default(false),
          featured: s.boolean().default(false),
          relatedSlugs: s.array(s.string()).default([]),
          keywords: s.array(s.string()).default([]),
          metadata: s.metadata(),
          toc: s.toc(),
          body: s.mdx(),
        })
        .strict(),
    },
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, { theme: 'github-light' }],
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  },
});
