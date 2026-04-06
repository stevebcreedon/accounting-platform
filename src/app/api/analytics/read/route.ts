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

    if (!rateLimit(ip, 10, 60_000)) {
      return NextResponse.json({ ok: true });
    }

    const body = await request.json();
    const { articleSlug, scrollDepth } = body;

    if (!articleSlug || typeof articleSlug !== 'string') {
      return NextResponse.json({ ok: true });
    }

    const truncatedSlug = articleSlug.slice(0, 200);
    const validScrollDepth =
      typeof scrollDepth === 'number' ? scrollDepth : 75;

    const { error } = await supabaseAdmin.from('article_reads').insert({
      article_slug: truncatedSlug,
      scroll_depth: validScrollDepth,
    });

    if (error) {
      console.error('Article read insert error:', error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Article read route error:', error);
    return NextResponse.json({ ok: true });
  }
}
