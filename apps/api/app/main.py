from datetime import datetime, timezone
import asyncio
import json
import random

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from redis import Redis
from sse_starlette.sse import EventSourceResponse

app = FastAPI(
    title="AI for Kuala Lumpur API",
    version="0.2.0",
    description="Real-time AI city intelligence API for Kuala Lumpur.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REDIS_HOST = "localhost"
REDIS_PORT = 6379
REDIS_KEY_LATEST = "ai_kl:latest_snapshot"

DISTRICTS = [
    "KLCC",
    "Bukit Bintang",
    "Bangsar",
    "Mont Kiara",
    "Petaling Jaya",
]


class AIAnalysisRequest(BaseModel):
    question: str
    snapshot: dict | None = None


def get_redis_client() -> Redis | None:
    try:
        client = Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        client.ping()
        return client
    except Exception:
        return None


def generate_mock_snapshot() -> dict:
    district = random.choice(DISTRICTS)

    traffic_index = random.randint(45, 95)
    aqi = random.randint(35, 120)
    temperature = round(random.uniform(27.0, 34.0), 1)
    humidity = random.randint(60, 92)
    transit_delay_min = random.randint(1, 12)

    congestion_level = (
        "heavy" if traffic_index >= 80 else
        "moderate" if traffic_index >= 60 else
        "fluid"
    )

    air_quality_status = (
        "unhealthy" if aqi >= 101 else
        "moderate" if aqi >= 51 else
        "good"
    )

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "district": district,
        "traffic_index": traffic_index,
        "congestion_level": congestion_level,
        "aqi": aqi,
        "air_quality_status": air_quality_status,
        "temperature_c": temperature,
        "humidity_pct": humidity,
        "transit_delay_min": transit_delay_min,
        "source": "mock",
    }


def get_latest_snapshot() -> dict:
    redis_client = get_redis_client()
    if redis_client is not None:
        try:
            raw = redis_client.get(REDIS_KEY_LATEST)
            if raw:
                payload = json.loads(raw)
                payload["source"] = "redis-cache"
                return payload
        except Exception:
            pass

    return generate_mock_snapshot()


