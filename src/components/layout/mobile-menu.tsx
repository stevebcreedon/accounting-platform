'use client';

import { useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from './navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

export function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && overlayRef.current) {
        const focusableElements = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, a[href]'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose]
  );

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap and escape key
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center transition-opacity duration-150"
    >
      <button
        ref={closeButtonRef}
        className="absolute top-4 right-4 flex items-center justify-center w-11 h-11"
        aria-label="Close menu"
        onClick={onClose}
      >
        <X className="h-6 w-6 text-charcoal" />
      </button>

      <span className="font-heading text-h2 font-bold text-charcoal mb-12">
        The Ledger
      </span>

      <nav
        aria-label="Mobile navigation"
        className="flex flex-col items-center gap-6"
      >
        {NAV_LINKS.map((link) => {
          const isActive = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-heading text-h2 font-bold',
                isActive ? 'text-burnt-orange-500' : 'text-charcoal'
              )}
              onClick={onClose}
            >
              {link.label}
            </Link>
          );
        })}

        <Link
          href="/contact"
          className="font-body text-base text-stone-600 mt-8"
          onClick={onClose}
        >
          Contact
        </Link>
      </nav>
    </div>
  );
}
