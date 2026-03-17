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
  source?: string;
  producer?: string;
};

type LiveApiResponse = {
  city: string;
  mode: string;
  snapshot: LiveSnapshot;
};

type WarehouseRiskRow = {
  district: string;
  latest_timestamp: string;
  avg_traffic_index: number;
  avg_aqi: number;
  avg_temperature_c: number;
  avg_humidity_pct: number;
  avg_transit_delay_min: number;
  signal_count: number;
  city_risk_level: string;
};

type WarehouseRiskResponse = {
  source: string;
  data: WarehouseRiskRow[];
};

type WarehouseStatusResponse = {
  source: string;
  data: {
    status: string;
    last_refresh_at: string | null;
    last_success_at: string | null;
    last_error: unknown;
    last_row_count_hint?: string | null;
  };
};

type HealthResponse = {
  status: string;
  service: string;
  redis_connected: boolean;
  deployment_mode: string;
  live_generation_enabled: boolean;
  timestamp: string;
};

const API_BASE_URL = "http://localhost:8000";

const mainBars = [72, 56, 68, 49, 65, 73, 45, 61, 58, 79, 86, 74];
const miniTrafficBars = [35, 62, 48, 41, 75, 91, 67, 44];
const miniHumidityBars = [50, 54, 40, 66, 82, 72, 52, 60];
const miniWeatherBars = [74, 61, 45, 38, 50, 59, 42, 68];

function getTrafficFeedback(value?: number) {
  if (value === undefined) {
    return { text: "Waiting for live traffic feed.", tone: "feedback-medium" };
  }
  if (value >= 80) {
    return {
      text: "🚨 Heavy congestion detected. Road pressure is high.",
      tone: "feedback-bad",
    };
  }
  if (value >= 60) {
    return {
      text: "⚠️ Traffic is elevated but still manageable.",
      tone: "feedback-medium",
    };
  }
  return {
    text: "✅ Traffic is fluid across the monitored zone.",
    tone: "feedback-good",
  };
}

function getAirFeedback(value?: number) {
  if (value === undefined) {
    return {
      text: "Waiting for live air quality feed.",
      tone: "feedback-medium",
    };
  }
  if (value >= 101) {
    return {
      text: "😷 Air quality is unhealthy. Outdoor exposure should be limited.",
      tone: "feedback-bad",
    };
  }
  if (value >= 51) {
    return {
      text: "🌤️ Air quality is moderate. Acceptable with some caution.",
      tone: "feedback-medium",
    };
  }
  return {
    text: "🌿 Air quality is good and stable.",
    tone: "feedback-good",
  };
}

function getTempFeedback(value?: number) {
  if (value === undefined) {
    return { text: "Waiting for temperature data.", tone: "feedback-medium" };
  }
  if (value >= 33) {
    return {
      text: "🔥 Heat is intense. Expect higher urban stress.",
      tone: "feedback-bad",
    };
  }
  if (value >= 29) {
    return {
      text: "☀️ Warm city conditions, typical for Kuala Lumpur.",
      tone: "feedback-medium",
    };
  }
  return {
    text: "🌤️ Temperature is comfortable for city operations.",
    tone: "feedback-good",
  };
}

function getHumidityFeedback(value?: number) {
  if (value === undefined) {
    return { text: "Waiting for humidity data.", tone: "feedback-medium" };
  }
  if (value >= 85) {
    return {
      text: "💧 Humidity is very high. Air will feel heavy.",
      tone: "feedback-bad",
    };
  }
  if (value >= 70) {
    return {
      text: "🌫️ Humidity is noticeable but within expected range.",
      tone: "feedback-medium",
    };
  }
  return {
    text: "🍃 Humidity is relatively comfortable.",
    tone: "feedback-good",
  };
}

function getTransitFeedback(value?: number) {
  if (value === undefined) {
    return {
      text: "Waiting for transit delay feed.",
      tone: "feedback-medium",
    };
  }
  if (value >= 10) {
    return {
      text: "🚦 Transit delays are significant right now.",
      tone: "feedback-bad",
    };
  }
  if (value >= 5) {
    return {
      text: "🚌 Minor disruptions are visible in the network.",
      tone: "feedback-medium",
    };
  }
  return {
    text: "✅ Transit flow is healthy and responsive.",
    tone: "feedback-good",
  };
}

