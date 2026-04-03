'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

interface TableOfContentsProps {
  toc: TocEntry[];
}

function useActiveHeading(headingIds: string[]): string {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-96px 0px -66% 0px' }
    );

    headingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headingIds]);

  return activeId;
}

export function TableOfContents({ toc }: TableOfContentsProps) {
  const headingIds = toc.flatMap((entry) => [
    entry.url.replace('#', ''),
    ...entry.items.map((child) => child.url.replace('#', '')),
  ]);

  const activeId = useActiveHeading(headingIds);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <nav
        aria-label="Table of Contents"
        className="hidden lg:block sticky top-24 w-[240px] max-h-[calc(100vh-128px)] overflow-y-auto bg-white rounded-lg p-6"
      >
        <p className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">
          On This Page
        </p>
        <ol className="space-y-1">
          {toc.map((entry) => {
            const id = entry.url.replace('#', '');
            const isActive = activeId === id;
            return (
              <li key={entry.url}>
                <a
                  href={entry.url}
                  className={cn(
                    'block py-1 pl-3 text-sm border-l-2 transition-colors',
                    isActive
                      ? 'font-bold text-charcoal border-burnt-orange-500'
                      : 'text-stone-600 border-transparent hover:text-charcoal'
                  )}
                >
                  {entry.title}
                </a>
                {entry.items.length > 0 && (
                  <ol className="space-y-1 mt-1">
                    {entry.items.map((child) => {
                      const childId = child.url.replace('#', '');
                      const isChildActive = activeId === childId;
                      return (
                        <li key={child.url}>
                          <a
                            href={child.url}
                            className={cn(
                              'block py-1 pl-7 text-sm border-l-2 transition-colors',
                              isChildActive
                                ? 'font-bold text-charcoal border-burnt-orange-500'
                                : 'text-stone-600 border-transparent hover:text-charcoal'
                            )}
                          >
                            {child.title}
                          </a>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile: expandable inline block */}
      <div className="lg:hidden border border-stone-200 rounded-lg bg-white mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-4 text-sm font-bold text-charcoal"
          aria-expanded={isOpen}
        >
          <span>In this article</span>
          <ChevronDown
            size={16}
            className={cn(
              'text-stone-500 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>
        {isOpen && (
          <ol className="px-4 pb-4 space-y-1">
            {toc.map((entry) => {
              const id = entry.url.replace('#', '');
              const isActive = activeId === id;
              return (
                <li key={entry.url}>
                  <a
                    href={entry.url}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block py-1 pl-3 text-sm border-l-2 transition-colors',
                      isActive
                        ? 'font-bold text-charcoal border-burnt-orange-500'
                        : 'text-stone-600 border-transparent hover:text-charcoal'
                    )}
                  >
                    {entry.title}
                  </a>
                  {entry.items.length > 0 && (
                    <ol className="space-y-1 mt-1">
                      {entry.items.map((child) => {
                        const childId = child.url.replace('#', '');
                        const isChildActive = activeId === childId;
                        return (
                          <li key={child.url}>
                            <a
                              href={child.url}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'block py-1 pl-7 text-sm border-l-2 transition-colors',
                                isChildActive
                                  ? 'font-bold text-charcoal border-burnt-orange-500'
                                  : 'text-stone-600 border-transparent hover:text-charcoal'
                              )}
                            >
                              {child.title}
                            </a>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </>
  );
}
