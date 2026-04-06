-- Page views table (per D-01, ANAL-01)
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent_hash TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
-- No SELECT/UPDATE/DELETE policies = no public access (per D-08, ANAL-07)
-- Service role bypasses RLS for inserts

CREATE INDEX idx_page_views_created_at ON public.page_views(created_at);
CREATE INDEX idx_page_views_path ON public.page_views(path);

-- Article reads table (per D-04, ANAL-04)
CREATE TABLE IF NOT EXISTS public.article_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  scroll_depth INTEGER NOT NULL DEFAULT 75,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.article_reads ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_article_reads_created_at ON public.article_reads(created_at);
CREATE INDEX idx_article_reads_slug ON public.article_reads(article_slug);

-- Outbound clicks table (per D-06, ANAL-05)
CREATE TABLE IF NOT EXISTS public.outbound_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  target_url TEXT NOT NULL,
  link_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.outbound_clicks ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_outbound_clicks_created_at ON public.outbound_clicks(created_at);
CREATE INDEX idx_outbound_clicks_slug ON public.outbound_clicks(article_slug);

-- Daily summary tables for rollups (per D-07, ANAL-06)
CREATE TABLE IF NOT EXISTS public.daily_page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  path TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  UNIQUE(date, path)
);

ALTER TABLE public.daily_page_views ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.daily_article_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  article_slug TEXT NOT NULL,
  read_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(date, article_slug)
);

ALTER TABLE public.daily_article_reads ENABLE ROW LEVEL SECURITY;
