import type { Specialty } from "@/types";

export const specialties: Specialty[] = [
  {
    id: "1",
    slug: "cardiologia",
    title: "Cardiologia Geral",
    shortDescription:
      "Avaliação completa da saúde cardiovascular, prevenção e tratamento de doenças do coração.",
    description:
      "A cardiologia é a especialidade médica que cuida da saúde do coração e do sistema circulatório. Realizamos consultas cardiológicas completas, incluindo avaliação clínica detalhada, exames complementares e orientação sobre prevenção de doenças cardiovasculares.",
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
  },
  {
    id: "2",
    slug: "arritmologia",
    title: "Arritmologia",
    shortDescription:
      "Especialidade focada no diagnóstico e tratamento de alterações do ritmo cardíaco (arritmias).",
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
      "Procedimentos avançados para diagnóstico e tratamento definitivo de arritmias cardíacas.",
    description:
      "A eletrofisiologia invasiva utiliza técnicas minimamente invasivas para mapear o sistema elétrico do coração e realizar tratamentos definitivos de arritmias através de ablação por cateter. Formação pela UNIFESP/EPM, centro de referência nacional.",
    icon: "zap",
    benefits: [
      "Estudo eletrofisiológico diagnóstico",
      "Ablação por cateter (tratamento definitivo)",
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
