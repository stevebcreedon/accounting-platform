'use client';

import { useEffect, useRef } from 'react';

export function PageViewTracker() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    const data = JSON.stringify({
      path: window.location.pathname,
      referrer: document.referrer || null,
    });

    // sendBeacon with Blob for correct Content-Type (avoids text/plain pitfall)
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/analytics/pageview',
        new Blob([data], { type: 'application/json' })
      );
    } else {
      fetch('/api/analytics/pageview', {
        method: 'POST',
        body: data,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      });
    }
  }, []);

  return null;
}
