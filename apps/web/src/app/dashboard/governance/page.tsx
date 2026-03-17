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

export default function GovernancePage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "Trust layer",
      title: "Governance",
      subtitle:
        "This page is dedicated to data quality, operational trust, and AI reliability.",
      themesTitle: "Governance pillars",
      themesSub: "Core concepts",
      roadmapTitle: "Future governance layer",
      roadmapSub: "Next steps",
    },
    fr: {
      eyebrow: "Couche de confiance",
      title: "Gouvernance",
      subtitle:
        "Cette page est dédiée à la qualité des données, à la confiance opérationnelle et à la fiabilité de l’IA.",
      themesTitle: "Piliers de gouvernance",
      themesSub: "Concepts clés",
      roadmapTitle: "Future couche de gouvernance",
      roadmapSub: "Prochaines étapes",
    },
  }[language];

  const pillars =
    language === "en"
      ? [
          "Data quality checks on raw and curated layers",
          "Warehouse lineage and transformation clarity",
          "AI answer grounding and explainability",
          "Operational alert reliability",
        ]
      : [
          "Contrôles de qualité sur les couches raw et préparées",
          "Lineage warehouse et clarté des transformations",
          "Ancrage et explicabilité des réponses IA",
          "Fiabilité des alertes opérationnelles",
        ];

  const roadmap =
    language === "en"
      ? [
          "Document lineage from ingestion to marts",
          "Track AI prompt and answer provenance",
          "Add business validation rules",
          "Add observability and reliability metrics",
        ]
      : [
          "Documenter la lineage depuis l’ingestion jusqu’aux marts",
          "Tracer la provenance des prompts et réponses IA",
          "Ajouter des règles de validation métier",
          "Ajouter des métriques d’observabilité et de fiabilité",
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
        <SectionCard title={t.themesTitle} subtitle={t.themesSub}>
          <div className="space-y-3">
            {pillars.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t.roadmapTitle} subtitle={t.roadmapSub}>
          <div className="space-y-3">
            {roadmap.map((item) => (
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