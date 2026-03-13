"use client";

import { useEffect, useMemo, useState } from "react";

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
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
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
        const response = await fetch(`${API_BASE_URL}/api/live`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch initial live data.");
        }

        const json: LiveApiResponse = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    function connectStream() {
      eventSource = new EventSource(`${API_BASE_URL}/api/live/stream`);

      eventSource.onopen = () => {
        setConnected(true);
        setError(null);
      };

      eventSource.onerror = () => {
        setConnected(false);
        setError("Live stream disconnected.");
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed: LiveApiResponse = JSON.parse(event.data);
          setData(parsed);
        } catch {
          setError("Failed to parse live stream payload.");
        }
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">
              Live City Operations
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Kuala Lumpur Real-Time Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Mock real-time monitoring for urban signals. This first version
              uses streaming demo data to simulate production-style live city
              metrics.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  connected ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span>{connected ? "Stream connected" : "Stream offline"}</span>
            </div>
            <p className="mt-2 text-slate-400">Last update: {updatedAt}</p>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="District"
            value={snapshot?.district ?? "--"}
            helper="Current focus zone"
          />
          <MetricCard
            label="Traffic Index"
            value={snapshot?.traffic_index ?? "--"}
            helper={snapshot?.congestion_level ?? "No data"}
          />
          <MetricCard
            label="Air Quality Index"
            value={snapshot?.aqi ?? "--"}
            helper={snapshot?.air_quality_status ?? "No data"}
          />
          <MetricCard
            label="Transit Delay"
            value={
              snapshot?.transit_delay_min !== undefined
                ? `${snapshot.transit_delay_min} min`
                : "--"
            }
            helper="Estimated average delay"
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricCard
            label="Temperature"
            value={
              snapshot?.temperature_c !== undefined
                ? `${snapshot.temperature_c} °C`
                : "--"
            }
            helper="Current local reading"
          />
          <MetricCard
            label="Humidity"
            value={
              snapshot?.humidity_pct !== undefined
                ? `${snapshot.humidity_pct}%`
                : "--"
            }
            helper="Atmospheric humidity"
          />
          <MetricCard
            label="Mode"
            value={data?.mode ?? "--"}
            helper="Current pipeline mode"
          />
        </div>
      </section>
    </main>
  );
}