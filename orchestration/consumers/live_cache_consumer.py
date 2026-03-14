import json

from kafka import KafkaConsumer
from redis import Redis

TOPIC = "city_live_events"
BOOTSTRAP_SERVERS = "localhost:9092"
REDIS_KEY_LATEST = "ai_kl:latest_snapshot"


def main():
    consumer = KafkaConsumer(
        TOPIC,
        bootstrap_servers=BOOTSTRAP_SERVERS,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        group_id="ai-kl-live-cache-consumer",
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
    )

    redis_client = Redis(host="localhost", port=6379, decode_responses=True)

    print("Consumer started. Writing latest event to Redis...")
    for message in consumer:
        payload = message.value
        redis_client.set(REDIS_KEY_LATEST, json.dumps(payload))
        print(f"Cached latest snapshot: {payload}")


if __name__ == "__main__":
    main()