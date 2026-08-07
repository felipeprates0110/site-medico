-- Interruptor mestre das ofertas afiliadas no site público.
-- false = nenhuma caixa de oferta aparece (útil em testes com site no ar).
-- true  = comportamento normal (respeita is_active e o modo por artigo).

ALTER TABLE public.site_config
  ADD COLUMN IF NOT EXISTS affiliate_offers_enabled BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.site_config.affiliate_offers_enabled IS
  'Interruptor mestre: quando false, oculta todas as ofertas afiliadas no site público sem alterar o cadastro individual.';
