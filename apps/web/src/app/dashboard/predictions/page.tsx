"use client";

import { useLanguage } from "@/components/language-provider";

export default function PredictionsPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "ML layer",
      title: "Predictions",
      text:
        "This page will contain congestion forecasting, anomaly detection, district-level risk prediction, and future short-term operational scenarios.",
    },
    fr: {
      eyebrow: "Couche ML",
      title: "Prédictions",
      text:
        "Cette page contiendra les prévisions de congestion, la détection d’anomalies, la prédiction du risque par district et les scénarios opérationnels à court terme.",
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