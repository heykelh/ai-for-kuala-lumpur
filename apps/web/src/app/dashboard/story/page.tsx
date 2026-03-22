"use client";

import { useLanguage } from "@/components/language-provider";

function StoryCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-card soft-glow rounded-[30px] p-4 sm:p-6">
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

export default function StoryPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "Project story",
      title: "AI for Kuala Lumpur — Full Project Journey",
      intro:
        "This page is the narrative backbone of the project. It explains how the platform started, how the architecture evolved, what was successfully implemented, which deployment and product challenges were encountered, why key technical decisions were made, and what future directions remain open. It is designed as a portfolio-grade project retrospective with a strong product, engineering, and governance angle.",

      hookTitle: "Project ambition",
      hookSub: "What this project was meant to become",

      originTitle: "How the project started",
      originSub: "Initial intention",

      buildTitle: "What was actually built",
      buildSub: "Concrete implementation steps",

      liveTitle: "Live system foundation",
      liveSub: "Real-time product layer",

      aiTitle: "AI copilot evolution",
      aiSub: "From assistant idea to grounded reasoning",

      governanceTitle: "Governance and data quality layer",
      governanceSub: "Why this project is more than a dashboard",

      deploymentTitle: "Deployment challenges",
      deploymentSub: "What happened in the real world",

      decisionTitle: "Key technical decisions",
      decisionSub: "Trade-offs and architecture choices",

      currentTitle: "Current state of the project",
      currentSub: "What is already strong today",

      perspectiveTitle: "Future perspectives",
      perspectiveSub: "What this project can become next",

      finalTitle: "Conclusion",
      finalSub: "Why this project matters",
    },
    fr: {
      eyebrow: "Histoire du projet",
      title: "AI for Kuala Lumpur — Parcours complet du projet",
      intro:
        "Cette page constitue la colonne vertébrale narrative du projet. Elle explique comment la plateforme a démarré, comment l’architecture a évolué, ce qui a été réellement implémenté, quelles difficultés produit et déploiement ont été rencontrées, pourquoi certaines décisions techniques ont été prises, et quelles perspectives restent ouvertes. Elle est pensée comme une rétrospective de projet de niveau portfolio avec un angle produit, ingénierie et gouvernance fort.",

      hookTitle: "Ambition du projet",
      hookSub: "Ce que ce projet devait devenir",

      originTitle: "Comment le projet a commencé",
      originSub: "Intention initiale",

      buildTitle: "Ce qui a réellement été construit",
      buildSub: "Étapes concrètes d’implémentation",

      liveTitle: "Fondation du système live",
      liveSub: "Couche produit temps réel",

      aiTitle: "Évolution de l’AI copilot",
      aiSub: "D’une idée d’assistant à un raisonnement ancré",

      governanceTitle: "Couche gouvernance et qualité de données",
      governanceSub: "Pourquoi ce projet est plus qu’un dashboard",

      deploymentTitle: "Difficultés de déploiement",
      deploymentSub: "Ce qui s’est passé dans le réel",

      decisionTitle: "Décisions techniques clés",
      decisionSub: "Arbitrages et choix d’architecture",

      currentTitle: "État actuel du projet",
      currentSub: "Ce qui est déjà solide aujourd’hui",

      perspectiveTitle: "Perspectives futures",
      perspectiveSub: "Ce que le projet peut devenir ensuite",

      finalTitle: "Conclusion",
      finalSub: "Pourquoi ce projet compte",
    },
  }[language];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="glass-card soft-glow rounded-[28px] p-4 sm:rounded-[34px] sm:p-6 lg:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/90">
          {t.eyebrow}
        </p>
        <h1 className="heading-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-5xl text-sm leading-8 text-slate-300 sm:text-base">
          {t.intro}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <StoryCard title={t.hookTitle} subtitle={t.hookSub}>
          <Bullet>
            {language === "en" ? (
              <>
                <strong className="text-white">AI for Kuala Lumpur</strong> was
                never meant to be just a static dashboard. The original ambition
                was to simulate a modern enterprise-grade urban intelligence
                platform capable of combining live data, analytics, AI
                interpretation, and decision support in one coherent product.
              </>
            ) : (
              <>
                <strong className="text-white">AI for Kuala Lumpur</strong>{" "}
                n’avait jamais vocation à n’être qu’un dashboard statique.
                L’ambition initiale était de simuler une plateforme moderne
                d’intelligence urbaine de niveau entreprise capable de combiner
                données live, analytics, interprétation IA et aide à la décision
                dans un produit cohérent.
              </>
            )}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The idea was to create a project that could speak both to recruiters and to technical teams: something visually tangible, but also supported by real backend logic, governance thinking, and architectural depth."
              : "L’idée était de créer un projet capable de parler à la fois aux recruteurs et aux équipes techniques : quelque chose de visuellement tangible, mais aussi soutenu par une vraie logique backend, une réflexion gouvernance et une profondeur d’architecture."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This is why the project intentionally mixes product design, real-time thinking, AI reasoning, and data platform concepts rather than focusing on a single technical layer."
              : "C’est pour cela que le projet mélange volontairement design produit, logique temps réel, raisonnement IA et concepts de plateforme data plutôt que de se concentrer sur une seule couche technique."}
          </Bullet>
        </StoryCard>

        <StoryCard title={t.originTitle} subtitle={t.originSub}>
          <Bullet>
            {language === "en"
              ? "The project started from a simple observation: many portfolio projects display charts, but very few explain how data is ingested, refreshed, governed, interpreted, and turned into actions."
              : "Le projet est parti d’un constat simple : beaucoup de projets portfolio affichent des graphiques, mais très peu expliquent comment la donnée est ingérée, rafraîchie, gouvernée, interprétée et transformée en actions."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The first goal was therefore to build a visible product layer first: a premium interface showing a believable smart city use case. Once the product became tangible, the backend, live logic, warehouse thinking, and AI layer were progressively added."
              : "Le premier objectif a donc été de construire d’abord une couche produit visible : une interface premium montrant un cas d’usage smart city crédible. Une fois le produit rendu tangible, le backend, la logique live, la réflexion warehouse et la couche IA ont été ajoutés progressivement."}
          </Bullet>
        </StoryCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <StoryCard title={t.buildTitle} subtitle={t.buildSub}>
          <Bullet>
            {language === "en"
              ? "The frontend was built in Next.js with a premium dashboard approach, multilingual support, responsive cards, a live operational overview, and an AI conversation panel."
              : "Le frontend a été construit en Next.js avec une approche dashboard premium, un support multilingue, des cartes responsives, une vue opérationnelle live et un panneau de conversation IA."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The backend was built in FastAPI and structured around live city snapshots, AI copilot endpoints, warehouse status endpoints, governance knowledge endpoints, and refresh logic."
              : "Le backend a été construit en FastAPI et structuré autour de snapshots live urbains, d’endpoints AI copilot, d’endpoints de statut warehouse, d’endpoints de connaissance gouvernance et d’une logique de refresh."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "A Redis-compatible live layer was designed to hold the latest city snapshot, while a DuckDB + dbt warehouse layer was introduced to represent the more analytical and transformed side of the platform."
              : "Une couche live compatible Redis a été conçue pour stocker le dernier snapshot de la ville, tandis qu’une couche warehouse DuckDB + dbt a été introduite pour représenter le versant plus analytique et transformé de la plateforme."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The project also incorporated governance content, data quality logic, and a documented operating model in order to position the platform as something closer to a serious data product than a visual demo."
              : "Le projet a également intégré du contenu de gouvernance, de la logique de qualité de données et un operating model documenté afin de positionner la plateforme comme quelque chose de plus proche d’un vrai produit data que d’une simple démo visuelle."}
          </Bullet>
        </StoryCard>

        <StoryCard title={t.liveTitle} subtitle={t.liveSub}>
          <Bullet>
            {language === "en"
              ? "One of the strongest parts of the project is the live layer. The dashboard was designed to refresh frequently, change district focus, and give the impression of a city command center reacting to dynamic operational conditions."
              : "L’une des parties les plus fortes du projet est la couche live. Le dashboard a été conçu pour se rafraîchir fréquemment, changer de district focus et donner l’impression d’un centre de commandement urbain réagissant à des conditions opérationnelles dynamiques."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This resulted in a multi-district overview, map-based district visualization, live cards, and continuously updated recommendations that make the product feel active and decision-oriented."
              : "Cela a donné une vue multi-districts, une visualisation cartographique des districts, des cartes live et des recommandations continuellement mises à jour qui rendent le produit actif et orienté décision."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The live mode became a major product differentiator because it turned the project from a static showcase into something that feels operational."
              : "Le mode live est devenu un différenciateur produit majeur car il a transformé le projet d’une vitrine statique en quelque chose qui semble réellement opérationnel."}
          </Bullet>
        </StoryCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <StoryCard title={t.aiTitle} subtitle={t.aiSub}>
          <Bullet>
            {language === "en"
              ? "The AI copilot started as a simple assistant idea, but quickly evolved into a more structured reasoning component. The objective was not to add an AI label for style, but to make the assistant useful, contextual, and explainable."
              : "L’AI copilot a commencé comme une simple idée d’assistant, mais a rapidement évolué vers un composant de raisonnement plus structuré. L’objectif n’était pas d’ajouter un label IA pour le style, mais de rendre l’assistant utile, contextualisé et explicable."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This led to an intent classification layer capable of distinguishing operational, analytical, explanatory, and out-of-scope questions. That design made the assistant much more credible and better aligned with the project domain."
              : "Cela a conduit à une couche de classification d’intention capable de distinguer les questions opérationnelles, analytiques, explicatives et hors périmètre. Cette conception a rendu l’assistant beaucoup plus crédible et mieux aligné sur le domaine du projet."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The assistant was then grounded with a simplified RAG logic: live snapshot context, warehouse context, and governance context are combined before generating an answer. This was essential to reduce hallucinations and keep the copilot attached to project reality."
              : "L’assistant a ensuite été ancré avec une logique RAG simplifiée : le contexte snapshot live, le contexte warehouse et le contexte gouvernance sont combinés avant de générer une réponse. C’était essentiel pour réduire les hallucinations et garder le copilot attaché à la réalité du projet."}
          </Bullet>
        </StoryCard>

        <StoryCard title={t.governanceTitle} subtitle={t.governanceSub}>
          <Bullet>
            {language === "en"
              ? "A key project decision was to avoid positioning the platform as a simple dashboard. Governance, lineage, data quality, role ownership, and AI grounding were progressively introduced to make the product look and behave like a serious enterprise data system."
              : "Une décision clé du projet a été d’éviter de positionner la plateforme comme un simple dashboard. Gouvernance, lineage, qualité de données, ownership des rôles et ancrage IA ont été progressivement introduits pour faire ressembler le produit à un véritable système data entreprise."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This added major value because it aligned the project with real business expectations: trust, control, explainability, and operating discipline."
              : "Cela a ajouté une valeur majeure car le projet s’est aligné sur de vraies attentes métier : confiance, contrôle, explicabilité et discipline opérationnelle."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The governance and documents pages therefore became essential parts of the project rather than secondary documentation."
              : "Les pages governance et documents sont donc devenues des parties essentielles du projet plutôt qu’une documentation secondaire."}
          </Bullet>
        </StoryCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <StoryCard title={t.deploymentTitle} subtitle={t.deploymentSub}>
          <Bullet>
            {language === "en"
              ? "One of the most instructive phases of the project came during deployment. The first serious deployment attempt was made on Vercel, because it is a natural option for Next.js. However, the monorepo structure, root directory configuration, and build behavior introduced repeated friction."
              : "L’une des phases les plus instructives du projet est apparue au moment du déploiement. La première tentative sérieuse a été faite sur Vercel, car c’est une option naturelle pour Next.js. Cependant, la structure en monorepo, la configuration du root directory et le comportement du build ont introduit des frictions répétées."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "The project then pivoted to Netlify for the frontend and Render for the backend. This solved a large part of the deployment problem, but revealed another reality: running a continuously updating background worker in the cloud is rarely fully free."
              : "Le projet a ensuite pivoté vers Netlify pour le frontend et Render pour le backend. Cela a résolu une grande partie du problème de déploiement, mais a révélé une autre réalité : faire tourner un background worker qui met à jour en continu dans le cloud est rarement totalement gratuit."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Rather than forcing a paid architecture, a pragmatic decision was made: preserve the live user experience by letting the frontend trigger snapshot generation in demo mode. This retained the product feel while respecting cost constraints."
              : "Plutôt que de forcer une architecture payante, une décision pragmatique a été prise : préserver l’expérience live côté utilisateur en laissant le frontend déclencher la génération des snapshots en mode démo. Cela a conservé la sensation produit tout en respectant les contraintes de coût."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This deployment journey became a strength of the project because it showed not only technical skill, but also real-world adaptation, trade-off management, and product-minded decision making."
              : "Ce parcours de déploiement est devenu une force du projet car il a montré non seulement des compétences techniques, mais aussi une capacité d’adaptation au réel, de gestion des arbitrages et de prise de décision orientée produit."}
          </Bullet>
        </StoryCard>

        <StoryCard title={t.decisionTitle} subtitle={t.decisionSub}>
          <Bullet>
            {language === "en"
              ? "A first major decision was to keep two architectural modes in mind: a richer local mode closer to full streaming logic, and a public cloud demo mode optimized for free deployment and visual reliability."
              : "Une première décision majeure a été de garder en tête deux modes d’architecture : un mode local plus riche, plus proche d’une vraie logique streaming, et un mode démo cloud public optimisé pour le déploiement gratuit et la fiabilité visuelle."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "A second major decision was to remove or hide unfinished pages rather than leaving them visible in a broken state. This improved product quality and avoided giving the impression of an incomplete or unstable application."
              : "Une deuxième décision majeure a été de retirer ou masquer les pages non finalisées plutôt que de les laisser visibles dans un état cassé. Cela a amélioré la qualité produit et évité de donner l’impression d’une application incomplète ou instable."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "A third decision was to concentrate the map and district interpretation into the live overview rather than fragmenting the experience across too many pages. This strengthened coherence and made the product easier to understand."
              : "Une troisième décision a été de concentrer la carte et l’interprétation des districts dans la vue live plutôt que de fragmenter l’expérience sur trop de pages. Cela a renforcé la cohérence et rendu le produit plus facile à comprendre."}
          </Bullet>
        </StoryCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <StoryCard title={t.currentTitle} subtitle={t.currentSub}>
          <Bullet>
            {language === "en"
              ? "At this stage, the project is already strong in several dimensions: premium UI, clear use case, real backend structure, live experience, AI copilot, governance framing, multilingual support, and a coherent story."
              : "À ce stade, le projet est déjà fort sur plusieurs dimensions : UI premium, cas d’usage clair, vraie structure backend, expérience live, AI copilot, cadrage gouvernance, support multilingue et récit cohérent."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Most importantly, it no longer feels like a simple technical exercise. It now looks like a realistic data and AI product prototype built with enterprise constraints in mind."
              : "Le plus important est qu’il ne ressemble plus à un simple exercice technique. Il ressemble désormais à un prototype réaliste de produit data et IA construit avec des contraintes de niveau entreprise en tête."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "This makes it particularly relevant for positioning around data engineering, analytics engineering, AI engineering, data governance, and consulting-oriented product work."
              : "Cela le rend particulièrement pertinent pour un positionnement autour du data engineering, de l’analytics engineering, de l’AI engineering, de la data governance et des travaux produit orientés conseil."}
          </Bullet>
        </StoryCard>

        <StoryCard title={t.perspectiveTitle} subtitle={t.perspectiveSub}>
          <Bullet>
            {language === "en"
              ? "The next natural evolution would be to connect real external APIs for weather and air quality, keep a cached backend layer, and progressively transition from simulated metrics to hybrid or fully real signals."
              : "L’évolution naturelle suivante serait de connecter de vraies APIs externes pour la météo et la qualité de l’air, de conserver une couche de cache backend et de passer progressivement de métriques simulées à des signaux hybrides ou totalement réels."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "Other future directions include stronger warehouse automation, full dbt refresh logic in cloud mode, richer data cataloging, more advanced RAG over documentation, and broader explainability."
              : "D’autres perspectives incluent une automatisation warehouse plus forte, une logique complète de refresh dbt en mode cloud, un catalogage de données plus riche, un RAG plus avancé sur la documentation et davantage d’explicabilité."}
          </Bullet>

          <Bullet>
            {language === "en"
              ? "A more ambitious long-term version could also become multi-city, integrate real anomaly detection, and evolve from a portfolio project into a reusable urban intelligence product pattern."
              : "Une version plus ambitieuse à long terme pourrait aussi devenir multi-ville, intégrer une vraie détection d’anomalies et évoluer d’un projet portfolio vers un pattern réutilisable de produit d’intelligence urbaine."}
          </Bullet>
        </StoryCard>
      </section>

      <StoryCard title={t.finalTitle} subtitle={t.finalSub}>
        <Bullet>
          {language === "en"
            ? "AI for Kuala Lumpur ultimately became much more than a dashboard project. It became a demonstration of how product thinking, backend engineering, live data patterns, AI grounding, governance logic, and real-world deployment constraints can be combined in one coherent system."
            : "AI for Kuala Lumpur est finalement devenu bien plus qu’un projet de dashboard. Il est devenu une démonstration de la façon dont vision produit, ingénierie backend, patterns de données live, ancrage IA, logique de gouvernance et contraintes réelles de déploiement peuvent être combinés dans un système cohérent."}
        </Bullet>

        <Bullet>
          {language === "en"
            ? "Its real value is not only in what was built, but also in how the project evolved, how problems were handled, and how technical ambition was balanced with practicality."
            : "Sa vraie valeur ne réside pas seulement dans ce qui a été construit, mais aussi dans la façon dont le projet a évolué, dont les problèmes ont été gérés et dont l’ambition technique a été équilibrée avec le pragmatisme."}
        </Bullet>

        <Bullet>
          {language === "en"
            ? "That is what makes the project credible, memorable, and useful as a portfolio centerpiece."
            : "C’est ce qui rend le projet crédible, mémorable et utile comme pièce centrale d’un portfolio."}
        </Bullet>
      </StoryCard>
    </div>
  );
}