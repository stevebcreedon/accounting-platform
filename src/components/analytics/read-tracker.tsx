'use client';

import { useEffect, useRef } from 'react';

export function ReadTracker({ articleSlug }: { articleSlug: string }) {
  const markerRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (!markerRef.current || fired.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          const data = JSON.stringify({ articleSlug, scrollDepth: 75 });
          if (navigator.sendBeacon) {
            navigator.sendBeacon(
              '/api/analytics/read',
              new Blob([data], { type: 'application/json' })
            );
          } else {
            fetch('/api/analytics/read', {
              method: 'POST',
              body: data,
              headers: { 'Content-Type': 'application/json' },
              keepalive: true,
            });
          }
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(markerRef.current);
    return () => observer.disconnect();
  }, [articleSlug]);

  return <div ref={markerRef} aria-hidden="true" />;
}
