"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is Ascend?",
    answer:
      "Ascend is a private subscription community built around leverage, systems, identity, and ambition. It includes the Ascend Framework, a private Discord server, and a growing library of operator resources.",
  },
  {
    question: "What's included in the membership?",
    answer:
      "You get full access to the Ascend Framework (6 modules), the private Discord community, the systems library, and all future content and resources added to the vault.",
  },
  {
    question: "How do I access the Discord?",
    answer:
      "After subscribing, you'll create your Ascend account and connect your Discord. Access is granted automatically — no waiting, no manual approval.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel your subscription at any time from your member dashboard. No lock-ins, no cancellation fees.",
  },
  {
    question: "What's the difference between monthly and yearly?",
    answer:
      "Both plans give you identical access. The yearly plan saves you 25% and locks in your founding member rate for the full year.",
  },
  {
    question: "Is this like other online communities?",
    answer:
      "No. There is no free tier, no noise, no spam. Ascend is completely private — only paying members have access. The Discord is deliberately minimal and operator-focused.",
  },
  {
    question: "Who is Ascend for?",
    answer:
      "Ascend is for people who are serious about operating at a higher level — whether you're building a business, growing an income stream, or simply done with average. If you're looking for a shortcut, this isn't it.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.4em] uppercase text-[#808080] mb-4">FAQ</p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#e8e8e3] tracking-tight">
          Common Questions
        </h2>
        <div className="chrome-line w-16 mx-auto mt-8 mb-12" aria-hidden="true" />

        <div className="max-w-2xl mx-auto text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question} className="border-t border-[#1e1e1e]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-[#e8e8e3] text-sm font-semibold tracking-tight py-5 cursor-pointer flex justify-between items-center gap-6"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="text-[#808080] text-base leading-none" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-[#7a7a7a] text-sm leading-relaxed pb-5">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
