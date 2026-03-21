"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import AICopilotPanel from "@/components/ai-copilot-panel";
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const translations = {
  en: {
    pageTag: "Live command center",
    pageTitle: "Kuala Lumpur Real-Time Overview",
    pageSubtitle:
      "Monitor live city signals, multi-district metrics, warehouse analytics, and interact with the AI copilot in one place.",
    currentTime: "Kuala Lumpur time",
    mode: "Mode",
    localRealtime: "Local realtime",
    demoMode: "Demo mode",
    warehouse: "Warehouse",
    warehouseReady: "Ready",
    warehouseUnavailable: "Unavailable in cloud demo",
    noWarehouseSuccess: "No successful refresh yet",
    generateSnapshot: "Generate snapshot",
    generateSnapshotHint: "Create a new live district focus",
    refreshWarehouse: "Refresh warehouse",
    refreshWarehouseHint: "Reload DuckDB + dbt analytics",
    districtOverview: "District overview",
    districtOverviewSub: "All monitored zones",
    currentFocus: "Current focus",
    currentFocusSub: "Live district spotlight",
    mapTitle: "Kuala Lumpur live map",
    mapSub: "Geospatial overview",
    mapLegend: "Map legend",
    mapLegendSub: "Traffic interpretation",
    monitoredZone: "Monitored zone",
    currentDistrictFocus: "Current district focus",
    trafficInterpretation: "Traffic interpretation",
    warehouseTitle: "Warehouse analytics",
    warehouseSub: "dbt marts and risk signals",
    traffic: "Traffic",
    air: "Air quality",
    temperature: "Temperature",
    humidity: "Humidity",
    transit: "Transit delay",
    signals: "Signals",
    recommendation: "Recommendation",
    riskLevel: "Risk level",
    liveSnapshot: "Live snapshot",
    lastUpdate: "Last update",
    noData: "No data",
    loading: "Loading...",
    refreshing: "Refreshing...",
    autoRefreshOn: "Auto refresh every 2s",
    warehouseDemoText:
      "The public cloud version prioritizes live demo behavior. Full warehouse refresh and local dbt/DuckDB orchestration remain available in the full-stack local setup.",
    fluidTraffic: "Fluid traffic",
    moderateTraffic: "Moderate pressure",
    heavyTraffic: "Heavy congestion",
    fluidTrafficText:
      "Road conditions are smooth and operationally comfortable.",
    moderateTrafficText:
      "Traffic density is rising, but delays remain manageable.",
    heavyTrafficText:
      "Strong road pressure requiring close operational attention.",
    focusRecommendationHigh:
      "Escalate monitoring and prioritize mobility mitigation in this district.",
    focusRecommendationMedium:
      "Increase monitoring cadence and prepare localized interventions.",
    focusRecommendationLow:
      "Maintain normal monitoring and continue collecting signals.",
    districtRecommendationHigh:
      "High-risk district. Prioritize active monitoring and rapid coordination.",
    districtRecommendationMedium:
      "Medium-risk district. Watch closely and prepare targeted action.",
    districtRecommendationLow:
      "Lower-risk district. Continue routine monitoring.",
  },
  fr: {
    pageTag: "Centre de commandement live",
    pageTitle: "Vue temps réel de Kuala Lumpur",
    pageSubtitle:
      "Surveille les signaux live de la ville, les métriques multi-districts, les analytics warehouse et interagis avec l’AI copilot au même endroit.",
    currentTime: "Heure de Kuala Lumpur",
    mode: "Mode",
    localRealtime: "Temps réel local",
    demoMode: "Mode démo",
    warehouse: "Warehouse",
    warehouseReady: "Prêt",
    warehouseUnavailable: "Indisponible dans la démo cloud",
    noWarehouseSuccess: "Aucun refresh réussi pour le moment",
    generateSnapshot: "Générer un snapshot",
    generateSnapshotHint: "Créer un nouveau focus district live",
    refreshWarehouse: "Rafraîchir le warehouse",
    refreshWarehouseHint: "Recharger DuckDB + analytics dbt",
    districtOverview: "Vue d’ensemble des districts",
    districtOverviewSub: "Toutes les zones surveillées",
    currentFocus: "Focus actuel",
    currentFocusSub: "District live mis en avant",
    mapTitle: "Carte live de Kuala Lumpur",
    mapSub: "Vue géospatiale",
    mapLegend: "Légende de carte",
    mapLegendSub: "Interprétation du trafic",
    monitoredZone: "Zone surveillée",
    currentDistrictFocus: "Focus district actuel",
    trafficInterpretation: "Interprétation du trafic",
    warehouseTitle: "Analytics warehouse",
    warehouseSub: "Marts dbt et signaux de risque",
    traffic: "Trafic",
    air: "Qualité de l’air",
    temperature: "Température",
    humidity: "Humidité",
    transit: "Retard transport",
    signals: "Signaux",
    recommendation: "Recommandation",
    riskLevel: "Niveau de risque",
    liveSnapshot: "Snapshot live",
    lastUpdate: "Dernière mise à jour",
    noData: "Aucune donnée",
    loading: "Chargement...",
    refreshing: "Rafraîchissement...",
    autoRefreshOn: "Rafraîchissement auto toutes les 2s",
    warehouseDemoText:
      "La version cloud publique privilégie le comportement live de démonstration. Le refresh warehouse complet et l’orchestration locale dbt/DuckDB restent disponibles dans la version full-stack locale.",
    fluidTraffic: "Trafic fluide",
    moderateTraffic: "Pression modérée",
    heavyTraffic: "Forte congestion",
    fluidTrafficText:
      "Les conditions routières sont fluides et confortables opérationnellement.",
    moderateTrafficText:
      "La densité augmente, mais les retards restent encore maîtrisables.",
    heavyTrafficText:
      "La pression routière est forte et nécessite une attention opérationnelle rapprochée.",
    focusRecommendationHigh:
      "Escalader la surveillance et prioriser les actions mobilité sur ce district.",
    focusRecommendationMedium:
      "Augmenter la fréquence de monitoring et préparer des interventions locales.",
    focusRecommendationLow:
      "Maintenir une surveillance normale et continuer la collecte des signaux.",
    districtRecommendationHigh:
      "District à risque élevé. Prioriser un monitoring actif et une coordination rapide.",
    districtRecommendationMedium:
      "District à risque moyen. Surveiller de près et préparer une action ciblée.",
    districtRecommendationLow:
      "District à risque plus faible. Continuer la surveillance habituelle.",
  },
};

