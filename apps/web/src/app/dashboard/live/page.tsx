"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AICopilotPanel from "@/components/ai-copilot-panel";

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
};

type LiveApiResponse = {
  city: string;
  mode: string;
  snapshot: LiveSnapshot;
};

const API_BASE_URL = "http://localhost:8000";

function MetricCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="glass-card rounded-[28px] p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </div>
  );
}

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
    <section className="glass-card rounded-[30px] p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">
          {subtitle}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function LiveDashboardPage() {
  const [data, setData] = useState<LiveApiResponse | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    async function loadInitialData() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/live`, {
          cache: "no-store",
        });

        const json: LiveApiResponse = await res.json();
        setData(json);
      } catch {
        setError("Unable to fetch initial live data.");
      }
    }

    function connectStream() {
      eventSource = new EventSource(`${API_BASE_URL}/api/live/stream`);

      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.onerror = () => {
        setConnected(false);
      };

      eventSource.onmessage = (event) => {
        const parsed: LiveApiResponse = JSON.parse(event.data);
        setData(parsed);
      };
    }

    loadInitialData();
    connectStream();

    return () => {
      eventSource?.close();
    };
  }, []);

  const snapshot = data?.snapshot;

  const updatedAt = useMemo(() => {
    if (!snapshot?.timestamp) return "--";
    return new Date(snapshot.timestamp).toLocaleString();
  }, [snapshot?.timestamp]);

  const mapPoints = [
    {
      name: "KLCC",
      lat: 3.1579,
      lng: 101.7116,
      trafficIndex: snapshot?.traffic_index ?? 80,
      aqi: snapshot?.aqi ?? 55,
      temperature: snapshot?.temperature_c ?? 31,
      humidity: snapshot?.humidity_pct ?? 76,
    },
    {
      name: "Bukit Bintang",
      lat: 3.1467,
      lng: 101.7133,
      trafficIndex: 75,
      aqi: 62,
      temperature: 32,
      humidity: 78,
    },
    {
      name: "Bangsar",
      lat: 3.1292,
      lng: 101.6788,
      trafficIndex: 63,
      aqi: 48,
      temperature: 30,
      humidity: 74,
    },
    {
      name: "Mont Kiara",
      lat: 3.1698,
      lng: 101.6527,
      trafficIndex: 57,
      aqi: 45,
      temperature: 29,
      humidity: 72,
    },
    {
      name: "Petaling Jaya",
      lat: 3.1073,
      lng: 101.6067,
      trafficIndex: 69,
      aqi: 54,
      temperature: 30,
      humidity: 76,
    },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <section className="glass-card rounded-[34px] p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-300">
              Live command center
            </p>
            <h1 className="mt-3 text-4xl font-bold text-white">
              Kuala Lumpur Operations
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Real-time monitoring of traffic, environment and transport
              conditions across Kuala Lumpur districts.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="pill rounded-2xl px-4 py-3">
              <p className="text-xs text-slate-400">Stream</p>
              <p className="font-medium text-white">
                {connected ? "Connected" : "Offline"}
              </p>
            </div>

            <div className="pill rounded-2xl px-4 py-3">
              <p className="text-xs text-slate-400">Last update</p>
              <p className="font-medium text-white">{updatedAt}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-4">
        <MetricCard
          title="District"
          value={snapshot?.district ?? "--"}
          helper="Current monitoring zone"
        />

        <MetricCard
          title="Traffic"
          value={
            snapshot?.traffic_index
              ? `${snapshot.traffic_index} 🚗`
              : "--"
          }
          helper={snapshot?.congestion_level ?? ""}
        />

        <MetricCard
          title="Air Quality"
          value={snapshot?.aqi ? `${snapshot.aqi} 🌿` : "--"}
          helper={snapshot?.air_quality_status ?? ""}
        />

        <MetricCard
          title="Transit Delay"
          value={
            snapshot?.transit_delay_min
              ? `${snapshot.transit_delay_min} min 🚇`
              : "--"
          }
          helper="Average network delay"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <SectionCard
          title="City environment"
          subtitle="Weather signals"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <MetricCard
              title="Temperature"
              value={
                snapshot?.temperature_c
                  ? `${snapshot.temperature_c}°C 🌡️`
                  : "--"
              }
              helper="Urban temperature"
            />

            <MetricCard
              title="Humidity"
              value={
                snapshot?.humidity_pct
                  ? `${snapshot.humidity_pct}% 💧`
                  : "--"
              }
              helper="Atmospheric humidity"
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Operational feedback"
          subtitle="Situation analysis"
        >
          <div className="space-y-3 text-sm text-slate-300">
            {snapshot?.traffic_index && snapshot.traffic_index > 75 && (
              <p>🚗 Heavy traffic pressure detected.</p>
            )}

            {snapshot?.aqi && snapshot.aqi > 80 && (
              <p>🌫 Air quality is deteriorating.</p>
            )}

            {snapshot?.temperature_c && snapshot.temperature_c > 32 && (
              <p>🔥 High temperature detected.</p>
            )}

            {snapshot?.humidity_pct && snapshot.humidity_pct > 85 && (
              <p>💧 Very humid conditions.</p>
            )}

            {snapshot?.transit_delay_min && snapshot.transit_delay_min > 8 && (
              <p>🚇 Transit network delays increasing.</p>
            )}
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard title="Kuala Lumpur map" subtitle="Geospatial layer">
          <KLLiveMap points={mapPoints} />
        </SectionCard>

        <SectionCard title="Traffic legend" subtitle="Road pressure">
          <div className="space-y-4 text-sm text-slate-300">
            <p>🟢 Fluid traffic</p>
            <p>🟡 Moderate congestion</p>
            <p>🔴 Heavy congestion</p>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AICopilotPanel snapshot={snapshot} />

        <SectionCard title="System status" subtitle="Infrastructure">
          <div className="space-y-4 text-sm text-slate-300">
            <p>⚡ FastAPI backend active</p>
            <p>📡 Streaming pipeline running</p>
            <p>🗺 Map layer active</p>
            <p>🤖 AI Copilot ready</p>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}