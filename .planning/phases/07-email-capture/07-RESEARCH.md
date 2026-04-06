# Phase 7: Email Capture - Research

**Researched:** 2026-04-06
**Domain:** Email subscription system (Supabase + Resend + React Email + GDPR)
**Confidence:** HIGH

## Summary

Phase 7 builds a complete email subscription system: a Supabase `subscribers` table, API routes for subscribe/confirm/unsubscribe, a confirmation email via Resend with React Email components, and a reusable `EmailCapture` client component that replaces the existing `EmailCTAPlaceholder` on three pages. The GDPR requirements (double opt-in, consent proof, unsubscribe) are well-defined in CONTEXT.md and map cleanly to the stack already specified in CLAUDE.md.

The critical finding is that this project does NOT use Supabase Auth -- it only needs direct database operations from API routes. This means `@supabase/ssr` is unnecessary overhead. A simple admin client using `@supabase/supabase-js` with the service role key (already in `.env.local`) is the correct pattern. The Resend SDK accepts React Email components directly via the `react` parameter, so `@react-email/render` is only needed if generating plain text fallbacks. Both `@react-email/components` and `@react-email/render` require `serverComponentsExternalPackages` config in Next.js 14 to avoid ReactServerComponentsError.

**Primary recommendation:** Use `@supabase/supabase-js` with service role key for all DB operations in API routes. Use Resend's `react` parameter to send React Email components directly. Add `serverComponentsExternalPackages` to `next.config.mjs` for react-email compatibility.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Inline form (email input + consent checkbox + submit button). Different heading per source.
- **D-02:** Inline success message -- form replaces itself, no page redirect.
- **D-03:** Source tracking via hidden field: `homepage`, `directory-waitlist`, `article-cta`.
- **D-04:** Consent checkbox unchecked by default, text: "I agree to receive email updates from The Ledger. View our [Privacy Policy](/privacy)."
- **D-05:** Consent text stored as string per subscriber (no version table).
- **D-06:** IP address, consent text, and timestamp stored per subscriber for GDPR proof.
- **D-07:** Confirmation email only (no separate welcome email). Stays within Resend 100/day free tier.
- **D-08:** Confirmation email uses React Email components, branded with "The Ledger" styling.
- **D-09:** Every email includes an unsubscribe link.
- **D-10:** Simple in-memory rate limiting -- IP-based, 5 requests/minute/IP.
- **D-11:** Supabase subscribers table schema: id, email, source, confirmed, confirmation_token, created_at, confirmed_at, consent_text, consent_timestamp, ip_address, unsubscribed_at.
- **D-12:** After clicking confirmation link, user sees thank-you page at `/subscribe/confirm`.

### Claude's Discretion
- Exact form styling and layout within the editorial brand
- Loading state animation (spinner vs text)
- Error message wording (invalid email, already subscribed, rate limited)
- Confirmation email HTML layout
- React Email component structure
- Supabase RLS policies
- API route error handling details
- Unsubscribe page design

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EMAIL-01 | Supabase subscribers table with all specified fields | Supabase SQL migration pattern; service role client for admin inserts |
| EMAIL-02 | API route validates email, inserts to Supabase, sends confirmation via Resend | Next.js App Router route handler + Resend `react` parameter pattern |
| EMAIL-03 | Double opt-in: confirmation email with magic link, updates confirmed flag | Crypto token generation, GET route handler for confirm endpoint |
| EMAIL-04 | Source tracking: homepage, directory-waitlist, article-cta | Hidden field in form, validated server-side against allowed enum |
| EMAIL-05 | GDPR consent: explicit checkbox, consent text stored, privacy policy link | Client component with checkbox state, consent string passed to API |
| EMAIL-06 | Unsubscribe mechanism: link in every email, updates Supabase record | Unsubscribe API route + confirmation page |
| EMAIL-07 | Reusable EmailCapture component with configurable source | Client component with `source` prop, replaces EmailCTAPlaceholder |
| EMAIL-08 | Consent proof logging: timestamp, IP, consent text per subscriber | `x-forwarded-for` header extraction, stored alongside subscriber row |
</phase_requirements>

## Standard Stack

