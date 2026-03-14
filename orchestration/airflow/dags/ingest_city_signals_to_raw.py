from datetime import datetime
import json
import os
import random
from pathlib import Path

from airflow import DAG
from airflow.operators.python import PythonOperator

RAW_DIR = Path("/opt/airflow/data/raw/city_signals")
RAW_DIR.mkdir(parents=True, exist_ok=True)

DISTRICTS = [
    "KLCC",
    "Bukit Bintang",
    "Bangsar",
    "Mont Kiara",
    "Petaling Jaya",
]


def generate_city_signal_file():
    payload = {
        "timestamp": datetime.utcnow().isoformat(),
        "district": random.choice(DISTRICTS),
        "traffic_index": random.randint(45, 95),
        "aqi": random.randint(35, 120),
        "temperature_c": round(random.uniform(27.0, 34.0), 1),
        "humidity_pct": random.randint(60, 92),
        "transit_delay_min": random.randint(1, 12),
        "source": "airflow_batch_ingestion",
    }

    filename = f"city_signal_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.json"
    filepath = RAW_DIR / filename

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"Generated raw signal file: {filepath}")


with DAG(
    dag_id="ingest_city_signals_to_raw",
    start_date=datetime(2026, 3, 14),
    schedule="*/5 * * * *",
    catchup=False,
    tags=["ai-kl", "raw", "ingestion"],
) as dag:
    generate_raw_file = PythonOperator(
        task_id="generate_raw_city_signal_file",
        python_callable=generate_city_signal_file,
    )

    generate_raw_file