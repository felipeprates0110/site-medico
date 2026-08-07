-- Lista editável de termos proibidos nos comentários do blog.
-- Um termo por linha; a API pública bloqueia o envio antes da moderação.

ALTER TABLE public.site_config
  ADD COLUMN IF NOT EXISTS blocked_comment_terms TEXT DEFAULT '';

COMMENT ON COLUMN public.site_config.blocked_comment_terms IS
  'Palavras/termos proibidos em comentários do blog (um por linha). Bloqueio automático antes da moderação.';