### Core (to install)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | ^2.101.1 | Supabase client | Direct DB operations via service role key. No auth needed. |
| resend | ^6.10.0 | Email delivery | Transactional email API. `react` param accepts React components directly. |
| @react-email/components | ^1.0.11 | Email template components | Pre-built email-safe HTML components (Button, Container, Text, etc.) |

### Supporting (optional)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @react-email/render | ^2.0.5 | Render email to HTML string | Only if plain text email fallback is needed. Resend handles rendering via `react` param. |

### NOT Needed
| Library | Why Not |
|---------|---------|
| @supabase/ssr | No Supabase Auth in this project. Direct `createClient` with service role key is simpler and correct. |
| nodemailer | Resend handles delivery. No SMTP needed. |
| rate-limiter-flexible | D-10 specifies simple in-memory Map. No external dependency. |
| uuid | Node.js `crypto.randomUUID()` is built-in since Node 19+. |
| zod (for API validation) | Already installed (Velite dependency). Reuse for email validation in API route. |

**Installation:**
```bash
npm install @supabase/supabase-js@^2 resend@^6 @react-email/components@^1
```

## Architecture Patterns

### New Files Structure
```
src/
├── lib/
│   └── supabase/
│       └── admin.ts              # Service role client (server-only)
├── components/
│   └── email-capture.tsx         # "use client" - reusable form component
├── emails/
│   └── confirmation-email.tsx    # React Email template
├── app/
│   ├── api/
│   │   ├── subscribe/
│   │   │   └── route.ts          # POST: validate, insert, send email
│   │   ├── confirm/
│   │   │   └── route.ts          # GET: validate token, update confirmed
│   │   └── unsubscribe/
│   │       └── route.ts          # GET: mark unsubscribed
│   ├── subscribe/
│   │   └── confirm/
│   │       └── page.tsx          # Thank-you page (server component)
│   └── unsubscribe/
│       └── page.tsx              # Unsubscribe confirmation (server component)
```

### Pattern 1: Service Role Admin Client
**What:** A server-only Supabase client using the service role key that bypasses RLS.
**When to use:** API routes that insert/update subscribers without user auth.
**Example:**
```typescript
// src/lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';

// Server-only -- SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);
```
Source: [Supabase service role discussion](https://github.com/orgs/supabase/discussions/30739)

### Pattern 2: API Route with Resend + React Email
**What:** Next.js App Router route handler that sends emails via Resend using React components.
**When to use:** The subscribe POST endpoint.
**Example:**
```typescript
// src/app/api/subscribe/route.ts
import { Resend } from 'resend';
import { ConfirmationEmail } from '@/emails/confirmation-email';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  // ... validate, insert to Supabase, generate token ...

  const { error } = await resend.emails.send({
    from: 'The Ledger <noreply@resend.dev>',  // Use resend.dev until custom domain
    to: [body.email],
    subject: 'Confirm your subscription to The Ledger',
    react: ConfirmationEmail({ confirmUrl, unsubscribeUrl }),
  });

  if (error) {
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return Response.json({ success: true });
}
```
Source: [Resend Next.js docs](https://resend.com/docs/send-with-nextjs)

### Pattern 3: React Email Template
**What:** Email template as a React component using @react-email/components.
**When to use:** Confirmation email (and any future emails).
**Example:**
```typescript
// src/emails/confirmation-email.tsx
import {
  Body, Button, Container, Head, Heading, Html,
  Link, Preview, Section, Text,
} from '@react-email/components';

interface ConfirmationEmailProps {
  confirmUrl: string;
  unsubscribeUrl: string;
}

export function ConfirmationEmail({ confirmUrl, unsubscribeUrl }: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your subscription to The Ledger</Preview>
      <Body style={{ backgroundColor: '#FAFAF9', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px' }}>
          <Heading style={{ fontSize: '24px', color: '#1C1917' }}>
            Confirm Your Subscription
          </Heading>
          <Text style={{ fontSize: '16px', color: '#44403C', lineHeight: '1.6' }}>
            Thanks for subscribing to The Ledger. Click the button below to confirm
            your email address.
          </Text>
          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
              href={confirmUrl}
              style={{
                backgroundColor: '#EA580C',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '6px',
                fontSize: '16px',
                textDecoration: 'none',
              }}
            >
              Confirm Subscription
            </Button>
          </Section>
          <Text style={{ fontSize: '12px', color: '#A8A29E' }}>
            If you didn&apos;t request this, you can safely ignore this email.
          </Text>
          <Text style={{ fontSize: '12px', color: '#A8A29E' }}>
            <Link href={unsubscribeUrl}>Unsubscribe</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Pattern 4: In-Memory Rate Limiter
**What:** Simple Map-based IP rate limiter for the subscribe endpoint.
**When to use:** Prevents spam without external dependencies (D-10).
**Example:**
```typescript
// src/lib/rate-limit.ts
const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= limit) {
    return false; // blocked
  }

  entry.count++;
  return true; // allowed
}
```
Note: In-memory state resets on serverless cold starts. This is acceptable per D-10 -- it's spam prevention, not security-critical.

### Pattern 5: Client Component Form with Server Fetch
**What:** "use client" form component that POSTs to the API route.
**When to use:** The EmailCapture component (EMAIL-07).
**Example:**
```typescript
// src/components/email-capture.tsx
'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  source: 'homepage' | 'directory-waitlist' | 'article-cta';
  heading?: string;
  description?: string;
}

