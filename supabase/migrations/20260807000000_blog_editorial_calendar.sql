-- ============================================
-- CALENDÁRIO EDITORIAL DO RITMOBLOG
-- Status ready/scheduled + regras por dia/categoria + alertas
-- ============================================

-- Ampliar status dos artigos: rascunho | na fila | agendado | publicado
ALTER TABLE blog_articles DROP CONSTRAINT IF EXISTS blog_articles_status_check;
ALTER TABLE blog_articles
  ADD CONSTRAINT blog_articles_status_check
  CHECK (status IN ('draft', 'ready', 'scheduled', 'published'));

-- Data/hora de agendamento pontual (posts especiais)
ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMP WITH TIME ZONE;

-- Rastreio de publicação automática por regra do calendário
ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS published_by_rule_id UUID;

ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS publish_slot_date DATE;

CREATE INDEX IF NOT EXISTS idx_blog_articles_ready_queue
  ON blog_articles (category_id, created_at ASC)
  WHERE status = 'ready';

CREATE INDEX IF NOT EXISTS idx_blog_articles_scheduled_at
  ON blog_articles (scheduled_at)
  WHERE status = 'scheduled';

-- ============================================
-- REGRAS DO CALENDÁRIO SEMANAL
-- weekday: 0=domingo … 6=sábado (mesmo que Date.getDay no JS)
-- ============================================
CREATE TABLE IF NOT EXISTS blog_publish_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  publish_time TIME NOT NULL DEFAULT '08:00',
  active BOOLEAN NOT NULL DEFAULT true,
  label TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_publish_rules_weekday
  ON blog_publish_rules (weekday)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_blog_publish_rules_category
  ON blog_publish_rules (category_id);

DROP TRIGGER IF EXISTS update_blog_publish_rules_updated_at ON blog_publish_rules;
CREATE TRIGGER update_blog_publish_rules_updated_at
  BEFORE UPDATE ON blog_publish_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FK opcional nos artigos (após criar a tabela de regras)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'blog_articles_published_by_rule_id_fkey'
  ) THEN
    ALTER TABLE blog_articles
      ADD CONSTRAINT blog_articles_published_by_rule_id_fkey
      FOREIGN KEY (published_by_rule_id)
      REFERENCES blog_publish_rules(id)
      ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================
-- ALERTAS DE SLOT VAZIO
-- ============================================
CREATE TABLE IF NOT EXISTS blog_publish_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id UUID NOT NULL REFERENCES blog_publish_rules(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  message TEXT NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (rule_id, slot_date)
);

CREATE INDEX IF NOT EXISTS idx_blog_publish_alerts_unresolved
  ON blog_publish_alerts (created_at DESC)
  WHERE resolved_at IS NULL;

-- ============================================
-- RLS (admin usa service role; leitura pública não precisa destas tabelas)
-- ============================================
ALTER TABLE blog_publish_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_publish_alerts ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE blog_publish_rules IS 'Regras do calendário editorial (dia da semana + categoria + horário)';
COMMENT ON TABLE blog_publish_alerts IS 'Alertas quando um slot do calendário não tinha artigo pronto na fila';
COMMENT ON COLUMN blog_articles.scheduled_at IS 'Data/hora para publicação agendada pontual';
COMMENT ON COLUMN blog_articles.published_by_rule_id IS 'Regra do calendário que publicou o artigo automaticamente';
COMMENT ON COLUMN blog_articles.publish_slot_date IS 'Data do slot (calendário Brasil) em que a regra publicou o artigo';
