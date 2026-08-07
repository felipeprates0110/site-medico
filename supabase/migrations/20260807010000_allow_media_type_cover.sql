-- Libera o tipo 'cover' para capas de artigos do blog.
-- Antes disso a constraint só aceitava: profile, clinic, procedure, other.

ALTER TABLE public.media
  DROP CONSTRAINT IF EXISTS media_type_check;

ALTER TABLE public.media
  ADD CONSTRAINT media_type_check
  CHECK (type = ANY (ARRAY[
    'profile'::text,
    'clinic'::text,
    'procedure'::text,
    'cover'::text,
    'other'::text
  ]));
