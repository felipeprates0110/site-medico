import type { FAQItem } from "@/types";

export const faqItems: FAQItem[] = [
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
      "A ablação por cateter é um procedimento minimamente invasivo, realizado através de um cateterismo específico. O arritmologista mapeia o sistema elétrico do coração para localizar o foco exato da alteração e aplica energia (radiofrequência ou crioablação) para cauterizar esse ponto. Para diversos tipos de taquicardias, a ablação oferece uma taxa de cura elevada, permitindo que muitos pacientes fiquem livres do uso diário de medicamentos.",
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
      "Embora ambos sejam dispositivos implantáveis para monitorar o ritmo cardíaco, eles têm funções distintas. Marca-passo: indicado para quando o coração bate muito devagar (bradicardias). Ele envia impulsos elétricos para manter a frequência cardíaca adequada. CDI: além de atuar como marca-passo se necessário, o CDI monitora e identifica arritmias graves e rápidas (como a taquicardia ventricular), sendo capaz de emitir um choque interno para reverter uma parada cardíaca e prevenir a morte súbita.",
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
];
