from datetime import datetime
import json
import random
from pathlib import Path
import subprocess
import sys

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
    traffic_index = random.randint(45, 95)
    aqi = random.randint(35, 120)

    payload = {
        "timestamp": datetime.utcnow().isoformat(),
        "district": random.choice(DISTRICTS),
        "traffic_index": traffic_index,
        "congestion_level": (
            "heavy" if traffic_index >= 80 else
            "moderate" if traffic_index >= 60 else
            "fluid"
        ),
        "aqi": aqi,
        "air_quality_status": (
            "unhealthy" if aqi >= 101 else
            "moderate" if aqi >= 51 else
            "good"
        ),
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


def load_raw_into_duckdb():
    script_path = Path("/opt/warehouse/duckdb/load_raw_city_signals.py")

    if not script_path.exists():
        raise FileNotFoundError(f"Could not find DuckDB load script: {script_path}")

    result = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True,
        text=True,
        check=True,
    )

    print(result.stdout)
    if result.stderr:
        print(result.stderr)


def run_dbt():
    dbt_project_dir = Path("/opt/warehouse/dbt")
    profiles_dir = Path("/opt/warehouse/dbt")

    if not dbt_project_dir.exists():
        raise FileNotFoundError(f"dbt project directory not found: {dbt_project_dir}")

    debug_result = subprocess.run(
        ["dbt", "debug", "--profiles-dir", str(profiles_dir)],
        cwd=str(dbt_project_dir),
        capture_output=True,
        text=True,
        check=True,
    )
    print(debug_result.stdout)
    if debug_result.stderr:
        print(debug_result.stderr)

    run_result = subprocess.run(
        ["dbt", "run", "--profiles-dir", str(profiles_dir)],
        cwd=str(dbt_project_dir),
        capture_output=True,
        text=True,
        check=True,
    )
    print(run_result.stdout)
    if run_result.stderr:
        print(run_result.stderr)


with DAG(
    dag_id="city_warehouse_pipeline",
    start_date=datetime(2026, 3, 14),
    schedule="*/5 * * * *",
    catchup=False,
    tags=["ai-kl", "warehouse", "dbt", "duckdb"],
) as dag:
    generate_raw = PythonOperator(
        task_id="generate_raw_city_signal_file",
        python_callable=generate_city_signal_file,
    )

    load_duckdb = PythonOperator(
        task_id="load_raw_into_duckdb",
        python_callable=load_raw_into_duckdb,
    )

    transform_dbt = PythonOperator(
        task_id="run_dbt_models",
        python_callable=run_dbt,
    )

    generate_raw >> load_duckdb >> transform_dbt