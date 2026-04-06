import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';
import { Resend } from 'resend';
import { ConfirmationEmail } from '@/emails/confirmation-email';

const resend = new Resend(process.env.RESEND_API_KEY);

const VALID_SOURCES = ['homepage', 'directory-waitlist', 'article-cta'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, source, consentText } = body;

    // Validate email
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Validate source
    if (!source || !VALID_SOURCES.includes(source)) {
      return NextResponse.json(
        { error: 'Invalid subscription source.' },
        { status: 400 }
      );
    }

    // Validate consent text
    if (!consentText || typeof consentText !== 'string') {
      return NextResponse.json(
        { error: 'Consent is required to subscribe.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check for existing subscriber
    const { data: existing } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    let token: string;

    if (existing) {
      // Already confirmed and active
      if (existing.confirmed && !existing.unsubscribed_at) {
        return NextResponse.json(
          { error: 'This email is already subscribed.' },
          { status: 409 }
        );
      }

      // Regenerate token for unconfirmed or resubscribing users
      token = crypto.randomUUID();

      const updateData: Record<string, unknown> = {
        confirmation_token: token,
        consent_text: consentText,
        consent_timestamp: new Date().toISOString(),
        ip_address: ip,
      };

      // Reset unsubscribed status if resubscribing
      if (existing.unsubscribed_at) {
        updateData.unsubscribed_at = null;
        updateData.confirmed = false;
        updateData.confirmed_at = null;
      }

      const { error: updateError } = await supabaseAdmin
        .from('subscribers')
        .update(updateData)
        .eq('id', existing.id);

      if (updateError) {
        console.error('Subscriber update error:', updateError);
        return NextResponse.json(
          { error: 'Something went wrong. Please try again.' },
          { status: 500 }
        );
      }
    } else {
      // New subscriber
      token = crypto.randomUUID();

      const { error: insertError } = await supabaseAdmin
        .from('subscribers')
        .insert({
          email: normalizedEmail,
          source,
          confirmed: false,
          confirmation_token: token,
          consent_text: consentText,
          consent_timestamp: new Date().toISOString(),
          ip_address: ip,
        });

      if (insertError) {
        console.error('Subscriber insert error:', insertError);
        return NextResponse.json(
          { error: 'Something went wrong. Please try again.' },
          { status: 500 }
        );
      }
    }

    // Build URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const confirmUrl = `${baseUrl}/api/confirm?token=${token}`;
    const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${token}`;

    // Send confirmation email
    const { error: emailError } = await resend.emails.send({
      from: 'The Ledger <onboarding@resend.dev>',
      to: [normalizedEmail],
      subject: 'Confirm your subscription to The Ledger',
      react: ConfirmationEmail({ confirmUrl, unsubscribeUrl }),
    });

    if (emailError) {
      console.error('Email send error:', emailError);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscribe route error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