def build_ai_analysis(question: str, snapshot: dict | None) -> dict:
    if not snapshot:
        return {
            "answer": "I do not have enough live data yet to provide a grounded analysis.",
            "severity": "medium",
            "highlights": [
                "No live snapshot received.",
                "Please wait for the stream or refresh the dashboard.",
            ],
            "recommended_action": "Reload the live feed and retry the analysis.",
        }

    district = snapshot.get("district", "Unknown district")
    traffic_index = snapshot.get("traffic_index")
    aqi = snapshot.get("aqi")
    temperature_c = snapshot.get("temperature_c")
    humidity_pct = snapshot.get("humidity_pct")
    transit_delay_min = snapshot.get("transit_delay_min")

    highlights = []
    severity = "low"

    if traffic_index is not None:
        if traffic_index >= 80:
            highlights.append(f"🚗 Heavy congestion detected in {district} ({traffic_index}).")
            severity = "high"
        elif traffic_index >= 60:
            highlights.append(f"🚗 Moderate traffic pressure in {district} ({traffic_index}).")
            severity = "medium"
        else:
            highlights.append(f"🚗 Traffic remains fluid in {district} ({traffic_index}).")

    if aqi is not None:
        if aqi >= 101:
            highlights.append(f"🌫 Air quality is unhealthy (AQI {aqi}).")
            severity = "high"
        elif aqi >= 51:
            highlights.append(f"🌿 Air quality is moderate (AQI {aqi}).")
            if severity == "low":
                severity = "medium"
        else:
            highlights.append(f"🌿 Air quality is good (AQI {aqi}).")

    if temperature_c is not None:
        if temperature_c >= 33:
            highlights.append(f"🌡 Urban heat is elevated at {temperature_c}°C.")
            if severity == "low":
                severity = "medium"
        else:
            highlights.append(f"🌡 Temperature is currently {temperature_c}°C.")

    if humidity_pct is not None:
        if humidity_pct >= 85:
            highlights.append(f"💧 Humidity is very high at {humidity_pct}%.")
            if severity == "low":
                severity = "medium"
        else:
            highlights.append(f"💧 Humidity is {humidity_pct}%.")

    if transit_delay_min is not None:
        if transit_delay_min >= 10:
            highlights.append(f"🚇 Transit delays are significant ({transit_delay_min} min).")
            severity = "high"
        elif transit_delay_min >= 5:
            highlights.append(f"🚇 Transit delays are noticeable ({transit_delay_min} min).")
            if severity == "low":
                severity = "medium"
        else:
            highlights.append(f"🚇 Transit network remains responsive ({transit_delay_min} min delay).")

    normalized_question = question.lower().strip()

    if "summary" in normalized_question or "situation" in normalized_question:
        answer = (
            f"Current situation in {district}: traffic, air quality, weather, and transit signals "
            f"show a {severity} operational pressure profile. The main drivers are the live traffic, "
            f"environmental conditions, and transit delay levels observed in the latest snapshot."
        )
    elif "traffic" in normalized_question:
        answer = (
            f"Traffic analysis for {district}: the latest live traffic index is {traffic_index}. "
            f"This suggests {'heavy congestion' if traffic_index is not None and traffic_index >= 80 else 'moderate pressure' if traffic_index is not None and traffic_index >= 60 else 'fluid movement'}."
        )
    elif "air" in normalized_question or "aqi" in normalized_question:
        answer = (
            f"Air quality analysis for {district}: the latest AQI is {aqi}. "
            f"This indicates {'unhealthy air conditions' if aqi is not None and aqi >= 101 else 'moderate air quality' if aqi is not None and aqi >= 51 else 'good air quality'}."
        )
    elif "temperature" in normalized_question or "humidity" in normalized_question or "weather" in normalized_question:
        answer = (
            f"Weather analysis for {district}: temperature is {temperature_c}°C and humidity is {humidity_pct}%. "
            f"These conditions {'suggest elevated urban heat stress' if temperature_c is not None and temperature_c >= 33 else 'remain within typical Kuala Lumpur urban conditions'}."
        )
    elif "recommend" in normalized_question or "action" in normalized_question:
        answer = (
            f"Recommended action for {district}: prioritize operational monitoring, especially where road pressure "
            f"and transit delay are elevated. If this pattern persists, the next step should be district-level hotspot mapping and predictive congestion scoring."
        )
    else:
        answer = (
            f"The latest live snapshot for {district} indicates a {severity} level operational situation. "
            f"I analyzed traffic, AQI, temperature, humidity, and transit delay to produce this assessment."
        )

    recommended_action = (
        "Monitor the district closely and prepare escalation if traffic and transit delay continue rising."
        if severity == "high"
        else "Continue monitoring and compare with the next live updates."
        if severity == "medium"
        else "Situation is stable. No urgent intervention is needed."
    )

    return {
        "answer": answer,
        "severity": severity,
        "highlights": highlights,
        "recommended_action": recommended_action,
    }


@app.get("/health")
def health() -> dict:
    redis_client = get_redis_client()
    return {
        "status": "ok",
        "service": "ai-for-kuala-lumpur-api",
        "redis_connected": redis_client is not None,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/live")
def get_live_data() -> dict:
    snapshot = get_latest_snapshot()
    return {
        "city": "Kuala Lumpur",
        "mode": "streaming-cache" if snapshot.get("source") == "redis-cache" else "mock-realtime",
        "snapshot": snapshot,
    }


async def event_generator():
    while True:
        snapshot = get_latest_snapshot()
        payload = {
            "city": "Kuala Lumpur",
            "mode": "streaming-cache" if snapshot.get("source") == "redis-cache" else "mock-realtime",
            "snapshot": snapshot,
        }
        yield {
            "event": "message",
            "data": json.dumps(payload),
        }
        await asyncio.sleep(2)


@app.get("/api/live/stream")
async def stream_live_data() -> EventSourceResponse:
    return EventSourceResponse(event_generator())


@app.post("/api/ai/analyze")
def analyze_live_data(payload: AIAnalysisRequest) -> dict:
    result = build_ai_analysis(payload.question, payload.snapshot)
    return {
        "question": payload.question,
        "result": result,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }