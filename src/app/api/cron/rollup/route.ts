import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  // Verify Vercel cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().slice(0, 10);

  try {
    // Rollup page views for yesterday
    // Aggregate by path: count total views and count distinct user_agent_hash as unique visitors
    const { data: pvRaw } = await supabaseAdmin
      .from('page_views')
      .select('path, user_agent_hash')
      .gte('created_at', `${dateStr}T00:00:00.000Z`)
      .lt('created_at', `${dateStr}T23:59:59.999Z`);

    if (pvRaw && pvRaw.length > 0) {
      // Group by path
      const pvByPath = new Map<string, { count: number; hashes: Set<string> }>();
      for (const row of pvRaw) {
        const entry = pvByPath.get(row.path) || { count: 0, hashes: new Set<string>() };
        entry.count++;
        if (row.user_agent_hash) entry.hashes.add(row.user_agent_hash);
        pvByPath.set(row.path, entry);
      }

      const pvInserts = Array.from(pvByPath.entries()).map(([path, data]) => ({
        date: dateStr,
        path,
        view_count: data.count,
        unique_visitors: data.hashes.size,
      }));

      // Upsert into daily_page_views (handles re-runs gracefully)
      const { error: pvError } = await supabaseAdmin
        .from('daily_page_views')
        .upsert(pvInserts, { onConflict: 'date,path' });

      if (pvError) console.error('Page views rollup error:', pvError);
    }

    // Rollup article reads for yesterday
    const { data: arRaw } = await supabaseAdmin
      .from('article_reads')
      .select('article_slug')
      .gte('created_at', `${dateStr}T00:00:00.000Z`)
      .lt('created_at', `${dateStr}T23:59:59.999Z`);

    if (arRaw && arRaw.length > 0) {
      const arBySlug = new Map<string, number>();
      for (const row of arRaw) {
        arBySlug.set(row.article_slug, (arBySlug.get(row.article_slug) || 0) + 1);
      }

      const arInserts = Array.from(arBySlug.entries()).map(([slug, count]) => ({
        date: dateStr,
        article_slug: slug,
        read_count: count,
      }));

      const { error: arError } = await supabaseAdmin
        .from('daily_article_reads')
        .upsert(arInserts, { onConflict: 'date,article_slug' });

      if (arError) console.error('Article reads rollup error:', arError);
    }

    return NextResponse.json({
      ok: true,
      date: dateStr,
      pageViewPaths: pvRaw?.length || 0,
      articleReads: arRaw?.length || 0,
    });
  } catch (error) {
    console.error('Cron rollup error:', error);
    return NextResponse.json({ error: 'Rollup failed' }, { status: 500 });
  }
}
