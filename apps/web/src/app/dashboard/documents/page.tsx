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
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="glass-card soft-glow rounded-[34px] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/90">
          Project documentation
        </p>
        <h1 className="heading-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          AI for Kuala Lumpur — Documents
        </h1>
        <p className="mt-4 max-w-4xl text-base leading-8 text-slate-300">
          This page explains the purpose of the platform, the logic of each
          screen, the technical stack, and the implementation roadmap. It is
          designed both as an internal project guide and as a recruiter-facing
          walkthrough.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <DocCard title="Project vision" subtitle="Why this project exists">
          <Bullet>
            <strong className="text-white">AI for Kuala Lumpur</strong> is a
            real-time smart city intelligence platform designed to monitor
            urban traffic, air quality, weather, humidity, and transport
            conditions through a modern enterprise data stack.
          </Bullet>

          <Bullet>
            The goal is to simulate the kind of system that a mobility company,
            a public operations team, or a data & AI consulting practice could
            build to support urban decision-making in real time.
          </Bullet>

          <Bullet>
            The platform is intentionally built to demonstrate strong skills in{" "}
            <strong className="text-white">Data Engineering</strong>,{" "}
            <strong className="text-white">Analytics Engineering</strong>,{" "}
            <strong className="text-white">AI Engineering</strong>,{" "}
            <strong className="text-white">dashboard design</strong>, and{" "}
            <strong className="text-white">product thinking</strong>.
          </Bullet>
        </DocCard>

        <DocCard title="Recruiter takeaway" subtitle="What this proves">
          <Bullet>✅ End-to-end architecture mindset</Bullet>
          <Bullet>✅ Ability to build both backend and frontend layers</Bullet>
          <Bullet>✅ Knowledge of real-time data serving patterns</Bullet>
          <Bullet>✅ Readiness for enterprise stack integration</Bullet>
          <Bullet>✅ Clear documentation and project storytelling</Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DocCard title="Current pages and features" subtitle="Product walkthrough">
          <Bullet>
            <strong className="text-white">Live Overview</strong> shows the
            current operational picture of Kuala Lumpur through traffic, AQI,
            temperature, humidity, and transit metrics.
          </Bullet>

          <Bullet>
            <strong className="text-white">Live Map</strong> visualizes district
            activity geographically and will progressively evolve toward richer
            overlays and zone-level intelligence.
          </Bullet>

          <Bullet>
            <strong className="text-white">AI Copilot</strong> interprets the
            current snapshot, summarizes the situation, and proposes immediate
            actions based on live operational signals.
          </Bullet>

          <Bullet>
            <strong className="text-white">Documents</strong> acts as the
            project handbook, architecture note, and recruiter-friendly demo
            guide.
          </Bullet>
        </DocCard>

        <DocCard title="How to explain the app in interview" subtitle="Demo support">
          <Bullet>
            “This platform simulates an enterprise-grade urban intelligence
            system combining live ingestion, data serving, AI analysis, and
            decision support.”
          </Bullet>

          <Bullet>
            “I started with the product layer to make the use case tangible,
            then progressively introduced the data platform, streaming, AI, and
            analytics layers.”
          </Bullet>

          <Bullet>
            “The long-term objective is to connect a real orchestration stack,
            warehouse models, and a real LLM on top of curated enterprise data.”
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DocCard title="Technical stack" subtitle="Current and target architecture">
          <Bullet>
            <strong className="text-white">Frontend:</strong> Next.js,
            TypeScript, Tailwind CSS, component-based dashboard architecture.
          </Bullet>

          <Bullet>
            <strong className="text-white">Backend:</strong> FastAPI, SSE live
            endpoints, Redis-powered serving layer, AI analysis endpoint.
          </Bullet>

          <Bullet>
            <strong className="text-white">Streaming foundation:</strong>{" "}
            Redpanda/Kafka-style event flow, producer, consumer, live Redis
            cache.
          </Bullet>

          <Bullet>
            <strong className="text-white">Target enterprise stack:</strong>{" "}
            Airflow, MinIO, DuckDB, dbt, ML models, and a real LLM / RAG layer.
          </Bullet>
        </DocCard>

        <DocCard title="Architecture logic" subtitle="Why it was designed this way">
          <Bullet>
            The platform separates the{" "}
            <strong className="text-white">presentation layer</strong>, the{" "}
            <strong className="text-white">serving/API layer</strong>, the{" "}
            <strong className="text-white">streaming/live layer</strong>, and
            eventually the <strong className="text-white">warehouse layer</strong>.
          </Bullet>

          <Bullet>
            This mirrors how enterprise products are built: data is ingested,
            stored, transformed, served through APIs, and then used by analytics
            interfaces and AI systems.
          </Bullet>
        </DocCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DocCard title="Implementation roadmap" subtitle="What will be added next">
          <Bullet>
            <strong className="text-white">Sprint 1:</strong> premium frontend,
            live API, Redis cache, streaming simulation, AI copilot V1.
          </Bullet>

          <Bullet>
            <strong className="text-white">Sprint 2:</strong> Airflow, MinIO,
            DuckDB integration, dbt models, raw/bronze/silver/gold style
            architecture.
          </Bullet>

          <Bullet>
            <strong className="text-white">Sprint 3:</strong> predictive
            congestion model, anomaly detection, model serving endpoints.
          </Bullet>

          <Bullet>
            <strong className="text-white">Sprint 4:</strong> real LLM, RAG,
            enterprise-grade AI assistant, explainability and governance layer.
          </Bullet>
        </DocCard>

        <DocCard title="Why this roadmap matters" subtitle="Enterprise readiness">
          <Bullet>
            It shows a progression from a visible user product to a complete
            data and AI platform.
          </Bullet>

          <Bullet>
            This is the kind of evolution recruiters expect to see when they
            evaluate a candidate for data engineering, AI engineering, or modern
            consulting roles.
          </Bullet>

          <Bullet>
            Each sprint adds a new proof point: architecture, orchestration,
            transformation, AI, and business impact.
          </Bullet>
        </DocCard>
      </section>

      <DocCard title="Final target state" subtitle="What the finished platform becomes">
        <Bullet>
          A modern enterprise AI platform combining{" "}
          <strong className="text-white">real-time ingestion</strong>,{" "}
          <strong className="text-white">warehouse transformation</strong>,{" "}
          <strong className="text-white">ML prediction</strong>,{" "}
          <strong className="text-white">AI copilots</strong>, and{" "}
          <strong className="text-white">decision-support dashboards</strong>.
        </Bullet>

        <Bullet>
          In portfolio terms, this becomes much more than a dashboard: it
          becomes a concrete demonstration of product thinking, engineering
          structure, and enterprise readiness.
        </Bullet>
      </DocCard>
    </div>
  );
}