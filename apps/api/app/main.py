from __future__ import annotations

import json
import os
import random
from datetime import datetime, timezone
from typing import Any

import redis
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .warehouse_ops import read_warehouse_status, refresh_warehouse

app = FastAPI(title="AI for Kuala Lumpur API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
LIVE_SNAPSHOT_KEY = "ai_kl:latest_snapshot"
DEPLOYMENT_MODE = os.getenv("DEPLOYMENT_MODE", "local_realtime")
LIVE_GENERATION_ENABLED = os.getenv("LIVE_GENERATION_ENABLED", "true").lower() == "true"

redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)


class CopilotRequest(BaseModel):
    question: str
    snapshot: dict[str, Any] | None = None


DISTRICTS = [
    "KLCC",
    "Bukit Bintang",
    "Bangsar",
    "Mont Kiara",
    "Petaling Jaya",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def build_random_snapshot() -> dict[str, Any]:
    district = random.choice(DISTRICTS)
    traffic_index = random.randint(35, 92)
    aqi = random.randint(35, 130)
    temperature_c = round(random.uniform(27.0, 34.5), 1)
    humidity_pct = random.randint(62, 90)
    transit_delay_min = random.randint(1, 14)

    if traffic_index >= 80:
        congestion_level = "heavy"
    elif traffic_index >= 60:
        congestion_level = "moderate"
    else:
        congestion_level = "fluid"

    if aqi >= 101:
        air_quality_status = "unhealthy"
    elif aqi >= 51:
        air_quality_status = "moderate"
    else:
        air_quality_status = "good"

    return {
        "timestamp": now_iso(),
        "district": district,
        "traffic_index": traffic_index,
        "congestion_level": congestion_level,
        "aqi": aqi,
        "air_quality_status": air_quality_status,
        "temperature_c": temperature_c,
        "humidity_pct": humidity_pct,
        "transit_delay_min": transit_delay_min,
        "producer": "api_live_generator",
    }


def save_snapshot(snapshot: dict[str, Any]) -> None:
    redis_client.set(LIVE_SNAPSHOT_KEY, json.dumps(snapshot, ensure_ascii=False))


def get_latest_snapshot() -> dict[str, Any] | None:
    raw = redis_client.get(LIVE_SNAPSHOT_KEY)
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


def get_city_risk() -> list[dict[str, Any]]:
    db_path = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "..",
            "warehouse",
            "duckdb",
            "data",
            "ai_kl.duckdb",
        )
    )

    if not os.path.exists(db_path):
        return []

    try:
        import duckdb

        conn = duckdb.connect(db_path)
        rows = conn.execute(
            """
            select
              district,
              latest_timestamp,
              avg_traffic_index,
              avg_aqi,
              avg_temperature_c,
              avg_humidity_pct,
              avg_transit_delay_min,
              signal_count,
              city_risk_level
            from main.mart_city_risk
            order by district
            """
        ).fetchall()
        columns = [desc[0] for desc in conn.description]
        conn.close()

        result: list[dict[str, Any]] = []
        for row in rows:
          item = dict(zip(columns, row))
          if item.get("latest_timestamp") is not None:
              item["latest_timestamp"] = str(item["latest_timestamp"])
          result.append(item)
        return result
    except Exception:
        return []


