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

export default function StreamingPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "Data flow",
      title: "Streaming",
      subtitle:
        "This page explains how live signals travel from production to dashboard delivery.",
      chainTitle: "Streaming chain",
      chainSub: "Current architecture",
      whyTitle: "Why this matters",
      whySub: "Engineering logic",
    },
    fr: {
      eyebrow: "Flux de données",
      title: "Streaming",
      subtitle:
        "Cette page explique comment les signaux live circulent depuis la production jusqu’à l’affichage dans le dashboard.",
      chainTitle: "Chaîne de streaming",
      chainSub: "Architecture actuelle",
      whyTitle: "Pourquoi c’est important",
      whySub: "Logique d’ingénierie",
    },
  }[language];

  const chain =
    language === "en"
      ? [
          "Producer generates city signals",
          "Consumer processes events",
          "Redis stores the latest live snapshot",
          "FastAPI serves live endpoints",
          "Next.js dashboard displays live operations",
        ]
      : [
          "Le producer génère les signaux urbains",
          "Le consumer traite les événements",
          "Redis stocke le dernier snapshot live",
          "FastAPI sert les endpoints temps réel",
          "Le dashboard Next.js affiche les opérations live",
        ];

  const why =
    language === "en"
      ? [
          "Clear separation between ingestion and serving",
          "Redis enables fast retrieval of the latest state",
          "The dashboard stays responsive without querying a warehouse for every refresh",
        ]
      : [
          "Séparation claire entre ingestion et serving",
          "Redis permet une récupération rapide du dernier état",
          "Le dashboard reste réactif sans interroger le warehouse à chaque rafraîchissement",
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
        <SectionCard title={t.chainTitle} subtitle={t.chainSub}>
          <div className="space-y-3">
            {chain.map((item, index) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300"
              >
                <span className="mr-3 font-semibold text-cyan-300">
                  {index + 1}.
                </span>
                {item}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t.whyTitle} subtitle={t.whySub}>
          <div className="space-y-3">
            {why.map((item) => (
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