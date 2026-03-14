from datetime import datetime
from pathlib import Path

from airflow import DAG
from airflow.operators.python import PythonOperator
from minio import Minio

RAW_DIR = Path("/opt/airflow/data/raw/city_signals")
BUCKET_NAME = "city-raw"


def upload_files_to_minio():
    client = Minio(
        "minio:9000",
        access_key="minioadmin",
        secret_key="minioadmin",
        secure=False,
    )

    if not client.bucket_exists(BUCKET_NAME):
        client.make_bucket(BUCKET_NAME)

    for file_path in RAW_DIR.glob("*.json"):
        object_name = f"city_signals/{file_path.name}"
        client.fput_object(BUCKET_NAME, object_name, str(file_path))
        print(f"Uploaded {file_path.name} to MinIO bucket {BUCKET_NAME} as {object_name}")


with DAG(
    dag_id="upload_city_signals_to_minio",
    start_date=datetime(2026, 3, 14),
    schedule="*/5 * * * *",
    catchup=False,
    tags=["ai-kl", "minio", "raw"],
) as dag:
    upload_task = PythonOperator(
        task_id="upload_raw_json_to_minio",
        python_callable=upload_files_to_minio,
    )

    upload_task