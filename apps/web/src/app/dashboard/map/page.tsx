"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";

const KLLiveMap = dynamic(() => import("@/components/kl-live-map"), {
  ssr: false,
});

type LiveSnapshot = {
  timestamp: string;
  district: string;
  traffic_index: number;
  congestion_level: string;
  aqi: number;
  air_quality_status: string;
  temperature_c: number;
  humidity_pct: number;
  transit_delay_min: number;
  source?: string;
};

type LiveApiResponse = {
  city: string;
  mode: string;
  snapshot: LiveSnapshot;
};

const API_BASE_URL = "http://localhost:8000";

function SectionCard({
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
      {children}
    </section>
  );
}

export default function MapPage() {
  const { language } = useLanguage();
  const [data, setData] = useState<LiveApiResponse | null>(null);

  useEffect(() => {
    async function loadLive() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/live`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json: LiveApiResponse = await res.json();
        setData(json);
      } catch {
        //
      }
    }

    loadLive();
    const interval = setInterval(loadLive, 3000);
    return () => clearInterval(interval);
  }, []);

  const snapshot = data?.snapshot;

  const t = {
    en: {
      eyebrow: "Geospatial layer",
      title: "City Map",
      subtitle:
        "This page focuses on the geographic reading of the monitored city.",
      mapTitle: "Kuala Lumpur live map",
      mapSub: "Geospatial operations",
      focusTitle: "Current district focus",
      focusSub: "Monitored zone",
      legendTitle: "Map legend",
      legendSub: "Traffic interpretation",
      futureTitle: "What this page will become",
      futureSub: "Roadmap",
    },
    fr: {
      eyebrow: "Couche géospatiale",
      title: "Carte urbaine",
      subtitle:
        "Cette page se concentre sur la lecture géographique de la ville surveillée.",
      mapTitle: "Carte live de Kuala Lumpur",
      mapSub: "Opérations géospatiales",
      focusTitle: "District actuellement surveillé",
      focusSub: "Zone monitorée",
      legendTitle: "Légende de la carte",
      legendSub: "Interprétation du trafic",
      futureTitle: "Ce que cette page va devenir",
      futureSub: "Feuille de route",
    },
  }[language];

  const mapPoints = [
    {
      name: "KLCC",
      lat: 3.1579,
      lng: 101.7116,
      trafficIndex: snapshot?.district === "KLCC" ? snapshot.traffic_index : 82,
      aqi: snapshot?.district === "KLCC" ? snapshot.aqi : 58,
      temperature: snapshot?.district === "KLCC" ? snapshot.temperature_c : 31,
      humidity: snapshot?.district === "KLCC" ? snapshot.humidity_pct : 78,
    },
    {
      name: "Bukit Bintang",
      lat: 3.1467,
      lng: 101.7133,
      trafficIndex:
        snapshot?.district === "Bukit Bintang" ? snapshot.traffic_index : 76,
      aqi: snapshot?.district === "Bukit Bintang" ? snapshot.aqi : 64,
      temperature:
        snapshot?.district === "Bukit Bintang" ? snapshot.temperature_c : 32,
      humidity:
        snapshot?.district === "Bukit Bintang" ? snapshot.humidity_pct : 80,
    },
    {
      name: "Bangsar",
      lat: 3.1292,
      lng: 101.6788,
      trafficIndex: snapshot?.district === "Bangsar" ? snapshot.traffic_index : 61,
      aqi: snapshot?.district === "Bangsar" ? snapshot.aqi : 49,
      temperature: snapshot?.district === "Bangsar" ? snapshot.temperature_c : 30,
      humidity: snapshot?.district === "Bangsar" ? snapshot.humidity_pct : 74,
    },
    {
      name: "Mont Kiara",
      lat: 3.1698,
      lng: 101.6527,
      trafficIndex:
        snapshot?.district === "Mont Kiara" ? snapshot.traffic_index : 57,
      aqi: snapshot?.district === "Mont Kiara" ? snapshot.aqi : 46,
      temperature:
        snapshot?.district === "Mont Kiara" ? snapshot.temperature_c : 29,
      humidity:
        snapshot?.district === "Mont Kiara" ? snapshot.humidity_pct : 72,
    },
    {
      name: "Petaling Jaya",
      lat: 3.1073,
      lng: 101.6067,
      trafficIndex:
        snapshot?.district === "Petaling Jaya" ? snapshot.traffic_index : 69,
      aqi: snapshot?.district === "Petaling Jaya" ? snapshot.aqi : 54,
      temperature:
        snapshot?.district === "Petaling Jaya" ? snapshot.temperature_c : 30,
      humidity:
        snapshot?.district === "Petaling Jaya" ? snapshot.humidity_pct : 76,
    },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="glass-card soft-glow rounded-[34px] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/90">
          {t.eyebrow}
        </p>
        <h1 className="heading-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          {t.subtitle}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard title={t.mapTitle} subtitle={t.mapSub}>
          <KLLiveMap points={mapPoints} />
        </SectionCard>

        <div className="flex flex-col gap-6">
          <SectionCard title={t.focusTitle} subtitle={t.focusSub}>
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-400">
                {language === "en" ? "Live district" : "District live"}
              </p>
              <p className="heading-font mt-3 text-3xl font-bold text-white">
                {snapshot?.district ?? "--"}
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>🚗 Traffic: {snapshot?.traffic_index ?? "--"}</p>
                <p>🌿 AQI: {snapshot?.aqi ?? "--"}</p>
                <p>
                  🌡️ {language === "en" ? "Temperature" : "Température"}:{" "}
                  {snapshot?.temperature_c !== undefined
                    ? `${snapshot.temperature_c}°C`
                    : "--"}
                </p>
                <p>
                  💧 {language === "en" ? "Humidity" : "Humidité"}:{" "}
                  {snapshot?.humidity_pct !== undefined
                    ? `${snapshot.humidity_pct}%`
                    : "--"}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title={t.legendTitle} subtitle={t.legendSub}>
            <div className="space-y-4">
              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
                <div className="mb-2 flex items-center gap-3">
                  <span className="inline-block h-3 w-3 rounded-full bg-[#22c7a9]" />
                  <span className="font-medium text-white">
                    {language === "en" ? "Fluid traffic" : "Trafic fluide"}
                  </span>
                </div>
                {language === "en"
                  ? "Road conditions are smooth and operationally comfortable."
                  : "Les conditions routières sont fluides et confortables d’un point de vue opérationnel."}
              </div>

              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
                <div className="mb-2 flex items-center gap-3">
                  <span className="inline-block h-3 w-3 rounded-full bg-[#f5b942]" />
                  <span className="font-medium text-white">
                    {language === "en" ? "Moderate pressure" : "Pression modérée"}
                  </span>
                </div>
                {language === "en"
                  ? "Increased traffic density with manageable delays."
                  : "Densité de trafic plus forte avec des retards encore gérables."}
              </div>

              <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
                <div className="mb-2 flex items-center gap-3">
                  <span className="inline-block h-3 w-3 rounded-full bg-[#ff6b6b]" />
                  <span className="font-medium text-white">
                    {language === "en" ? "Heavy congestion" : "Forte congestion"}
                  </span>
                </div>
                {language === "en"
                  ? "Strong road pressure requiring operational attention."
                  : "Forte pression routière nécessitant une attention opérationnelle."}
              </div>
            </div>
          </SectionCard>
        </div>
      </section>

      <SectionCard title={t.futureTitle} subtitle={t.futureSub}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            language === "en"
              ? "District heatmaps"
              : "Heatmaps par district",
            language === "en"
              ? "Route overlays and mobility corridors"
              : "Overlays d’itinéraires et corridors de mobilité",
            language === "en"
              ? "Spatial AI recommendations"
              : "Recommandations IA spatiales",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4 text-sm text-slate-300"
            >
              {item}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}