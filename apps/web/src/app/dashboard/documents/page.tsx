"use client";

import { useLanguage } from "@/components/language-provider";

function DocCard({
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
      <div className="space-y-4 text-sm leading-7 text-slate-300">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-white/8 bg-white/[0.03] px-4 py-4">
      {children}
    </div>
  );
}

export default function DocumentsPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "Project documentation",
      title: "AI for Kuala Lumpur — Documents",
      intro:
        "This page explains the purpose of the platform, the logic of each screen, the technical stack, and the implementation roadmap. It is designed both as an internal project guide and as a recruiter-facing walkthrough.",
      visionTitle: "Project vision",
      visionSub: "Why this project exists",
      recruiterTitle: "Recruiter takeaway",
      recruiterSub: "What this proves",
      pagesTitle: "Current pages and features",
      pagesSub: "Product walkthrough",
      interviewTitle: "How to explain the app in interview",
      interviewSub: "Demo support",
      stackTitle: "Technical stack",
      stackSub: "Current and target architecture",
      archTitle: "Architecture logic",
      archSub: "Why it was designed this way",
      roadmapTitle: "Implementation roadmap",
      roadmapSub: "What will be added next",
      whyRoadmapTitle: "Why this roadmap matters",
      whyRoadmapSub: "Enterprise readiness",
      finalTitle: "Final target state",
      finalSub: "What the finished platform becomes",
    },
    fr: {
      eyebrow: "Documentation du projet",
      title: "AI for Kuala Lumpur — Documents",
      intro:
        "Cette page explique la finalité de la plateforme, la logique de chaque écran, la stack technique et la feuille de route d’implémentation. Elle sert à la fois de guide projet interne et de support de démonstration pour les recruteurs.",
      visionTitle: "Vision du projet",
      visionSub: "Pourquoi ce projet existe",
      recruiterTitle: "Ce que voit un recruteur",
      recruiterSub: "Ce que cela démontre",
      pagesTitle: "Pages et fonctionnalités actuelles",
      pagesSub: "Parcours produit",
      interviewTitle: "Comment expliquer l’application en entretien",
      interviewSub: "Support de démonstration",
      stackTitle: "Stack technique",
      stackSub: "Architecture actuelle et cible",
      archTitle: "Logique d’architecture",
      archSub: "Pourquoi cela a été conçu ainsi",
      roadmapTitle: "Feuille de route d’implémentation",
      roadmapSub: "Ce qui sera ajouté ensuite",
      whyRoadmapTitle: "Pourquoi cette feuille de route compte",
      whyRoadmapSub: "Crédibilité entreprise",
      finalTitle: "État cible final",
      finalSub: "Ce que devient la plateforme terminée",
    },
  }[language];

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

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DocCard title={t.visionTitle} subtitle={t.visionSub}>
          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">AI for Kuala Lumpur</strong> is a
                real-time smart city intelligence platform designed to monitor
                urban traffic, air quality, weather, humidity, and transport
                conditions through a modern enterprise data stack.
              </>
            ) : (
              <>
                <strong className="text-white">AI for Kuala Lumpur</strong> est
                une plateforme d’intelligence urbaine temps réel conçue pour
                surveiller le trafic, la qualité de l’air, la météo, l’humidité
                et les conditions de transport via une stack data moderne de
                niveau entreprise.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The goal is to simulate the kind of system that a mobility company, a public operations team, or a data & AI consulting practice could build to support urban decision-making in real time."
              : "L’objectif est de simuler le type de système qu’une entreprise de mobilité, une équipe d’opérations publiques ou un cabinet de conseil data & IA pourrait construire pour soutenir la prise de décision urbaine en temps réel."}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                The platform is intentionally built to demonstrate strong skills
                in <strong className="text-white">Data Engineering</strong>,{" "}
                <strong className="text-white">Analytics Engineering</strong>,{" "}
                <strong className="text-white">AI Engineering</strong>,{" "}
                <strong className="text-white">dashboard design</strong>, and{" "}
                <strong className="text-white">product thinking</strong>.
              </>
            ) : (
              <>
                La plateforme est volontairement construite pour démontrer des
                compétences solides en{" "}
                <strong className="text-white">Data Engineering</strong>,{" "}
                <strong className="text-white">Analytics Engineering</strong>,{" "}
                <strong className="text-white">AI Engineering</strong>,{" "}
                <strong className="text-white">design de dashboard</strong> et{" "}
                <strong className="text-white">vision produit</strong>.
              </>
            )}
          </Bullet>
        </DocCard>

        <DocCard title={t.recruiterTitle} subtitle={t.recruiterSub}>
          <Bullet>
            {language === "en"
              ? "✅ End-to-end architecture mindset"
              : "✅ Vision d’architecture de bout en bout"}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "✅ Ability to build both backend and frontend layers"
              : "✅ Capacité à construire le backend et le frontend"}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "✅ Knowledge of real-time data serving patterns"
              : "✅ Connaissance des patterns de serving temps réel"}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "✅ Readiness for enterprise stack integration"
              : "✅ Préparation à l’intégration de stacks entreprise"}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "✅ Clear documentation and project storytelling"
              : "✅ Documentation claire et storytelling projet solide"}
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DocCard title={t.pagesTitle} subtitle={t.pagesSub}>
          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">Live Overview</strong> shows the
                current operational picture of Kuala Lumpur through traffic, AQI,
                temperature, humidity, and transit metrics.
              </>
            ) : (
              <>
                <strong className="text-white">Vue temps réel</strong> montre la
                situation opérationnelle actuelle de Kuala Lumpur à travers le
                trafic, l’AQI, la température, l’humidité et les métriques de
                transport.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">Live Map</strong> visualizes
                district activity geographically and will progressively evolve
                toward richer overlays and zone-level intelligence.
              </>
            ) : (
              <>
                <strong className="text-white">Carte live</strong> visualise
                géographiquement l’activité des districts et évoluera
                progressivement vers des couches plus riches et une intelligence
                spatiale plus avancée.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">AI Copilot</strong> interprets
                the current snapshot, summarizes the situation, and proposes
                immediate actions based on live operational signals.
              </>
            ) : (
              <>
                <strong className="text-white">AI Copilot</strong> interprète le
                snapshot actuel, résume la situation et propose des actions
                immédiates à partir des signaux opérationnels live.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">Documents</strong> acts as the
                project handbook, architecture note, and recruiter-friendly demo
                guide.
              </>
            ) : (
              <>
                <strong className="text-white">Documents</strong> sert de guide
                projet, de note d’architecture et de support de démonstration
                compréhensible pour un recruteur.
              </>
            )}
          </Bullet>
        </DocCard>

        <DocCard title={t.interviewTitle} subtitle={t.interviewSub}>
          <Bullet>
            {language === "en"
              ? "“This platform simulates an enterprise-grade urban intelligence system combining live ingestion, data serving, AI analysis, and decision support.”"
              : "« Cette plateforme simule un système d’intelligence urbaine de niveau entreprise combinant ingestion live, serving data, analyse IA et aide à la décision. »"}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "“I started with the product layer to make the use case tangible, then progressively introduced the data platform, streaming, AI, and analytics layers.”"
              : "« J’ai commencé par la couche produit pour rendre le cas d’usage concret, puis j’ai progressivement ajouté la plateforme data, le streaming, l’IA et les couches analytiques. »"}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "“The long-term objective is to connect a real orchestration stack, warehouse models, and a real LLM on top of curated enterprise data.”"
              : "« L’objectif long terme est de connecter une vraie stack d’orchestration, des modèles de warehouse et un vrai LLM par-dessus des données préparées. »"}
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DocCard title={t.stackTitle} subtitle={t.stackSub}>
          <Bullet>
            {language === "en"
              ? "Frontend: Next.js, TypeScript, Tailwind CSS, component-based dashboard architecture."
              : "Frontend : Next.js, TypeScript, Tailwind CSS, architecture dashboard orientée composants."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Backend: FastAPI, SSE live endpoints, Redis-powered serving layer, AI analysis endpoint."
              : "Backend : FastAPI, endpoints live SSE, couche de serving pilotée par Redis, endpoint d’analyse IA."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Streaming foundation: Redpanda/Kafka-style event flow, producer, consumer, live Redis cache."
              : "Fondation streaming : flux d’événements de style Redpanda/Kafka, producer, consumer, cache Redis live."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Target enterprise stack: Airflow, MinIO, DuckDB, dbt, ML models, and a real LLM / RAG layer."
              : "Stack entreprise cible : Airflow, MinIO, DuckDB, dbt, modèles ML et une vraie couche LLM / RAG."}
          </Bullet>
        </DocCard>

        <DocCard title={t.archTitle} subtitle={t.archSub}>
          <Bullet>
            {language === "en" ? (
              <>
                The platform separates the{" "}
                <strong className="text-white">presentation layer</strong>, the{" "}
                <strong className="text-white">serving/API layer</strong>, the{" "}
                <strong className="text-white">streaming/live layer</strong>,
                and eventually the{" "}
                <strong className="text-white">warehouse layer</strong>.
              </>
            ) : (
              <>
                La plateforme sépare la{" "}
                <strong className="text-white">couche de présentation</strong>,
                la <strong className="text-white">couche serving/API</strong>,
                la <strong className="text-white">couche streaming/live</strong>
                , et à terme la{" "}
                <strong className="text-white">couche warehouse</strong>.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This mirrors how enterprise products are built: data is ingested, stored, transformed, served through APIs, and then used by analytics interfaces and AI systems."
              : "Cela reflète la façon dont les produits entreprise sont construits : les données sont ingérées, stockées, transformées, servies via des APIs, puis utilisées par les interfaces analytiques et les systèmes IA."}
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DocCard title={t.roadmapTitle} subtitle={t.roadmapSub}>
          <Bullet>
            {language === "en"
              ? "Sprint 1: premium frontend, live API, Redis cache, streaming simulation, AI copilot V1."
              : "Sprint 1 : frontend premium, API live, cache Redis, simulation streaming, AI copilot V1."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Sprint 2: Airflow, MinIO, DuckDB integration, dbt models, raw/bronze/silver/gold style architecture."
              : "Sprint 2 : Airflow, MinIO, intégration DuckDB, modèles dbt, architecture de type raw/bronze/silver/gold."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Sprint 3: predictive congestion model, anomaly detection, model serving endpoints."
              : "Sprint 3 : modèle prédictif de congestion, détection d’anomalies, endpoints de serving de modèles."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Sprint 4: real LLM, RAG, enterprise-grade AI assistant, explainability and governance layer."
              : "Sprint 4 : vrai LLM, RAG, assistant IA de niveau entreprise, explicabilité et couche de gouvernance."}
          </Bullet>
        </DocCard>

        <DocCard title={t.whyRoadmapTitle} subtitle={t.whyRoadmapSub}>
          <Bullet>
            {language === "en"
              ? "It shows a progression from a visible user product to a complete data and AI platform."
              : "Cela montre une progression depuis un produit visible par l’utilisateur jusqu’à une plateforme data et IA complète."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This is the kind of evolution recruiters expect to see when they evaluate a candidate for data engineering, AI engineering, or modern consulting roles."
              : "C’est le type d’évolution que les recruteurs aiment voir lorsqu’ils évaluent un candidat en data engineering, AI engineering ou conseil moderne."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Each sprint adds a new proof point: architecture, orchestration, transformation, AI, and business impact."
              : "Chaque sprint ajoute une nouvelle preuve : architecture, orchestration, transformation, IA et impact métier."}
          </Bullet>
        </DocCard>
      </section>

      <DocCard title={t.finalTitle} subtitle={t.finalSub}>
        <Bullet>
          {language === "en" ? (
            <>
              A modern enterprise AI platform combining{" "}
              <strong className="text-white">real-time ingestion</strong>,{" "}
              <strong className="text-white">warehouse transformation</strong>,{" "}
              <strong className="text-white">ML prediction</strong>,{" "}
              <strong className="text-white">AI copilots</strong>, and{" "}
              <strong className="text-white">decision-support dashboards</strong>.
            </>
          ) : (
            <>
              Une plateforme IA moderne de niveau entreprise combinant{" "}
              <strong className="text-white">ingestion temps réel</strong>,{" "}
              <strong className="text-white">transformation warehouse</strong>,{" "}
              <strong className="text-white">prédiction ML</strong>,{" "}
              <strong className="text-white">copilots IA</strong> et{" "}
              <strong className="text-white">dashboards d’aide à la décision</strong>.
            </>
          )}
        </Bullet>

        <Bullet>
          {language === "en"
            ? "In portfolio terms, this becomes much more than a dashboard: it becomes a concrete demonstration of product thinking, engineering structure, and enterprise readiness."
            : "Dans un portfolio, cela devient bien plus qu’un dashboard : c’est une démonstration concrète de vision produit, de structure d’ingénierie et de préparation au contexte entreprise."}
        </Bullet>
      </DocCard>
    </div>
  );
}