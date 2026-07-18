-- Schema do Banco de Dados - Site Médico
-- Supabase PostgreSQL

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA DE USUÁRIOS (Autenticação)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'secretary', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por email
CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- TABELA DE CONFIGURAÇÕES DO SITE
-- ============================================
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_name TEXT NOT NULL,
  doctor_crm TEXT NOT NULL,
  doctor_rqe TEXT[] DEFAULT '{}',
  specialty TEXT,
  subspecialty TEXT,
  bio TEXT,
  profile_photo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- TABELA DE INFORMAÇÕES DE CONTATO
-- ============================================
CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

-- ============================================
-- TABELA DE ENDEREÇOS/CONSULTÓRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_name TEXT NOT NULL,
  street TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABELA DE ESPECIALIDADES
-- ============================================
CREATE TABLE IF NOT EXISTS specialties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'heart',
  benefits TEXT[] DEFAULT '{}',
  common_conditions TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para slug único
CREATE INDEX idx_specialties_slug ON specialties(slug);
CREATE INDEX idx_specialties_active ON specialties(is_active);

-- ============================================
-- TABELA DE TRATAMENTOS
-- ============================================
CREATE TABLE IF NOT EXISTS treatments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  symptoms TEXT[] DEFAULT '{}',
  diagnosis TEXT[] DEFAULT '{}',
  treatment TEXT[] DEFAULT '{}',
  preventive_care TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para slug único
CREATE INDEX idx_treatments_slug ON treatments(slug);
CREATE INDEX idx_treatments_active ON treatments(is_active);

-- ============================================
-- TABELA DE CONVÊNIOS
-- ============================================
CREATE TABLE IF NOT EXISTS insurance_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('private', 'public', 'corporate')),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para categoria
CREATE INDEX idx_insurance_category ON insurance_plans(category);
CREATE INDEX idx_insurance_active ON insurance_plans(is_active);

-- ============================================
-- TABELA DE AVALIAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author TEXT NOT NULL,
  date DATE NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  service TEXT,
  verified BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'site', -- 'site', 'doctoralia', 'google'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para filtros
CREATE INDEX idx_reviews_approved ON reviews(approved);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_date ON reviews(date DESC);

-- ============================================
-- TABELA DE MÍDIA/IMAGENS
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('profile', 'clinic', 'procedure', 'other')),
  url TEXT NOT NULL,
  alt_text TEXT,
  file_size INT,
  mime_type TEXT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice por tipo
CREATE INDEX idx_media_type ON media(type);

-- ============================================
-- TABELA DE FAQ
-- ============================================
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('geral', 'agendamento', 'convenios', 'tratamentos')),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para categoria
CREATE INDEX idx_faq_category ON faq_items(category);
CREATE INDEX idx_faq_active ON faq_items(is_active);

-- ============================================
-- TABELA DE LOGS DE AUDITORIA
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca por usuário e data
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_table ON audit_logs(table_name);

-- ============================================
-- FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para updated_at
CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON contact_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialties_updated_at BEFORE UPDATE ON specialties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON treatments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insurance_plans_updated_at BEFORE UPDATE ON insurance_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS DE ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para leitura pública (dados do site)
CREATE POLICY "Public read for site_config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read for contact_info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Public read for addresses" ON addresses FOR SELECT USING (true);
CREATE POLICY "Public read for active specialties" ON specialties FOR SELECT USING (is_active = true);
CREATE POLICY "Public read for active treatments" ON treatments FOR SELECT USING (is_active = true);
CREATE POLICY "Public read for active insurance" ON insurance_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public read for approved reviews" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "Public read for media" ON media FOR SELECT USING (true);
CREATE POLICY "Public read for active faq" ON faq_items FOR SELECT USING (is_active = true);

-- Políticas para escrita apenas por usuários autenticados
-- (Vamos configurar auth.uid() quando configurar o Supabase Auth)

-- ============================================
-- INSERIR USUÁRIO ADMIN PADRÃO
-- ============================================
-- Senha padrão: "admin123" (TROCAR IMEDIATAMENTE após primeiro login)
-- Hash gerado com bcrypt rounds=10
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@drpedrofelipe.com.br',
  '$2a$10$rQ3LhJ8qVvZ.gxKGxYxpyOxH0zN9Nw5P7pq2X6qwYxN5zT8bJ9yWS',
  'Dr. Pedro Felipe Prates Silva',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- COMENTÁRIOS NAS TABELAS
-- ============================================
COMMENT ON TABLE users IS 'Usuários do sistema (admin, secretária, etc)';
COMMENT ON TABLE site_config IS 'Configurações gerais do site e dados do médico';
COMMENT ON TABLE contact_info IS 'Informações de contato (telefone, email, WhatsApp)';
COMMENT ON TABLE addresses IS 'Endereços dos consultórios';
COMMENT ON TABLE specialties IS 'Especialidades médicas oferecidas';
COMMENT ON TABLE treatments IS 'Tratamentos e doenças tratadas';
COMMENT ON TABLE insurance_plans IS 'Convênios médicos aceitos';
COMMENT ON TABLE reviews IS 'Avaliações de pacientes';
COMMENT ON TABLE media IS 'Arquivos de mídia (fotos, imagens)';
COMMENT ON TABLE faq_items IS 'Perguntas frequentes';
COMMENT ON TABLE audit_logs IS 'Log de auditoria de todas as alterações';