export function EmailCapture({ source, heading, description }: EmailCaptureProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const consentText = 'I agree to receive email updates from The Ledger. View our Privacy Policy.';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent) return;

    setStatus('loading');
    const formData = new FormData(e.currentTarget);

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        source,
        consentText,
      }),
    });

    if (res.ok) {
      setStatus('success');
    } else {
      const data = await res.json();
      setErrorMessage(data.error || 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (/* inline success message per D-02 */);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* email input, consent checkbox, submit button */}
    </form>
  );
}
```

### Anti-Patterns to Avoid
- **Server Action for subscribe:** Server Actions re-render the page. An API route is better for a client-side form that manages its own state (loading, success, error).
- **Anon key for inserts:** The anon key with RLS would require a public insert policy on subscribers. The service role key from an API route is safer -- the key never reaches the client.
- **Pre-rendering the confirmation page with data:** The `/subscribe/confirm` thank-you page should be a static page. Token validation happens in the API route, which redirects to this page only on success.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Email delivery | SMTP/Nodemailer setup | Resend SDK | Handles deliverability, DNS, bounces. API key already provisioned. |
| Email HTML | Raw HTML templates | React Email components | Email HTML is notoriously fragile. React Email handles client compatibility. |
| Crypto tokens | Custom random strings | `crypto.randomUUID()` | Built into Node.js. Cryptographically secure. No dependency. |
| Email validation | Regex | Zod `z.string().email()` | Zod is already installed. Handles edge cases regex misses. |

**Key insight:** Email HTML is the most deceptive complexity here. What looks simple in a browser breaks in Outlook, Gmail, Yahoo. React Email abstracts away 20 years of email client quirks.

## Common Pitfalls

### Pitfall 1: ReactServerComponentsError with React Email
**What goes wrong:** Importing `@react-email/components` or `@react-email/render` in a route handler causes Next.js to throw: "You're importing a component that imports react-dom/server."
**Why it happens:** React Email internally uses `react-dom/server` for rendering, which conflicts with Next.js server component bundling.
**How to avoid:** Add to `next.config.mjs`:
```javascript
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@react-email/components',
      '@react-email/render',
    ],
  },
};
```
**Warning signs:** Build fails with ReactServerComponentsError mentioning react-dom/server.
Source: [GitHub Issue #977](https://github.com/resend/react-email/issues/977)

### Pitfall 2: Resend "from" Address on Free Tier
**What goes wrong:** Emails fail to send or go to spam because the "from" address isn't verified.
**Why it happens:** Resend free tier requires using `onboarding@resend.dev` or a verified domain. Without a custom domain, you must use `@resend.dev`.
**How to avoid:** Use `The Ledger <onboarding@resend.dev>` as the from address. When a custom domain is added later, update to a branded address.
**Warning signs:** Resend API returns 403 or emails land in spam.

### Pitfall 3: IP Address Extraction in Vercel
**What goes wrong:** `request.headers.get('x-forwarded-for')` returns `null` or a comma-separated list.
**Why it happens:** Vercel (and other proxies) may chain multiple IPs in the header.
**How to avoid:** Extract the first IP: `const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'`. In local dev, this will be `::1` or `127.0.0.1`.
**Warning signs:** All subscribers have the same IP, or IP is null.

