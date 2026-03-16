"use client";

import { useLanguage } from "@/components/language-provider";

export default function AIPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "AI layer",
      title: "AI Assistant",
      text:
        "This page will consolidate AI copilot prompts, multilingual analysis, warehouse-grounded answers, and future agent-based operational actions.",
    },
    fr: {
      eyebrow: "Couche IA",
      title: "Assistant IA",
      text:
        "Cette page regroupera les prompts du copilot IA, l’analyse multilingue, les réponses basées sur le warehouse et les futures actions opérationnelles pilotées par des agents.",
    },
  }[language];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="glass-card soft-glow rounded-[30px] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
          {t.eyebrow}
        </p>
        <h1 className="heading-font mt-2 text-3xl font-bold text-white">
          {t.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          {t.text}
        </p>
      </div>
    </div>
  );
}