export interface CategoryConfig {
  slug: string;
  name: string;
  description: string;
  emoji: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: 'getting-started',
    name: 'Getting Started',
    description:
      'First steps for new Irish business owners navigating accounting and tax registration.',
    emoji: '\u{1F680}',
  },
  {
    slug: 'business-structures',
    name: 'Business Structures',
    description:
      'Sole trader, limited company, and partnership comparisons under Irish law.',
    emoji: '\u{1F3E2}',
  },
  {
    slug: 'tax-obligations',
    name: 'Tax Obligations',
    description:
      'VAT, corporation tax, income tax, and PAYE obligations for Irish businesses.',
    emoji: '\u{1F9FE}',
  },
  {
    slug: 'accounting-basics',
    name: 'Accounting Basics',
    description:
      'Bookkeeping, financial statements, and record-keeping for Irish SMEs.',
    emoji: '\u{1F4CA}',
  },
  {
    slug: 'choosing-an-accountant',
    name: 'Choosing an Accountant',
    description:
      'How to find, evaluate, and work with an accountant in Ireland.',
    emoji: '\u{1F50D}',
  },
  {
    slug: 'costs-and-fees',
    name: 'Costs & Fees',
    description:
      'What accountants charge in Ireland and how to budget for professional services.',
    emoji: '\u{1F4B6}',
  },
  {
    slug: 'compliance-and-deadlines',
    name: 'Compliance & Deadlines',
    description:
      'Key filing dates, Revenue deadlines, and CRO annual return requirements.',
    emoji: '\u{1F4C5}',
  },
  {
    slug: 'industry-guides',
    name: 'Industry Guides',
    description:
      'Accounting guidance tailored to specific Irish industries and business types.',
    emoji: '\u{1F3ED}',
  },
];

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}