def build_live_alerts(
    snapshot: dict[str, Any] | None, warehouse_risk: list[dict[str, Any]] | None
) -> list[dict[str, Any]]:
    alerts: list[dict[str, Any]] = []

    if snapshot:
        district = snapshot.get("district", "Unknown")
        traffic_index = snapshot.get("traffic_index", 0)
        aqi = snapshot.get("aqi", 0)
        transit_delay_min = snapshot.get("transit_delay_min", 0)
        temperature_c = snapshot.get("temperature_c", 0)

        if traffic_index >= 80:
            alerts.append(
                {
                    "type": "traffic",
                    "severity": "high",
                    "message_en": f"Heavy road congestion detected in {district}.",
                    "message_fr": f"Forte congestion routière détectée à {district}.",
                    "timestamp": now_iso(),
                }
            )
        elif traffic_index >= 60:
            alerts.append(
                {
                    "type": "traffic",
                    "severity": "medium",
                    "message_en": f"Traffic pressure is rising in {district}.",
                    "message_fr": f"La pression du trafic augmente à {district}.",
                    "timestamp": now_iso(),
                }
            )

        if aqi >= 101:
            alerts.append(
                {
                    "type": "air",
                    "severity": "high",
                    "message_en": f"Air quality is unhealthy in {district}.",
                    "message_fr": f"La qualité de l’air est mauvaise à {district}.",
                    "timestamp": now_iso(),
                }
            )
        elif aqi >= 51:
            alerts.append(
                {
                    "type": "air",
                    "severity": "medium",
                    "message_en": f"Air quality is moderately degraded in {district}.",
                    "message_fr": f"La qualité de l’air est modérément dégradée à {district}.",
                    "timestamp": now_iso(),
                }
            )

        if transit_delay_min >= 10:
            alerts.append(
                {
                    "type": "transit",
                    "severity": "high",
                    "message_en": f"Significant transit disruption detected ({transit_delay_min} min delay).",
                    "message_fr": f"Perturbation importante des transports détectée ({transit_delay_min} min de retard).",
                    "timestamp": now_iso(),
                }
            )
        elif transit_delay_min >= 5:
            alerts.append(
                {
                    "type": "transit",
                    "severity": "medium",
                    "message_en": f"Transit delays are noticeable ({transit_delay_min} min).",
                    "message_fr": f"Les retards de transport deviennent visibles ({transit_delay_min} min).",
                    "timestamp": now_iso(),
                }
            )

        if temperature_c >= 33:
            alerts.append(
                {
                    "type": "weather",
                    "severity": "medium",
                    "message_en": f"Urban heat is elevated in {district}.",
                    "message_fr": f"La chaleur urbaine est élevée à {district}.",
                    "timestamp": now_iso(),
                }
            )

    if warehouse_risk:
        for row in warehouse_risk:
            risk = str(row.get("city_risk_level", "low")).lower()
            district = row.get("district", "Unknown")
            if risk == "high":
                alerts.append(
                    {
                        "type": "warehouse",
                        "severity": "high",
                        "message_en": f"Warehouse analytics classify {district} as high risk.",
                        "message_fr": f"Les analytics du warehouse classent {district} en risque élevé.",
                        "timestamp": now_iso(),
                    }
                )
            elif risk == "medium":
                alerts.append(
                    {
                        "type": "warehouse",
                        "severity": "medium",
                        "message_en": f"Warehouse analytics classify {district} as medium risk.",
                        "message_fr": f"Les analytics du warehouse classent {district} en risque moyen.",
                        "timestamp": now_iso(),
                    }
                )

    if not alerts:
        alerts.append(
            {
                "type": "system",
                "severity": "low",
                "message_en": "No major operational alert detected.",
                "message_fr": "Aucune alerte opérationnelle majeure détectée.",
                "timestamp": now_iso(),
            }
        )

    severity_rank = {"high": 0, "medium": 1, "low": 2}
    alerts.sort(key=lambda x: severity_rank.get(x["severity"], 3))
    return alerts


def analyze_city_data_with_llm(
    question: str,
    snapshot: dict[str, Any] | None,
    warehouse_risk: list[dict[str, Any]] | None,
) -> dict[str, Any]:
    severity = "low"
    highlights: list[str] = []
    recommended_action = "Keep monitoring the city signals."

    if snapshot:
        if snapshot.get("traffic_index", 0) >= 80:
            severity = "high"
            highlights.append("Traffic congestion is heavy.")
        elif snapshot.get("traffic_index", 0) >= 60:
            severity = "medium"
            highlights.append("Traffic pressure is elevated.")

        if snapshot.get("aqi", 0) >= 101:
            severity = "high"
            highlights.append("Air quality is unhealthy.")
        elif snapshot.get("aqi", 0) >= 51:
            if severity != "high":
                severity = "medium"
            highlights.append("Air quality is moderately degraded.")

        if snapshot.get("transit_delay_min", 0) >= 10:
            severity = "high"
            highlights.append("Transit disruption is significant.")
        elif snapshot.get("transit_delay_min", 0) >= 5:
            if severity != "high":
                severity = "medium"
            highlights.append("Transit delays are noticeable.")

    if warehouse_risk:
        if any(str(row.get("city_risk_level", "")).lower() == "high" for row in warehouse_risk):
            severity = "high"
            highlights.append("Warehouse analytics confirm at least one high-risk district.")

    if severity == "high":
        recommended_action = "Escalate city operations monitoring and prioritize the most affected district."
    elif severity == "medium":
        recommended_action = "Increase monitoring frequency and prepare targeted interventions."
    else:
        recommended_action = "Maintain normal monitoring and continue collecting live signals."

    answer_lines = [
        f"Question: {question}",
        "",
        "Situation summary:",
    ]

    if snapshot:
        answer_lines.extend(
            [
                f"- District: {snapshot.get('district', '--')}",
                f"- Traffic index: {snapshot.get('traffic_index', '--')}",
                f"- AQI: {snapshot.get('aqi', '--')}",
                f"- Temperature: {snapshot.get('temperature_c', '--')}°C",
                f"- Humidity: {snapshot.get('humidity_pct', '--')}%",
                f"- Transit delay: {snapshot.get('transit_delay_min', '--')} min",
            ]
        )

    if highlights:
        answer_lines.append("")
        answer_lines.append("Main highlights:")
        answer_lines.extend([f"- {item}" for item in highlights])

    answer_lines.append("")
    answer_lines.append(f"Recommended action: {recommended_action}")

    return {
        "answer": "\n".join(answer_lines),
        "severity": severity,
        "highlights": highlights,
        "recommended_action": recommended_action,
    }


