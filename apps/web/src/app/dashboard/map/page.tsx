"use client";

import { useLanguage } from "@/components/language-provider";

export default function MapPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "Geospatial layer",
      title: "City Map",
      text:
        "This page will host a richer operational map with district overlays, heatmaps, route intelligence, and AI-generated spatial insights.",
    },
    fr: {
      eyebrow: "Couche géospatiale",
      title: "Carte urbaine",
      text:
        "Cette page accueillera une carte opérationnelle plus riche avec overlays de districts, heatmaps, intelligence de trajets et insights spatiaux générés par l’IA.",
    },
  }[language];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="glass-card soft-glow rounded-[30px] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
          {t.eyebrow}
        </p>
        <h1 className="heading-font mt-2 text-3xl font-bold text-white">
          {t.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          {t.text}
        </p>
      </div>
    </div>
  );
}