function MetricCard({
  icon,
  title,
  value,
  helper,
  feedback,
  feedbackTone,
  glow = "metric-glow-cyan",
}: {
  icon: string;
  title: string;
  value: string;
  helper: string;
  feedback: string;
  feedbackTone: string;
  glow?: string;
}) {
  return (
    <div className={`glass-card ${glow} rounded-[28px] p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-400">{title}</p>
          <p className="kpi-value mt-3 text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl">
          {icon}
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-400">{helper}</p>
      <p className={`mt-3 text-sm leading-6 ${feedbackTone}`}>{feedback}</p>
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
    <section className="glass-card soft-glow rounded-[30px] p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
            {subtitle}
          </p>
          <h2 className="heading-font mt-2 text-xl font-semibold text-white">
            {title}
          </h2>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function LiveDashboardPage() {
  const [data, setData] = useState<LiveApiResponse | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warehouseRisk, setWarehouseRisk] = useState<WarehouseRiskRow[]>([]);
  const [warehouseStatus, setWarehouseStatus] =
    useState<WarehouseStatusResponse["data"] | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

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

    async function loadWarehouseRisk() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/warehouse/risk`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch warehouse risk.");
        }

        const json: WarehouseRiskResponse = await response.json();
        setWarehouseRisk(json.data);
      } catch {
        //
      }
    }

    async function loadWarehouseStatus() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/warehouse/status`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch warehouse status.");
        }

        const json: WarehouseStatusResponse = await response.json();
        setWarehouseStatus(json.data);
      } catch {
        //
      }
    }

    async function loadHealth() {
      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch health.");
        }

        const json: HealthResponse = await response.json();
        setHealth(json);
      } catch {
        //
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
    loadWarehouseRisk();
    loadWarehouseStatus();
    loadHealth();
    connectStream();

    const poll = setInterval(() => {
      loadInitialData();
      loadWarehouseStatus();
    }, 3000);

    const warehousePoll = setInterval(() => {
      loadWarehouseRisk();
      loadWarehouseStatus();
      loadHealth();
    }, 10000);

    return () => {
      eventSource?.close();
      clearInterval(poll);
      clearInterval(warehousePoll);
    };
  }, []);

  async function generateLiveTick() {
  try {
    const genResponse = await fetch(`${API_BASE_URL}/api/live/generate`, {
      method: "POST",
    });

    if (!genResponse.ok) {
      throw new Error("Failed to generate live snapshot.");
    }

    const liveResponse = await fetch(`${API_BASE_URL}/api/live`, {
      cache: "no-store",
    });

    if (!liveResponse.ok) {
      throw new Error("Failed to reload live snapshot.");
    }

    const json: LiveApiResponse = await liveResponse.json();
    setData(json);
    setError(null);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to generate snapshot.");
  }
}

  const snapshot = data?.snapshot;

  const updatedAt = useMemo(() => {
    if (!snapshot?.timestamp) return "--";
    return new Date(snapshot.timestamp).toLocaleString();
  }, [snapshot?.timestamp]);

  const trafficFeedback = getTrafficFeedback(snapshot?.traffic_index);
  const airFeedback = getAirFeedback(snapshot?.aqi);
  const tempFeedback = getTempFeedback(snapshot?.temperature_c);
  const humidityFeedback = getHumidityFeedback(snapshot?.humidity_pct);
  const transitFeedback = getTransitFeedback(snapshot?.transit_delay_min);

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
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/90">
              Live command center
            </p>
            <h1 className="heading-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Kuala Lumpur Real-Time Operations
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              A cleaner and more urban visual style for monitoring city traffic,
              temperature, humidity, transit conditions, environmental signals,
              and analytics warehouse insights in one place.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="pill rounded-3xl px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Stream status
              </p>
              <div className="mt-2 flex items-center gap-2 text-white">
                <span
                  className={`status-dot ${
                    connected ? "status-online" : "status-offline"
                  }`}
                />
                <span className="font-medium">
                  {connected ? "Connected" : "Offline"}
                </span>
              </div>
            </div>

            <div className="pill rounded-3xl px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Warehouse
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {warehouseStatus?.status ?? "--"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {warehouseStatus?.last_success_at
                  ? new Date(warehouseStatus.last_success_at).toLocaleString()
                  : "No successful refresh yet"}
              </p>
            </div>

            <div className="pill rounded-3xl px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Deployment mode
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                {health?.deployment_mode ?? "--"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {health?.live_generation_enabled
                  ? "Live generation enabled"
                  : "Live generation disabled"}
              </p>
            </div>

            <button
              type="button"
              onClick={generateLiveTick}
              className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 px-5 py-4 text-left transition hover:bg-cyan-400/20 active:scale-[0.99]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Live tick
              </p>
              <p className="mt-2 text-sm font-medium text-white">
                Generate snapshot
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Demo mode compatible with Vercel
              </p>
            </button>

            <div className="pill rounded-3xl px-5 py-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Last update
              </p>
              <p className="mt-2 text-sm font-medium text-white">{updatedAt}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 h-[2px] w-full rounded-full gradient-line" />

        <div className="chart-bars">
          {mainBars.map((height, index) => (
            <div
              key={`${height}-${index}`}
              className="chart-bar"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-6 gap-2 text-center text-[11px] uppercase tracking-[0.18em] text-slate-500 sm:grid-cols-12">
          {[
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ].map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </section>

      {error && (
        <div className="rounded-[28px] border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-4">
        <MetricCard
          icon="🚗"
          title="Traffic Index"
          value={snapshot?.traffic_index?.toString() ?? "--"}
          helper={snapshot?.congestion_level ?? "No live label"}
          feedback={trafficFeedback.text}
          feedbackTone={trafficFeedback.tone}
          glow="metric-glow-cyan"
        />

        <MetricCard
          icon="🌿"
          title="Air Quality Index"
          value={snapshot?.aqi?.toString() ?? "--"}
          helper={snapshot?.air_quality_status ?? "No AQ label"}
          feedback={airFeedback.text}
          feedbackTone={airFeedback.tone}
          glow="metric-glow-teal"
        />

        <MetricCard
          icon="🌡️"
          title="Temperature"
          value={
            snapshot?.temperature_c !== undefined
              ? `${snapshot.temperature_c}°C`
              : "--"
          }
          helper="Current urban temperature"
          feedback={tempFeedback.text}
          feedbackTone={tempFeedback.tone}
          glow="metric-glow-amber"
        />

        <MetricCard
          icon="💧"
          title="Humidity"
          value={
            snapshot?.humidity_pct !== undefined
              ? `${snapshot.humidity_pct}%`
              : "--"
          }
          helper="Atmospheric moisture"
          feedback={humidityFeedback.text}
          feedbackTone={humidityFeedback.tone}
          glow="metric-glow-teal"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <SectionCard
          title="City live overview"
          subtitle="District / transit / weather"
        >
          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">🏙️ Current district</p>
                <span className="text-xl">📍</span>
              </div>
              <p className="heading-font mt-3 text-3xl font-bold text-white">
                {snapshot?.district ?? "--"}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Live operational focus zone currently monitored by the platform.
              </p>
              <div className="mini-bars mt-5">
                {miniTrafficBars.map((value, index) => (
                  <div
                    key={index}
                    className="mini-bar-cyan"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">🚌 Transit delay</p>
                <span className="text-xl">🚦</span>
              </div>
              <p className="heading-font mt-3 text-3xl font-bold text-white">
                {snapshot?.transit_delay_min !== undefined
                  ? `${snapshot.transit_delay_min} min`
                  : "--"}
              </p>
              <p className={`mt-3 text-sm leading-6 ${transitFeedback.tone}`}>
                {transitFeedback.text}
              </p>
              <div className="mini-bars mt-5">
                {miniHumidityBars.map((value, index) => (
                  <div
                    key={index}
                    className="mini-bar-amber"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">☁️ Pipeline mode</p>
                <span className="text-xl">📡</span>
              </div>
              <p className="heading-font mt-3 text-3xl font-bold text-white">
                {data?.mode ?? "--"}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Live serving is active and connected to the analytics stack.
              </p>
              <div className="mini-bars mt-5">
                {miniWeatherBars.map((value, index) => (
                  <div
                    key={index}
                    className="mini-bar-teal"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Quick situation summary" subtitle="AI-style feedback">
          <div className="space-y-4">
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
              🚗 <span className={trafficFeedback.tone}>{trafficFeedback.text}</span>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
              🌿 <span className={airFeedback.tone}>{airFeedback.text}</span>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
              🌡️ <span className={tempFeedback.tone}>{tempFeedback.text}</span>
            </div>
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
              💧 <span className={humidityFeedback.tone}>{humidityFeedback.text}</span>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <SectionCard title="Kuala Lumpur live map" subtitle="Geospatial operations">
          <KLLiveMap points={mapPoints} />
        </SectionCard>

        <SectionCard title="Map legend" subtitle="Traffic levels">
          <div className="space-y-4">
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
              <div className="mb-2 flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#22c7a9]" />
                <span className="font-medium text-white">Fluid traffic</span>
              </div>
              Road conditions are smooth and operationally comfortable.
            </div>

            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
              <div className="mb-2 flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#f5b942]" />
                <span className="font-medium text-white">Moderate pressure</span>
              </div>
              Increased traffic density with manageable delays.
            </div>

            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-slate-300">
              <div className="mb-2 flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ff6b6b]" />
                <span className="font-medium text-white">Heavy congestion</span>
              </div>
              Strong road pressure requiring operational attention.
            </div>

            <div className="rounded-[22px] border border-cyan-400/15 bg-cyan-500/8 px-4 py-4 text-sm text-slate-200">
              🗺️ This map is the foundation for the next phases: district heatmaps,
              live route overlays, AI recommendations, and predictive congestion.
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="glass-card soft-glow rounded-[30px] p-6">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
            Warehouse analytics
          </p>
          <h2 className="heading-font mt-2 text-xl font-semibold text-white">
            District risk from dbt marts
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {warehouseRisk.map((row) => (
            <div
              key={row.district}
              className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="heading-font text-lg font-semibold text-white">
                  {row.district}
                </h3>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white">
                  {row.city_risk_level}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p>🚗 Avg traffic: {Number(row.avg_traffic_index).toFixed(1)}</p>
                <p>🌿 Avg AQI: {Number(row.avg_aqi).toFixed(1)}</p>
                <p>🌡️ Avg temp: {Number(row.avg_temperature_c).toFixed(1)}°C</p>
                <p>💧 Avg humidity: {Number(row.avg_humidity_pct).toFixed(1)}%</p>
                <p>🚇 Avg delay: {Number(row.avg_transit_delay_min).toFixed(1)} min</p>
                <p>🧮 Signals: {row.signal_count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AICopilotPanel snapshot={snapshot} />

        <SectionCard title="System status" subtitle="Foundation">
          <div className="space-y-4">
            {[
              {
                label: "FastAPI live endpoint",
                value: connected ? "Healthy" : "Check stream",
              },
              {
                label: "Next.js dashboard shell",
                value: "Ready",
              },
              {
                label: "Real-time Kuala Lumpur map",
                value: "Ready",
              },
              {
                label: "AI copilot backend",
                value: "Ready",
              },
              {
                label: "DuckDB warehouse marts",
                value: warehouseRisk.length > 0 ? "Ready" : "Loading",
              },
              {
                label: "Warehouse refresh",
                value: warehouseStatus?.status ?? "--",
              },
              {
                label: "Deployment mode",
                value: health?.deployment_mode ?? "--",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4"
              >
                <span className="text-sm text-slate-300">{row.label}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs font-medium text-white">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}