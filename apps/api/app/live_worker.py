from __future__ import annotations

import json
import os
import random
import time
from datetime import datetime, timezone

import redis
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
LIVE_SNAPSHOT_KEY = "ai_kl:latest_snapshot"
TICK_SECONDS = float(os.getenv("LIVE_TICK_SECONDS", "2"))

DISTRICTS = [
    "KLCC",
    "Bukit Bintang",
    "Bangsar",
    "Mont Kiara",
    "Petaling Jaya",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def build_random_snapshot() -> dict:
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
        "producer": "render_live_worker",
    }


def main() -> None:
    client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

    while True:
        snapshot = build_random_snapshot()
        client.set(LIVE_SNAPSHOT_KEY, json.dumps(snapshot, ensure_ascii=False))
        print(f"[live_worker] pushed snapshot for {snapshot['district']} at {snapshot['timestamp']}", flush=True)
        time.sleep(TICK_SECONDS)


if __name__ == "__main__":
    main()