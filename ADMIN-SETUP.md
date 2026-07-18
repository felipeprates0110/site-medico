# 🔐 Guia de Configuração do Painel Administrativo

Este guia explica como configurar o painel administrativo do site.

---

## 📋 PRÉ-REQUISITOS

- Conta no Supabase (gratuita)
- Conta na Vercel (gratuita)
- Node.js 18+ instalado

---

## 🚀 PASSO 1: Configurar Supabase

### 1.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização (se necessário)
4. Crie um novo projeto:
   - **Name:** site-medico-drpedro
   - **Database Password:** (escolha uma senha forte e anote)
   - **Region:** South America (São Paulo) - recomendado
   - Clique em "Create new project"

⏱️ Aguarde 2-3 minutos enquanto o banco é provisionado.

### 1.2 Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **New query**
3. Copie TODO o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor
5. Clique em **Run** (▶️)

✅ Você verá "Success. No rows returned" - está correto!

### 1.3 Obter as Credenciais

1. Vá em **Settings** → **API** (menu lateral)
2. Copie as seguintes informações:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE:** O `service_role key` é SECRETO! Nunca compartilhe!

---

## 🔑 PASSO 2: Configurar Variáveis de Ambiente

### 2.1 Criar arquivo `.env.local`

Na raiz do projeto `site-medico`, crie um arquivo chamado `.env.local`:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gere-uma-chave-secreta-aqui-use-o-comando-abaixo

# Supabase (cole as credenciais do passo 1.3)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Vercel Blob (configurar depois do deploy)
# BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxx
```

### 2.2 Gerar NEXTAUTH_SECRET

Execute no terminal:

```bash
openssl rand -base64 32
```

Copie o resultado e cole no `.env.local`

---

## 👤 PASSO 3: Criar Dados Iniciais no Banco

### 3.1 Inserir Configuração do Site

No **SQL Editor** do Supabase, execute:

```sql
-- Inserir configuração do site
INSERT INTO site_config (
  doctor_name, 
  doctor_crm, 
  doctor_rqe, 
  specialty, 
  subspecialty, 
  bio
) VALUES (
  'Dr. Pedro Felipe Prates Silva',
  'CRM DF 18951',
  ARRAY['RQE 16475', 'RQE 16476'],
  'Cardiologia',
  'Eletrofisiologia Clínica e Invasiva',
  'Cardiologista e Arritmologista especialista em Eletrofisiologia Clínica e Invasiva pela UNIFESP/EPM.'
);

-- Inserir informações de contato
INSERT INTO contact_info (phone, whatsapp, email) VALUES (
  '61999999999',
  '5561999999999',
  'contato@drpedrofelipe.com.br'
);

-- Inserir endereço
INSERT INTO addresses (
  clinic_name,
  street,
  neighborhood,
  city,
  state,
  zip,
  is_primary
) VALUES (
  'Life Centro Cardiológico',
  'Q EQ 47-49 PROJEÇÃO 4, SALAS 701, 702 E 708',
  'Gama',
  'Brasília',
  'DF',
  '72405-498',
  true
);
```

---

## 🧪 PASSO 4: Testar Localmente

### 4.1 Instalar Dependências (se ainda não fez)

```bash
cd site-medico
npm install
```

### 4.2 Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

### 4.3 Acessar o Painel Admin

1. Abra: http://localhost:3000/login
2. **Email:** `admin@drpedrofelipe.com.br`
3. **Senha:** `admin123`
4. Clique em "Entrar"

✅ Se funcionou, você verá o Dashboard do admin!

### 4.4 ⚠️ TROCAR SENHA PADRÃO

**MUITO IMPORTANTE:** A senha `admin123` é temporária!

Para trocar, execute no Supabase SQL Editor:

```sql
-- Gere uma nova senha com bcrypt: https://bcrypt-generator.com/
-- Use 10 rounds

