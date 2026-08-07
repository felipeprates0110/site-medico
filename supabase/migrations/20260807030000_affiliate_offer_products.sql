-- ============================================
-- PRODUTOS MÚLTIPLOS POR OFERTA (com foto)
-- ============================================
-- products: [{ "label", "url", "image_url", "sort_order" }]
-- image_url: link da foto (ex.: site do fabricante)

ALTER TABLE affiliate_offers
  ADD COLUMN IF NOT EXISTS products JSONB NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN affiliate_offers.products IS
  'Produtos da oferta: [{label, url, image_url, sort_order}]. image_url pode ser URL do fabricante.';

-- Migra ofertas antigas (1 botão + 1 URL) para a lista de produtos
UPDATE affiliate_offers
SET products = jsonb_build_array(
  jsonb_build_object(
    'label', COALESCE(NULLIF(TRIM(button_text), ''), 'Ver oferta'),
    'url', COALESCE(TRIM(url), ''),
    'image_url', '',
    'sort_order', 0
  )
)
WHERE products = '[]'::jsonb
  AND COALESCE(TRIM(button_text), '') <> '';
