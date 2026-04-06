import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Daily rebuild cron route - triggered at 06:00 UTC by Vercel Cron.
 *
 * This route uses on-demand ISR revalidation to refresh cached pages.
 * For ISR-enabled pages, this triggers Next.js to regenerate them on
 * the next request after revalidation.
 *
 * NOTE: For fully static (SSG) pages built by Velite at build time,
 * ISR revalidation alone does not trigger a full rebuild. To publish
 * new scheduled articles, a full redeploy is needed. Options:
 * - Vercel Deploy Hook triggered by an external cron (e.g. GitHub Action)
 * - Push to main branch to trigger automatic deployment
 * The Vercel cron here still provides value by revalidating any ISR
 * pages (e.g. API routes, dynamic segments) on a daily schedule.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  revalidatePath('/', 'layout');

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
  });
}
