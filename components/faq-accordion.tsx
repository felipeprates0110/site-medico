"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQAccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQAccordionItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300",
              isOpen
                ? "border-primary-200 shadow-md"
                : "border-gray-200 hover:border-primary-200 hover:shadow-md"
            )}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${item.id}`}
              className="flex w-full items-start justify-between gap-4 p-6 text-left"
            >
              <h4 className="font-bold text-gray-950">{item.question}</h4>
              <ChevronDown
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0 text-primary-600 transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
                aria-hidden
              />
            </button>

            <div
              id={`faq-answer-${item.id}`}
              role="region"
              aria-hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-gray-600">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
