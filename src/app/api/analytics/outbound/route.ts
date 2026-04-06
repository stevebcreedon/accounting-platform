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
    const { articleSlug, targetUrl, linkText } = body;

    if (
      !articleSlug ||
      typeof articleSlug !== 'string' ||
      !targetUrl ||
      typeof targetUrl !== 'string'
    ) {
      return NextResponse.json({ ok: true });
    }

    const truncatedSlug = articleSlug.slice(0, 200);
    const truncatedUrl = targetUrl.slice(0, 2000);
    const truncatedLinkText =
      linkText && typeof linkText === 'string'
        ? linkText.slice(0, 200)
        : null;

    const { error } = await supabaseAdmin.from('outbound_clicks').insert({
      article_slug: truncatedSlug,
      target_url: truncatedUrl,
      link_text: truncatedLinkText,
    });

    if (error) {
      console.error('Outbound click insert error:', error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Outbound click route error:', error);
    return NextResponse.json({ ok: true });
  }
}
