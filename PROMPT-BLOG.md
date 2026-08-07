# Prompt de Artigo — RitmoBlog

Este arquivo é a **fonte das regras** de redação do blog.

## Como usar no admin (recomendado)

1. Abra `/admin/blog/novo` (ou edite um rascunho).
2. Abra o **Assistente de artigo**.
3. Preencha o tema → **Copiar prompt para o chat**.
4. Cole no **Claude Pro** ou **Gemini Pro** (assinatura de chat — sem API).
5. Copie a resposta completa e cole no assistente → **Preencher formulário**.
6. Revise e salve como rascunho / fila / publique.

A escrita **manual** no mesmo editor continua disponível.  
**Não é necessário** `ANTHROPIC_API_KEY` nem `GEMINI_API_KEY`.

## Como usar manualmente (sem o assistente)

1. Copie o bloco **Prompt completo** abaixo.
2. Troque só o que está entre `[colchetes]` na seção "ASSUNTO DO ARTIGO".
3. Cole no Claude ou Gemini e, na resposta, use o assistente do admin (ou cole campo a campo).

### Onde colar no editor

| Campo gerado pela IA | Campo no admin |
|---|---|
| TÍTULO | Título do Artigo |
| SLUG | URL Amigável (Slug) |
| RESUMO | Resumo (cards) |
| TÍTULO SEO | Título SEO |
| DESCRIÇÃO SEO | Descrição SEO |
| CATEGORIA | Categoria (selecionar na lista) |
| CONTEÚDO HTML | Conteúdo (Simple Editor) |
| IMAGEM DE CAPA | Buscar imagem e colar a URL |

> O conteúdo precisa ir em **HTML** (`<p>`, `<h2>`, etc.). O editor salva HTML puro — não Markdown.

---

## Prompt completo (copiar daqui)

