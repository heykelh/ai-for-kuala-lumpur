# AI for Kuala Lumpur

AI for Kuala Lumpur is a real-time AI data platform that analyzes urban signals across Kuala Lumpur using modern data engineering, machine learning, and generative AI.

This project is designed as a portfolio-grade, production-inspired platform showing how a regional tech company or enterprise data team could monitor city operations, forecast trends, detect anomalies, and support decisions with an AI assistant.

## Core capabilities

- Live and near-real-time monitoring for traffic, air quality, weather, and transit
- Modern data platform with ingestion, transformation, and analytics layers
- Forecasting and anomaly detection
- GenAI assistant with guardrailed analytics answers
- Data quality and freshness monitoring
- Full-stack product experience with Next.js and FastAPI

## Tech stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- FastAPI
- Pydantic
- Uvicorn

### Data / AI
- Python
- Airflow
- dbt
- BigQuery or Snowflake
- Redis
- OpenAI API
- MLflow

## Monorepo structure

- `apps/web` — Next.js frontend
- `apps/api` — FastAPI backend
- `orchestration` — pipelines and workers
- `warehouse` — dbt models and tests
- `ml` — forecasting and anomaly detection
- `ai` — prompts and retrieval assets
- `infra` — Docker and deployment config
- `docs` — technical documentation

## Local development

### Frontend
```bash
cd apps/web
pnpm dev