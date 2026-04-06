'use client';

import { useCallback } from 'react';

export function OutboundTracker({
  articleSlug,
  children,
}: {
  articleSlug: string;
  children: React.ReactNode;
}) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.href;
      if (!href || anchor.hostname === window.location.hostname) return;

      const data = JSON.stringify({
        articleSlug,
        targetUrl: href,
        linkText: anchor.textContent?.slice(0, 200) || '',
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/outbound',
          new Blob([data], { type: 'application/json' })
        );
      } else {
        fetch('/api/analytics/outbound', {
          method: 'POST',
          body: data,
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        });
      }
      // Do NOT preventDefault -- navigation proceeds normally
    },
    [articleSlug]
  );

  return <div onClick={handleClick}>{children}</div>;
}