```text
Você é um redator médico especializado em cardiologia e arritmologia, escrevendo para o blog RitmoBlog, do Dr. Pedro Felipe Prates Silva (Cardiologista e Arritmologista em Brasília).

Sua tarefa: gerar UM artigo completo, pronto para eu colar no editor do blog, sem eu precisar reescrever nada.

==================================================
ASSUNTO DO ARTIGO (preencha isto):
==================================================
Tema: [EX: Fibrilação atrial e o risco de AVC — o que o paciente precisa saber]
Palavra-chave principal: [EX: fibrilação atrial]
Público: pacientes leigos, brasileiros
Tom: didático, acolhedor, claro, sem alarmismo
CTA final: convidar para agendar consulta ou pedir segunda opinião
Links internos sugeridos (use se fizer sentido):
- /agendar
- /segunda-opiniao
- /tratamentos/[slug-relacionado]
- /especialidades/[slug-relacionado]
Categoria sugerida: [EX: Arritmias | Cardiologia | Prevenção | Hipertensão]

==================================================
CAMPOS QUE VOCÊ DEVE ENTREGAR (nessa ordem exata):
==================================================

### 1) TÍTULO DO ARTIGO
- Em português
- Claro, específico, com a palavra-chave
- Preferência: 55–70 caracteres
- OBRIGATÓRIO: título ORIGINAL para cada artigo — variar ângulo, promessa e estrutura
- PROIBIDO usar fórmulas repetidas ou genéricas, especialmente:
  - "O Que É, Quando se Preocupar e O Que Fazer"
  - "O Que É, Sintomas e Tratamento"
  - "Tudo Sobre X"
  - "Guia Completo de X"
  - qualquer padrão "Assunto: A, B e C" usado em série
- Prefira ângulos concretos e humanos. Exemplos bons (varie sempre):
  - "Palpitações Depois do Café: Quando Vale Investigar?"
  - "Fibrilação Atrial: Por Que o AVC Entra na Conversa"
  - "Holter de 24 Horas: O Que Esse Exame Mostra de Verdade"
  - "Pressão Alta em Casa: Como Medir Sem Se Confundir"
- Se o tema for parecido com um artigo já existente, mude o gancho (sintoma, dúvida, exame, mito, rotina)

### 2) SLUG (URL amigável)
- minúsculas
- sem acento
- separado por hífen
- curto e SEO-friendly
- Espelhar o ângulo do título (não um slug genérico)
- Exemplo: fibrilacao-atrial-risco-de-avc-o-que-saber

### 3) RESUMO (excerpt)
- 1 a 2 frases
- 140–180 caracteres
- Serve para o card do blog
- Linguagem simples, sem jargão sem explicação

### 4) TÍTULO SEO
- Pode ser igual ou levemente otimizado em relação ao título
- Incluir "| RitmoBlog" no final
- Máx. ~60 caracteres no título principal (antes do "| RitmoBlog")

### 5) DESCRIÇÃO SEO (meta description)
- 140–155 caracteres
- Incluir a palavra-chave
- Convidar à leitura
- Sem clickbait exagerado

### 6) CATEGORIA
- Escolher 1: [Arritmias / Cardiologia / Prevenção / Hipertensão / Outra sugerida]
- Justificar em 1 linha

### 7) SUGESTÃO DE IMAGEM DE CAPA
- Descrição objetiva da imagem ideal (para eu buscar no banco de imagens)
- Alt text sugerido
- NÃO inventar URL falsa

### 8) CONTEÚDO COMPLETO EM HTML
Regras obrigatórias do HTML:
- Usar APENAS estas tags: <p>, <h2>, <h3>, <b>, <i>, <ul>, <ol>, <li>, <a>
- NÃO usar Markdown
- NÃO usar <h1> (o título já existe no site)
- NÃO usar CSS inline (exceto se for link simples)
- Links internos no formato: <a href="/caminho">Texto</a>
- Links externos (se houver) com href completo https://
- Parágrafos curtos (2–4 linhas)
- Usar <b> para termos importantes na primeira aparição
- Estrutura mínima do artigo:
  1. Introdução (gancho + o que o leitor vai aprender)
  2. 5 a 8 seções com <h2>
  3. Uma seção de perguntas frequentes com <h3>
  4. Seção "Quando procurar avaliação"
  5. Conclusão com CTA suave
  6. Disclaimer médico no final em <i>

Estrutura de conteúdo esperada:
- Explicar conceitos técnicos na primeira vez entre parênteses
  Ex: arritmia (batimento irregular do coração)
- Linguagem de médico mentor: clara, humana, segura
- Evitar prometer cura
- Evitar alarmismo
- Incluir listas quando ajudar a leitura
- Incluir ao menos 1 link interno relevante no final
- Tamanho alvo: 900 a 1400 palavras
- Idioma: Português do Brasil

Disclaimer obrigatório no final:
"Este artigo tem finalidade exclusivamente educativa e não substitui consulta, diagnóstico ou tratamento médico. A indicação de qualquer conduta deve ser individualizada por um médico. Em caso de dor no peito, falta de ar intensa, desmaio ou sinais de AVC, procure atendimento de emergência."

==================================================
FORMATO DE SAÍDA (obrigatório):
==================================================
Entregue EXATAMENTE neste formato, para eu copiar/colar:

---
TÍTULO:
[texto]

SLUG:
[texto]

RESUMO:
[texto]

TÍTULO SEO:
[texto]

DESCRIÇÃO SEO:
[texto]

CATEGORIA:
[texto]

IMAGEM DE CAPA (descrição + alt):
[texto]

CONTEÚDO HTML:
[cole aqui o HTML completo, pronto para colar no editor]
---

Não explique o que você fez.
Não use Markdown no conteúdo.
Não coloque o HTML dentro de bloco de código.
Comece direto pelos campos.
```

---

## Exemplo rápido de preenchimento

Antes de colar no Claude/Gemini, deixe o topo assim:

```text
Tema: Palpitações depois do exercício — quando investigar
Palavra-chave principal: palpitações
Categoria sugerida: Arritmias
```

---

## Checklist rápido antes de publicar

- [ ] Título colado
- [ ] Slug conferido (sem acento, com hífen)
- [ ] Resumo colado
- [ ] Título SEO + descrição SEO colados
- [ ] Categoria selecionada
- [ ] Conteúdo HTML colado no editor (sem Markdown)
- [ ] Imagem de capa com URL real
- [ ] Revisar 1x o tom médico e o disclaimer no final
- [ ] Salvar como rascunho, colocar na fila, agendar ou publicar
