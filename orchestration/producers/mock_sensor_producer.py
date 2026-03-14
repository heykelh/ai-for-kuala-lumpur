import json
import random
import time
from datetime import datetime, timezone

from kafka import KafkaProducer

TOPIC = "city_live_events"
BOOTSTRAP_SERVERS = "localhost:9092"

DISTRICTS = [
    "KLCC",
    "Bukit Bintang",
    "Bangsar",
    "Mont Kiara",
    "Petaling Jaya",
]


def build_event() -> dict:
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
        "producer": "mock_sensor_producer",
    }


def main():
    producer = KafkaProducer(
        bootstrap_servers=BOOTSTRAP_SERVERS,
        value_serializer=lambda v: json.dumps(v).encode("utf-8"),
    )

    print("Producer started. Sending city events...")
    while True:
        payload = build_event()
        producer.send(TOPIC, payload)
        producer.flush()
        print(f"Sent event: {payload}")
        time.sleep(2)


if __name__ == "__main__":
    main()