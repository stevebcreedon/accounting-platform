'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FAQPage, WithContext } from 'schema-dts';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement).props.children);
  }
  return '';
}

export function FAQItem({
  question,
  children,
  isOpen,
  onToggle,
  id,
}: FAQItemProps) {
  return (
    <div className="border-b border-stone-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 px-6 text-left font-bold text-charcoal hover:bg-cream transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-controls={id}
      >
        <span>{question}</span>
        <ChevronDown
          size={20}
          className={cn(
            'text-stone-500 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        id={id}
        role="region"
        aria-hidden={!isOpen}
        className={cn(
          'grid transition-[grid-template-rows] duration-200 overflow-hidden',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-4 text-stone-700">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface FAQSectionProps {
  children: React.ReactNode;
}

export function FAQSection({ children }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const childArray = React.Children.toArray(children);

  // Extract question/answer pairs for JSON-LD
  const faqItems: { question: string; answer: string }[] = [];
  childArray.forEach((child) => {
    if (React.isValidElement(child) && child.props.question) {
      faqItems.push({
        question: child.props.question,
        answer: extractText(child.props.children),
      });
    }
  });

  const faqSchema: WithContext<FAQPage> = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question' as const,
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: item.answer,
      },
    })),
  };

  return (
    <section>
      <h2 className="font-heading text-h3 text-charcoal mb-6">
        Frequently Asked Questions
      </h2>
      <div className="bg-white rounded-lg overflow-hidden">
        {childArray.map((child, index) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(
            child as React.ReactElement<FAQItemProps>,
            {
              isOpen: openIndex === index,
              onToggle: () =>
                setOpenIndex(openIndex === index ? null : index),
              id: `faq-${index}`,
            }
          );
        })}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
}
