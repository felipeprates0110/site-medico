-- ============================================
-- SEED DATA — Site Médico Dr. Pedro Felipe
-- ============================================
-- Execute APÓS o schema.sql
-- Idempotente: pode rodar mais de uma vez com segurança
--
-- Email admin: admin@drpedrofelipe.com.br
-- Senha: definida no banco (não documentar senha em arquivos públicos)
-- ============================================

-- ============================================
-- USUÁRIO ADMIN
-- ============================================
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES (
  'admin@drpedrofelipe.com.br',
  '$2b$10$gCzgfcrQhhQ65o61BsPxauB1WlEwbenyprkxiJZTUEBfIqnMBHTwS',
  'Dr. Pedro Felipe Prates Silva',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- ============================================
-- CONFIGURAÇÕES DO SITE
-- ============================================
INSERT INTO site_config (
  doctor_name, doctor_crm, doctor_rqe, specialty, subspecialty, bio
)
SELECT
  'Dr. Pedro Felipe Prates Silva',
  'CRM DF 18951',
  ARRAY['RQE 16475', 'RQE 16476']::TEXT[],
  'Cardiologia e Arritmologia',
  'Eletrofisiologia Clínica e Invasiva',
  'Cardiologista e Arritmologista especialista em Eletrofisiologia Clínica e Invasiva pela UNIFESP/EPM. Tratamento de arritmias cardíacas, fibrilação atrial e ablação por cateter em Brasília - DF.'
WHERE NOT EXISTS (SELECT 1 FROM site_config LIMIT 1);

-- ============================================
-- CONTATO
-- ============================================
INSERT INTO contact_info (phone, whatsapp, email)
SELECT
  '(61) 3346-0202',
  '5561996270787',
  'pedrofelipe@ritmocardio.com.br'
WHERE NOT EXISTS (SELECT 1 FROM contact_info LIMIT 1);

-- ============================================
-- ENDEREÇO DO CONSULTÓRIO (IDC Brasília)
-- ============================================
INSERT INTO addresses (
  clinic_name, street, neighborhood, city, state, zip,
  latitude, longitude, is_primary
)
SELECT
  'IDC - Instituto de Doenças Cardiovasculares',
  'SHLS 716, Conjunto B, Bloco C — Centro Médico de Brasília',
  'Asa Sul',
  'Brasília',
  'DF',
  '70390-700',
  -15.8278852,
  -47.9284578,
  true
WHERE NOT EXISTS (SELECT 1 FROM addresses LIMIT 1);

-- ============================================
-- ESPECIALIDADES
-- ============================================
INSERT INTO specialties (
  title, slug, short_description, description, icon,
  benefits, common_conditions, display_order, is_active
) VALUES
(
  'Cardiologia Geral',
  'cardiologia',
  'Avaliação completa da saúde cardiovascular, prevenção e tratamento de doenças do coração.',
  'A cardiologia é a especialidade médica que cuida da saúde do coração e do sistema circulatório. Realizamos consultas cardiológicas completas, incluindo avaliação clínica detalhada, exames complementares e orientação sobre prevenção de doenças cardiovasculares.',
  'heart',
  ARRAY[
    'Check-up cardiológico completo',
    'Avaliação de risco cardiovascular',
    'Controle de hipertensão arterial',
    'Risco pré-operatório',
    'Prevenção de infarto e AVC',
    'Acompanhamento de pacientes cardiopatas'
  ]::TEXT[],
  ARRAY[
    'Hipertensão arterial',
    'Colesterol alto',
    'Angina e infarto',
    'Insuficiência cardíaca',
    'Doenças das válvulas cardíacas',
    'Cardiopatias congênitas'
  ]::TEXT[],
  1, true
),
(
  'Arritmologia',
  'arritmologia',
  'Especialidade focada no diagnóstico e tratamento de alterações do ritmo cardíaco (arritmias).',
  'A arritmologia é uma subespecialidade da cardiologia dedicada ao estudo, diagnóstico e tratamento das arritmias cardíacas. O arritmologista é o médico especialista nos distúrbios do ritmo do coração, oferecendo tratamentos desde medicamentosos até procedimentos intervencionistas.',
  'activity',
  ARRAY[
    'Diagnóstico preciso de arritmias',
    'Tratamento personalizado',
    'Monitoramento com Holter 24h',
    'Indicação de procedimentos quando necessário',
    'Acompanhamento de portadores de marca-passo',
    'Prevenção de AVC por fibrilação atrial'
  ]::TEXT[],
  ARRAY[
    'Fibrilação Atrial',
    'Flutter Atrial',
    'Taquicardia Ventricular',
    'Síndrome de Wolff-Parkinson-White',
    'Bloqueios cardíacos',
    'Extrassístoles (batimentos extras)'
  ]::TEXT[],
  2, true
),
(
  'Eletrofisiologia Clínica e Invasiva',
  'eletrofisiologia',
  'Procedimentos avançados para diagnóstico e tratamento definitivo de arritmias cardíacas.',
  'A eletrofisiologia invasiva utiliza técnicas minimamente invasivas para mapear o sistema elétrico do coração e realizar tratamentos definitivos de arritmias através de ablação por cateter. Formação pela UNIFESP/EPM, centro de referência nacional.',
  'zap',
  ARRAY[
    'Estudo eletrofisiológico diagnóstico',
    'Ablação por cateter (tratamento definitivo)',
    'Avaliação e acompanhamento de portadores de marca-passo',
    'Indicação de marca-passo ou CDI quando necessário',
    'Procedimentos minimamente invasivos',
    'Acompanhamento especializado de arritmias'
  ]::TEXT[],
  ARRAY[
    'Fibrilação Atrial refratária',
    'Flutter Atrial',
    'Taquicardias supraventriculares',
    'Taquicardias ventriculares',
    'Síndrome de WPW',
    'Bradicardias sintomáticas'
  ]::TEXT[],
  3, true
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- TRATAMENTOS
-- ============================================
INSERT INTO treatments (
  title, slug, short_description, description,
  symptoms, diagnosis, treatment, preventive_care,
  display_order, is_active
) VALUES
(
  'Fibrilação Atrial',
  'fibrilacao-atrial',
  'Arritmia cardíaca mais comum que aumenta risco de AVC e demência.',
  'A Fibrilação Atrial (FA) é a alteração do ritmo do coração mais comum no mundo. Mais de 30 milhões de pessoas possuem FA globalmente. A importância de diagnosticar essa arritmia está na sua relação com aumento do risco de desenvolver AVC, demência, insuficiência cardíaca e morte súbita.',
  ARRAY['Palpitações', 'Fadiga e cansaço fácil', 'Falta de ar ao esforço', 'Tontura', 'Desconforto no peito', 'Pode ser assintomática']::TEXT[],
  ARRAY['Eletrocardiograma (ECG)', 'Holter 24 horas', 'Ecocardiograma', 'Exames laboratoriais', 'Teste ergométrico']::TEXT[],
  ARRAY['Controle medicamentoso da frequência cardíaca', 'Anticoagulação para prevenção de AVC', 'Cardioversão elétrica', 'Ablação por cateter', 'Controle de fatores de risco']::TEXT[],
  ARRAY['Controle da pressão arterial', 'Tratamento da apneia do sono', 'Perda de peso', 'Redução do álcool', 'Atividade física regular']::TEXT[],
  1, true
),
(
  'Ablação por Cateter de Arritmias',
  'ablacao-por-cateter',
  'Procedimento minimamente invasivo para tratamento definitivo de arritmias.',
  'A ablação por cateter é um procedimento considerado minimamente invasivo, no qual o médico passa um cateter fino pelos vasos sanguíneos até o coração para diagnosticar e tratar vias elétricas anormais. Realizado com anestesia local, sem cortes.',
  ARRAY[]::TEXT[],
  ARRAY['Estudo eletrofisiológico', 'Mapeamento eletroanatômico 3D', 'Localização precisa do foco da arritmia']::TEXT[],
  ARRAY['Ablação por radiofrequência', 'Crioablação', 'Procedimento guiado por raio-X e ultrassom', 'Internação de 1 dia', 'Recuperação rápida']::TEXT[],
  ARRAY['Seguimento ambulatorial regular', 'Monitoramento com Holter', 'Adequação de medicações']::TEXT[],
  2, true
),
(
  'Flutter Atrial',
  'flutter-atrial',
  'Arritmia cardíaca que pode ser tratada de forma definitiva com ablação.',
  'O Flutter Atrial é uma arritmia caracterizada por batimentos cardíacos rápidos e regulares. Similar à fibrilação atrial, também aumenta o risco de AVC. Em muitos casos, pode ser tratado de forma definitiva através de ablação por cateter.',
  ARRAY['Palpitações regulares e rápidas', 'Falta de ar', 'Cansaço', 'Tontura', 'Dor no peito']::TEXT[],
  ARRAY['Eletrocardiograma', 'Holter 24 horas', 'Ecocardiograma']::TEXT[],
  ARRAY['Controle medicamentoso', 'Cardioversão elétrica', 'Ablação por cateter (tratamento definitivo)', 'Anticoagulação']::TEXT[],
  ARRAY[]::TEXT[],
  3, true
),
(
  'Bloqueio Cardíaco',
  'bloqueio-cardiaco',
  'Alteração na condução elétrica do coração que pode necessitar marca-passo.',
  'Se existir um bloqueio na condução elétrica do coração, as contrações serão ineficazes e o corpo não receberá o suprimento de sangue necessário. Pode causar tontura, desmaios e em casos graves morte súbita.',
  ARRAY['Tontura', 'Cansaço excessivo', 'Escurecimento da visão', 'Desmaios', 'Pode levar à morte súbita']::TEXT[],
  ARRAY['Eletrocardiograma', 'Holter 24 horas', 'Teste de inclinação', 'Estudo eletrofisiológico']::TEXT[],
  ARRAY['Avaliação e indicação de marca-passo quando necessário', 'Encaminhamento para implante do dispositivo', 'Acompanhamento regular após o implante']::TEXT[],
  ARRAY[]::TEXT[],
  4, true
),
(
  'Síndrome de Wolff-Parkinson-White (WPW)',
  'sindrome-wolff-parkinson-white',
  'Arritmia congênita que pode ser tratada de forma definitiva com ablação.',
  'A Síndrome de Wolff-Parkinson-White (WPW) é uma alteração congênita. Os sintomas cursam com crises de palpitações. O tratamento definitivo é feito através de ablação por cateter.',
  ARRAY['Crises súbitas de palpitações', 'Taquicardia', 'Tontura durante as crises', 'Falta de ar', 'Pode ser assintomática']::TEXT[],
  ARRAY['Eletrocardiograma (padrão de pré-excitação)', 'Estudo eletrofisiológico', 'Teste ergométrico']::TEXT[],
  ARRAY['Ablação por cateter (tratamento de escolha)', 'Procedimento minimamente invasivo', 'Seguimento após o procedimento']::TEXT[],
  ARRAY[]::TEXT[],
  5, true
),
(
  'Hipertensão Arterial',
  'hipertensao-arterial',
  'Pressão alta — principal fator de risco para doenças cardiovasculares.',
  'A hipertensão arterial é uma condição crônica em que a pressão do sangue nas artérias está persistentemente elevada. É o principal fator de risco para infarto, AVC, insuficiência cardíaca e doença renal crônica.',
  ARRAY['Geralmente assintomática', 'Dor de cabeça', 'Tontura', 'Visão embaçada', 'Falta de ar']::TEXT[],
  ARRAY['Medição da pressão arterial', 'MAPA', 'Exames de órgãos-alvo', 'Exames laboratoriais']::TEXT[],
  ARRAY['Mudanças no estilo de vida', 'Dieta com redução de sal', 'Atividade física regular', 'Medicamentos anti-hipertensivos']::TEXT[],
  ARRAY['Alimentação saudável', 'Exercícios regulares', 'Controle do estresse', 'Não fumar', 'Manter peso adequado']::TEXT[],
  6, true
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CONVÊNIOS (47 planos)
-- ============================================
INSERT INTO insurance_plans (name, category, display_order, is_active)
SELECT name, category, display_order, true
FROM (VALUES
  ('Camed', 'private', 1),
  ('Postal Saúde', 'corporate', 2),
  ('GAMA Saúde', 'public', 3),
  ('NotreDame Intermédica', 'private', 4),
  ('Omint', 'private', 5),
  ('BRB Saúde', 'corporate', 6),
  ('AFFEGO', 'corporate', 7),
  ('Unafisco Saúde', 'corporate', 8),
  ('PMDF', 'public', 9),
  ('Bradesco Saúde', 'private', 10),
  ('Geap Saúde', 'corporate', 11),
  ('TRE SAÚDE', 'public', 12),
  ('BACEN', 'public', 13),
  ('TST SAÚDE', 'public', 14),
  ('AFEB BRASAL', 'corporate', 15),
  ('Fascal', 'corporate', 16),
  ('Casembrapa', 'corporate', 17),
  ('Care Plus', 'private', 18),
  ('PROASA', 'corporate', 19),
  ('CASEC (CODEVASF)', 'corporate', 20),
  ('Amil', 'private', 21),
  ('SulAmérica', 'private', 22),
  ('Unimed', 'private', 23),
  ('Golden Cross', 'private', 24),
  ('Mediservice', 'private', 25),
  ('São Francisco Saúde', 'private', 26),
  ('Porto Seguro Saúde', 'private', 27),
  ('Saúde Caixa', 'public', 28),
  ('Fusex', 'public', 29),
  ('Inas', 'public', 30),
  ('Serpro', 'public', 31),
  ('STF Saúde', 'public', 32),
  ('STJ Saúde', 'public', 33),
  ('Capesaúde', 'corporate', 34),
  ('Correios Saúde', 'public', 35),
  ('Economus', 'corporate', 36),
  ('Gboex', 'public', 37),
  ('Life Empresarial', 'corporate', 38),
  ('Marítima Saúde', 'corporate', 39),
  ('Plas', 'corporate', 40),
  ('Sabesprev', 'corporate', 41),
  ('Saúde Petrobras', 'corporate', 42),
  ('Elos', 'corporate', 43),
  ('Particular', 'private', 44),
  ('Banestes', 'corporate', 45),
  ('Fapes', 'corporate', 46),
  ('Real Grandeza', 'corporate', 47)
) AS v(name, category, display_order)
WHERE NOT EXISTS (SELECT 1 FROM insurance_plans LIMIT 1);

-- ============================================
-- FAQ (12 perguntas)
-- ============================================
INSERT INTO faq_items (question, answer, category, display_order, is_active)
SELECT question, answer, category, display_order, true
FROM (VALUES
  (
    'Como posso agendar uma consulta?',
    'Você pode agendar uma consulta através do WhatsApp clicando no botão de agendamento do site, ligando diretamente para o consultório, ou preenchendo o formulário de contato. Respondemos rapidamente e confirmamos o melhor horário disponível.',
    'agendamento', 1
  ),
  (
    'Quais convênios são aceitos?',
    'Atendemos 47 planos de saúde, incluindo Camed, Postal Saúde, GAMA Saúde, NotreDame Intermédica, Omint, BRB Saúde, Bradesco Saúde, Geap Saúde, Unimed, Amil, SulAmérica, entre outros. Também atendemos pacientes particulares.',
    'convenios', 2
  ),
  (
    'Qual o valor da consulta particular?',
    'O valor da consulta cardiológica e arritmológica particular é R$ 200,00. Formas de pagamento: dinheiro, cartão de crédito, cartão de débito ou transferência bancária.',
    'geral', 3
  ),
  (
    'O ecocardiograma e o eletrocardiograma podem identificar uma possível artéria entupida?',
    'Sim. São exames valiosos na avaliação de doença coronária. O eletrocardiograma pode mostrar sinais de isquemia ou infarto prévio, enquanto o ecocardiograma avalia a função e mobilidade do coração.',
    'tratamentos', 4
  ),
  (
    'O que é ablação por cateter?',
    'A ablação por cateter é um procedimento minimamente invasivo para tratamento definitivo de arritmias cardíacas. Um cateter fino é inserido através de vaso sanguíneo até o coração, onde identifica e elimina o foco da arritmia.',
    'tratamentos', 5
  ),
  (
    'Fibrilação atrial tem cura?',
    'A fibrilação atrial pode ser tratada de forma definitiva através de ablação por cateter, dependendo do tipo e das características de cada paciente. Em alguns casos, mais de um procedimento pode ser necessário. Além disso, o controle de fatores de risco como obesidade, apneia do sono e hipertensão é fundamental.',
    'tratamentos', 6
  ),
  (
    'Onde fica o consultório?',
    'O consultório fica no Life Centro Cardiológico, Q EQ 47-49 PROJEÇÃO 4, SALAS 701, 702 E 708, Gama - Brasília/DF, CEP 72405-498. Oferecemos estacionamento no local.',
    'geral', 7
  ),
  (
    'Qual a diferença entre cardiologista e arritmologista?',
    'O cardiologista é especialista em doenças do coração de forma geral. O arritmologista é cardiologista com subespecialização em arritmias cardíacas, com expertise em ablação por cateter, avaliação de portadores de marca-passo e indicação do dispositivo quando necessário.',
    'geral', 8
  ),
  (
    'Preciso de encaminhamento médico para consultar?',
    'Não é necessário encaminhamento para consulta particular. Para convênio, verifique com seu plano se é necessária guia de encaminhamento.',
    'agendamento', 9
  ),
  (
    'Quanto tempo dura uma consulta?',
    'A consulta inicial dura de 30 a 45 minutos para avaliação completa. Consultas de retorno são mais breves, mas sempre com tempo para esclarecer dúvidas.',
    'geral', 10
  ),
  (
    'Realiza atendimento de urgência?',
    'O consultório atende por agendamento. Em urgência cardíaca (dor no peito intensa, falta de ar grave, desmaio), procure o pronto-socorro ou ligue 192 (SAMU).',
    'agendamento', 11
  ),
  (
    'Que exames devo levar na primeira consulta?',
    'Traga todos os exames cardiológicos já realizados (ECG, ecocardiograma, Holter, teste ergométrico, cateterismo), exames de sangue recentes, relatórios médicos e lista de medicamentos em uso.',
    'agendamento', 12
  )
) AS v(question, answer, category, display_order)
WHERE NOT EXISTS (SELECT 1 FROM faq_items LIMIT 1);

-- ============================================
-- AVALIAÇÕES (10 aprovadas)
-- ============================================
INSERT INTO reviews (author, date, rating, comment, service, verified, approved, source)
SELECT author, date::DATE, rating, comment, service, verified, approved, source
FROM (VALUES
  ('Cesar Caetano de Resende', '2024-06-12', 5, 'Gostei da consulta, informações, empatia e conhecimento clínico demonstrados com presteza.', 'Consulta cardiologista', true, true, 'doctoralia'),
  ('Maria Cecília Castro', '2024-05-29', 5, 'Doutor explica tudo muito bem e é atencioso. Demonstra interesse pelo paciente.', 'Consulta cardiologista', true, true, 'doctoralia'),
  ('Valdete', '2024-05-29', 5, 'Muito detalhista, ótima explicação gentil e focado, prestativo', 'Consulta cardiologista', true, true, 'doctoralia'),
  ('Valéria Helena Lopes', '2024-05-15', 5, 'Eu e meu esposo gostamos muito do atendimento. Foi claro na explicação do tratamento e solicitou exames complementares.', 'Consulta cardiologista', true, true, 'doctoralia'),
  ('Luiz Abadia de Pina Neto', '2024-05-15', 5, 'Me senti seguro em fazer o procedimento crioablação pois todos os riscos me foram esclarecidos de forma clara.', 'Consulta arritmologista', true, true, 'doctoralia'),
  ('Adroaldo Veloso', '2024-05-15', 5, 'Excelente profissional. O atendimento foi super satisfatório', 'Consulta cardiologista', true, true, 'doctoralia'),
  ('Jacqueline Siqueira', '2024-05-22', 4, 'Bom profissional, sério e demonstrou bastante conhecimento, porém pouco comunicativo.', 'Consulta cardiologista', true, true, 'doctoralia'),
  ('Roberto Silva', '2024-04-20', 5, 'Profissional extremamente competente e atencioso. Explicou todo o procedimento de ablação de forma clara.', 'Consulta arritmologista', true, true, 'doctoralia'),
  ('Ana Paula Martins', '2024-04-15', 5, 'Primeira consulta e já me senti acolhida. Dr. Pedro é muito cuidadoso e detalhista na avaliação.', 'Consulta cardiologista', true, true, 'doctoralia'),
  ('Carlos Eduardo', '2024-03-28', 5, 'Excelente cardiologista! Me ajudou muito no controle da minha fibrilação atrial. Recomendo!', 'Consulta arritmologista', true, true, 'doctoralia')
) AS v(author, date, rating, comment, service, verified, approved, source)
WHERE NOT EXISTS (SELECT 1 FROM reviews LIMIT 1);

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================
SELECT 'users' AS tabela, COUNT(*) AS registros FROM users
UNION ALL SELECT 'site_config', COUNT(*) FROM site_config
UNION ALL SELECT 'contact_info', COUNT(*) FROM contact_info
UNION ALL SELECT 'addresses', COUNT(*) FROM addresses
UNION ALL SELECT 'specialties', COUNT(*) FROM specialties
UNION ALL SELECT 'treatments', COUNT(*) FROM treatments
UNION ALL SELECT 'insurance_plans', COUNT(*) FROM insurance_plans
UNION ALL SELECT 'faq_items', COUNT(*) FROM faq_items
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
ORDER BY tabela;
