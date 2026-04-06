import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!token) {
    return NextResponse.redirect(new URL('/', baseUrl));
  }

  // Find subscriber by token
  const { data: subscriber } = await supabaseAdmin
    .from('subscribers')
    .select('id')
    .eq('confirmation_token', token)
    .single();

  if (!subscriber) {
    return NextResponse.redirect(
      new URL('/unsubscribe?error=invalid', baseUrl)
    );
  }

  // Mark as unsubscribed
  const { error } = await supabaseAdmin
    .from('subscribers')
    .update({
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('id', subscriber.id);

  if (error) {
    console.error('Unsubscribe update error:', error);
    return NextResponse.redirect(
      new URL('/unsubscribe?error=invalid', baseUrl)
    );
  }

  return NextResponse.redirect(new URL('/unsubscribe', baseUrl));
}
