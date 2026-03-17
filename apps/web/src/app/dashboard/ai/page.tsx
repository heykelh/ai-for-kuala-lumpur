"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import AICopilotPanel from "@/components/ai-copilot-panel";

type LiveSnapshot = {
  timestamp: string;
  district: string;
  traffic_index: number;
  congestion_level: string;
  aqi: number;
  air_quality_status: string;
  temperature_c: number;
  humidity_pct: number;
  transit_delay_min: number;
  source?: string;
};

type LiveApiResponse = {
  city: string;
  mode: string;
  snapshot: LiveSnapshot;
};

const API_BASE_URL = "http://localhost:8000";

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

export default function AIPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<LiveApiResponse | null>(null);

  useEffect(() => {
    async function loadLive() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/live`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json: LiveApiResponse = await res.json();
        setData(json);
      } catch {
        //
      }
    }

    loadLive();
    const interval = setInterval(loadLive, 3000);
    return () => clearInterval(interval);
  }, []);

  const t = {
    en: {
      eyebrow: "AI layer",
      title: "AI Assistant",
      subtitle:
        "This page centralizes the copilot and explains how the AI layer supports operational understanding.",
      copilotTitle: "Operational copilot",
      copilotSub: "Live analysis",
      promptsTitle: "Suggested use cases",
      promptsSub: "Prompt ideas",
      roadmapTitle: "What comes next",
      roadmapSub: "AI roadmap",
    },
    fr: {
      eyebrow: "Couche IA",
      title: "Assistant IA",
      subtitle:
        "Cette page centralise le copilot et explique comment la couche IA soutient la compréhension opérationnelle.",
      copilotTitle: "Copilot opérationnel",
      copilotSub: "Analyse live",
      promptsTitle: "Cas d’usage suggérés",
      promptsSub: "Idées de prompts",
      roadmapTitle: "Ce qui arrive ensuite",
      roadmapSub: "Feuille de route IA",
    },
  }[language];

  const promptIdeas =
    language === "en"
      ? [
          "Summarize the current city situation.",
          "Explain the main operational risk right now.",
          "Compare traffic and air quality conditions.",
          "Recommend an action for city operations teams.",
          "Highlight the most sensitive district.",
        ]
      : [
          "Résume la situation actuelle de la ville.",
          "Explique le principal risque opérationnel du moment.",
          "Compare les conditions de trafic et de qualité de l’air.",
          "Recommande une action pour les équipes d’opérations urbaines.",
          "Mets en avant le district le plus sensible.",
        ];

  const roadmap =
    language === "en"
      ? [
          "RAG grounded on warehouse analytics",
          "Bilingual enterprise copilots",
          "Alert explanation and root cause reasoning",
          "Operational recommendations by district",
        ]
      : [
          "RAG ancré sur les analytics du warehouse",
          "Copilots entreprise bilingues",
          "Explication des alertes et raisonnement cause racine",
          "Recommandations opérationnelles par district",
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

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AICopilotPanel snapshot={data?.snapshot} />

        <div className="flex flex-col gap-6">
          <SectionCard title={t.promptsTitle} subtitle={t.promptsSub}>
            <div className="space-y-3">
              {promptIdeas.map((item) => (
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
        </div>
      </section>
    </div>
  );
}