UPDATE users 
SET password_hash = '$2a$10$SEU_NOVO_HASH_AQUI'
WHERE email = 'admin@drpedrofelipe.com.br';
```

---

## 🌐 PASSO 5: Deploy na Vercel

### 5.1 Preparar para Deploy

1. Commitar o código:

```bash
git add .
git commit -m "Add admin panel with Supabase"
git push origin main
```

### 5.2 Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Import Project"
3. Selecione o repositório do GitHub
4. Configure as **Environment Variables**:

```
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=[cole o valor do .env.local]
NEXT_PUBLIC_SUPABASE_URL=[cole do .env.local]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[cole do .env.local]
SUPABASE_SERVICE_ROLE_KEY=[cole do .env.local]
```

5. Clique em "Deploy"

⏱️ Aguarde 2-3 minutos para o deploy completar.

---

## 📤 PASSO 6: Configurar Upload de Imagens (Vercel Blob)

### 6.1 Habilitar Vercel Blob

1. No painel da Vercel, vá em seu projeto
2. Clique em **Storage** → **Create Database**
3. Selecione **Blob**
4. Clique em **Create**

### 6.2 Adicionar Token às Variáveis de Ambiente

1. Copie o `BLOB_READ_WRITE_TOKEN` gerado
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Key:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** [token gerado]
   - **Environment:** Production, Preview, Development

4. Faça um novo deploy ou redeploy

---

## ✅ PASSO 7: Migrar Dados do Código para o Banco

Agora você precisa inserir os dados que estão em `data/` no Supabase:

### 7.1 Especialidades

Execute no SQL Editor:

```sql
INSERT INTO specialties (title, slug, short_description, description, icon, benefits, common_conditions, display_order) VALUES
('Cardiologia Geral', 'cardiologia', 'Avaliação completa da saúde cardiovascular...', '...', 'heart', 
  ARRAY['Check-up cardiológico completo', 'Avaliação de risco cardiovascular', '...'],
  ARRAY['Hipertensão arterial', 'Colesterol alto', '...'],
  1
),
-- ... copiar dados de data/specialties.ts
```

### 7.2 Tratamentos, Convênios, Avaliações

Repita o processo para:
- `treatments` (de `data/treatments.ts`)
- `insurance_plans` (de `data/insurance.ts`)
- `reviews` (de `data/reviews.ts`)

Ou use o script de migração (se criado).

---

## 🔒 SEGURANÇA

### Checklist de Segurança:

- [ ] Trocar senha padrão `admin123`
- [ ] Nunca commitar `.env.local` no Git
- [ ] Manter `SUPABASE_SERVICE_ROLE_KEY` secreto
- [ ] Configurar Row Level Security (RLS) no Supabase
- [ ] Habilitar 2FA na Vercel e Supabase
- [ ] Usar senhas fortes (12+ caracteres)

---

## 📊 FUNCIONALIDADES IMPLEMENTADAS

### ✅ Autenticação
- [x] Login com email/senha
- [x] Sessão JWT (30 dias)
- [x] Proteção de rotas `/admin/*`
- [x] Middleware de autorização
- [x] Logout seguro

### ✅ Dashboard Admin
- [x] Visão geral de estatísticas
- [x] Atividade recente
- [x] Ações rápidas

### ✅ Gestão de Perfil
- [x] Editar nome, CRM, RQEs
- [x] Editar especialidade e bio
- [x] Upload de foto de perfil (estrutura pronta)

### ✅ API Routes Protegidas
- [x] GET/PUT `/api/admin/profile`
- [x] GET/PUT `/api/admin/contact`
- [x] Autenticação por sessão
- [x] Log de auditoria

### ✅ Banco de Dados
- [x] Schema SQL completo
- [x] 11 tabelas (users, site_config, etc)
- [x] Row Level Security (RLS)
- [x] Triggers de updated_at
- [x] Audit logs

---

## 📝 PRÓXIMOS PASSOS (Opcional)

Para completar o painel admin, você pode adicionar:

1. **Página de Contato** (`/admin/contato`)
2. **Página de Endereço** (`/admin/endereco`)
3. **Gerenciar Especialidades** (CRUD completo)
4. **Gerenciar Tratamentos** (CRUD completo)
5. **Gerenciar Convênios** (CRUD completo)
6. **Moderar Avaliações** (aprovar/reprovar)
7. **Galeria de Mídia** (upload com Vercel Blob)
8. **Configurações Gerais** (SEO, horários, etc)

---

## 🆘 PROBLEMAS COMUNS

### Erro: "Não autorizado" ao fazer login

**Solução:** Verifique se o usuário foi criado no banco:

```sql
SELECT * FROM users WHERE email = 'admin@drpedrofelipe.com.br';
```

Se não existir, execute novamente a query de criação do usuário no `schema.sql`.

### Erro: "Error connecting to Supabase"

**Solução:** Verifique se as variáveis de ambiente estão corretas no `.env.local`

### Página 404 em `/admin`

**Solução:** Verifique se você está logado e se o middleware está configurado.

---

## 📞 SUPORTE

Se encontrar problemas, verifique:

1. Console do navegador (F12) para erros JavaScript
2. Terminal do Next.js para erros de servidor
3. Logs da Vercel (se em produção)
4. Logs do Supabase (SQL Editor)

---

**Desenvolvido com ❤️ para o Dr. Pedro Felipe**
