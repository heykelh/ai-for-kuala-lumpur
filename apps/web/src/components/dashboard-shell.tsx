"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

export default function DashboardShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { language, toggleLanguage } = useLanguage();

  const t = {
    en: {
      live: "🏙️ Live Overview",
      docs: "📚 Documents",
      map: "🗺️ City Map",
      ai: "🤖 AI Assistant",
      predictions: "📈 Predictions",
      streaming: "📡 Streaming",
      governance: "🧭 Governance",
      enterpriseTrack: "Enterprise track",
      upgradeTitle: "Data platform upgrade",
      upgradeText:
        "Next sprint: orchestration, storage, warehouse automation, bilingual product experience, and AI analytics grounded in curated data.",
      headerEyebrow: "Real-time city intelligence",
      headerTitle: "AI for Kuala Lumpur",
      liveSystem: "Live system",
      urbanAnalytics: "Urban analytics",
    },
    fr: {
      live: "🏙️ Vue temps réel",
      docs: "📚 Documents",
      map: "🗺️ Carte urbaine",
      ai: "🤖 Assistant IA",
      predictions: "📈 Prédictions",
      streaming: "📡 Streaming",
      governance: "🧭 Gouvernance",
      enterpriseTrack: "Parcours entreprise",
      upgradeTitle: "Montée en puissance data",
      upgradeText:
        "Prochain sprint : orchestration, stockage, automatisation du warehouse, expérience produit bilingue et analytics IA basées sur des données préparées.",
      headerEyebrow: "Intelligence urbaine temps réel",
      headerTitle: "AI for Kuala Lumpur",
      liveSystem: "Système live",
      urbanAnalytics: "Analytics urbaines",
    },
  }[language];

  const navItems = [
    { href: "/dashboard/live", label: t.live },
    { href: "/dashboard/documents", label: t.docs },
    { href: "/dashboard/map", label: t.map },
    { href: "/dashboard/ai", label: t.ai },
    { href: "/dashboard/predictions", label: t.predictions },
    { href: "/dashboard/streaming", label: t.streaming },
    { href: "/dashboard/governance", label: t.governance },
  ];

  return (
    <div className="dashboard-bg">
      <div className="flex min-h-screen">
        <aside className="sidebar-city hidden w-[290px] shrink-0 flex-col justify-between border-r border-white/8 p-6 text-white xl:flex">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-lg shadow-lg">
                🌆
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/65">
                  AI Platform
                </p>
                <h2 className="heading-font text-lg font-semibold">
                  Kuala Lumpur Ops
                </h2>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive =
                  item.href !== "#" && pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-cyan-400/10 text-white ring-1 ring-cyan-300/15"
                        : "text-white/78 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-4">
            <button
              onClick={toggleLanguage}
              className="w-full rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-400/20"
            >
              {language === "en" ? "🇫🇷 Passer en français" : "🇬🇧 Switch to English"}
            </button>

            
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07111b]/72 px-6 py-4 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/85">
                  {t.headerEyebrow}
                </p>
                <h1 className="heading-font mt-1 text-xl font-semibold text-white">
                  {t.headerTitle}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="pill rounded-2xl px-4 py-2 text-sm text-slate-200">
                  <span className="mr-2 status-dot status-online" />
                  {t.liveSystem}
                </div>
                <div className="pill rounded-2xl px-4 py-2 text-sm text-slate-200">
                  🌍 {t.urbanAnalytics}
                </div>
                <a
                  href="https://github.com/heykelh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-cyan-400 text-slate-950 px-3 py-1 text-sm font-semibold transition hover:bg-cyan-300 hover:scale-105"
                >
                  <span>🐙</span>
                  HeykelH
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}