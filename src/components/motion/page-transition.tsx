'use client';

import * as m from 'motion/react-m';
import { useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.25,
        ease: 'easeOut',
      }}
    >
      {children}
    </m.div>
  );
}
