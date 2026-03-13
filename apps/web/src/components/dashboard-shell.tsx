import Link from "next/link";
import { ReactNode } from "react";

const navItems = [
  { href: "/dashboard/live", label: "🏙️ Live Overview", active: true },
  { href: "#", label: "🗺️ City Map", active: false },
  { href: "#", label: "🤖 AI Assistant", active: false },
  { href: "#", label: "📈 Predictions", active: false },
  { href: "#", label: "📡 Streaming", active: false },
  { href: "#", label: "🧭 Governance", active: false },
];

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="dashboard-bg">
      <div className="flex min-h-screen">
        <aside className="sidebar-city hidden w-[280px] shrink-0 flex-col justify-between border-r border-white/8 p-6 text-white xl:flex">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-lg font-bold shadow-lg">
                🌆
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/70">
                  AI Platform
                </p>
                <h2 className="heading-font text-lg font-semibold">
                  Kuala Lumpur Ops
                </h2>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    item.active
                      ? "bg-cyan-400/12 text-white shadow-lg ring-1 ring-cyan-300/15"
                      : "text-white/80 hover:bg-white/6 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/55">
              Next milestones
            </p>
            <h3 className="heading-font mt-2 text-lg font-semibold">
              Live map + AI copilot
            </h3>
            <p className="mt-2 text-sm text-white/75">
              The platform is ready to receive real-time map overlays, streaming
              ingestion, AI analysis, and district-level forecasting.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/8 bg-[#08111b]/72 px-6 py-4 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/90">
                  Real-time city intelligence
                </p>
                <h1 className="heading-font mt-1 text-xl font-semibold text-white">
                  AI for Kuala Lumpur
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="pill rounded-2xl px-4 py-2 text-sm text-slate-200">
                  <span className="mr-2 status-dot status-online" />
                  Live system
                </div>
                <div className="pill rounded-2xl px-4 py-2 text-sm text-slate-200">
                  🌍 Urban analytics
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-sm font-semibold text-white">
                  MH
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}