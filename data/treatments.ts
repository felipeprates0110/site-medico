import type { Treatment } from "@/types";

export const treatments: Treatment[] = [
  {
    id: "1",
    slug: "fibrilacao-atrial",
    title: "Fibrilação Atrial",
    shortDescription:
      "Arritmia cardíaca mais comum que aumenta risco de AVC e demência.",
    description:
      "A Fibrilação Atrial (FA) é a alteração do ritmo do coração mais comum no mundo. Mais de 30 milhões de pessoas possuem FA globalmente. A importância de diagnosticar essa arritmia está na sua relação com aumento do risco de desenvolver AVC, demência, insuficiência cardíaca e morte súbita. Muitas vezes é silenciosa, ou seja, não demonstra sintomas evidentes e sua primeira manifestação pode ser um derrame cerebral.",
    symptoms: [
      "Palpitações (batimentos acelerados ou irregulares)",
      "Fadiga e cansaço fácil",
      "Falta de ar aos esforços",
      "Tontura e fraqueza",
      "Desconforto no peito",
      "Pode ser assintomática (sem sintomas)",
    ],
    diagnosis: [
      "Eletrocardiograma (ECG)",
      "Holter 24 horas",
      "Ecocardiograma",
      "Exames laboratoriais",
      "Teste ergométrico",
    ],
    treatment: [
      "Controle medicamentoso da frequência cardíaca",
      "Anticoagulação para prevenção de AVC",
      "Cardioversão elétrica",
      "Ablação por cateter (tratamento definitivo)",
      "Controle de fatores de risco",
    ],
    preventiveCare: [
      "Controle da pressão arterial",
      "Tratamento da apneia do sono",
      "Perda de peso",
      "Redução do consumo de álcool",
      "Atividade física regular",
    ],
  },
  {
    id: "2",
    slug: "ablacao-por-cateter",
    title: "Ablação por Cateter de Arritmias",
    shortDescription:
      "Procedimento minimamente invasivo para cura definitiva de arritmias.",
    description:
      "A ablação por cateter é um procedimento considerado minimamente invasivo, no qual o médico passa um tubo fino (cateter) pelos vasos sanguíneos até o coração. Esse procedimento tem por objetivo diagnosticar e tratar as vias elétricas anormais do coração. É feito por anestesia local, sem cortes ou pontos de sutura. Também é um procedimento moderno, seguro e eficaz com altas taxas de cura.",
    symptoms: [],
    diagnosis: [
      "Estudo eletrofisiológico",
      "Mapeamento eletroanatômico 3D",
      "Localização precisa do foco da arritmia",
    ],
    treatment: [
      "Ablação por radiofrequência",
      "Crioablação (ablação por frio)",
      "Procedimento guiado por raio-X e ultrassom",
      "Internação de 1 dia",
      "Recuperação rápida",
    ],
    preventiveCare: [
      "Seguimento ambulatorial regular",
      "Monitoramento com Holter após procedimento",
      "Adequação de medicações",
    ],
  },
  {
    id: "3",
    slug: "flutter-atrial",
    title: "Flutter Atrial",
    shortDescription:
      "Arritmia cardíaca com alta taxa de cura através de ablação.",
    description:
      "O Flutter Atrial é uma arritmia caracterizada por batimentos cardíacos rápidos e regulares. Similar à fibrilação atrial, também aumenta o risco de AVC e pode causar sintomas como palpitações e cansaço. A boa notícia é que possui alta taxa de cura através de ablação por cateter.",
    symptoms: [
      "Palpitações regulares e rápidas",
      "Falta de ar",
      "Cansaço",
      "Tontura",
      "Dor no peito",
    ],
    diagnosis: [
      "Eletrocardiograma (padrão característico)",
      "Holter 24 horas",
      "Ecocardiograma",
    ],
    treatment: [
      "Controle medicamentoso",
      "Cardioversão elétrica",
      "Ablação por cateter (cura > 95%)",
      "Anticoagulação",
    ],
  },
  {
    id: "4",
    slug: "bloqueio-cardiaco",
    title: "Bloqueio Cardíaco",
    shortDescription:
      "Alteração na condução elétrica do coração que pode necessitar marca-passo.",
    description:
      "O coração é um órgão incrível! Para bombear sangue para o resto do corpo, ele precisa ser comandado por um sistema elétrico que dita a frequência de suas contrações por minuto. Se existir um bloqueio na condução, em algum ponto desse vasto sistema elétrico, as contrações serão ineficazes e o corpo não receberá o suprimento de sangue necessário.",
    symptoms: [
      "Tontura",
      "Cansaço excessivo",
      "Escurecimento da visão",
      "Palidez",
      "Desmaios",
      "Pode levar à morte súbita",
    ],
    diagnosis: [
      "Eletrocardiograma",
      "Holter 24 horas",
      "Teste de inclinação (Tilt Test)",
      "Estudo eletrofisiológico",
    ],
    treatment: [
      "Implante de marca-passo definitivo",
      "Marca-passo temporário em emergências",
      "Acompanhamento regular do dispositivo",
    ],
  },
  {
    id: "5",
    slug: "sindrome-wolff-parkinson-white",
    title: "Síndrome de Wolff-Parkinson-White (WPW)",
    shortDescription: "Arritmia congênita com cura definitiva através de ablação.",
    description:
      "A Síndrome de Wolff-Parkinson-White (WPW) é uma arritmia bem comum na prática médica. Trata-se de uma alteração congênita (a pessoa já nasce com ela). Os sintomas cursam com crises de palpitações, que podem ser curtas ou mais prolongadas, queda da pressão arterial e mal estar geral. A cura dessa arritmia é feita através de ablação por cateter com taxa de sucesso superior a 95%.",
    symptoms: [
      "Crises súbitas de palpitações",
      "Taquicardia (coração acelerado)",
      "Tontura durante as crises",
      "Falta de ar",
      "Ansiedade",
      "Pode ser assintomática",
    ],
    diagnosis: [
      "Eletrocardiograma (padrão de pré-excitação)",
      "Estudo eletrofisiológico",
      "Teste ergométrico",
    ],
    treatment: [
      "Ablação por cateter (tratamento de escolha)",
      "Taxa de cura > 95%",
      "Procedimento minimamente invasivo",
      "Alternativa: medicamentos antiarrítmicos",
    ],
  },
  {
    id: "6",
    slug: "hipertensao-arterial",
    title: "Hipertensão Arterial",
    shortDescription:
      "Pressão alta - principal fator de risco para doenças cardiovasculares.",
    description:
      "A hipertensão arterial, conhecida como pressão alta, é uma condição crônica em que a pressão do sangue nas artérias está persistentemente elevada. É o principal fator de risco para infarto, AVC, insuficiência cardíaca e doença renal crônica. O controle adequado da pressão é fundamental para prevenir complicações.",
    symptoms: [
      "Geralmente assintomática (doença silenciosa)",
      "Dor de cabeça",
      "Tontura",
      "Visão embaçada",
      "Falta de ar",
      "Dor no peito (em casos graves)",
    ],
    diagnosis: [
      "Medição da pressão arterial",
      "MAPA (Monitorização Ambulatorial da Pressão)",
      "Exames para avaliar lesões em órgãos-alvo",
      "Exames laboratoriais",
    ],
    treatment: [
      "Mudanças no estilo de vida",
      "Dieta com redução de sal",
      "Atividade física regular",
      "Perda de peso",
      "Medicamentos anti-hipertensivos",
      "Acompanhamento regular",
    ],
    preventiveCare: [
      "Alimentação saudável",
      "Exercícios físicos regulares",
      "Controle do estresse",
      "Evitar consumo excessivo de álcool",
      "Não fumar",
      "Manter peso adequado",
    ],
  },
];
