-- ============================================
-- EVENTOS DE ACESSO AO SITE (analytics interno)
-- ============================================
-- Guarda page views e cliques em CTAs (WhatsApp, Agendar, etc.)
-- Sem dados pessoais: só evento, caminho e sessão anônima.

CREATE TABLE IF NOT EXISTS site_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '/',
  session_id TEXT,
  referrer TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_events_created_at ON site_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_event_name ON site_events(event_name);
CREATE INDEX IF NOT EXISTS idx_site_events_path ON site_events(path);
CREATE INDEX IF NOT EXISTS idx_site_events_session_id ON site_events(session_id);
CREATE INDEX IF NOT EXISTS idx_site_events_name_created
  ON site_events(event_name, created_at DESC);

ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;

-- Sem políticas públicas de leitura/escrita: só service role (API Next.js)

COMMENT ON TABLE site_events IS 'Eventos anônimos de acesso e cliques no site público';
COMMENT ON COLUMN site_events.session_id IS 'ID anônimo gerado no navegador (sessionStorage), não identifica a pessoa';
COMMENT ON COLUMN site_events.event_name IS 'Ex.: page_view, whatsapp_click, agendar_click, phone_click, email_click';
