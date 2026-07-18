export interface Review {
  id: string;
  author: string;
  date: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  verified: boolean;
  service?: string;
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