### Pitfall 4: Confirmation Token Expiry Not Handled
**What goes wrong:** Users click stale confirmation links weeks later and nothing happens (or worse, it errors).
**Why it happens:** No expiry mechanism on the confirmation token.
**How to avoid:** Either (a) accept tokens indefinitely (simplest, acceptable for email confirm), or (b) add a `token_expires_at` column and check it. For this project, option (a) is fine -- there's no security risk in a late email confirmation.

### Pitfall 5: Duplicate Email Handling
**What goes wrong:** User submits the same email twice and gets a Supabase unique constraint error.
**Why it happens:** No check for existing subscriber before insert.
**How to avoid:** Query for existing email first. If found and confirmed, return "already subscribed." If found but unconfirmed, resend the confirmation email (regenerate token). If found but unsubscribed, resubscribe (reset unsubscribed_at, generate new token).

### Pitfall 6: Rate Limiter Resets on Cold Start
**What goes wrong:** In-memory Map is cleared when Vercel spins up a new serverless function instance.
**Why it happens:** Serverless functions are stateless across invocations.
**How to avoid:** Accept this limitation (D-10 chose simplicity over robustness). The rate limiter protects against rapid-fire spam within a single function lifetime, not persistent abuse. For persistent protection, Supabase's unique email constraint prevents duplicate records regardless.

## Code Examples

### Supabase SQL Migration
```sql
-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('homepage', 'directory-waitlist', 'article-cta')),
  confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  consent_text TEXT NOT NULL,
  consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  unsubscribed_at TIMESTAMPTZ
);

-- RLS: Enable but allow service role to bypass
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- No public policies needed -- all access via service role key
-- This means anon key cannot read/write this table (good for security)

-- Index for token lookups during confirmation
CREATE INDEX idx_subscribers_confirmation_token ON public.subscribers(confirmation_token);

-- Index for email lookups during duplicate check
CREATE INDEX idx_subscribers_email ON public.subscribers(email);
```

### next.config.mjs Update
```javascript
/** @type {import('next').NextConfig} */

const isDev = process.argv.indexOf('dev') !== -1;
const isBuild = process.argv.indexOf('build') !== -1;
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1';
  const { build } = await import('velite');
  await build({ watch: isDev, clean: !isDev });
}

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@react-email/components',
      '@react-email/render',
    ],
  },
};

export default nextConfig;
```