@app.get("/health")
def health() -> dict[str, Any]:
    redis_connected = False
    try:
        redis_connected = bool(redis_client.ping())
    except Exception:
        redis_connected = False

    return {
        "status": "ok",
        "service": "ai-for-kuala-lumpur-api",
        "redis_connected": redis_connected,
        "deployment_mode": DEPLOYMENT_MODE,
        "live_generation_enabled": LIVE_GENERATION_ENABLED,
        "timestamp": now_iso(),
    }


@app.get("/api/live")
def get_live() -> dict[str, Any]:
    snapshot = get_latest_snapshot()
    if snapshot is None:
        snapshot = build_random_snapshot()
        save_snapshot(snapshot)

    return {
        "city": "Kuala Lumpur",
        "mode": "streaming-cache" if DEPLOYMENT_MODE == "local_realtime" else "demo-generated",
        "snapshot": snapshot,
    }


@app.get("/api/live/stream")
def get_live_stream_fallback() -> dict[str, Any]:
    snapshot = get_latest_snapshot()
    if snapshot is None:
        snapshot = build_random_snapshot()
        save_snapshot(snapshot)

    return {
        "city": "Kuala Lumpur",
        "mode": "streaming-cache" if DEPLOYMENT_MODE == "local_realtime" else "demo-generated",
        "snapshot": snapshot,
    }


@app.post("/api/live/generate")
def generate_live_tick() -> dict[str, Any]:
    if not LIVE_GENERATION_ENABLED:
        raise HTTPException(status_code=403, detail="Live generation disabled.")

    snapshot = build_random_snapshot()
    save_snapshot(snapshot)

    return {
        "source": "api-live-generator",
        "deployment_mode": DEPLOYMENT_MODE,
        "snapshot": snapshot,
    }


@app.get("/api/alerts")
def get_alerts() -> dict[str, Any]:
    snapshot = get_latest_snapshot()
    warehouse_risk = get_city_risk()
    return {
        "source": "live-and-warehouse",
        "data": build_live_alerts(snapshot, warehouse_risk),
    }


@app.get("/api/warehouse/risk")
def warehouse_risk() -> dict[str, Any]:
    return {
        "source": "duckdb",
        "data": get_city_risk(),
    }


@app.get("/api/warehouse/status")
def warehouse_status() -> dict[str, Any]:
    return {
        "source": "warehouse-status-file",
        "data": read_warehouse_status(),
    }


@app.post("/api/warehouse/refresh")
def warehouse_refresh() -> dict[str, Any]:
    result = refresh_warehouse()
    return {
        "source": "manual-refresh",
        "data": result,
    }


@app.post("/api/ai/copilot")
def ai_copilot(payload: CopilotRequest) -> dict[str, Any]:
    warehouse_risk = get_city_risk()
    snapshot = payload.snapshot or get_latest_snapshot()

    result = analyze_city_data_with_llm(
        question=payload.question,
        snapshot=snapshot,
        warehouse_risk=warehouse_risk,
    )

    return {
        "question": payload.question,
        "analysis": result,
        "timestamp": now_iso(),
    }