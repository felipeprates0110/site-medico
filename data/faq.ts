import type { FAQItem } from "@/types";

/**
 * Perguntas frequentes do site.
 * Os primeiros itens alinham com "As pessoas também perguntam" do Google
 * (busca arritmologista Brasília) para SEO e citação em AI Overview.
 */
export const faqItems: FAQItem[] = [
  {
    id: "paa-1",
    question: "Qual a diferença entre cardiologista e arritmologista?",
    answer:
      "O cardiologista cuida do coração de forma ampla: pressão alta, colesterol, prevenção de infarto, insuficiência cardíaca e check-up. O arritmologista é o cardiologista com formação adicional em distúrbios do ritmo — palpitações, fibrilação atrial, taquicardias, bradicardias e, quando necessário, indicação de procedimentos como ablação, marca-passo ou CDI. Em Brasília, o Dr. Pedro Felipe atua nas duas frentes, com foco em arritmologia e eletrofisiologia.",
    category: "geral",
  },
  {
    id: "paa-2",
    question: "Quando devo procurar um arritmologista?",
    answer:
      "Vale buscar avaliação de arritmologista se você tem palpitações frequentes, coração acelerado ou irregular, tonturas, quase desmaio ou desmaio, diagnóstico de fibrilação atrial ou outra arritmia, ou se o cardiologista clínico indicou avaliação especializada. Procure pronto-socorro com urgência se houver desmaio, dor forte no peito, falta de ar intensa ou tontura severa. Para sintomas leves ou avaliação eletiva, agende consulta no consultório.",
    category: "geral",
  },
  {
    id: "paa-3",
    question: "Qual é o outro nome para arritmologista?",
    answer:
      "Arritmologista e eletrofisiologista são termos próximos na prática. Em geral, “arritmologista” destaca o cuidado clínico das arritmias; “eletrofisiologista” destaca o domínio dos procedimentos invasivos (estudo eletrofisiológico e ablação). Muitos especialistas atuam nas duas áreas. No Brasil, a subespecialidade costuma aparecer como Eletrofisiologia Clínica e Invasiva.",
    category: "geral",
  },
  {
    id: "paa-4",
    question: "Como escolher um arritmologista em Brasília?",
    answer:
      "Em vez de rankings genéricos, prefira critérios objetivos: formação e títulos em cardiologia e eletrofisiologia (CRM/RQE), experiência com o tipo de arritmia que você tem, clareza na explicação das opções (medicação, ablação, dispositivos), possibilidade de segunda opinião e atendimento em serviço estruturado. O Dr. Pedro Felipe Prates Silva (CRM DF 18951) atende na IDC — Instituto de Doenças Cardiovasculares, Asa Sul, Brasília.",
    category: "geral",
  },
  {
    id: "1",
    question:
      'Sinto o meu coração "pular um batimento" ou acelerar do nada. Isso sempre é perigoso?',
    answer:
      'Nem toda alteração no ritmo do coração indica uma doença grave. Sensações de "falhas", palpitações ou aceleração rápida podem ocorrer por conta de extrassístoles benignas, estresse, consumo de cafeína ou ansiedade. No entanto, apenas uma avaliação cardiológica detalhada, acompanhada de exames como o Eletrocardiograma e o Holter 24 horas, pode diferenciar uma arritmia benigna de uma condição que exige tratamento.',
    category: "tratamentos",
  },
  {
    id: "2",
    question: "O que é a Ablação por Cateter e como ela trata as arritmias?",
    answer:
      "A ablação por cateter é um procedimento minimamente invasivo, realizado através de um cateterismo específico. O arritmologista mapeia o sistema elétrico do coração para localizar o foco da alteração e aplica energia (radiofrequência ou crioablação) nesse ponto. Em determinados tipos de taquicardias, a ablação pode ser uma opção terapêutica para controlar a arritmia e, em alguns casos, reduzir a necessidade de medicamentos — sempre conforme avaliação individualizada.",
    category: "tratamentos",
  },
  {
    id: "3",
    question:
      "Fibrilação Atrial: qual é o risco dessa arritmia e qual a sua relação com o AVC?",
    answer:
      "A Fibrilação Atrial é a arritmia sustentada mais comum na população. Ela faz com que os átrios (câmaras superiores do coração) tremam em vez de contrair ritmicamente, o que pode levar ao acúmulo de sangue e formação de coágulos. Se um coágulo se soltar, ele pode viajar até o cérebro e provocar um Acidente Vascular Cerebral (AVC). Por isso, o tratamento foca tanto em controlar o ritmo ou a frequência cardíaca quanto na prevenção de coágulos com o uso de anticoagulantes, quando indicado.",
    category: "tratamentos",
  },
  {
    id: "4",
    question:
      "Quem tem arritmia cardíaca ou usa marca-passo pode praticar atividades físicas?",
    answer:
      "Na maioria dos casos, sim! A prática de exercícios físicos costuma ser uma importante aliada da saúde cardiovascular. No entanto, a liberação e a intensidade adequada dependem da causa da arritmia e da avaliação médica. Pacientes com marca-passo ou desfibrilador (CDI) geralmente podem manter uma rotina ativa e saudável, desde que façam o acompanhamento regular para ajuste dos dispositivos e passem por avaliação prévia.",
    category: "tratamentos",
  },
  {
    id: "5",
    question:
      "Qual é a diferença entre um marca-passo e um Cardiodesfibrilador Implantável (CDI)?",
    answer:
      "Embora ambos sejam dispositivos implantáveis para monitorar o ritmo cardíaco, eles têm funções distintas. Marca-passo: indicado para quando o coração bate muito devagar (bradicardias). Ele envia impulsos elétricos para manter a frequência cardíaca adequada. CDI: além de atuar como marca-passo se necessário, o CDI monitora e identifica arritmias graves e rápidas (como a taquicardia ventricular), podendo emitir um choque interno com o objetivo de reverter arritmias potencialmente fatais, quando indicado.",
    category: "tratamentos",
  },
  {
    id: "6",
    question:
      "Quando devo procurar um médico cardiologista ou arritmologista com urgência?",
    answer:
      "Você deve buscar atendimento imediato em um pronto-socorro se as palpitações vierem acompanhadas de: desmaios (síncopes) ou sensação iminente de perda de consciência; dor ou aperto forte no peito; falta de ar intensa e repentina; tonturas severas ou queda abrupta da pressão arterial. Para tonturas leves pontuais, palpitações esporádicas ou para uma avaliação preventiva de rotina, agende uma consulta eletiva no consultório.",
    category: "agendamento",
  },
  {
    id: "7",
    question: "Onde o Dr. Pedro Felipe atende em Brasília?",
    answer:
      "As consultas presenciais são na IDC — Instituto de Doenças Cardiovasculares, no Centro Médico de Brasília (SHLS 716, Conjunto B, Bloco C — Asa Sul/DF). O Dr. Pedro Felipe faz parte do corpo clínico da IDC em cardiologia e eletrofisiologia. Para agendar, use o WhatsApp, o telefone (61) 3346-0202 ou o formulário deste site. Perfil oficial na IDC: https://idcbrasilia.com.br/dr-pedro-felipe-prates-silva/",
    category: "agendamento",
  },
];
