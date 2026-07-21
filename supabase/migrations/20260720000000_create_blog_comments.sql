-- ============================================
-- TABELA DE COMENTÁRIOS DO BLOG
-- ============================================
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES blog_articles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  doctor_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_article_id ON blog_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at DESC);

DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;

-- Leitura pública apenas de comentários aprovados
DROP POLICY IF EXISTS "Public read for approved blog_comments" ON blog_comments;
CREATE POLICY "Public read for approved blog_comments" ON blog_comments
  FOR SELECT USING (status = 'approved');

COMMENT ON TABLE blog_comments IS 'Comentários e dúvidas dos leitores nos artigos do blog (com moderação)';
COMMENT ON COLUMN blog_comments.doctor_reply IS 'Resposta do médico ao comentário';
COMMENT ON COLUMN blog_comments.status IS 'pending = aguardando moderação; approved = visível no artigo; rejected = oculto';
