import { NextRequest, NextResponse } from 'next/server';

/**
 * Daily rebuild cron route - triggered at 06:00 UTC by Vercel Cron.
 *
 * Triggers a full Vercel deployment via Deploy Hook. This is required
 * because Velite compiles MDX at build time (SSG), so ISR revalidation
 * cannot surface articles whose publishDate just became current.
 * A full rebuild runs Velite, which re-evaluates publishDate filters
 * and generates static pages for newly-publishable articles.
 *
 * Setup: Create a Deploy Hook in Vercel Dashboard -> Settings -> Git ->
 * Deploy Hooks. Name it "Daily Rebuild" on "main" branch. Copy the URL
 * and set it as VERCEL_DEPLOY_HOOK_URL in environment variables.
 *
 * Fallback: If no deploy hook is configured, falls back to ISR
 * revalidation (which still refreshes dynamic/ISR pages).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (deployHookUrl) {
    // Trigger a full rebuild via Vercel Deploy Hook
    const response = await fetch(deployHookUrl, { method: 'POST' });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Deploy hook failed', status: response.status },
        { status: 502 }
      );
    }

    return NextResponse.json({
      triggered: true,
      method: 'deploy-hook',
      now: Date.now(),
    });
  }

  // Fallback: ISR revalidation (refreshes dynamic pages but not SSG)
  const { revalidatePath } = await import('next/cache');
  revalidatePath('/', 'layout');

  return NextResponse.json({
    revalidated: true,
    method: 'isr-fallback',
    now: Date.now(),
  });
}
