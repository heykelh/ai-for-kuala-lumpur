from datetime import datetime

from airflow import DAG
from airflow.operators.trigger_dagrun import TriggerDagRunOperator

with DAG(
    dag_id="city_data_platform_orchestrator",
    start_date=datetime(2026, 3, 14),
    schedule="*/10 * * * *",
    catchup=False,
    tags=["ai-kl", "platform", "orchestrator"],
) as dag:
    trigger_ingest_raw = TriggerDagRunOperator(
        task_id="trigger_ingest_city_signals_to_raw",
        trigger_dag_id="ingest_city_signals_to_raw",
        wait_for_completion=True,
        poke_interval=10,
    )

    trigger_upload_minio = TriggerDagRunOperator(
        task_id="trigger_upload_city_signals_to_minio",
        trigger_dag_id="upload_city_signals_to_minio",
        wait_for_completion=True,
        poke_interval=10,
    )

    trigger_warehouse_pipeline = TriggerDagRunOperator(
        task_id="trigger_city_warehouse_pipeline",
        trigger_dag_id="city_warehouse_pipeline",
        wait_for_completion=True,
        poke_interval=10,
    )

    trigger_ingest_raw >> trigger_upload_minio >> trigger_warehouse_pipeline