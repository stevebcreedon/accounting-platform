'use client';

import { LazyMotion } from 'motion/react';

const loadFeatures = () =>
  import('@/lib/motion-features').then((mod) => mod.default);

interface MotionProviderProps {
  children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <LazyMotion features={loadFeatures}>
      {children}
    </LazyMotion>
  );
}
