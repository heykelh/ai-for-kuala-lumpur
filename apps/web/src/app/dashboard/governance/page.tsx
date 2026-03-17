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

function InfoCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-slate-300">
      {children}
    </div>
  );
}

export default function GovernancePage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "Trust layer",
      title: "Governance",
      intro:
        "This page explains how the project handles data quality, lineage, reliability, observability, AI guardrails, and operational trust.",
      pillarsTitle: "Governance pillars",
      pillarsSub: "Core concepts",
      dataQualityTitle: "Data quality",
      dataQualitySub: "Raw to curated control points",
      lineageTitle: "Lineage and traceability",
      lineageSub: "How data moves",
      aiTitle: "AI governance",
      aiSub: "Copilot reliability",
      observabilityTitle: "Observability and reliability",
      observabilitySub: "Platform health",
      securityTitle: "Access and environment management",
      securitySub: "Operational safety",
      roadmapTitle: "Future governance roadmap",
      roadmapSub: "Next maturity steps",
    },
    fr: {
      eyebrow: "Couche de confiance",
      title: "Gouvernance",
      intro:
        "Cette page explique comment le projet gère la qualité des données, la lineage, la fiabilité, l’observabilité, les garde-fous IA et la confiance opérationnelle.",
      pillarsTitle: "Piliers de gouvernance",
      pillarsSub: "Concepts clés",
      dataQualityTitle: "Qualité des données",
      dataQualitySub: "Points de contrôle du raw au préparé",
      lineageTitle: "Lineage et traçabilité",
      lineageSub: "Comment les données circulent",
      aiTitle: "Gouvernance IA",
      aiSub: "Fiabilité du copilot",
      observabilityTitle: "Observabilité et fiabilité",
      observabilitySub: "Santé de la plateforme",
      securityTitle: "Gestion des accès et des environnements",
      securitySub: "Sécurité opérationnelle",
      roadmapTitle: "Feuille de route gouvernance",
      roadmapSub: "Étapes de maturité suivantes",
    },
  }[language];

  const pillars =
    language === "en"
      ? [
          "Data quality validation from ingestion to marts",
          "Lineage and transformation transparency",
          "Clear separation between live serving and analytics warehouse",
          "Operational reliability and system status tracking",
          "AI answer grounding, explainability, and guardrails",
        ]
      : [
          "Validation de la qualité des données de l’ingestion jusqu’aux marts",
          "Transparence de la lineage et des transformations",
          "Séparation claire entre serving live et warehouse analytique",
          "Fiabilité opérationnelle et suivi de l’état du système",
          "Ancrage, explicabilité et garde-fous des réponses IA",
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
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">
          {t.intro}
        </p>
      </section>

      <SectionCard title={t.pillarsTitle} subtitle={t.pillarsSub}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pillars.map((item) => (
            <InfoCard key={item}>{item}</InfoCard>
          ))}
        </div>
      </SectionCard>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard title={t.dataQualityTitle} subtitle={t.dataQualitySub}>
          <div className="space-y-4">
            <InfoCard>
              {language === "en"
                ? "Raw city signals are ingested first, then transformed before being exposed as warehouse marts. This creates a clear distinction between source data and business-facing metrics."
                : "Les signaux urbains bruts sont ingérés en premier, puis transformés avant d’être exposés sous forme de marts analytiques. Cela crée une distinction claire entre la donnée source et les métriques orientées métier."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "The project already separates live serving data from warehouse analytics. Redis is used for the latest live state, while DuckDB/dbt are used for curated analytics."
                : "Le projet sépare déjà les données de serving live des analytics warehouse. Redis est utilisé pour le dernier état live, tandis que DuckDB/dbt servent aux analytics préparées."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "A mature next step is to add explicit validation rules such as acceptable AQI ranges, non-negative transit delays, district whitelist checks, and duplicate event detection."
                : "L’étape de maturité suivante consiste à ajouter des règles explicites de validation comme des plages AQI acceptables, des retards non négatifs, une whitelist de districts et la détection des doublons."}
            </InfoCard>
          </div>
        </SectionCard>

        <SectionCard title={t.lineageTitle} subtitle={t.lineageSub}>
          <div className="space-y-4">
            <InfoCard>
              {language === "en"
                ? "Current lineage can be explained as: producer → consumer → Redis → FastAPI → dashboard for live serving, and raw signals → DuckDB → dbt → marts → analytics views for the warehouse path."
                : "La lineage actuelle peut s’expliquer ainsi : producer → consumer → Redis → FastAPI → dashboard pour le serving live, et raw signals → DuckDB → dbt → marts → vues analytiques pour le chemin warehouse."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "This distinction is important because live data serves immediate monitoring, while warehouse data supports stable analytics, historical reasoning, and AI enrichment."
                : "Cette distinction est importante car la donnée live sert au monitoring immédiat, tandis que la donnée warehouse supporte des analytics stables, l’historique et l’enrichissement IA."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "A future improvement is to expose lineage visually on this page and document each transformation from raw to staging to marts."
                : "Une amélioration future consiste à exposer visuellement la lineage sur cette page et à documenter chaque transformation du raw au staging puis aux marts."}
            </InfoCard>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard title={t.aiTitle} subtitle={t.aiSub}>
          <div className="space-y-4">
            <InfoCard>
              {language === "en"
                ? "The AI copilot should not answer from vague intuition. It should be grounded in live metrics, warehouse marts, and documented project logic."
                : "Le copilot IA ne doit pas répondre à partir d’une intuition vague. Il doit être ancré dans les métriques live, les marts warehouse et la logique documentée du projet."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "The key governance rule for AI is traceability: where did the answer come from, what data was used, and what assumptions were made."
                : "La règle de gouvernance clé pour l’IA est la traçabilité : d’où vient la réponse, quelles données ont été utilisées et quelles hypothèses ont été faites."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "The next step is RAG analytics: retrieve relevant warehouse summaries and governance notes before generating the answer."
                : "L’étape suivante est le RAG analytics : récupérer les résumés warehouse et les notes de gouvernance pertinentes avant de générer la réponse."}
            </InfoCard>
          </div>
        </SectionCard>

        <SectionCard title={t.observabilityTitle} subtitle={t.observabilitySub}>
          <div className="space-y-4">
            <InfoCard>
              {language === "en"
                ? "The project already exposes operational health through stream connectivity, warehouse refresh status, and system health indicators."
                : "Le projet expose déjà une partie de la santé opérationnelle via la connectivité du stream, le statut du refresh warehouse et les indicateurs système."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "A stronger observability layer would include producer activity, consumer lag, Redis freshness, warehouse refresh age, and AI request success rate."
                : "Une couche d’observabilité plus forte inclurait l’activité du producer, le lag du consumer, la fraîcheur Redis, l’âge du refresh warehouse et le taux de succès des requêtes IA."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "This is how the platform moves from a visual dashboard to a reliable operational product."
                : "C’est ainsi que la plateforme passe d’un dashboard visuel à un vrai produit opérationnel fiable."}
            </InfoCard>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <SectionCard title={t.securityTitle} subtitle={t.securitySub}>
          <div className="space-y-4">
            <InfoCard>
              {language === "en"
                ? "Environment variables should isolate API keys, Redis connection strings, and future storage credentials from the codebase."
                : "Les variables d’environnement doivent isoler les clés API, les chaînes de connexion Redis et les futurs identifiants de stockage hors du code."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "The project should clearly separate local development, local orchestration, and deployed production settings."
                : "Le projet doit clairement séparer les réglages de développement local, d’orchestration locale et de production déployée."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "A future production-grade version should document who can trigger warehouse refreshes, who can access AI endpoints, and which services are allowed to write live data."
                : "Une future version de niveau production devra documenter qui peut déclencher les refreshes du warehouse, qui peut accéder aux endpoints IA et quels services sont autorisés à écrire les données live."}
            </InfoCard>
          </div>
        </SectionCard>

        <SectionCard title={t.roadmapTitle} subtitle={t.roadmapSub}>
          <div className="space-y-4">
            <InfoCard>
              {language === "en"
                ? "Add explicit data quality tests for marts and source freshness."
                : "Ajouter des tests explicites de qualité de données pour les marts et la fraîcheur des sources."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "Add lineage documentation from ingestion to analytics pages."
                : "Ajouter une documentation de lineage depuis l’ingestion jusqu’aux pages analytiques."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "Add AI response provenance and structured retrieval before generation."
                : "Ajouter la provenance des réponses IA et une récupération structurée avant génération."}
            </InfoCard>
            <InfoCard>
              {language === "en"
                ? "Add deployment-mode governance: local real-time mode vs Vercel-compatible public demo mode."
                : "Ajouter une gouvernance par mode de déploiement : mode local temps réel vs mode démo publique compatible Vercel."}
            </InfoCard>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}