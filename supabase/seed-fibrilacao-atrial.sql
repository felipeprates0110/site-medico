-- Artigo: Fibrilação Atrial (primeiro do RitmoBlog)
-- Idempotente: atualiza se o slug já existir

INSERT INTO blog_categories (name, slug, description)
VALUES (
  'Arritmias',
  'arritmias',
  'Artigos sobre arritmias cardíacas, fibrilação atrial, palpitações e tratamento eletrofisiológico.'
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

INSERT INTO blog_articles (
  title,
  slug,
  content,
  excerpt,
  cover_image_url,
  category_id,
  status,
  published_at,
  seo_title,
  seo_description
)
VALUES (
  'Fibrilação Atrial: O Que Você Precisa Saber Sobre Essa Arritmia Silenciosa',
  'fibrilacao-atrial-o-que-voce-precisa-saber',
  $html$
<p>Você já sentiu o coração "disparar" do nada, bater de forma desorganizada ou "tremer" no peito? Esses sintomas podem ser sinais de <b>fibrilação atrial (FA)</b>, a arritmia cardíaca mais comum no mundo — e que, apesar de frequente, ainda é pouco conhecida pela população.</p>
<p>Neste artigo, vou explicar de forma simples o que é a fibrilação atrial, por que ela acontece, quais são os riscos reais e quando você deve procurar ajuda médica.</p>

<h2>O Que é Fibrilação Atrial?</h2>
<p>O coração normal bate de forma regular e coordenada, comandado por um "marcapasso natural" chamado nó sinusal. Na fibrilação atrial, as duas câmaras superiores do coração (os átrios) param de contrair de forma organizada e passam a "tremer" de maneira caótica e muito rápida — podendo chegar a 300-600 impulsos elétricos por minuto.</p>
<p>O resultado é que os batimentos ficam <b>irregulares e, muitas vezes, acelerados</b>, o que pode ser sentido como palpitações, cansaço ou falta de ar.</p>

<h2>Quem Tem Mais Risco de Desenvolver FA?</h2>
<p>A fibrilação atrial se torna mais comum com o avanço da idade, mas alguns fatores aumentam ainda mais o risco:</p>
<ul>
  <li>Idade acima de 65 anos</li>
  <li>Hipertensão arterial não controlada</li>
  <li>Diabetes</li>
  <li>Obesidade</li>
  <li>Apneia do sono</li>
  <li>Hipertireoidismo</li>
  <li>Consumo excessivo de álcool</li>
  <li>Doenças cardíacas prévias (valvopatias, insuficiência cardíaca)</li>
  <li>Histórico familiar de arritmias</li>
</ul>

<h2>Principais Sintomas</h2>
<p>Nem todo mundo sente a FA da mesma forma. Alguns pacientes não sentem absolutamente nada — é o que chamamos de FA assintomática, descoberta em um exame de rotina. Outros apresentam:</p>
<ul>
  <li>Palpitações (sensação de coração "disparado" ou "batendo torto")</li>
  <li>Cansaço e fadiga incomum</li>
  <li>Falta de ar, principalmente aos esforços</li>
  <li>Tontura ou sensação de cabeça leve</li>
  <li>Dor ou desconforto no peito</li>
  <li>Ansiedade associada às palpitações</li>
</ul>
<p><b>Importante:</b> a ausência de sintomas não significa ausência de risco. Isso é um dos pontos mais perigosos da FA.</p>

<h2>Por Que a Fibrilação Atrial é Perigosa?</h2>
<p>O principal risco da FA não é o sintoma em si, mas suas complicações:</p>

<h3>1. Risco de AVC (Acidente Vascular Cerebral)</h3>
<p>Quando os átrios não se contraem direito, o sangue pode "estagnar" dentro do coração e formar coágulos. Se um desses coágulos se solta e vai para o cérebro, causa um AVC. Pessoas com FA têm risco significativamente maior de AVC do que a população geral — por isso muitos pacientes precisam de anticoagulantes.</p>

<h3>2. Insuficiência Cardíaca</h3>
<p>Quando a FA não é tratada e o coração fica acelerado por longos períodos, o músculo cardíaco pode enfraquecer com o tempo, levando à insuficiência cardíaca.</p>

<h3>3. Piora da Qualidade de Vida</h3>
<p>Cansaço constante, falta de ar e limitação para atividades do dia a dia são queixas comuns em quem convive com FA não controlada.</p>

<h2>Quando Procurar um Médico com Urgência</h2>
<p>Procure atendimento de emergência imediatamente se, além das palpitações, você sentir:</p>
<ul>
  <li>Dor forte no peito</li>
  <li>Falta de ar intensa e súbita</li>
  <li>Desmaio ou quase desmaio</li>
  <li>Fraqueza súbita em um lado do corpo, dificuldade para falar ou visão turva (sinais de possível AVC)</li>
</ul>
<p>Fora desses sinais de alarme, palpitações recorrentes ou frequentes ainda merecem avaliação cardiológica — não espere elas "passarem sozinhas" repetidamente sem investigar.</p>

<h2>Como é Feito o Diagnóstico?</h2>
<p>O exame mais simples e direto é o <b>eletrocardiograma (ECG)</b>, mas como a FA pode ser intermitente, às vezes é necessário:</p>
<ul>
  <li>Holter de 24h ou 7 dias</li>
  <li>Monitor de eventos</li>
  <li>Smartwatches com função de ECG (úteis para triagem, mas não substituem avaliação médica)</li>
</ul>

<h2>Existe Tratamento?</h2>
<p>Sim. O tratamento é individualizado e pode incluir:</p>
<ul>
  <li><b>Controle de fatores de risco</b> (pressão, peso, apneia do sono, álcool)</li>
  <li><b>Medicamentos</b> para controlar a frequência ou o ritmo cardíaco</li>
  <li><b>Anticoagulantes</b>, quando indicado, para prevenir AVC</li>
  <li><b>Ablação por cateter</b>, um procedimento minimamente invasivo, em casos selecionados</li>
  <li><b>Cardioversão elétrica</b>, em situações específicas</li>
</ul>
<p>A decisão sobre qual estratégia usar deve ser sempre feita junto com um cardiologista, considerando o risco individual de cada paciente.</p>

<h2>Conclusão</h2>
<p>A fibrilação atrial é comum, mas não deve ser ignorada. Reconhecer os sintomas e, principalmente, entender o risco de AVC associado é fundamental para buscar tratamento a tempo. Se você tem palpitações frequentes ou fatores de risco cardiovascular, converse com seu médico — o diagnóstico precoce faz toda a diferença.</p>

<p><i>Este artigo tem finalidade exclusivamente educativa e não substitui consulta, diagnóstico ou tratamento médico. Procure sempre um cardiologista para avaliação individualizada.</i></p>
$html$,
  'Entenda o que é a fibrilação atrial, seus principais sintomas, riscos e quando procurar um médico. Guia completo escrito por cardiologista.',
  NULL,
  (SELECT id FROM blog_categories WHERE slug = 'arritmias' LIMIT 1),
  'published',
  NOW(),
  'Fibrilação Atrial: Sintomas, Riscos e Quando Procurar Médico | RitmoBlog',
  'Entenda o que é a fibrilação atrial, seus principais sintomas, riscos e quando procurar um médico. Guia completo escrito por cardiologista.'
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  category_id = EXCLUDED.category_id,
  status = 'published',
  published_at = COALESCE(blog_articles.published_at, NOW()),
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = NOW()
RETURNING id, title, slug, status, published_at, seo_title;
