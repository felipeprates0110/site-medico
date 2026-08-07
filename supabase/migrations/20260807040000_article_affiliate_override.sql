-- ============================================
-- OVERRIDE DE OFERTA AFILIADA POR ARTIGO
-- ============================================
-- auto  = escolher por peso na categoria (padrão)
-- offer = forçar affiliate_offer_id
-- hide  = não mostrar caixa neste artigo

ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS affiliate_display TEXT NOT NULL DEFAULT 'auto'
    CHECK (affiliate_display IN ('auto', 'offer', 'hide'));

ALTER TABLE blog_articles
  ADD COLUMN IF NOT EXISTS affiliate_offer_id UUID
    REFERENCES affiliate_offers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_blog_articles_affiliate_offer_id
  ON blog_articles(affiliate_offer_id);

COMMENT ON COLUMN blog_articles.affiliate_display IS
  'auto = peso da categoria; offer = oferta específica; hide = sem caixa';
COMMENT ON COLUMN blog_articles.affiliate_offer_id IS
  'Oferta forçada quando affiliate_display = offer';
