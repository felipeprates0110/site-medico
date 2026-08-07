-- ============================================
-- OFERTAS AFILIADAS POR CATEGORIA DO BLOG
-- ============================================
CREATE TABLE IF NOT EXISTS affiliate_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT NOT NULL,
  url TEXT NOT NULL,
  weight INT NOT NULL DEFAULT 1 CHECK (weight >= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_offers_category_id
  ON affiliate_offers(category_id);

CREATE INDEX IF NOT EXISTS idx_affiliate_offers_category_active
  ON affiliate_offers(category_id, is_active);

DROP TRIGGER IF EXISTS update_affiliate_offers_updated_at ON affiliate_offers;
CREATE TRIGGER update_affiliate_offers_updated_at BEFORE UPDATE ON affiliate_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE affiliate_offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read for active affiliate_offers" ON affiliate_offers;
CREATE POLICY "Public read for active affiliate_offers" ON affiliate_offers
  FOR SELECT USING (is_active = true);

COMMENT ON TABLE affiliate_offers IS 'Ofertas afiliadas exibidas nos artigos do blog conforme a categoria';
COMMENT ON COLUMN affiliate_offers.weight IS 'Peso relativo na escolha estável por artigo (maior = mais frequente)';
COMMENT ON COLUMN affiliate_offers.is_active IS 'Só ofertas ativas entram no site público';

-- Seed inicial: só se a categoria existir (URLs editáveis no admin)
INSERT INTO affiliate_offers (category_id, title, description, button_text, url, weight, sort_order)
SELECT
  c.id,
  'Monitoramento Residencial Recomendado',
  'Para pacientes que precisam monitorar a pressão arterial em casa, podem ser indicados aparelhos digitais de braço validados clinicamente, que ajudam a obter medições mais confiáveis para a avaliação do cardiologista.',
  'Ver Monitores Aprovados na Amazon',
  'https://www.amazon.com.br/s?k=medidor+pressao+arterial+braco',
  60,
  0
FROM blog_categories c
WHERE c.slug IN ('hipertensao', 'hipertensão')
LIMIT 1;

INSERT INTO affiliate_offers (category_id, title, description, button_text, url, weight, sort_order)
SELECT
  c.id,
  'Exercício em Casa para Apoiar o Controle',
  'Atividade física regular ajuda no controle do peso e na saúde cardiovascular. Bicicletas ergométricas podem ser uma opção prática para quem prefere treinar em casa — sempre com orientação médica individualizada.',
  'Ver Bicicletas Ergométricas na Amazon',
  'https://www.amazon.com.br/s?k=bicicleta+ergometrica',
  25,
  1
FROM blog_categories c
WHERE c.slug IN ('hipertensao', 'hipertensão')
LIMIT 1;

INSERT INTO affiliate_offers (category_id, title, description, button_text, url, weight, sort_order)
SELECT
  c.id,
  'Material Educativo de Prevenção',
  'Conteúdos digitais podem complementar o aprendizado sobre hábitos saudáveis e prevenção cardiovascular. Escolha materiais de fontes confiáveis e lembre-se: nenhum ebook substitui avaliação médica.',
  'Ver Ebooks Recomendados',
  'https://hotmart.com',
  40,
  0
FROM blog_categories c
WHERE c.slug IN ('prevencao', 'prevenção')
LIMIT 1;
