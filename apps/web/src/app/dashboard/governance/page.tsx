"use client";

import { useLanguage } from "@/components/language-provider";

function GovCard({
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

export default function GovernancePage() {
  const { language, setLanguage } = useLanguage();

  const t = {
    en: {
      eyebrow: "Data governance & data quality",
      title: "AI for Kuala Lumpur — Governance",
      intro:
        "This page explains how governance is applied to the platform: who is accountable, how data quality is controlled, how live and warehouse layers are separated, how regulatory constraints are addressed, and how the AI copilot stays grounded on governed data.",
      switchLabel: "FR / EN",

      pillarsTitle: "Governance pillars",
      pillarsSub: "Maturity dimensions",

      operatingTitle: "Operating model",
      operatingSub: "Roles, responsibilities, accountability",

      qualityTitle: "Data quality framework",
      qualitySub: "Rules, monitoring, correction",

      securityTitle: "Architecture & security controls",
      securitySub: "Protection, classification, access",

      rgpdTitle: "RGPD & AI governance",
      rgpdSub: "Compliance and accountability",

      metadataTitle: "Metadata, glossary & lineage",
      metadataSub: "Traceability and catalog logic",

      auditTitle: "Audit readiness",
      auditSub: "What an auditor should find",

      watchTitle: "Culture, training & regulatory watch",
      watchSub: "Long-term maturity",

      roadmapTitle: "Governance roadmap",
      roadmapSub: "How this project grows toward maturity",
    },
    fr: {
      eyebrow: "Data governance & data quality",
      title: "AI for Kuala Lumpur — Governance",
      intro:
        "Cette page explique comment la gouvernance est appliquée à la plateforme : qui est responsable, comment la qualité des données est contrôlée, comment les couches live et warehouse sont séparées, comment les contraintes réglementaires sont traitées, et comment l’AI copilot reste ancré dans des données gouvernées.",
      switchLabel: "FR / EN",

      pillarsTitle: "Piliers de gouvernance",
      pillarsSub: "Dimensions de maturité",

      operatingTitle: "Operating model",
      operatingSub: "Rôles, responsabilités, redevabilité",

      qualityTitle: "Cadre de qualité des données",
      qualitySub: "Règles, monitoring, correction",

      securityTitle: "Architecture & contrôles de sécurité",
      securitySub: "Protection, classification, accès",

      rgpdTitle: "RGPD & gouvernance IA",
      rgpdSub: "Conformité et accountability",

      metadataTitle: "Métadonnées, glossaire & lineage",
      metadataSub: "Traçabilité et logique de catalog",

      auditTitle: "Audit readiness",
      auditSub: "Ce qu’un auditeur doit trouver",

      watchTitle: "Culture, formation & veille réglementaire",
      watchSub: "Maturité dans la durée",

      roadmapTitle: "Roadmap de gouvernance",
      roadmapSub: "Comment ce projet monte en maturité",
    },
  }[language];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="glass-card soft-glow rounded-[34px] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-5xl">
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/90">
              {t.eyebrow}
            </p>
            <h1 className="heading-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-300">{t.intro}</p>
          </div>

          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "fr" : "en")}
            className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
          >
            {t.switchLabel}
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <GovCard title={t.pillarsTitle} subtitle={t.pillarsSub}>
          <Bullet>
            {language === "en"
              ? "1. Strategy & governance: policy, committee, roles, roadmap, KPIs."
              : "1. Stratégie & gouvernance : politique, comité, rôles, feuille de route, KPIs."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "2. Data quality: rules, metrics, profiling, anomaly remediation."
              : "2. Qualité des données : règles, métriques, profiling, remédiation des anomalies."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "3. Architecture & security: catalog, classification, RBAC, encryption, MDM logic."
              : "3. Architecture & sécurité : catalog, classification, RBAC, chiffrement, logique MDM."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "4. RGPD & regulatory compliance: register, legal basis, rights, DPA, AIPD, breach response."
              : "4. RGPD & conformité réglementaire : registre, base légale, droits, DPA, AIPD, réponse aux violations."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "5. Metadata & catalog: glossary, technical metadata, lineage."
              : "5. Métadonnées & catalog : glossaire, métadonnées techniques, lineage."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "6. Culture & organization: training, incident review, regulatory watch."
              : "6. Culture & organisation : formation, revue des incidents, veille réglementaire."}
          </Bullet>
        </GovCard>

        <GovCard title={t.operatingTitle} subtitle={t.operatingSub}>
          <Bullet>
            {language === "en"
              ? "The governance model of this platform is built around clear accountability: Product defines operational objectives, engineering owns pipelines and serving, governance defines policy and controls, and data roles own critical domains."
              : "Le modèle de gouvernance de cette plateforme repose sur une accountability claire : le produit définit les objectifs opérationnels, l’ingénierie possède les pipelines et le serving, la gouvernance définit la politique et les contrôles, et les rôles data possèdent les domaines critiques."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "Core target roles are aligned with mature governance practice: Data Owner for business accountability, Data Steward for quality rules and metadata, Data Custodian for technical custody, DPO for privacy compliance, and RSSI / security function for protection controls."
              : "Les rôles cibles principaux sont alignés avec une gouvernance mature : Data Owner pour la responsabilité métier, Data Steward pour les règles qualité et les métadonnées, Data Custodian pour la garde technique, DPO pour la conformité privacy et RSSI / sécurité pour les contrôles de protection."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "The target decision body is a Data Governance Council / Comité Data with business and IT representation, exactly the kind of structure expected in a DAMA-aligned operating model."
              : "L’instance cible de décision est un Data Governance Council / Comité Data avec représentation métier et IT, exactement le type de structure attendu dans un operating model aligné DAMA."}
          </Bullet>
        </GovCard>

        <GovCard title={t.auditTitle} subtitle={t.auditSub}>
          <Bullet>
            {language === "en"
              ? "An auditor should find a formal policy, named roles, a roadmap, traceable controls, evidence of risk prioritization, and a measurable maturity path."
              : "Un auditeur doit trouver une politique formalisée, des rôles nommés, une feuille de route, des contrôles traçables, des preuves de priorisation du risque et une trajectoire de maturité mesurable."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "For this project, the most visible audit evidence should be: warehouse refresh status, documented lineage, explicit quality rules, governance knowledge base, and explainable AI outputs tied to governed context."
              : "Pour ce projet, les preuves d’audit les plus visibles doivent être : le statut de refresh du warehouse, une lineage documentée, des règles qualité explicites, une base de connaissance gouvernance, et des sorties IA explicables liées à un contexte gouverné."}
          </Bullet>
        </GovCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GovCard title={t.qualityTitle} subtitle={t.qualitySub}>
          <Bullet>
            {language === "en"
              ? "The quality model should be based on the classic dimensions explicitly highlighted by the audit checklist: completeness, accuracy, consistency, and uniqueness. In this project, freshness must be added as a critical live-data dimension."
              : "Le modèle qualité doit reposer sur les dimensions classiques explicitement mises en avant par la checklist d’audit : complétude, exactitude, cohérence et unicité. Dans ce projet, la fraîcheur doit être ajoutée comme dimension critique de la live data."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "Concrete examples for this platform: district must belong to an allowed list, transit delay cannot be negative, AQI must stay within realistic operational bounds, timestamps must be valid, and duplicate live snapshots should be controlled."
              : "Exemples concrets pour cette plateforme : le district doit appartenir à une liste autorisée, le retard transport ne peut pas être négatif, l’AQI doit rester dans des bornes opérationnelles réalistes, les timestamps doivent être valides, et les doublons de snapshots live doivent être contrôlés."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "The target process is: define quality rules, profile critical datasets, automate metrics, detect anomalies, assign ownership, correct within SLA, and report status to decision makers."
              : "Le processus cible est : définir les règles de qualité, profiler les jeux de données critiques, automatiser les métriques, détecter les anomalies, assigner un owner, corriger dans un SLA et reporter l’état aux décideurs."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "This is fully aligned with the quality stream described in the roadmap: identify critical data, define quality rules, build a quality dashboard, and formalize an anomaly correction process."
              : "Ceci est pleinement aligné avec le stream qualité décrit dans la roadmap : identifier les données critiques, définir les règles qualité, construire un dashboard qualité et formaliser un processus de correction des anomalies."}
          </Bullet>
        </GovCard>

        <GovCard title={t.securityTitle} subtitle={t.securitySub}>
          <Bullet>
            {language === "en"
              ? "The platform should distinguish data by sensitivity and apply appropriate controls. Even in a portfolio project, the governance page should make that model explicit: public demo data, internal technical metadata, confidential operational logic, and regulated personal data if real integrations are introduced later."
              : "La plateforme doit distinguer les données par niveau de sensibilité et appliquer les contrôles adaptés. Même dans un projet portfolio, la page gouvernance doit rendre ce modèle explicite : données de démo publiques, métadonnées techniques internes, logique opérationnelle confidentielle, et données personnelles réglementées si de vraies intégrations sont introduites plus tard."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "Target controls include role-based access control, encryption at rest and in transit, review of critical access rights, documented source inventory, and lineage of critical flows."
              : "Les contrôles cibles incluent le contrôle d’accès par rôles, le chiffrement au repos et en transit, la revue des habilitations critiques, un inventaire documenté des sources et une lineage des flux critiques."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "For AI for Kuala Lumpur, the architectural split between Redis live serving and DuckDB/dbt analytical transformation is itself a governance choice: the live layer optimizes freshness, the warehouse layer optimizes reliability and structure."
              : "Pour AI for Kuala Lumpur, la séparation architecturale entre le serving live Redis et la transformation analytique DuckDB/dbt est elle-même un choix de gouvernance : la couche live optimise la fraîcheur, la couche warehouse optimise la fiabilité et la structure."}
          </Bullet>
        </GovCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <GovCard title={t.rgpdTitle} subtitle={t.rgpdSub}>
          <Bullet>
            {language === "en"
              ? "The governance target is to be compatible with a real privacy-by-design posture: maintain an Article 30 processing register, document legal basis, enable data subject rights, manage DPA obligations, and formalize a breach response process."
              : "La cible de gouvernance est d’être compatible avec une vraie posture privacy-by-design : tenir un registre des traitements Art. 30, documenter la base légale, permettre l’exercice des droits, gérer les obligations DPA et formaliser un processus de réponse aux violations."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "The AIPD / DPIA logic is also relevant to this project because the supplied model clearly shows when impact assessment becomes mandatory: profiling, large scale processing, sensitive data, innovative technology, surveillance, or automated decisioning."
              : "La logique d’AIPD / DPIA est aussi pertinente pour ce projet car le modèle fourni montre clairement quand l’analyse d’impact devient obligatoire : profilage, traitement à grande échelle, données sensibles, technologie innovante, surveillance ou décision automatisée."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "For future real-city integrations, any personal data use, geolocation enrichment, or citizen monitoring feature should be screened through this governance lens before rollout."
              : "Pour de futures intégrations réelles, tout usage de données personnelles, enrichissement de géolocalisation ou fonctionnalité de monitoring citoyen devra être évalué à travers cette grille de gouvernance avant déploiement."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "On the AI side, the roadmap explicitly connects governance to IA Act classification, inventory of AI systems, and supervision of higher-risk use cases. This is especially relevant for a copilot that influences operational decisions."
              : "Côté IA, la roadmap relie explicitement la gouvernance à la classification IA Act, à l’inventaire des systèmes IA et à la supervision des cas d’usage plus risqués. C’est particulièrement pertinent pour un copilot qui influence des décisions opérationnelles."}
          </Bullet>
        </GovCard>

        <GovCard title={t.metadataTitle} subtitle={t.metadataSub}>
          <Bullet>
            {language === "en"
              ? "Metadata management is a key maturity signal. The target state includes a business glossary, technical metadata for critical datasets, and documented lineage for critical flows."
              : "La gestion des métadonnées est un signal clé de maturité. L’état cible inclut un glossaire métier, des métadonnées techniques pour les jeux de données critiques et une lineage documentée pour les flux critiques."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "In this project, the most important lineage to document is: producer → consumer → Redis → FastAPI → dashboard for live serving, and raw signals → DuckDB → dbt → marts → analytics pages / copilot for analytical reasoning."
              : "Dans ce projet, la lineage la plus importante à documenter est : producer → consumer → Redis → FastAPI → dashboard pour le serving live, et raw signals → DuckDB → dbt → marts → pages analytiques / copilot pour le raisonnement analytique."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "A future data catalog would document district definitions, metric semantics, thresholds, refresh frequency, ownership, acceptable quality bounds, and downstream consumers."
              : "Un futur data catalog documenterait les définitions de districts, la sémantique des métriques, les seuils, la fréquence de refresh, l’ownership, les bornes qualité acceptables et les consommateurs aval."}
          </Bullet>
        </GovCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GovCard title={t.watchTitle} subtitle={t.watchSub}>
          <Bullet>
            {language === "en"
              ? "Mature governance is not just controls and documentation. It also requires regular training, recurring awareness, incident analysis, and a structured regulatory watch."
              : "Une gouvernance mature ne se limite pas aux contrôles et à la documentation. Elle nécessite aussi des formations régulières, de la sensibilisation récurrente, une analyse des incidents et une veille réglementaire structurée."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "The supplied guide makes this explicit: CNIL resources, EDPB guidelines, DAMA-DMBOK references, IA Act monitoring, and professional communities all support long-term maturity."
              : "Le guide fourni le rend explicite : les ressources CNIL, les lignes directrices EDPB, les références DAMA-DMBOK, le suivi de l’IA Act et les communautés professionnelles soutiennent la maturité dans la durée."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "For this project, the governance page should therefore signal a culture objective: not only build a platform, but also build the habits required to maintain trusted data and trusted AI over time."
              : "Pour ce projet, la page gouvernance doit donc signaler un objectif culturel : non seulement construire une plateforme, mais aussi construire les habitudes nécessaires pour maintenir une donnée et une IA de confiance dans la durée."}
          </Bullet>
        </GovCard>

        <GovCard title={t.roadmapTitle} subtitle={t.roadmapSub}>
          <Bullet>
            {language === "en"
              ? "Phase 1 governance foundation: define policy intent, document roles, make controls visible, and anchor AI responses in governed project context."
              : "Fondation de gouvernance phase 1 : définir l’intention de politique, documenter les rôles, rendre les contrôles visibles et ancrer les réponses IA dans un contexte projet gouverné."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "Phase 2: formalize committee logic, bilingual documentation, clearer ownership, and governance-ready product pages."
              : "Phase 2 : formaliser la logique de comité, la documentation bilingue, un ownership plus clair et des pages produit prêtes pour la gouvernance."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "Phase 3: add stronger quality metrics, automated checks, lineage visibility, warehouse control evidence, and more explicit audit traceability."
              : "Phase 3 : ajouter des métriques qualité plus fortes, des contrôles automatisés, de la visibilité lineage, des preuves de contrôle warehouse et une traçabilité d’audit plus explicite."}
          </Bullet>
          <Bullet>
            {language === "en"
              ? "Phase 4: evolve toward a more complete governance operating model with data catalog, richer RACI, regulatory watch workflow, and stronger AI governance documentation."
              : "Phase 4 : évoluer vers un operating model de gouvernance plus complet avec data catalog, RACI enrichi, workflow de veille réglementaire et documentation de gouvernance IA renforcée."}
          </Bullet>
        </GovCard>
      </section>
    </div>
  );
}