function getTrafficTone(value?: number) {
  if (value === undefined) return "text-slate-300";
  if (value >= 80) return "text-red-300";
  if (value >= 60) return "text-amber-300";
  return "text-emerald-300";
}

function getRiskTone(risk?: string) {
  const normalized = String(risk || "").toLowerCase();
  if (normalized === "high") return "border-red-400/20 bg-red-500/10 text-red-200";
  if (normalized === "medium")
    return "border-amber-400/20 bg-amber-500/10 text-amber-200";
  return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
}

function getFocusRecommendation(
  risk: string | undefined,
  t: (typeof translations)["en"]
) {
  const normalized = String(risk || "").toLowerCase();
  if (normalized === "high") return t.focusRecommendationHigh;
  if (normalized === "medium") return t.focusRecommendationMedium;
  return t.focusRecommendationLow;
}

function getDistrictRecommendation(
  risk: string | undefined,
  t: (typeof translations)["en"]
) {
  const normalized = String(risk || "").toLowerCase();
  if (normalized === "high") return t.districtRecommendationHigh;
  if (normalized === "medium") return t.districtRecommendationMedium;
  return t.districtRecommendationLow;
}

function getTrafficLegend(
  value: number | undefined,
  t: (typeof translations)["en"]
) {
  if (value === undefined) {
    return {
      label: t.moderateTraffic,
      text: t.moderateTrafficText,
      tone: "border-amber-400/20 bg-amber-500/10 text-amber-200",
    };
  }
  if (value >= 80) {
    return {
      label: t.heavyTraffic,
      text: t.heavyTrafficText,
      tone: "border-red-400/20 bg-red-500/10 text-red-200",
    };
  }
  if (value >= 60) {
    return {
      label: t.moderateTraffic,
      text: t.moderateTrafficText,
      tone: "border-amber-400/20 bg-amber-500/10 text-amber-200",
    };
  }
  return {
    label: t.fluidTraffic,
    text: t.fluidTrafficText,
    tone: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
  };
}

