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
      ai: "🤖 AI Assistant",
      predictions: "📈 Predictions",
      streaming: "📡 Streaming",
      governance: "🧭 Governance",
      headerEyebrow: "Real-time city intelligence",
      headerTitle: "AI for Kuala Lumpur",
      liveSystem: "Live system",
      urbanAnalytics: "Urban analytics",
      switchLanguage: "FR / EN",
      mobileNav: "Navigation",
    },
    fr: {
      live: "🏙️ Vue temps réel",
      docs: "📚 Documents",
      ai: "🤖 Assistant IA",
      predictions: "📈 Prédictions",
      streaming: "📡 Streaming",
      governance: "🧭 Gouvernance",
      headerEyebrow: "Intelligence urbaine temps réel",
      headerTitle: "AI for Kuala Lumpur",
      liveSystem: "Système live",
      urbanAnalytics: "Analytics urbaines",
      switchLanguage: "FR / EN",
      mobileNav: "Navigation",
    },
  }[language];

  const navItems = [
    { href: "/dashboard/live", label: t.live },
    { href: "/dashboard/documents", label: t.docs },
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
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
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
            <a
              href="https://github.com/heykelh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              <span>🐙</span>
              HeykelH
            </a>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/8 bg-[#07111b]/80 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.22em] text-cyan-300/85 sm:text-xs">
                  {t.headerEyebrow}
                </p>
                <h1 className="heading-font mt-1 truncate text-lg font-semibold text-white sm:text-xl">
                  {t.headerTitle}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:justify-end">
                <button
                  onClick={toggleLanguage}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-white transition hover:bg-white/[0.08] sm:px-4 sm:text-sm"
                >
                  {t.switchLanguage}
                </button>

                <div className="pill hidden rounded-2xl px-4 py-2 text-sm text-slate-200 sm:block">
                  <span className="mr-2 status-dot status-online" />
                  {t.liveSystem}
                </div>

                <div className="pill hidden rounded-2xl px-4 py-2 text-sm text-slate-200 md:block">
                  🌍 {t.urbanAnalytics}
                </div>

                <a
                  href="https://github.com/heykelh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-300 sm:text-sm"
                >
                  <span>🐙</span>
                  <span className="hidden xs:inline">HeykelH</span>
                  <span className="xs:hidden">GitHub</span>
                </a>
              </div>
            </div>

            <div className="mt-3 xl:hidden">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">
                {t.mobileNav}
              </p>
              <nav className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {navItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`whitespace-nowrap rounded-2xl px-3 py-2 text-xs font-medium transition sm:text-sm ${
                        isActive
                          ? "bg-cyan-400/10 text-white ring-1 ring-cyan-300/15"
                          : "border border-white/8 bg-white/[0.03] text-white/78 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </header>

          <main className="flex-1 px-3 py-3 sm:px-6 sm:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}