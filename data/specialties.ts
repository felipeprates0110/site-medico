import type { Specialty } from "@/types";

export const specialties: Specialty[] = [
  {
    id: "1",
    slug: "cardiologia",
    title: "Cardiologia Geral",
    shortDescription:
      "Avaliação cardiovascular completa, check-up de rotina, controle da pressão arterial e prevenção de doenças do coração.",
    description:
      "A cardiologia cuida do coração e da circulação. Muitas pessoas só procuram o especialista em situações graves — mas o acompanhamento preventivo permite identificar fatores de risco, orientar o tratamento e reduzir a chance de complicações como infarto e AVC.",
    icon: "heart",
    benefits: [
      "Check-up cardiológico completo",
      "Avaliação de risco cardiovascular",
      "Controle de hipertensão arterial",
      "Risco pré-operatório",
      "Prevenção de infarto e AVC",
      "Acompanhamento de pacientes cardiopatas",
    ],
    commonConditions: [
      "Hipertensão arterial",
      "Colesterol alto",
      "Angina e infarto",
      "Insuficiência cardíaca",
      "Doenças das válvulas cardíacas",
      "Cardiopatias congênitas",
    ],
    approach:
      "Na consulta, o cardiologista precisa conhecer você: rotina, alimentação, atividade física, histórico familiar e sintomas. Com base nisso, faz o exame clínico e, quando necessário, solicita exames que avaliam o funcionamento do coração e dos vasos. Se houver alteração, monta um plano de cuidado que pode incluir medicação, mudanças no estilo de vida e, em alguns casos, encaminhamento para procedimentos ou subespecialidades — sempre com acompanhamento contínuo.",
    conditionDetails: [
      {
        title: "Hipertensão arterial",
        summary:
          "Pressão elevada de forma persistente. É comum e, muitas vezes, silenciosa — por isso o controle adequado é essencial para proteger o coração, o cérebro e os rins.",
      },
      {
        title: "Colesterol alto e dislipidemia",
        summary:
          "Alterações nas gorduras do sangue que favorecem o endurecimento das artérias. O tratamento combina avaliação individualizada, hábitos e, quando indicado, medicação.",
      },
      {
        title: "Angina e infarto",
        summary:
          "Dor ou aperto no peito podem indicar falta de oxigênio no músculo cardíaco. O infarto ocorre quando o fluxo sanguíneo é bloqueado e exige atenção imediata.",
      },
      {
        title: "Insuficiência cardíaca",
        summary:
          "O coração não bombeia sangue de forma suficiente para as necessidades do corpo. Pode causar falta de ar, cansaço e inchaço — ou, em alguns casos, evoluir de forma mais silenciosa.",
      },
      {
        title: "Doenças das válvulas cardíacas",
        summary:
          "As válvulas regulam o fluxo de sangue dentro do coração. Estreitamentos ou refluxos podem exigir acompanhamento clínico e, em situações selecionadas, intervenção.",
      },
      {
        title: "Arritmias cardíacas",
        summary:
          "Batimentos irregulares, acelerados ou lentos. A investigação e o tratamento especializado ficam a cargo da arritmologia, com suporte da eletrofisiologia quando há indicação de procedimento.",
      },
    ],
    whenToSeek: [
      "Dor, aperto ou desconforto no peito",
      "Falta de ar em esforços leves ou em repouso",
      "Cansaço excessivo sem explicação clara",
      "Palpitações, coração acelerado ou irregular",
      "Tonturas, quase desmaio ou desmaio",
      "Inchaço nas pernas ou ganho de peso rápido",
      "Pressão arterial elevada de forma recorrente",
      "Histórico familiar de doença cardíaca precoce ou fatores de risco (diabetes, obesidade, tabagismo)",
    ],
    exams: [
      "Eletrocardiograma (ECG)",
      "Ecocardiograma",
      "Teste ergométrico",
      "Holter 24 horas",
      "MAPA (monitorização da pressão arterial)",
      "Exames laboratoriais e outros, conforme a indicação clínica",
    ],
    preventionNote:
      "Doenças cardiovasculares costumam evoluir de forma silenciosa. Consultas preventivas, controle da pressão e do colesterol, atividade física orientada e hábitos saudáveis são a base para proteger o coração — e o acompanhamento regular permite ajustar o cuidado antes que surjam complicações.",
  },
  {
    id: "2",
    slug: "arritmologia",
    title: "Arritmologia",
    shortDescription:
      "Investigação e diagnóstico de palpitações, tonturas, síncope (desmaio) e acompanhamento de arritmias cardíacas e Fibrilação Atrial.",
    description:
      "A arritmologia cuida dos distúrbios do ritmo do coração — quando os batimentos ficam rápidos demais (taquicardia), lentos demais (bradicardia) ou irregulares. O arritmologista investiga os sintomas, confirma o diagnóstico e define o melhor caminho: observação, medicação ou indicação de procedimento, sempre com foco em reduzir risco e melhorar qualidade de vida.",
    icon: "activity",
    benefits: [
      "Investigação de palpitações, tonturas e desmaios",
      "Diagnóstico preciso do tipo de arritmia",
      "Monitoramento com Holter e exames orientados à queixa",
      "Tratamento medicamentoso individualizado",
      "Prevenção de AVC na fibrilação atrial",
      "Indicação e acompanhamento de procedimentos quando necessário",
    ],
    commonConditions: [
      "Fibrilação Atrial",
      "Flutter Atrial",
      "Taquicardia Ventricular",
      "Síndrome de Wolff-Parkinson-White",
      "Bloqueios cardíacos",
      "Extrassístoles (batimentos extras)",
    ],
    approach:
      "Na consulta de arritmologia, o ponto de partida é a sua história: como são as palpitações, quando começam, se há tontura ou quase desmaio, e quais exames você já fez. Em seguida, correlacionamos sintomas com o eletrocardiograma e, quando preciso, com Holter ou outros registros do ritmo. Nem toda arritmia exige intervenção imediata — o plano pode incluir observação, ajuste de medicação ou indicação de estudo eletrofisiológico e ablação, discutidos com clareza.",
    conditionDetails: [
      {
        title: "Fibrilação atrial",
        summary:
          "A arritmia mais comum nos adultos. O ritmo atrial fica desorganizado, o que pode causar palpitações, cansaço e aumentar o risco de formação de coágulos e AVC. O cuidado envolve controle do ritmo ou da frequência e, quando indicado, anticoagulação.",
      },
      {
        title: "Flutter atrial",
        summary:
          "Ritmo atrial acelerado e organizado, muitas vezes sentido como batimentos rápidos e regulares. Pode coexistir com fibrilação atrial e, em casos selecionados, responde bem a tratamento intervencionista.",
      },
      {
        title: "Extrassístoles (batimentos extras)",
        summary:
          "Batimentos que “saem fora” do ritmo habitual e geram a sensação de tropeço ou pancada no peito. Em muitos casos são benignas, mas merecem avaliação para afastar causas estruturais e definir se há necessidade de tratamento.",
      },
      {
        title: "Taquicardias supraventriculares e WPW",
        summary:
          "Episódios de coração acelerado que começam e param de forma abrupta. Incluem taquicardias por reentrada e a síndrome de Wolff-Parkinson-White, em que existe uma via elétrica extra. A investigação define o risco e as opções de tratamento.",
      },
      {
        title: "Taquicardia ventricular",
        summary:
          "Arritmia originada nos ventrículos. Pode ser grave e exige avaliação especializada para distinguir formas de menor risco de situações que necessitam proteção urgente e tratamento dirigido.",
      },
      {
        title: "Bradicardia e bloqueios cardíacos",
        summary:
          "Quando o coração bate de forma lenta demais ou a condução elétrica falha. Podem causar fadiga, tontura ou desmaio. Em alguns casos, a solução passa por marca-passo após avaliação completa.",
      },
    ],
    whenToSeek: [
      "Palpitações ou batimentos fortes, rápidos ou irregulares",
      "Coração acelerado em crises (mais de 100 batimentos por minuto)",
      "Bradicardia sintomática (ritmo muito lento com mal-estar)",
      "Tonturas, quase desmaio ou desmaio (síncope)",
      "Fadiga ou falta de ar associadas a alterações do ritmo",
      "Fibrilação atrial já diagnosticada — para acompanhamento ou segunda opinião",
      "Histórico familiar de morte súbita ou arritmias hereditárias",
      "Uso de marca-passo ou CDI com necessidade de revisão especializada",
    ],
    exams: [
      "Eletrocardiograma (ECG)",
      "Holter 24 horas (e monitorização mais prolongada, quando indicada)",
      "Ecocardiograma",
      "Teste ergométrico, conforme a clínica",
      "Avaliação de dispositivos implantáveis (marca-passo/CDI)",
      "Outros exames complementares, conforme a indicação",
    ],
  },
  {
    id: "3",
    slug: "eletrofisiologia",
    title: "Eletrofisiologia Clínica e Invasiva",
    shortDescription:
      "Realização de Estudo Eletrofisiológico, ablação por cateter e indicação e acompanhamento de marcapasso e CDI.",
    description:
      "A eletrofisiologia mapeia e trata o sistema elétrico do coração com técnicas minimamente invasivas. Quando a arritmia está documentada e há indicação, o estudo eletrofisiológico e a ablação por cateter permitem localizar e tratar o foco responsável — com indicação e acompanhamento de marca-passo ou CDI quando necessário. Formação pela UNIFESP/EPM, centro de referência nacional.",
    icon: "zap",
    benefits: [
      "Estudo eletrofisiológico diagnóstico",
      "Ablação por cateter, quando indicada",
      "Indicação de marca-passo ou CDI com critério clínico",
      "Acompanhamento de portadores de dispositivos",
      "Abordagem minimamente invasiva",
      "Integração com o cuidado clínico da arritmologia",
    ],
    commonConditions: [
      "Fibrilação Atrial refratária",
      "Flutter Atrial",
      "Taquicardias supraventriculares",
      "Taquicardias ventriculares",
      "Síndrome de Wolff-Parkinson-White (WPW)",
      "Bradicardias sintomáticas",
    ],
    approach:
      "O caminho usual começa pela avaliação clínica e pelos exames não invasivos. Quando a arritmia está clara e o benefício do procedimento supera os riscos, discute-se o estudo eletrofisiológico — um exame invasivo que mapeia os circuitos elétricos do coração — e, se indicado, a ablação por cateter na mesma abordagem. Em bradicardias ou risco de arritmias graves, entra a conversa sobre marca-passo ou CDI. Cada indicação é individualizada.",
    conditionDetails: [
      {
        title: "Fibrilação atrial com indicação de ablação",
        summary:
          "Quando sintomas persistem apesar da medicação, ou quando o controle do ritmo é a melhor estratégia, a ablação por cateter (como o isolamento das veias pulmonares, em casos selecionados) pode ser considerada após avaliação completa.",
      },
      {
        title: "Flutter atrial",
        summary:
          "Frequentemente tem um circuito bem definido e, em muitos pacientes, a ablação apresenta excelente resultado clínico quando bem indicada.",
      },
      {
        title: "Taquicardias supraventriculares",
        summary:
          "Crises de taquicardia por reentrada nodal ou vias acessórias. O estudo eletrofisiológico confirma o mecanismo e permite tratar o circuito com ablação, quando essa for a escolha terapêutica.",
      },
      {
        title: "Síndrome de Wolff-Parkinson-White (WPW)",
        summary:
          "Presença de via elétrica extra. Em pacientes sintomáticos ou com risco documentado, a ablação da via acessória é uma opção consolidada para eliminar o substrato da arritmia.",
      },
      {
        title: "Taquicardias ventriculares selecionadas",
        summary:
          "Em contextos específicos — com ou sem doença estrutural — a eletrofisiologia contribui no diagnóstico, na estratificação de risco e, quando indicado, na ablação ou na proteção com CDI.",
      },
      {
        title: "Bradicardias sintomáticas",
        summary:
          "Quando o ritmo lento ou o bloqueio de condução causam sintomas e há indicação clara, o marca-passo restaura uma frequência adequada. O acompanhamento do dispositivo faz parte do cuidado contínuo.",
      },
    ],
    whenToSeek: [
      "Arritmia já documentada com sintomas que limitam o dia a dia",
      "Falência ou intolerância ao tratamento medicamentoso",
      "Discussão sobre indicação de ablação por cateter",
      "Indicação ou dúvida sobre marca-passo ou CDI",
      "Acompanhamento e otimização de dispositivo já implantado",
      "Taquicardias recorrentes com necessidade de definição do mecanismo",
      "Encaminhamento do cardiologista ou arritmologista para avaliação invasiva",
    ],
    exams: [
      "Estudo eletrofisiológico (quando indicado)",
      "Eletrocardiograma e Holter no preparo da decisão",
      "Ecocardiograma e exames pré-procedimento",
      "Interrogação e ajuste de marca-passo ou CDI",
      "Monitorização do ritmo no seguimento pós-ablação",
      "Demais exames conforme o tipo de arritmia e o procedimento",
    ],
    preventionNote:
      "Procedimentos de eletrofisiologia não são a primeira opção para todos — são ferramentas poderosas quando a indicação é correta. A decisão considera o tipo de arritmia, os sintomas, os riscos e os objetivos do tratamento. O acompanhamento próximo, em continuidade com a arritmologia clínica, é parte essencial do resultado.",
  },
];
