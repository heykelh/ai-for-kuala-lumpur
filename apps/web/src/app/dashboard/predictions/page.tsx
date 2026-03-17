"use client";

import { useLanguage } from "@/components/language-provider";

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card soft-glow rounded-[30px] p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
          {subtitle}
        </p>
        <h2 className="heading-font mt-2 text-xl font-semibold text-white">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

export default function PredictionsPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "ML layer",
      title: "Predictions",
      subtitle:
        "This page is dedicated to forecasting, anomaly detection, and future AI-driven predictions.",
      modulesTitle: "Prediction modules",
      modulesSub: "Planned features",
      businessTitle: "Why this matters",
      businessSub: "Business impact",
    },
    fr: {
      eyebrow: "Couche ML",
      title: "Prédictions",
      subtitle:
        "Cette page est dédiée au forecasting, à la détection d’anomalies et aux futures prédictions pilotées par l’IA.",
      modulesTitle: "Modules de prédiction",
      modulesSub: "Fonctionnalités prévues",
      businessTitle: "Pourquoi c’est utile",
      businessSub: "Impact métier",
    },
  }[language];

  const modules =
    language === "en"
      ? [
          "Traffic congestion forecasting for the next 30 minutes",
          "District-level operational risk prediction",
          "Air quality degradation early warning",
          "Transit disruption anomaly detection",
        ]
      : [
          "Prévision de congestion trafic sur les 30 prochaines minutes",
          "Prédiction du risque opérationnel par district",
          "Alerte précoce sur la dégradation de la qualité de l’air",
          "Détection d’anomalies sur les perturbations de transport",
        ];

  const business =
    language === "en"
      ? [
          "Anticipate congestion before it becomes critical",
          "Support decision-making with forward-looking signals",
          "Move from monitoring to prediction",
        ]
      : [
          "Anticiper la congestion avant qu’elle ne devienne critique",
          "Soutenir la décision avec des signaux prospectifs",
          "Passer du monitoring à la prédiction",
        ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="glass-card soft-glow rounded-[34px] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/90">
          {t.eyebrow}
        </p>
        <h1 className="heading-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          {t.subtitle}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard title={t.modulesTitle} subtitle={t.modulesSub}>
          <div className="space-y-3">
            {modules.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t.businessTitle} subtitle={t.businessSub}>
          <div className="space-y-3">
            {business.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-cyan-400/15 bg-cyan-500/8 px-4 py-4 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}