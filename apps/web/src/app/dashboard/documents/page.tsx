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
        "This page is the full documentation layer of the project. It explains the origin of the platform, the business problem it addresses, the architecture choices, the data logic, the AI copilot design, the implementation roadmap, and the value of the project from both an engineering and recruiter perspective. It is designed to act as a hybrid between a product handbook, a README, an interview support, and a portfolio-ready technical narrative.",

      visionTitle: "Project vision",
      visionSub: "Why this project exists",

      storyTitle: "Project story",
      storySub: "How the platform was born",

      problemTitle: "Problem statement",
      problemSub: "What the project is trying to solve",

      usefulTitle: "Why this project is useful",
      usefulSub: "Operational and business value",

      recruiterTitle: "Recruiter takeaway",
      recruiterSub: "What this proves",

      pagesTitle: "Current pages and features",
      pagesSub: "Product walkthrough",

      sourcesTitle: "Data sources and APIs",
      sourcesSub: "How city signals are represented",

      pipelineTitle: "End-to-end data pipeline",
      pipelineSub: "How data moves across the platform",

      liveVsWarehouseTitle: "Live data vs warehouse analytics",
      liveVsWarehouseSub: "Why both layers are necessary",

      aiTitle: "AI copilot and RAG logic",
      aiSub: "How the assistant reasons",

      stackTitle: "Technical stack",
      stackSub: "Current and target architecture",

      archTitle: "Architecture logic",
      archSub: "Why it was designed this way",

      challengesTitle: "Main difficulties encountered",
      challengesSub: "What made the project hard",

      interviewTitle: "How to explain the app in interview",
      interviewSub: "Demo support",

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
        "Cette page constitue la couche de documentation complète du projet. Elle explique l’origine de la plateforme, le problème métier auquel elle répond, les choix d’architecture, la logique data, la conception de l’AI copilot, la feuille de route d’implémentation, ainsi que la valeur du projet d’un point de vue ingénierie et recrutement. Elle est pensée comme un hybride entre un handbook produit, un README, un support d’entretien et un récit technique prêt pour un portfolio.",

      visionTitle: "Vision du projet",
      visionSub: "Pourquoi ce projet existe",

      storyTitle: "Histoire du projet",
      storySub: "Comment la plateforme est née",

      problemTitle: "Problématique",
      problemSub: "Ce que le projet cherche à résoudre",

      usefulTitle: "Pourquoi ce projet est utile",
      usefulSub: "Valeur opérationnelle et métier",

      recruiterTitle: "Ce que voit un recruteur",
      recruiterSub: "Ce que cela démontre",

      pagesTitle: "Pages et fonctionnalités actuelles",
      pagesSub: "Parcours produit",

      sourcesTitle: "Sources de données et APIs",
      sourcesSub: "Comment les signaux urbains sont représentés",

      pipelineTitle: "Pipeline data de bout en bout",
      pipelineSub: "Comment la donnée circule dans la plateforme",

      liveVsWarehouseTitle: "Live data vs warehouse analytics",
      liveVsWarehouseSub: "Pourquoi les deux couches sont nécessaires",

      aiTitle: "AI copilot et logique RAG",
      aiSub: "Comment l’assistant raisonne",

      stackTitle: "Stack technique",
      stackSub: "Architecture actuelle et cible",

      archTitle: "Logique d’architecture",
      archSub: "Pourquoi cela a été conçu ainsi",

      challengesTitle: "Difficultés principales rencontrées",
      challengesSub: "Ce qui a rendu le projet difficile",

      interviewTitle: "Comment expliquer l’application en entretien",
      interviewSub: "Support de démonstration",

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
        <p className="mt-4 max-w-5xl text-base leading-8 text-slate-300">
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
                conditions through a modern enterprise-style data stack.
              </>
            ) : (
              <>
                <strong className="text-white">AI for Kuala Lumpur</strong> est
                une plateforme d’intelligence urbaine temps réel conçue pour
                surveiller le trafic, la qualité de l’air, la météo, l’humidité
                et les conditions de transport via une stack data moderne de
                style entreprise.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The project was intentionally designed as more than a dashboard. It aims to simulate a complete decision-support platform where data is ingested, transformed, served, interpreted, and finally turned into AI-assisted operational recommendations."
              : "Le projet a été volontairement conçu comme bien plus qu’un dashboard. Il vise à simuler une plateforme complète d’aide à la décision où la donnée est ingérée, transformée, servie, interprétée puis convertie en recommandations opérationnelles assistées par l’IA."}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                It demonstrates strong skills in{" "}
                <strong className="text-white">Data Engineering</strong>,{" "}
                <strong className="text-white">Analytics Engineering</strong>,{" "}
                <strong className="text-white">AI Engineering</strong>,{" "}
                <strong className="text-white">dashboard design</strong>,{" "}
                <strong className="text-white">real-time serving</strong>, and{" "}
                <strong className="text-white">product thinking</strong>.
              </>
            ) : (
              <>
                Il démontre des compétences solides en{" "}
                <strong className="text-white">Data Engineering</strong>,{" "}
                <strong className="text-white">Analytics Engineering</strong>,{" "}
                <strong className="text-white">AI Engineering</strong>,{" "}
                <strong className="text-white">design de dashboard</strong>,{" "}
                <strong className="text-white">serving temps réel</strong> et{" "}
                <strong className="text-white">vision produit</strong>.
              </>
            )}
          </Bullet>
        </DocCard>

        
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DocCard title={t.storyTitle} subtitle={t.storySub}>
          <Bullet>
            {language === "en"
              ? "The project started from a simple idea: many dashboards can display data, but far fewer projects show how data is ingested, how it is served live, how it is transformed analytically, and how it can be turned into operational reasoning through AI."
              : "Le projet est né d’une idée simple : beaucoup de dashboards affichent des données, mais bien moins de projets montrent comment la donnée est ingérée, comment elle est servie en live, comment elle est transformée analytiquement, et comment elle peut être convertie en raisonnement opérationnel via l’IA."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The first objective was to create a visible product layer so that the use case would immediately feel concrete. Once the product angle was clear, the backend, live serving logic, warehouse layer, and AI copilot could be progressively introduced."
              : "Le premier objectif a été de créer une couche produit visible afin que le cas d’usage soit immédiatement concret. Une fois l’angle produit clarifié, le backend, la logique de serving live, la couche warehouse et l’AI copilot ont pu être introduits progressivement."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This evolution mirrors how real enterprise systems are often built: first make the use case tangible, then industrialize the data stack behind it."
              : "Cette évolution reflète la façon dont les systèmes entreprise sont souvent construits : d’abord rendre le cas d’usage tangible, puis industrialiser la stack data derrière lui."}
          </Bullet>
        </DocCard>

        <DocCard title={t.problemTitle} subtitle={t.problemSub}>
          <Bullet>
            {language === "en"
              ? "Urban operations generate multiple types of signals: mobility, environment, weather, and transport reliability. In practice, these signals often live in separate systems and are difficult to align in real time."
              : "Les opérations urbaines génèrent plusieurs types de signaux : mobilité, environnement, météo et fiabilité des transports. En pratique, ces signaux vivent souvent dans des systèmes séparés et sont difficiles à aligner en temps réel."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Decision makers usually face two gaps: live data can be noisy and hard to interpret, while historical analytics are more stable but less immediate. This project addresses that tension directly."
              : "Les décideurs font généralement face à deux écarts : la donnée live peut être bruitée et difficile à interpréter, tandis que les analytics historiques sont plus stables mais moins immédiates. Ce projet répond directement à cette tension."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The platform is therefore designed to combine live visibility, analytical perspective, and AI-assisted interpretation in a single operational surface."
              : "La plateforme est donc conçue pour combiner visibilité live, perspective analytique et interprétation assistée par l’IA dans une seule surface opérationnelle."}
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DocCard title={t.usefulTitle} subtitle={t.usefulSub}>
          <Bullet>
            {language === "en"
              ? "From an operational point of view, the project helps answer questions such as: Which district is currently under the most pressure? Is the issue driven by traffic, AQI, temperature, or transit delays? Which districts look structurally more sensitive according to warehouse analytics?"
              : "D’un point de vue opérationnel, le projet aide à répondre à des questions du type : Quel district est actuellement le plus sous pression ? Le problème est-il porté par le trafic, l’AQI, la température ou les retards de transport ? Quels districts semblent structurellement plus sensibles selon les analytics du warehouse ?"}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "From a business point of view, the platform demonstrates how a company can move from passive dashboards to active decision-support systems combining data engineering, analytics, and AI."
              : "D’un point de vue métier, la plateforme montre comment une entreprise peut passer de dashboards passifs à des systèmes d’aide à la décision actifs combinant data engineering, analytics et IA."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This is useful for consulting, public-sector transformation, mobility platforms, urban services, smart city experimentation, and any context where operational data must be interpreted quickly and responsibly."
              : "C’est utile pour le conseil, la transformation du secteur public, les plateformes de mobilité, les services urbains, les expérimentations smart city et tout contexte où des données opérationnelles doivent être interprétées rapidement et de façon responsable."}
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
                temperature, humidity, and transit metrics, now with a
                multi-district overview and a live district focus.
              </>
            ) : (
              <>
                <strong className="text-white">Vue temps réel</strong> montre la
                situation opérationnelle actuelle de Kuala Lumpur à travers le
                trafic, l’AQI, la température, l’humidité et les métriques de
                transport, désormais avec une vue multi-districts et un focus
                live sur un district.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">Live Map</strong> visualizes
                district activity geographically and serves as the spatial entry
                point of the platform.
              </>
            ) : (
              <>
                <strong className="text-white">Carte live</strong> visualise
                géographiquement l’activité des districts et sert de point
                d’entrée spatial à la plateforme.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">AI Copilot</strong> interprets
                the current snapshot, warehouse context, and governance logic to
                produce grounded operational, analytical, or explanatory answers.
              </>
            ) : (
              <>
                <strong className="text-white">AI Copilot</strong> interprète le
                snapshot actuel, le contexte warehouse et la logique de
                gouvernance pour produire des réponses ancrées, qu’elles soient
                opérationnelles, analytiques ou explicatives.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">Documents</strong> acts as the
                project handbook, technical note, README equivalent, and
                recruiter-friendly project narrative.
              </>
            ) : (
              <>
                <strong className="text-white">Documents</strong> sert de guide
                projet, de note technique, d’équivalent README et de narration
                compréhensible par un recruteur.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">Governance</strong> is intended
                to explain data lineage, quality rules, control logic, AI
                grounding principles, and enterprise governance alignment.
              </>
            ) : (
              <>
                <strong className="text-white">Governance</strong> a vocation à
                expliquer la lineage data, les règles de qualité, la logique de
                contrôle, les principes d’ancrage IA et l’alignement avec la
                gouvernance entreprise.
              </>
            )}
          </Bullet>
        </DocCard>

        <DocCard title={t.sourcesTitle} subtitle={t.sourcesSub}>
          <Bullet>
            {language === "en"
              ? "In its current state, the platform uses simulated city signals in order to reproduce realistic operating conditions while keeping the project simple, free, reproducible, and under full control."
              : "Dans son état actuel, la plateforme utilise des signaux urbains simulés afin de reproduire des conditions d’exploitation réalistes tout en gardant le projet simple, gratuit, reproductible et entièrement contrôlé."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The current live layer generates district snapshots including traffic index, AQI, temperature, humidity, and transit delay. These signals are then pushed through the serving layer to simulate how a city monitoring platform would behave in practice."
              : "La couche live actuelle génère des snapshots de districts incluant l’index trafic, l’AQI, la température, l’humidité et le retard transport. Ces signaux sont ensuite servis via la couche de serving pour simuler le comportement réel d’une plateforme de monitoring urbain."}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                In a production version, the platform could connect to real APIs
                such as:
                <br />• traffic APIs (Google Maps, TomTom, Waze-like services)
                <br />• air quality APIs (OpenAQ, governmental sensor networks)
                <br />• weather APIs (OpenWeather, Meteostat)
                <br />• transport APIs (GTFS feeds, city transport data)
                <br />• event / disruption feeds (public notices, city incidents)
              </>
            ) : (
              <>
                Dans une version production, la plateforme pourrait se connecter
                à de vraies APIs telles que :
                <br />• APIs trafic (Google Maps, TomTom, services de type Waze)
                <br />• APIs qualité de l’air (OpenAQ, réseaux de capteurs publics)
                <br />• APIs météo (OpenWeather, Meteostat)
                <br />• APIs transport (flux GTFS, données transport urbain)
                <br />• flux événements / perturbations (incidents, notices publiques)
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This design choice is important: the project is not limited by a specific external provider. It is built as an extensible architecture able to ingest real signals later without changing the overall product logic."
              : "Ce choix de conception est important : le projet n’est pas dépendant d’un fournisseur externe particulier. Il est construit comme une architecture extensible capable d’ingérer de vrais signaux plus tard sans changer la logique générale du produit."}
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DocCard title={t.pipelineTitle} subtitle={t.pipelineSub}>
          <Bullet>
            {language === "en"
              ? "The project follows a clear end-to-end pipeline logic: a producer generates raw city signals, a consumer processes them, Redis stores the latest operational state, FastAPI exposes that state to the frontend, and DuckDB/dbt provide analytical transformations for warehouse-level reasoning."
              : "Le projet suit une logique pipeline claire de bout en bout : un producer génère des signaux urbains bruts, un consumer les traite, Redis stocke l’état opérationnel le plus récent, FastAPI expose cet état au frontend, et DuckDB/dbt fournissent les transformations analytiques pour un raisonnement de niveau warehouse."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This separation is intentional. The live layer is optimized for freshness and rapid serving. The warehouse layer is optimized for structured transformation, aggregation, risk scoring, and stable analytical consumption."
              : "Cette séparation est volontaire. La couche live est optimisée pour la fraîcheur de la donnée et le serving rapide. La couche warehouse est optimisée pour la transformation structurée, l’agrégation, le scoring de risque et la consommation analytique stable."}
          </Bullet>

          <Bullet>
            {language === "en" ? (
              <>
                The current pipeline includes:
                <br />• raw signal generation
                <br />• live cache storage in Redis
                <br />• API serving via FastAPI
                <br />• analytical storage in DuckDB
                <br />• transformation logic in dbt marts
                <br />• consumption by dashboard pages and AI endpoints
              </>
            ) : (
              <>
                Le pipeline actuel inclut :
                <br />• génération de signaux bruts
                <br />• stockage live en cache Redis
                <br />• serving API via FastAPI
                <br />• stockage analytique dans DuckDB
                <br />• logique de transformation dans les marts dbt
                <br />• consommation par les pages dashboard et les endpoints IA
              </>
            )}
          </Bullet>
        </DocCard>

        <DocCard
          title={t.liveVsWarehouseTitle}
          subtitle={t.liveVsWarehouseSub}
        >
          <Bullet>
            {language === "en"
              ? "Live data answers the question: what is happening now? It is immediate, but it can be noisy, local, and highly variable."
              : "La live data répond à la question : que se passe-t-il maintenant ? Elle est immédiate, mais peut être bruitée, locale et très variable."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Warehouse analytics answer the question: what is consistently happening across districts or over time? They are less immediate but much better suited for comparison, aggregation, prioritization, and structured reasoning."
              : "Les warehouse analytics répondent à la question : que se passe-t-il de façon récurrente à travers les districts ou dans le temps ? Elles sont moins immédiates mais bien plus adaptées à la comparaison, à l’agrégation, à la priorisation et au raisonnement structuré."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The project is strong precisely because it does not choose between the two. It combines both layers and uses AI to bridge the gap between real-time perception and analytical interpretation."
              : "Le projet est fort précisément parce qu’il ne choisit pas entre les deux. Il combine les deux couches et utilise l’IA pour faire le lien entre perception temps réel et interprétation analytique."}
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DocCard title={t.aiTitle} subtitle={t.aiSub}>
          <Bullet>
            {language === "en"
              ? "The AI copilot is not designed as a generic chatbot. It is designed as a grounded assistant specialized on the platform. Its role is to interpret the current city state, connect it to warehouse context, and explain the system using governance-aware reasoning."
              : "L’AI copilot n’est pas conçu comme un chatbot générique. Il est pensé comme un assistant ancré dans la plateforme. Son rôle est d’interpréter l’état actuel de la ville, de le relier au contexte warehouse et d’expliquer le système avec un raisonnement conscient de la gouvernance."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Its RAG logic is based on three context layers: live snapshot context, warehouse analytical context, and governance knowledge context. This allows the assistant to answer operational, analytical, and explanatory questions."
              : "Sa logique RAG repose sur trois couches de contexte : le contexte du snapshot live, le contexte analytique du warehouse et le contexte de connaissance gouvernance. Cela permet à l’assistant de répondre à des questions opérationnelles, analytiques et explicatives."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This is also an important design decision for trust: the assistant should not invent a city narrative unsupported by the platform. It should answer from structured project context."
              : "C’est aussi une décision de conception importante pour la confiance : l’assistant ne doit pas inventer une narration urbaine non supportée par la plateforme. Il doit répondre à partir d’un contexte projet structuré."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Over time, this layer can evolve into a more advanced enterprise-grade assistant with retrieval scoring, memory, richer documentation search, and stronger explainability."
              : "Avec le temps, cette couche peut évoluer vers un assistant de niveau entreprise plus avancé avec scoring de retrieval, mémoire, recherche documentaire enrichie et explicabilité renforcée."}
          </Bullet>
        </DocCard>

        <DocCard title={t.stackTitle} subtitle={t.stackSub}>
          <Bullet>
            {language === "en"
              ? "Frontend: Next.js, TypeScript, Tailwind CSS, component-based dashboard architecture, multilingual support."
              : "Frontend : Next.js, TypeScript, Tailwind CSS, architecture dashboard orientée composants, support multilingue."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Backend: FastAPI, REST endpoints, live serving endpoints, AI copilot endpoint, warehouse refresh/status endpoints."
              : "Backend : FastAPI, endpoints REST, endpoints de serving live, endpoint AI copilot, endpoints de refresh/status du warehouse."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Streaming foundation: producer/consumer logic, Redis live cache, local real-time serving mode."
              : "Fondation streaming : logique producer/consumer, cache live Redis, mode local temps réel."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Warehouse foundation: DuckDB analytical database, dbt transformations, marts for risk and latest district logic."
              : "Fondation warehouse : base analytique DuckDB, transformations dbt, marts pour le risque et la logique latest par district."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "AI layer: LLM-compatible endpoint (Groq/OpenAI style), intent routing, grounded generation, governance-aware context injection."
              : "Couche IA : endpoint compatible LLM (style Groq/OpenAI), routage d’intention, génération ancrée, injection de contexte orientée gouvernance."}
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DocCard title={t.archTitle} subtitle={t.archSub}>
          <Bullet>
            {language === "en" ? (
              <>
                The platform separates the{" "}
                <strong className="text-white">presentation layer</strong>, the{" "}
                <strong className="text-white">serving/API layer</strong>, the{" "}
                <strong className="text-white">streaming/live layer</strong>,
                and the{" "}
                <strong className="text-white">warehouse / analytics layer</strong>.
              </>
            ) : (
              <>
                La plateforme sépare la{" "}
                <strong className="text-white">couche de présentation</strong>,
                la <strong className="text-white">couche serving/API</strong>,
                la <strong className="text-white">couche streaming/live</strong>
                , et la{" "}
                <strong className="text-white">
                  couche warehouse / analytics
                </strong>.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This mirrors how enterprise products are built: data is ingested, cached or stored, transformed, served through APIs, and then consumed by dashboards and AI systems."
              : "Cela reflète la façon dont les produits entreprise sont construits : les données sont ingérées, mises en cache ou stockées, transformées, servies via des APIs, puis consommées par des dashboards et des systèmes IA."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The architecture also supports two deployment mindsets: a richer local real-time engineering mode, and a simpler demo-compatible mode suitable for public frontend deployment."
              : "L’architecture supporte aussi deux logiques de déploiement : un mode local temps réel plus riche pour l’ingénierie, et un mode démo plus simple compatible avec un déploiement frontend public."}
          </Bullet>
        </DocCard>

        <DocCard title={t.challengesTitle} subtitle={t.challengesSub}>
          <Bullet>
            {language === "en"
              ? "One difficulty was balancing realism and simplicity. Real-time systems can quickly become operationally heavy, especially when mixing producer/consumer logic, Redis, warehouse refresh, and frontend rendering."
              : "Une difficulté a été de trouver l’équilibre entre réalisme et simplicité. Les systèmes temps réel peuvent vite devenir lourds à opérer, surtout lorsqu’on mélange logique producer/consumer, Redis, refresh warehouse et rendu frontend."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Another challenge was making the frontend credible. Some early visual blocks looked decorative rather than meaningful, so the interface had to be reoriented toward true operational value."
              : "Une autre difficulté a été de rendre le frontend crédible. Certains blocs visuels initiaux semblaient décoratifs plutôt que réellement utiles, donc l’interface a dû être réorientée vers une vraie valeur opérationnelle."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The AI layer also created an important challenge: how to make the copilot more natural and intelligent without letting it hallucinate? This is why intent routing, structured context, and grounded answers matter so much."
              : "La couche IA a aussi créé un défi important : comment rendre le copilot plus naturel et intelligent sans le laisser halluciner ? C’est précisément pour cela que le routage d’intention, le contexte structuré et les réponses ancrées sont si importants."}
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DocCard title={t.roadmapTitle} subtitle={t.roadmapSub}>
          <Bullet>
            {language === "en"
              ? "Phase 1: premium frontend, live overview, map, Redis-powered serving, API foundation, warehouse risk exposure, and AI copilot V1."
              : "Phase 1 : frontend premium, vue live, carte, serving piloté par Redis, fondation API, exposition du risque warehouse et AI copilot V1."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Phase 2: stronger documents and governance layers, multilingual consistency, cleaner UX, and better multi-page product structure."
              : "Phase 2 : couches documents et gouvernance plus solides, cohérence multilingue, UX plus propre et meilleure structuration produit sur plusieurs pages."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Phase 3: richer warehouse automation, improved refresh logic, stronger analytical comparisons, and more realistic district-level intelligence."
              : "Phase 3 : automatisation warehouse plus riche, meilleure logique de refresh, comparaisons analytiques plus fortes et intelligence plus réaliste au niveau district."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Phase 4: advanced AI assistant, better retrieval, deeper governance integration, and eventually real external APIs and production-style ingestion."
              : "Phase 4 : assistant IA avancé, meilleur retrieval, intégration plus profonde de la gouvernance et à terme vraies APIs externes et ingestion de style production."}
          </Bullet>
        </DocCard>

        <DocCard title={t.whyRoadmapTitle} subtitle={t.whyRoadmapSub}>
          <Bullet>
            {language === "en"
              ? "It shows a progression from visible product value to full data-platform maturity."
              : "Elle montre une progression depuis une valeur produit visible jusqu’à une maturité complète de plateforme data."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This is exactly the kind of evolution recruiters and managers like to see: not just a static showcase, but a project that can grow toward architecture, orchestration, analytics, and AI responsibility."
              : "C’est exactement le type d’évolution que les recruteurs et managers aiment voir : pas seulement une vitrine statique, mais un projet capable d’évoluer vers l’architecture, l’orchestration, l’analytique et la responsabilité IA."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Each iteration adds a new proof point: frontend quality, backend logic, data movement, transformation, governance, and business-oriented AI."
              : "Chaque itération ajoute une nouvelle preuve : qualité frontend, logique backend, circulation de la donnée, transformation, gouvernance et IA orientée métier."}
          </Bullet>
        </DocCard>
      </section>

      <DocCard title={t.finalTitle} subtitle={t.finalSub}>
        <Bullet>
          {language === "en" ? (
            <>
              A modern enterprise AI platform combining{" "}
              <strong className="text-white">real-time ingestion</strong>,{" "}
              <strong className="text-white">live serving</strong>,{" "}
              <strong className="text-white">warehouse transformation</strong>,{" "}
              <strong className="text-white">analytical reasoning</strong>,{" "}
              <strong className="text-white">AI copilots</strong>, and{" "}
              <strong className="text-white">decision-support dashboards</strong>.
            </>
          ) : (
            <>
              Une plateforme IA moderne de niveau entreprise combinant{" "}
              <strong className="text-white">ingestion temps réel</strong>,{" "}
              <strong className="text-white">serving live</strong>,{" "}
              <strong className="text-white">transformation warehouse</strong>,{" "}
              <strong className="text-white">raisonnement analytique</strong>,{" "}
              <strong className="text-white">copilots IA</strong> et{" "}
              <strong className="text-white">dashboards d’aide à la décision</strong>.
            </>
          )}
        </Bullet>

        <Bullet>
          {language === "en"
            ? "In portfolio terms, this becomes much more than a dashboard. It becomes a concrete demonstration of product thinking, engineering structure, AI grounding, documentation quality, and enterprise readiness."
            : "Dans un portfolio, cela devient bien plus qu’un dashboard. C’est une démonstration concrète de vision produit, de structure d’ingénierie, d’ancrage IA, de qualité de documentation et de préparation au contexte entreprise."}
        </Bullet>

        <Bullet>
          {language === "en"
            ? "In README terms, this page can serve as the narrative backbone of the repository: what the project does, why it matters, how it works, where the data comes from, what was difficult, and how the platform can evolve."
            : "En termes de README, cette page peut servir de colonne vertébrale narrative du repository : ce que fait le projet, pourquoi il compte, comment il fonctionne, d’où viennent les données, ce qui a été difficile, et comment la plateforme peut évoluer."}
        </Bullet>
      </DocCard>
    </div>
  );
}