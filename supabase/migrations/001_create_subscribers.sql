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

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_subscribers_confirmation_token ON public.subscribers(confirmation_token);
CREATE INDEX idx_subscribers_email ON public.subscribers(email);
