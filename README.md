# Site Profissional - Dr. Pedro Felipe Prates Silva

Site profissional do cardiologista e arritmologista Dr. Pedro Felipe Prates Silva, desenvolvido com Next.js 15, TypeScript e TailwindCSS.

## 🚀 Tecnologias Utilizadas

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS v4
- **Componentes:** Radix UI
- **Ícones:** Lucide React
- **Deploy:** Vercel (recomendado)

## 📋 Funcionalidades

- ✅ Design responsivo e moderno
- ✅ SEO otimizado com Schema Markup (Physician, MedicalClinic, LocalBusiness)
- ✅ 230+ avaliações importadas do Doctoralia
- ✅ Sistema de especialidades (Cardiologia, Arritmologia, Eletrofisiologia)
- ✅ Páginas de tratamentos detalhadas
- ✅ Lista de 47 convênios aceitos
- ✅ Integração com WhatsApp Business
- ✅ Formulário de agendamento
- ✅ Performance otimizada (Core Web Vitals)
- ✅ Conformidade com CFM 1.974/2011 e LGPD

## 🏗️ Estrutura do Projeto

```
site-medico/
├── app/                      # Pages (Next.js App Router)
│   ├── layout.tsx           # Layout raiz com Header/Footer
│   ├── page.tsx             # Página inicial
│   ├── sobre/               # Sobre o médico
│   ├── especialidades/      # Especialidades médicas
│   ├── tratamentos/         # Tratamentos e doenças
│   ├── avaliacoes/          # Avaliações de pacientes
│   ├── convenios/           # Convênios aceitos
│   ├── contato/             # Informações de contato
│   └── agendar/             # Formulário de agendamento
├── components/              # Componentes React
│   ├── ui/                  # Componentes base (Button, etc)
│   ├── header.tsx           # Cabeçalho do site
│   ├── footer.tsx           # Rodapé do site
│   ├── whatsapp-button.tsx  # Botões de WhatsApp
│   ├── review-card.tsx      # Card de avaliação
│   └── specialty-card.tsx   # Card de especialidade
├── data/                    # Dados estáticos
│   ├── reviews.ts           # Avaliações (importadas do Doctoralia)
│   ├── specialties.ts       # Especialidades médicas
│   ├── treatments.ts        # Tratamentos e doenças
│   ├── insurance.ts         # Convênios aceitos
│   └── faq.ts               # Perguntas frequentes
├── lib/                     # Utilitários e configurações
│   ├── utils.ts             # Funções auxiliares
│   ├── metadata.ts          # Configuração de SEO
│   └── schema.ts            # Schema Markup (JSON-LD)
└── types/                   # Tipos TypeScript
    └── index.ts             # Definições de tipos
```

## 🛠️ Instalação e Desenvolvimento

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositório>

# Entre na pasta
cd site-medico

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O site estará disponível em [http://localhost:3000](http://localhost:3000)

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

## 📝 Configurações Importantes

### 1. Atualizar Informações do Médico

Edite o arquivo `lib/metadata.ts`:

```typescript
export const siteConfig = {
  doctor: {
    name: "Dr. Pedro Felipe Prates Silva",
    crm: "CRM DF 18951",
    phone: "61999999999",        // ⚠️ ATUALIZAR
    whatsapp: "5561999999999",   // ⚠️ ATUALIZAR
    email: "contato@drpedrofelipe.com.br", // ⚠️ ATUALIZAR
    // ...
  }
}
```

### 2. Google Search Console

Após deploy, adicione o código de verificação em `lib/metadata.ts`:

```typescript
verification: {
  google: "seu-codigo-de-verificacao", // ⚠️ ATUALIZAR
}
```

### 3. Google Analytics (opcional)

Instale e configure o Google Analytics 4 seguindo a [documentação do Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/analytics).

## 🌐 Deploy na Vercel

### Deploy Automático

1. Conecte o repositório do GitHub na [Vercel](https://vercel.com)
2. O deploy será automático a cada push

### Deploy Manual

```bash
# Instale a Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Variáveis de Ambiente (opcional)

Se necessário, adicione variáveis de ambiente no painel da Vercel:

- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `RESEND_API_KEY` - Para envio de emails (se configurar)

## 📊 SEO e Performance

### SEO Implementado

- ✅ Metadata otimizada para cada página
- ✅ Schema Markup JSON-LD (Physician, MedicalClinic, LocalBusiness)
- ✅ Open Graph tags para redes sociais
- ✅ Sitemap.xml automático
- ✅ Robots.txt configurado
- ✅ URLs amigáveis (slugs)

### Performance

- ✅ Next.js Image Optimization
- ✅ Font Optimization (Inter)
- ✅ Lazy loading de componentes
- ✅ Static Generation quando possível
- ✅ Turbopack para build rápido

## 🔧 Próximos Passos

### Imediato

- [ ] Adicionar fotos reais do médico e consultório
- [ ] Atualizar telefone e WhatsApp reais
- [ ] Configurar domínio personalizado
- [ ] Adicionar Google Maps no contato
- [ ] Configurar Google Search Console

### Curto Prazo

- [ ] Integrar sistema de email (Resend, SendGrid)
- [ ] Adicionar Google Analytics
- [ ] Implementar blog com artigos
- [ ] Adicionar mais avaliações
- [ ] Criar página de FAQ

### Médio Prazo

- [ ] Integração com sistema de agendamento (iClinic, Feegow)
- [ ] Painel administrativo para gerenciar conteúdo
- [ ] Newsletter
- [ ] Chat ao vivo

### Longo Prazo (Marketplace)

- [ ] Sistema multi-médico
- [ ] Busca avançada de profissionais
- [ ] Pagamentos online
- [ ] Sistema de avaliações em tempo real
- [ ] API pública

## 📄 Licença

Este projeto é proprietário do Dr. Pedro Felipe Prates Silva.

## 🤝 Contato

Para dúvidas sobre o desenvolvimento, entre em contato através do repositório.

---

**Desenvolvido com ❤️ usando Next.js e TailwindCSS**
