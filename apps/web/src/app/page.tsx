import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20">
        <div className="inline-flex w-fit rounded-full border border-cyan-400/20 bg-cyan-400/8 px-4 py-2 text-sm text-cyan-200">
          Enterprise-ready AI city intelligence platform
        </div>

        <div className="max-w-5xl space-y-6">
          <h1 className="heading-font text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
            AI for Kuala Lumpur
          </h1>

          <p className="max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl">
            A premium smart-city operations platform combining live analytics,
            streaming infrastructure, AI-assisted interpretation, and an
            enterprise data stack roadmap built for real-world credibility.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="glass-card soft-glow rounded-[28px] p-6">
            <p className="text-sm text-cyan-300">01 — Live operations</p>
            <h2 className="heading-font mt-3 text-2xl font-semibold">
              Real-time city monitoring
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Track traffic, air quality, transit, temperature, and humidity
              with a dashboard designed like a modern urban command center.
            </p>
          </div>

          <div className="glass-card soft-glow rounded-[28px] p-6">
            <p className="text-sm text-cyan-300">02 — AI layer</p>
            <h2 className="heading-font mt-3 text-2xl font-semibold">
              AI copilot and insights
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Use an AI assistant to summarize live conditions, explain signals,
              and prepare future decision-support and recommendation workflows.
            </p>
          </div>

          <div className="glass-card soft-glow rounded-[28px] p-6">
            <p className="text-sm text-cyan-300">03 — Enterprise stack</p>
            <h2 className="heading-font mt-3 text-2xl font-semibold">
              Data platform roadmap
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The project is evolving toward Airflow, S3-style raw storage,
              Snowflake, dbt, predictive models, and a real LLM-powered layer.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/dashboard/live"
            className="rounded-2xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Open live dashboard
          </Link>

          <Link
            href="/dashboard/documents"
            className="rounded-2xl border border-white/12 bg-white/[0.03] px-6 py-3 font-semibold text-white transition hover:bg-white/[0.06]"
          >
            View documents
          </Link>
        </div>
      </section>
    </main>
  );
}