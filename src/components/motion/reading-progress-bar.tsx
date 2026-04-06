'use client';

import { useScroll, useTransform, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

export function ReadingProgressBar() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <m.div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-16 left-0 right-0 z-[49] h-1 bg-burnt-orange-500 origin-left"
      style={{
        scaleX: scrollYProgress,
        opacity: prefersReducedMotion ? 1 : opacity,
      }}
    />
  );
}
