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
      "A arritmologia é uma subespecialidade da cardiologia dedicada ao estudo, diagnóstico e tratamento das arritmias cardíacas. O arritmologista é o médico especialista nos distúrbios do ritmo do coração, oferecendo tratamentos desde medicamentosos até procedimentos intervencionistas.",
    icon: "activity",
    benefits: [
      "Diagnóstico preciso de arritmias",
      "Tratamento personalizado",
      "Monitoramento com Holter 24h",
      "Indicação de procedimentos quando necessário",
      "Acompanhamento de portadores de marca-passo",
      "Prevenção de AVC por fibrilação atrial",
    ],
    commonConditions: [
      "Fibrilação Atrial",
      "Flutter Atrial",
      "Taquicardia Ventricular",
      "Síndrome de Wolff-Parkinson-White",
      "Bloqueios cardíacos",
      "Extrassístoles (batimentos extras)",
    ],
  },
  {
    id: "3",
    slug: "eletrofisiologia",
    title: "Eletrofisiologia Clínica e Invasiva",
    shortDescription:
      "Realização de Estudo Eletrofisiológico, ablação por cateter e indicação e acompanhamento de marcapasso e CDI.",
    description:
      "A eletrofisiologia invasiva utiliza técnicas minimamente invasivas para mapear o sistema elétrico do coração e tratar arritmias por meio de ablação por cateter, quando indicado. Formação pela UNIFESP/EPM, centro de referência nacional.",
    icon: "zap",
    benefits: [
      "Estudo eletrofisiológico diagnóstico",
      "Ablação por cateter, quando indicada",
      "Avaliação e acompanhamento de portadores de marca-passo",
      "Indicação de marca-passo ou CDI quando necessário",
      "Procedimentos minimamente invasivos",
      "Acompanhamento especializado de arritmias",
    ],
    commonConditions: [
      "Fibrilação Atrial refratária",
      "Flutter Atrial",
      "Taquicardias supraventriculares",
      "Taquicardias ventriculares",
      "Síndrome de Wolff-Parkinson-White (WPW)",
      "Bradicardias sintomáticas",
    ],
  },
];
