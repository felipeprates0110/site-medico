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
    'Síndrome de Wolff-Parkinson-White (WPW)',
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
-- FAQ (6 perguntas — Arritmia e Cardiologia Geral)
-- ============================================
INSERT INTO faq_items (question, answer, category, display_order, is_active)
SELECT question, answer, category, display_order, true
FROM (VALUES
  (
    'Sinto o meu coração "pular um batimento" ou acelerar do nada. Isso sempre é perigoso?',
    'Nem toda alteração no ritmo do coração indica uma doença grave. Sensações de "falhas", palpitações ou aceleração rápida podem ocorrer por conta de extrassístoles benignas, estresse, consumo de cafeína ou ansiedade. No entanto, apenas uma avaliação cardiológica detalhada, acompanhada de exames como o Eletrocardiograma e o Holter 24 horas, pode diferenciar uma arritmia benigna de uma condição que exige tratamento.',
    'tratamentos', 1
  ),
  (
    'O que é a Ablação por Cateter e como ela trata as arritmias?',
    'A ablação por cateter é um procedimento minimamente invasivo, realizado através de um cateterismo específico. O arritmologista mapeia o sistema elétrico do coração para localizar o foco exato da alteração e aplica energia (radiofrequência ou crioablação) para cauterizar esse ponto. Para diversos tipos de taquicardias, a ablação oferece uma taxa de cura elevada, permitindo que muitos pacientes fiquem livres do uso diário de medicamentos.',
    'tratamentos', 2
  ),
  (
    'Fibrilação Atrial: qual é o risco dessa arritmia e qual a sua relação com o AVC?',
    'A Fibrilação Atrial é a arritmia sustentada mais comum na população. Ela faz com que os átrios (câmaras superiores do coração) tremam em vez de contrair ritmicamente, o que pode levar ao acúmulo de sangue e formação de coágulos. Se um coágulo se soltar, ele pode viajar até o cérebro e provocar um Acidente Vascular Cerebral (AVC). Por isso, o tratamento foca tanto em controlar o ritmo ou a frequência cardíaca quanto na prevenção de coágulos com o uso de anticoagulantes, quando indicado.',
    'tratamentos', 3
  ),
  (
    'Quem tem arritmia cardíaca ou usa marca-passo pode praticar atividades físicas?',
    'Na maioria dos casos, sim! A prática de exercícios físicos costuma ser uma importante aliada da saúde cardiovascular. No entanto, a liberação e a intensidade adequada dependem da causa da arritmia e da avaliação médica. Pacientes com marca-passo ou desfibrilador (CDI) geralmente podem manter uma rotina ativa e saudável, desde que façam o acompanhamento regular para ajuste dos dispositivos e passem por avaliação prévia.',
    'tratamentos', 4
  ),
  (
    'Qual é a diferença entre um marca-passo e um Cardiodesfibrilador Implantável (CDI)?',
    'Embora ambos sejam dispositivos implantáveis para monitorar o ritmo cardíaco, eles têm funções distintas. Marca-passo: indicado para quando o coração bate muito devagar (bradicardias). Ele envia impulsos elétricos para manter a frequência cardíaca adequada. CDI: além de atuar como marca-passo se necessário, o CDI monitora e identifica arritmias graves e rápidas (como a taquicardia ventricular), sendo capaz de emitir um choque interno para reverter uma parada cardíaca e prevenir a morte súbita.',
    'tratamentos', 5
  ),
  (
    'Quando devo procurar um médico cardiologista ou arritmologista com urgência?',
    'Você deve buscar atendimento imediato em um pronto-socorro se as palpitações vierem acompanhadas de: desmaios (síncopes) ou sensação iminente de perda de consciência; dor ou aperto forte no peito; falta de ar intensa e repentina; tonturas severas ou queda abrupta da pressão arterial. Para tonturas leves pontuais, palpitações esporádicas ou para uma avaliação preventiva de rotina, agende uma consulta eletiva no consultório.',
    'agendamento', 6
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
