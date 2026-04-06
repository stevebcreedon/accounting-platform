import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { isBotRequest } from '@/lib/analytics/bot-filter';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent');

    if (isBotRequest(userAgent)) {
      return NextResponse.json({ ok: true });
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    if (!rateLimit(ip, 30, 60_000)) {
      return NextResponse.json({ ok: true });
    }

    const body = await request.json();
    const { path, referrer } = body;

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ ok: true });
    }

    const truncatedPath = path.slice(0, 500);
    const truncatedReferrer =
      referrer && typeof referrer === 'string'
        ? referrer.slice(0, 2000)
        : null;

    const country = request.headers.get('x-vercel-ip-country') || null;

    let userAgentHash: string | null = null;
    if (userAgent) {
      const encoded = new TextEncoder().encode(userAgent);
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      userAgentHash = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }

    const { error } = await supabaseAdmin.from('page_views').insert({
      path: truncatedPath,
      referrer: truncatedReferrer,
      user_agent_hash: userAgentHash,
      country,
    });

    if (error) {
      console.error('Page view insert error:', error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Page view route error:', error);
    return NextResponse.json({ ok: true });
  }
}