### Confirmation Flow URL Pattern
```
1. User submits form -> POST /api/subscribe
2. API generates token, inserts row, sends email with link:
   {SITE_URL}/api/confirm?token={confirmation_token}
3. User clicks link -> GET /api/confirm?token=xxx
4. API validates token, updates confirmed=true, confirmed_at=now()
5. API redirects to /subscribe/confirm (thank-you page)

Unsubscribe:
1. Email contains link: {SITE_URL}/api/unsubscribe?token={confirmation_token}
2. GET /api/unsubscribe?token=xxx
3. API sets unsubscribed_at=now()
4. Redirects to /unsubscribe (confirmation page)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @supabase/auth-helpers-nextjs | @supabase/ssr | 2024 | Old package deprecated. But for this project, neither is needed -- direct createClient with service role key. |
| framer-motion for email | React Email (@react-email/components) | 2023 | Purpose-built email components with client compatibility. |
| Manual HTML email | React Email + Resend `react` param | 2023 | Send React components directly, no manual render step. |
| SendGrid/Mailchimp | Resend | 2023 | Simpler API, React Email integration, better DX. |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js crypto.randomUUID | Token generation | Yes | Built-in (Node 19+) | -- |
| Supabase project | Subscriber storage | Yes | Keys in .env.local | -- |
| Resend API | Email delivery | Yes | Key in .env.local | -- |
| @supabase/supabase-js | DB client | Not installed | ^2.101.1 (npm latest) | Install in Wave 0 |
| resend | Email SDK | Not installed | ^6.10.0 (npm latest) | Install in Wave 0 |
| @react-email/components | Email templates | Not installed | ^1.0.11 (npm latest) | Install in Wave 0 |

**Missing dependencies with no fallback:** None -- all external services (Supabase, Resend) have API keys already configured.

**Missing dependencies with fallback:** Three npm packages need installation. This is a Wave 0 task.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected |
| Config file | None -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EMAIL-01 | Subscribers table exists with correct schema | manual | Run SQL migration in Supabase dashboard | N/A |
| EMAIL-02 | POST /api/subscribe validates and inserts | integration | Manual curl/fetch test | N/A |
| EMAIL-03 | Confirmation link updates confirmed flag | integration | Manual: click link in email | N/A |
| EMAIL-04 | Source field tracked per subscriber | integration | Submit from each page, check Supabase | N/A |
| EMAIL-05 | Consent checkbox blocks submission when unchecked | manual | Browser test | N/A |
| EMAIL-06 | Unsubscribe link updates record | integration | Manual: click unsubscribe link | N/A |
| EMAIL-07 | EmailCapture renders on all 3 pages | manual | Visual inspection / dev server | N/A |
| EMAIL-08 | IP, consent text, timestamp stored | integration | Check Supabase row after subscribe | N/A |

### Sampling Rate
- **Per task commit:** Manual dev server testing (no automated test suite)
- **Per wave merge:** Manual end-to-end flow test
- **Phase gate:** Full subscribe/confirm/unsubscribe flow verified manually

### Wave 0 Gaps
- No test framework installed. Given this is a primarily API + form phase, manual integration testing is the pragmatic approach. A future phase could add Jest/Vitest for API route unit tests.
- The primary verification method is: submit form on dev server, check Supabase table, check email in inbox, click confirm link, verify record update.

## Open Questions

1. **Resend "from" address**
   - What we know: Free tier requires `@resend.dev` domain or a verified custom domain.
   - What's unclear: Whether the project has a verified domain on Resend. The `.env.local` has `RESEND_API_KEY` but domain verification status is unknown.
   - Recommendation: Use `The Ledger <onboarding@resend.dev>` initially. Add custom domain when brand domain is chosen.

2. **Supabase migration execution**
   - What we know: SQL needs to run in Supabase to create the table.
   - What's unclear: Whether there's a migration tool set up, or if SQL is run manually via Supabase dashboard.
   - Recommendation: Provide SQL file in the repo. Developer runs it manually via Supabase SQL Editor. No migration tooling needed for a single table.

3. **NEXT_PUBLIC_SITE_URL value**
   - What we know: The env var exists in `.env.local`.
   - What's unclear: Whether it points to `localhost:3000` for dev or the Vercel deployment URL.
   - Recommendation: API routes should use `process.env.NEXT_PUBLIC_SITE_URL` for confirmation/unsubscribe links. This must be set correctly in both local and Vercel environments.

## Sources

### Primary (HIGH confidence)
- [Resend Next.js docs](https://resend.com/docs/send-with-nextjs) - API route pattern, `react` parameter
- [Supabase SSR docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client) - Client setup patterns
- [Supabase service role discussion](https://github.com/orgs/supabase/discussions/30739) - Service role key usage in Next.js
- [React Email components](https://react.email/components) - Available components for email templates
- [React Email render docs](https://react.email/docs/utilities/render) - Render function API

### Secondary (MEDIUM confidence)
- [React Email + Next.js issue #977](https://github.com/resend/react-email/issues/977) - serverComponentsExternalPackages fix (verified by multiple reports)
- [Resend Next.js 14 changelog](https://resend.com/changelog/adding-support-for-nextjs-14) - Official compatibility confirmation

### Tertiary (LOW confidence)
- None -- all findings verified against official sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages specified in CLAUDE.md, versions verified against npm registry
- Architecture: HIGH - Pattern is well-established (API route + Supabase + Resend), all decisions locked in CONTEXT.md
- Pitfalls: HIGH - serverComponentsExternalPackages issue verified via GitHub issue with 50+ reports; other pitfalls are standard serverless patterns

**Research date:** 2026-04-06
**Valid until:** 2026-05-06 (stable domain -- Resend, Supabase, React Email are all mature)
