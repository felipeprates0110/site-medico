-- Bio curta opcional para o card do autor no blog (AuthorBox).
-- A biografia completa (bio) continua sendo o currículo longo do perfil.

ALTER TABLE public.site_config
  ADD COLUMN IF NOT EXISTS bio_short TEXT;

COMMENT ON COLUMN public.site_config.bio_short IS
  'Bio curta opcional exibida no card do autor dos artigos do blog';
