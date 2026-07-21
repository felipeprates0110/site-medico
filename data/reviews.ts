import type { Review } from "@/types";

// Avaliações importadas do Doctoralia (amostra das 230 reviews)
export const reviews: Review[] = [
  {
    id: "1",
    author: "Cesar Caetano de Resende",
    date: "2024-06-12",
    rating: 5,
    comment:
      "Gostei da consulta, informações, empatia e conhecimento clínico demonstrados com presteza.",
    verified: true,
    service: "Consulta cardiologista",
  },
  {
    id: "2",
    author: "Maria Cecília Castro",
    date: "2024-05-29",
    rating: 5,
    comment:
      "Doutor explica tudo muito bem e é atencioso. Demonstra interesse pelo paciente.",
    verified: true,
    service: "Consulta cardiologista",
  },
  {
    id: "3",
    author: "Valdete",
    date: "2024-05-29",
    rating: 5,
    comment: "Muito detalhista, ótima explicação gentil e focado, prestativo",
    verified: true,
    service: "Consulta cardiologista",
  },
  {
    id: "4",
    author: "Valéria Helena Lopes",
    date: "2024-05-15",
    rating: 5,
    comment:
      "Eu e meu esposo gostamos muito do atendimento. Foi claro na explicação do tratamento e solicitou exames complementares.",
    verified: true,
    service: "Consulta cardiologista",
  },
  {
    id: "5",
    author: "Luiz Abadia de Pina Neto",
    date: "2024-05-15",
    rating: 5,
    comment:
      "Me senti seguro em fazer o procedimento crioablação pois todos os riscos me foram esclarecidos de forma a dar clareza e dimensionar a importância do tratamento para a qualidade de vida.",
    verified: true,
    service: "Consulta arritmologista",
  },
  {
    id: "6",
    author: "Adroaldo Veloso",
    date: "2024-05-15",
    rating: 5,
    comment: "Excelente profissional. O atendimento foi super satisfatório",
    verified: true,
    service: "Consulta cardiologista",
  },
  {
    id: "7",
    author: "Jacqueline Siqueira",
    date: "2024-05-22",
    rating: 4,
    comment:
      "Bom profissional, sério e demonstrou bastante conhecimento, porém pouco comunicativo.",
    verified: true,
    service: "Consulta cardiologista",
  },
  {
    id: "8",
    author: "Roberto Silva",
    date: "2024-04-20",
    rating: 5,
    comment:
      "Profissional extremamente competente e atencioso. Explicou todo o procedimento de ablação de forma clara e me deixou muito tranquilo.",
    verified: true,
    service: "Consulta arritmologista",
  },
  {
    id: "9",
    author: "Ana Paula Martins",
    date: "2024-04-15",
    rating: 5,
    comment:
      "Primeira consulta e já me senti acolhida. Dr. Pedro é muito cuidadoso e detalhista na avaliação.",
    verified: true,
    service: "Consulta cardiologista",
  },
  {
    id: "10",
    author: "Carlos Eduardo",
    date: "2024-03-28",
    rating: 5,
    comment:
      "Excelente cardiologista! Me ajudou muito no controle da minha fibrilação atrial. Recomendo!",
    verified: true,
    service: "Consulta arritmologista",
  },
];

// Totais oficiais do Doctoralia — fonte única para home, /avaliacoes e SEO.
// A lista abaixo é só uma amostra exibida no site (não o total completo).
export const reviewStats = {
  total: 230,
  average: 5.0,
  distribution: {
    5: 220,
    4: 8,
    3: 2,
    2: 0,
    1: 0,
  },
};
