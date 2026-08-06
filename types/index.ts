export interface Review {
  id: string;
  author: string;
  date: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  verified: boolean;
  service?: string;
}

export interface SpecialtyConditionDetail {
  title: string;
  summary: string;
}

/** Guia educativo de procedimento (ex.: estudo eletrofisiológico) */
export interface SpecialtyProcedureGuide {
  title: string;
  summary: string;
  howItWorks: string;
  indications: string[];
  preparation: string[];
  aftercare: string[];
  risksNote: string;
}

export interface Specialty {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  benefits: string[];
  commonConditions: string[];
  /** Como funciona a consulta / o que o especialista avalia */
  approach?: string;
  /** Patologias com breve explicação (prevalece sobre commonConditions na página) */
  conditionDetails?: SpecialtyConditionDetail[];
  /** Sinais e sintomas que indicam procurar o especialista */
  whenToSeek?: string[];
  /** Exames frequentemente solicitados */
  exams?: string[];
  /** Nota curta sobre prevenção e acompanhamento */
  preventionNote?: string;
  /** Orientações sobre um procedimento-chave da especialidade */
  procedureGuide?: SpecialtyProcedureGuide;
}

export interface Treatment {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  symptoms: string[];
  diagnosis: string[];
  treatment: string[];
  preventiveCare?: string[];
}

export interface InsurancePlan {
  id: string;
  name: string;
  category: "public" | "private" | "corporate";
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "geral" | "agendamento" | "convenios" | "tratamentos";
}
