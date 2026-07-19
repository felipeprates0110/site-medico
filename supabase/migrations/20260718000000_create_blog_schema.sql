-- ============================================
-- TABELA DE CATEGORIAS DO BLOG
-- ============================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- ============================================
-- TABELA DE ARTIGOS DO BLOG
-- ============================================
CREATE TABLE IF NOT EXISTS blog_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_status ON blog_articles(status);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category_id);

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_articles_updated_at ON blog_articles;
CREATE TRIGGER update_blog_articles_updated_at BEFORE UPDATE ON blog_articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Categorias: leitura pública
DROP POLICY IF EXISTS "Public read for blog_categories" ON blog_categories;
CREATE POLICY "Public read for blog_categories" ON blog_categories FOR SELECT USING (true);

-- Artigos: leitura pública apenas para publicados
DROP POLICY IF EXISTS "Public read for published blog_articles" ON blog_articles;
CREATE POLICY "Public read for published blog_articles" ON blog_articles FOR SELECT USING (status = 'published');

-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================
COMMENT ON TABLE blog_categories IS 'Categorias dos artigos do blog';
COMMENT ON TABLE blog_articles IS 'Artigos do blog (RitmoBlog)';

-- ============================================
-- STORAGE PARA IMAGENS DO BLOG
-- ============================================
-- Nota: A criação de buckets no Supabase via SQL requer permissões de superuser ou a chamada de funções específicas.
-- Se a extensão storage estiver habilitada, podemos inserir diretamente na tabela storage.buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage para o bucket blog-images
-- Permitir leitura pública
DROP POLICY IF EXISTS "Public Access to blog-images" ON storage.objects;
CREATE POLICY "Public Access to blog-images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