function formatNumber(value?: number, suffix = "") {
  if (value === undefined || value === null || Number.isNaN(value)) return "--";
  return `${Number(value).toFixed(1)}${suffix}`;
}

function formatLocalTimeInKL(date: Date, language: "en" | "fr") {
  return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
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
    <section className="glass-card soft-glow rounded-[30px] p-4 sm:p-6">
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

export default function LiveDashboardPage() {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  const [data, setData] = useState<LiveApiResponse | null>(null);
  const [warehouseRisk, setWarehouseRisk] = useState<WarehouseRiskRow[]>([]);
  const [warehouseStatus, setWarehouseStatus] =
    useState<WarehouseStatusResponse["data"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [refreshingWarehouse, setRefreshingWarehouse] = useState(false);
  const [warehouseLoaded, setWarehouseLoaded] = useState(false);

  useEffect(() => {
    const tick = () => {
      setCurrentTime(formatLocalTimeInKL(new Date(), language));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [language]);

  async function loadLiveOnly() {
    const liveRes = await fetch(`${API_BASE_URL}/api/live`, {
      cache: "no-store",
    });

    if (!liveRes.ok) {
      throw new Error("Failed to fetch live data.");
    }

    const liveJson: LiveApiResponse = await liveRes.json();
    setData(liveJson);
  }

  async function loadWarehouse() {
    try {
      const [riskRes, statusRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/warehouse/risk`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/api/warehouse/status`, { cache: "no-store" }),
      ]);

      if (riskRes.ok) {
        const riskJson: WarehouseRiskResponse = await riskRes.json();
        setWarehouseRisk(riskJson.data ?? []);
      }

      if (statusRes.ok) {
        const statusJson: WarehouseStatusResponse = await statusRes.json();
        setWarehouseStatus(statusJson.data);
      }

      setWarehouseLoaded(true);
    } catch {
      setWarehouseLoaded(true);
    }
  }

  async function generateLiveTickSilently() {
    try {
      await fetch(`${API_BASE_URL}/api/live/generate`, {
        method: "POST",
      });
    } catch {
      // silent on auto refresh
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      try {
        await generateLiveTickSilently();
        if (!isMounted) return;
        await Promise.all([loadLiveOnly(), loadWarehouse()]);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }

    bootstrap();

    const liveTimer = setInterval(async () => {
      try {
        await generateLiveTickSilently();
        if (!isMounted) return;
        await loadLiveOnly();
      } catch {
        if (!isMounted) return;
        setError("Auto refresh failed.");
      }
    }, 2000);

    const warehouseTimer = setInterval(async () => {
      try {
        if (!isMounted) return;
        await loadWarehouse();
      } catch {
        // silent
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(liveTimer);
      clearInterval(warehouseTimer);
    };
  }, []);

  async function reloadLiveAndWarehouseStatus() {
    try {
      await Promise.all([loadLiveOnly(), loadWarehouse()]);
    } catch {
      // silent
    }
  }

  async function generateLiveTick() {
    try {
      setGenerating(true);
      setError(null);

      const genResponse = await fetch(`${API_BASE_URL}/api/live/generate`, {
        method: "POST",
      });

      if (!genResponse.ok) {
        throw new Error("Failed to generate live snapshot.");
      }

      await reloadLiveAndWarehouseStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate snapshot.");
    } finally {
      setGenerating(false);
    }
  }

  async function refreshWarehouse() {
    try {
      setRefreshingWarehouse(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/warehouse/refresh`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh warehouse.");
      }

      await reloadLiveAndWarehouseStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh warehouse.");
    } finally {
      setRefreshingWarehouse(false);
    }
  }

  const snapshot = data?.snapshot;

  const updatedAt = useMemo(() => {
    if (!snapshot?.timestamp) return "--";
    return new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", {
      dateStyle: "short",
      timeStyle: "medium",
    }).format(new Date(snapshot.timestamp));
  }, [snapshot?.timestamp, language]);

  const liveDistrictMap = useMemo(() => {
    const base = [
      {
        name: "KLCC",
        lat: 3.1579,
        lng: 101.7116,
        trafficIndex: 82,
        aqi: 58,
        temperature: 31,
        humidity: 78,
      },
      {
        name: "Bukit Bintang",
        lat: 3.1467,
        lng: 101.7133,
        trafficIndex: 76,
        aqi: 64,
        temperature: 32,
        humidity: 80,
      },
      {
        name: "Bangsar",
        lat: 3.1292,
        lng: 101.6788,
        trafficIndex: 61,
        aqi: 49,
        temperature: 30,
        humidity: 74,
      },
      {
        name: "Mont Kiara",
        lat: 3.1698,
        lng: 101.6527,
        trafficIndex: 57,
        aqi: 46,
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

    return base.map((item) => {
      if (snapshot?.district === item.name) {
        return {
          ...item,
          trafficIndex: snapshot.traffic_index,
          aqi: snapshot.aqi,
          temperature: snapshot.temperature_c,
          humidity: snapshot.humidity_pct,
        };
      }
      return item;
    });
  }, [snapshot]);

  const districtCards = useMemo(() => {
    return liveDistrictMap.map((district) => {
      const warehouseRow = warehouseRisk.find((row) => row.district === district.name);

      return {
        district: district.name,
        traffic: warehouseRow
          ? Number(warehouseRow.avg_traffic_index)
          : district.trafficIndex,
        aqi: warehouseRow ? Number(warehouseRow.avg_aqi) : district.aqi,
        temperature: warehouseRow
          ? Number(warehouseRow.avg_temperature_c)
          : district.temperature,
        humidity: warehouseRow
          ? Number(warehouseRow.avg_humidity_pct)
          : district.humidity,
        transit: warehouseRow
          ? Number(warehouseRow.avg_transit_delay_min)
          : snapshot?.district === district.name
          ? snapshot.transit_delay_min
          : undefined,
        risk: warehouseRow?.city_risk_level ?? "low",
        signals: warehouseRow?.signal_count ?? 0,
      };
    });
  }, [liveDistrictMap, warehouseRisk, snapshot]);

  const focusWarehouse = useMemo(() => {
    if (!snapshot?.district) return null;
    return warehouseRisk.find((row) => row.district === snapshot.district) ?? null;
  }, [snapshot?.district, warehouseRisk]);

  const trafficLegend = getTrafficLegend(snapshot?.traffic_index, t);

  const deploymentModeLabel =
    data?.mode === "streaming-cache" ? t.localRealtime : t.demoMode;

  const warehouseReady = warehouseRisk.length > 0;
  const warehouseUnavailable =
    warehouseLoaded && !warehouseReady && warehouseStatus?.status !== "ok";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-3 sm:px-4 lg:px-0">
      <section className="glass-card soft-glow rounded-[28px] p-4 sm:rounded-[34px] sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.26em] text-cyan-300/90">
              {t.pageTag}
            </p>
            <h1 className="heading-font mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
              {t.pageTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {t.pageSubtitle}
            </p>
            <p className="mt-3 text-sm text-cyan-200">{t.autoRefreshOn}</p>
          </div>

          <div className="flex flex-col gap-3 xl:min-w-[340px]">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLanguage(language === "en" ? "fr" : "en")}
                className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
              >
                FR / EN
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="pill rounded-3xl px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t.currentTime}
                </p>
                <p className="mt-2 text-sm font-medium text-white">{currentTime}</p>
              </div>

              <div className="pill rounded-3xl px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t.mode}
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {deploymentModeLabel}
                </p>
              </div>

              <div className="pill rounded-3xl px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t.warehouse}
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {warehouseReady
                    ? t.warehouseReady
                    : warehouseUnavailable
                    ? t.warehouseUnavailable
                    : t.loading}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {warehouseStatus?.last_success_at
                    ? new Intl.DateTimeFormat(language === "fr" ? "fr-FR" : "en-GB", {
                        dateStyle: "short",
                        timeStyle: "medium",
                      }).format(new Date(warehouseStatus.last_success_at))
                    : t.noWarehouseSuccess}
                </p>
              </div>

              <div className="pill rounded-3xl px-5 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t.lastUpdate}
                </p>
                <p className="mt-2 text-sm font-medium text-white">{updatedAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={generateLiveTick}
                disabled={generating}
                className="rounded-3xl border border-cyan-300/20 bg-cyan-400/10 px-5 py-4 text-left transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t.generateSnapshot}
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {generating ? t.loading : t.generateSnapshotHint}
                </p>
              </button>

              <button
                type="button"
                onClick={refreshWarehouse}
                disabled={refreshingWarehouse}
                className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 px-5 py-4 text-left transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t.refreshWarehouse}
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {refreshingWarehouse ? t.refreshing : t.refreshWarehouseHint}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-[28px] border border-red-500/25 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title={t.districtOverview} subtitle={t.districtOverviewSub}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {districtCards.map((row) => (
              <div
                key={row.district}
                className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="heading-font text-lg font-semibold text-white">
                    {row.district}
                  </h3>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getRiskTone(
                      row.risk
                    )}`}
                  >
                    {String(row.risk)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div>
                    <p className="text-slate-500">{t.traffic}</p>
                    <p className={`mt-1 font-medium ${getTrafficTone(row.traffic)}`}>
                      {formatNumber(row.traffic)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.air}</p>
                    <p className="mt-1 font-medium text-white">
                      {formatNumber(row.aqi)}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.temperature}</p>
                    <p className="mt-1 font-medium text-white">
                      {formatNumber(row.temperature, "°C")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.humidity}</p>
                    <p className="mt-1 font-medium text-white">
                      {formatNumber(row.humidity, "%")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.transit}</p>
                    <p className="mt-1 font-medium text-white">
                      {formatNumber(row.transit, " min")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.signals}</p>
                    <p className="mt-1 font-medium text-white">{row.signals}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-slate-200">
                  <p className="mb-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {t.recommendation}
                  </p>
                  {getDistrictRecommendation(row.risk, t)}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={t.currentFocus} subtitle={t.currentFocusSub}>
          <div className="space-y-4">
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-400">{t.liveSnapshot}</p>
                <span className="text-xl">📍</span>
              </div>

              <p className="heading-font mt-3 text-3xl font-bold text-white">
                {snapshot?.district ?? t.noData}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                <div>
                  <p className="text-slate-500">{t.traffic}</p>
                  <p className={`mt-1 font-medium ${getTrafficTone(snapshot?.traffic_index)}`}>
                    {snapshot?.traffic_index ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t.air}</p>
                  <p className="mt-1 font-medium text-white">
                    {snapshot?.aqi ?? "--"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t.temperature}</p>
                  <p className="mt-1 font-medium text-white">
                    {snapshot?.temperature_c !== undefined
                      ? `${snapshot.temperature_c}°C`
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t.humidity}</p>
                  <p className="mt-1 font-medium text-white">
                    {snapshot?.humidity_pct !== undefined
                      ? `${snapshot.humidity_pct}%`
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t.transit}</p>
                  <p className="mt-1 font-medium text-white">
                    {snapshot?.transit_delay_min !== undefined
                      ? `${snapshot.transit_delay_min} min`
                      : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">{t.riskLevel}</p>
                  <p className="mt-1 font-medium text-white">
                    {focusWarehouse?.city_risk_level ?? "low"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-cyan-400/15 bg-cyan-500/8 p-5">
              <p className="text-sm text-cyan-200">{t.recommendation}</p>
              <p className="mt-2 text-base leading-7 text-white">
                {getFocusRecommendation(focusWarehouse?.city_risk_level, t)}
              </p>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title={t.mapTitle} subtitle={t.mapSub}>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.03]">
              <div className="h-[280px] sm:h-[360px] lg:h-[420px]">
                <KLLiveMap
                  points={liveDistrictMap.map((item) => ({
                    name: item.name,
                    lat: item.lat,
                    lng: item.lng,
                    trafficIndex: item.trafficIndex,
                    aqi: item.aqi,
                    temperature: item.temperature,
                    humidity: item.humidity,
                  }))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm text-slate-400">{t.monitoredZone}</p>
                <p className="heading-font mt-3 text-2xl font-bold text-white">
                  Kuala Lumpur
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {liveDistrictMap.length} districts currently visualized on the live map.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm text-slate-400">{t.currentDistrictFocus}</p>
                <p className="heading-font mt-3 text-2xl font-bold text-white">
                  {snapshot?.district ?? t.noData}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {snapshot?.producer ?? "live-demo-source"}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm text-slate-400">{t.trafficInterpretation}</p>
                <div
                  className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${trafficLegend.tone}`}
                >
                  {trafficLegend.label}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {trafficLegend.text}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t.mapLegend} subtitle={t.mapLegendSub}>
          <div className="space-y-4">
            <div className="rounded-[22px] border border-emerald-400/20 bg-emerald-500/10 px-4 py-4 text-sm text-slate-200">
              <div className="mb-2 flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#22c7a9]" />
                <span className="font-medium text-white">{t.fluidTraffic}</span>
              </div>
              {t.fluidTrafficText}
            </div>

            <div className="rounded-[22px] border border-amber-400/20 bg-amber-500/10 px-4 py-4 text-sm text-slate-200">
              <div className="mb-2 flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#f5b942]" />
                <span className="font-medium text-white">{t.moderateTraffic}</span>
              </div>
              {t.moderateTrafficText}
            </div>

            <div className="rounded-[22px] border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-slate-200">
              <div className="mb-2 flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full bg-[#ff6b6b]" />
                <span className="font-medium text-white">{t.heavyTraffic}</span>
              </div>
              {t.heavyTrafficText}
            </div>

            <div className={`rounded-[22px] border px-4 py-4 text-sm ${trafficLegend.tone}`}>
              <p className="font-medium">{trafficLegend.label}</p>
              <p className="mt-2">{trafficLegend.text}</p>
            </div>
          </div>
        </SectionCard>
      </section>

      <SectionCard title={t.warehouseTitle} subtitle={t.warehouseSub}>
        {warehouseReady ? (
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
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${getRiskTone(
                      row.city_risk_level
                    )}`}
                  >
                    {row.city_risk_level}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
                  <div>
                    <p className="text-slate-500">{t.traffic}</p>
                    <p className="mt-1">{formatNumber(Number(row.avg_traffic_index))}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.air}</p>
                    <p className="mt-1">{formatNumber(Number(row.avg_aqi))}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.temperature}</p>
                    <p className="mt-1">{formatNumber(Number(row.avg_temperature_c), "°C")}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.humidity}</p>
                    <p className="mt-1">{formatNumber(Number(row.avg_humidity_pct), "%")}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.transit}</p>
                    <p className="mt-1">
                      {formatNumber(Number(row.avg_transit_delay_min), " min")}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t.signals}</p>
                    <p className="mt-1">{row.signal_count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : warehouseUnavailable ? (
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 text-sm leading-7 text-slate-300">
            <p className="font-medium text-white">{t.warehouseUnavailable}</p>
            <p className="mt-3">{t.warehouseDemoText}</p>
          </div>
        ) : (
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5 text-sm text-slate-300">
            {t.loading}
          </div>
        )}
      </SectionCard>

      <AICopilotPanel snapshot={snapshot} />
    </div>
  );
}