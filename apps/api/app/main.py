from datetime import datetime, timezone
import asyncio
import json
import random
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

app = FastAPI(
    title="AI for Kuala Lumpur API",
    version="0.1.0",
    description="Real-time city intelligence API for Kuala Lumpur.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DISTRICTS = [
    "KLCC",
    "Bukit Bintang",
    "Bangsar",
    "Mont Kiara",
    "Petaling Jaya",
]


def generate_live_snapshot() -> dict:
    district = random.choice(DISTRICTS)

    traffic_index = random.randint(45, 95)
    aqi = random.randint(35, 120)
    temperature = round(random.uniform(27.0, 34.0), 1)
    humidity = random.randint(60, 92)
    transit_delay_min = random.randint(1, 12)

    congestion_level = (
        "high" if traffic_index >= 80 else
        "medium" if traffic_index >= 60 else
        "low"
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
    }


@app.get("/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": "ai-for-kuala-lumpur-api",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/live")
def get_live_data() -> dict:
    snapshot = generate_live_snapshot()
    return {
        "city": "Kuala Lumpur",
        "mode": "mock-realtime",
        "snapshot": snapshot,
    }


async def event_generator() -> AsyncGenerator[dict, None]:
    while True:
        snapshot = generate_live_snapshot()
        payload = {
            "city": "Kuala Lumpur",
            "mode": "mock-realtime",
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