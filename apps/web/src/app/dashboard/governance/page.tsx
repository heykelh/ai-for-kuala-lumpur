"use client";

import { useLanguage } from "@/components/language-provider";

export default function GovernancePage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "Trust layer",
      title: "Governance",
      text:
        "This page will describe data quality checks, lineage, alert logic, model explainability, AI guardrails, and platform reliability principles.",
    },
    fr: {
      eyebrow: "Couche de confiance",
      title: "Gouvernance",
      text:
        "Cette page décrira les contrôles de qualité des données, la lineage, la logique des alertes, l’explicabilité des modèles, les garde-fous IA et les principes de fiabilité de la plateforme.",
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