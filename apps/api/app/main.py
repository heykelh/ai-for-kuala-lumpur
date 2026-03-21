from __future__ import annotations

import json
import os
import random
from datetime import datetime, timezone
from typing import Any

import redis
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

from .warehouse_ops import read_warehouse_status, refresh_warehouse

load_dotenv()

app = FastAPI(title="AI for Kuala Lumpur API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
LIVE_SNAPSHOT_KEY = "ai_kl:latest_snapshot"
DEPLOYMENT_MODE = os.getenv("DEPLOYMENT_MODE", "local_realtime")
LIVE_GENERATION_ENABLED = (
    os.getenv("LIVE_GENERATION_ENABLED", "true").lower() == "true"
)

LLM_API_KEY = os.getenv("OPENAI_API_KEY", "")
LLM_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.groq.com/openai/v1")
LLM_MODEL = os.getenv("OPENAI_MODEL", "llama-3.1-8b-instant")

redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)

llm_client: OpenAI | None = None
if LLM_API_KEY:
    llm_client = OpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL)


class CopilotRequest(BaseModel):
    question: str
    snapshot: dict[str, Any] | None = None


DISTRICTS = [
    "KLCC",
    "Bukit Bintang",
    "Bangsar",
    "Mont Kiara",
    "Petaling Jaya",
]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def build_random_snapshot() -> dict[str, Any]:
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
        "producer": "api_live_generator",
    }


def save_snapshot(snapshot: dict[str, Any]) -> None:
    try:
        redis_client.set(LIVE_SNAPSHOT_KEY, json.dumps(snapshot, ensure_ascii=False))
    except Exception:
        pass


def get_latest_snapshot() -> dict[str, Any] | None:
    try:
        raw = redis_client.get(LIVE_SNAPSHOT_KEY)
    except Exception:
        return None

    if not raw:
        return None

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None
    
def is_redis_available() -> bool:
    try:
        return bool(redis_client.ping())
    except Exception:
        return False


def get_duckdb_path() -> str:
    return os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "..",
            "warehouse",
            "duckdb",
            "data",
            "ai_kl.duckdb",
        )
    )


def fetch_duckdb_rows(query: str) -> list[dict[str, Any]]:
    db_path = get_duckdb_path()

    if not os.path.exists(db_path):
        return []

    try:
        import duckdb

        conn = duckdb.connect(db_path)
        rows = conn.execute(query).fetchall()
        columns = [desc[0] for desc in conn.description]
        conn.close()

        result: list[dict[str, Any]] = []
        for row in rows:
            item = dict(zip(columns, row))
            for key, value in item.items():
                if value is not None and "timestamp" in key:
                    item[key] = str(value)
            result.append(item)
        return result
    except Exception:
        return []


def get_city_risk() -> list[dict[str, Any]]:
    return fetch_duckdb_rows(
        """
        select
          district,
          latest_timestamp,
          avg_traffic_index,
          avg_aqi,
          avg_temperature_c,
          avg_humidity_pct,
          avg_transit_delay_min,
          signal_count,
          city_risk_level
        from main.mart_city_risk
        order by district
        """
    )


def get_city_latest() -> list[dict[str, Any]]:
    return fetch_duckdb_rows(
        """
        select *
        from main.mart_city_latest
        order by district
        """
    )


def build_live_alerts(
    snapshot: dict[str, Any] | None, warehouse_risk: list[dict[str, Any]] | None
) -> list[dict[str, Any]]:
    alerts: list[dict[str, Any]] = []

    if snapshot:
        district = snapshot.get("district", "Unknown")
        traffic_index = snapshot.get("traffic_index", 0)
        aqi = snapshot.get("aqi", 0)
        transit_delay_min = snapshot.get("transit_delay_min", 0)
        temperature_c = snapshot.get("temperature_c", 0)

        if traffic_index >= 80:
            alerts.append(
                {
                    "type": "traffic",
                    "severity": "high",
                    "message_en": f"Heavy road congestion detected in {district}.",
                    "message_fr": f"Forte congestion routière détectée à {district}.",
                    "timestamp": now_iso(),
                }
            )
        elif traffic_index >= 60:
            alerts.append(
                {
                    "type": "traffic",
                    "severity": "medium",
                    "message_en": f"Traffic pressure is rising in {district}.",
                    "message_fr": f"La pression du trafic augmente à {district}.",
                    "timestamp": now_iso(),
                }
            )

        if aqi >= 101:
            alerts.append(
                {
                    "type": "air",
                    "severity": "high",
                    "message_en": f"Air quality is unhealthy in {district}.",
                    "message_fr": f"La qualité de l’air est mauvaise à {district}.",
                    "timestamp": now_iso(),
                }
            )
        elif aqi >= 51:
            alerts.append(
                {
                    "type": "air",
                    "severity": "medium",
                    "message_en": f"Air quality is moderately degraded in {district}.",
                    "message_fr": f"La qualité de l’air est modérément dégradée à {district}.",
                    "timestamp": now_iso(),
                }
            )

        if transit_delay_min >= 10:
            alerts.append(
                {
                    "type": "transit",
                    "severity": "high",
                    "message_en": f"Significant transit disruption detected ({transit_delay_min} min delay).",
                    "message_fr": f"Perturbation importante des transports détectée ({transit_delay_min} min de retard).",
                    "timestamp": now_iso(),
                }
            )
        elif transit_delay_min >= 5:
            alerts.append(
                {
                    "type": "transit",
                    "severity": "medium",
                    "message_en": f"Transit delays are noticeable ({transit_delay_min} min).",
                    "message_fr": f"Les retards de transport deviennent visibles ({transit_delay_min} min).",
                    "timestamp": now_iso(),
                }
            )

        if temperature_c >= 33:
            alerts.append(
                {
                    "type": "weather",
                    "severity": "medium",
                    "message_en": f"Urban heat is elevated in {district}.",
                    "message_fr": f"La chaleur urbaine est élevée à {district}.",
                    "timestamp": now_iso(),
                }
            )

    if warehouse_risk:
        for row in warehouse_risk:
            risk = str(row.get("city_risk_level", "low")).lower()
            district = row.get("district", "Unknown")
            if risk == "high":
                alerts.append(
                    {
                        "type": "warehouse",
                        "severity": "high",
                        "message_en": f"Warehouse analytics classify {district} as high risk.",
                        "message_fr": f"Les analytics du warehouse classent {district} en risque élevé.",
                        "timestamp": now_iso(),
                    }
                )
            elif risk == "medium":
                alerts.append(
                    {
                        "type": "warehouse",
                        "severity": "medium",
                        "message_en": f"Warehouse analytics classify {district} as medium risk.",
                        "message_fr": f"Les analytics du warehouse classent {district} en risque moyen.",
                        "timestamp": now_iso(),
                    }
                )

    if not alerts:
        alerts.append(
            {
                "type": "system",
                "severity": "low",
                "message_en": "No major operational alert detected.",
                "message_fr": "Aucune alerte opérationnelle majeure détectée.",
                "timestamp": now_iso(),
            }
        )

    severity_rank = {"high": 0, "medium": 1, "low": 2}
    alerts.sort(key=lambda x: severity_rank.get(x["severity"], 3))
    return alerts


def governance_knowledge_base() -> list[dict[str, str]]:
    return [
        {
            "id": "gov_1",
            "title": "Live versus warehouse separation",
            "content": (
                "Live data serves immediate monitoring through Redis and FastAPI. "
                "Warehouse analytics serve stable, transformed, historical reasoning through DuckDB and dbt marts."
            ),
        },
        {
            "id": "gov_2",
            "title": "Data quality principle",
            "content": (
                "Raw signals should be validated before being promoted into curated analytics. "
                "Typical checks include allowed district values, non-negative transit delays, and acceptable AQI ranges."
            ),
        },
        {
            "id": "gov_3",
            "title": "Lineage principle",
            "content": (
                "The main lineage is producer to consumer to Redis to API to dashboard for live serving, "
                "and raw signals to DuckDB to dbt to marts to analytics pages for warehouse intelligence."
            ),
        },
        {
            "id": "gov_4",
            "title": "AI governance principle",
            "content": (
                "The AI copilot should answer from grounded project data: live metrics, warehouse marts, "
                "and documented governance logic, not unsupported intuition."
            ),
        },
        {
            "id": "gov_5",
            "title": "Deployment mode principle",
            "content": (
                "The platform supports a local real-time engineering mode with producer and consumer, "
                "and a public demo mode compatible with Vercel using API-generated live snapshots."
            ),
        },
    ]


def score_text_against_question(text: str, question: str) -> int:
    question_terms = [term.strip(" ,.?;:!").lower() for term in question.split()]
    text_lower = text.lower()
    score = 0
    for term in question_terms:
        if len(term) < 3:
            continue
        if term in text_lower:
            score += 1
    return score


def retrieve_governance_context(question: str, limit: int = 3) -> list[dict[str, str]]:
    docs = governance_knowledge_base()
    ranked = sorted(
        docs,
        key=lambda doc: score_text_against_question(
            f"{doc['title']} {doc['content']}", question
        ),
        reverse=True,
    )
    top = [
        doc
        for doc in ranked
        if score_text_against_question(f"{doc['title']} {doc['content']}", question) > 0
    ]
    return top[:limit] if top else docs[:limit]


def format_warehouse_context(
    warehouse_risk: list[dict[str, Any]],
    warehouse_latest: list[dict[str, Any]],
) -> dict[str, Any]:
    high_risk_districts = [
        row["district"]
        for row in warehouse_risk
        if str(row.get("city_risk_level", "")).lower() == "high"
    ]
    medium_risk_districts = [
        row["district"]
        for row in warehouse_risk
        if str(row.get("city_risk_level", "")).lower() == "medium"
    ]

    top_traffic = sorted(
        warehouse_risk,
        key=lambda row: float(row.get("avg_traffic_index") or 0),
        reverse=True,
    )[:3]

    top_aqi = sorted(
        warehouse_risk,
        key=lambda row: float(row.get("avg_aqi") or 0),
        reverse=True,
    )[:3]

    return {
        "high_risk_districts": high_risk_districts,
        "medium_risk_districts": medium_risk_districts,
        "top_traffic_districts": [
            {
                "district": row.get("district"),
                "avg_traffic_index": row.get("avg_traffic_index"),
            }
            for row in top_traffic
        ],
        "top_aqi_districts": [
            {
                "district": row.get("district"),
                "avg_aqi": row.get("avg_aqi"),
            }
            for row in top_aqi
        ],
        "latest_rows": warehouse_latest[:5],
    }


def fallback_rule_based_intent(question: str) -> str:
    q = question.lower().strip()

    explanatory_keywords = [
        "difference",
        "differ",
        "explain",
        "what is",
        "why",
        "how does",
        "how do",
        "architecture",
        "governance",
        "lineage",
        "dbt",
        "redis",
        "duckdb",
        "fastapi",
        "producer",
        "consumer",
        "streaming",
        "warehouse analytics",
        "live data",
        "warehouse",
        "analytics differ",
    ]

    analytical_keywords = [
        "trend",
        "analytics",
        "mart",
        "marts",
        "highest",
        "compare",
        "comparison",
        "sensitive",
        "most sensitive",
        "average",
        "historical",
        "which district",
        "top",
    ]

    operational_keywords = [
        "current",
        "right now",
        "risk",
        "risks",
        "alert",
        "alerts",
        "action",
        "situation",
        "traffic",
        "aqi",
        "air quality",
        "temperature",
        "humidity",
        "delay",
        "delays",
        "district",
        "monitor",
        "urgent",
        "operational",
    ]

    out_of_scope_keywords = [
        "football",
        "soccer",
        "champions league",
        "movie",
        "cinema",
        "recipe",
        "cooking",
        "love",
        "dating",
        "astrology",
        "bitcoin price",
        "stock market",
        "medical diagnosis",
        "legal advice",
        "tax return",
        "president",
        "election",
        "war",
    ]

    if any(keyword in q for keyword in out_of_scope_keywords):
        return "out_of_scope"
    if any(keyword in q for keyword in explanatory_keywords):
        return "explanatory"
    if any(keyword in q for keyword in analytical_keywords):
        return "analytical"
    if any(keyword in q for keyword in operational_keywords):
        return "operational"

    in_scope_terms = [
        "live",
        "warehouse",
        "analytics",
        "traffic",
        "aqi",
        "district",
        "redis",
        "duckdb",
        "dbt",
        "fastapi",
        "streaming",
        "governance",
        "copilot",
        "kuala lumpur",
    ]

    if any(term in q for term in in_scope_terms):
        return "explanatory"

    if len(q.split()) >= 4:
        return "explanatory"

    return "out_of_scope"


def classify_question_intent(question: str) -> str:
    allowed = {"operational", "analytical", "explanatory", "out_of_scope"}

    if llm_client is None:
        return fallback_rule_based_intent(question)

    system_prompt = (
        "You are an intent classifier for a specialized copilot called AI for Kuala Lumpur.\n"
        "Classify the user's question into exactly one of these labels:\n"
        "- operational: current live city conditions, risks, alerts, actions, traffic, AQI, transport, weather\n"
        "- analytical: warehouse analytics, comparisons, averages, sensitive districts, trends, marts\n"
        "- explanatory: architecture, governance, lineage, differences between systems, project design, technical explanations\n"
        "- out_of_scope: general questions unrelated to the project domain\n\n"
        "Return only one label, nothing else."
    )

    try:
        completion = llm_client.chat.completions.create(
            model=LLM_MODEL,
            temperature=0,
            max_tokens=8,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question},
            ],
        )
        label = (completion.choices[0].message.content or "").strip().lower()
        label = label.replace("-", "_").replace(" ", "_")
        if label in allowed:
            return label
        return fallback_rule_based_intent(question)
    except Exception:
        return fallback_rule_based_intent(question)


def build_severity_and_highlights(
    snapshot: dict[str, Any] | None,
    warehouse_context: dict[str, Any],
    warehouse_status: dict[str, Any],
) -> tuple[str, list[str], str]:
    severity = "low"
    highlights: list[str] = []
    recommended_action = "Maintain normal monitoring and continue collecting signals."

    if snapshot:
        if snapshot.get("traffic_index", 0) >= 80:
            severity = "high"
            highlights.append("Traffic congestion is currently heavy.")
        elif snapshot.get("traffic_index", 0) >= 60:
            severity = "medium"
            highlights.append("Traffic pressure is elevated.")

        if snapshot.get("aqi", 0) >= 101:
            severity = "high"
            highlights.append("Air quality is unhealthy.")
        elif snapshot.get("aqi", 0) >= 51:
            if severity != "high":
                severity = "medium"
            highlights.append("Air quality is moderately degraded.")

        if snapshot.get("transit_delay_min", 0) >= 10:
            severity = "high"
            highlights.append("Transit disruption is significant.")
        elif snapshot.get("transit_delay_min", 0) >= 5:
            if severity != "high":
                severity = "medium"
            highlights.append("Transit delays are noticeable.")

    if warehouse_context["high_risk_districts"]:
        severity = "high"
        highlights.append(
            f"Warehouse analytics flag high-risk districts: {', '.join(warehouse_context['high_risk_districts'])}."
        )
    elif warehouse_context["medium_risk_districts"] and severity == "low":
        severity = "medium"
        highlights.append(
            f"Warehouse analytics flag medium-risk districts: {', '.join(warehouse_context['medium_risk_districts'])}."
        )

    if warehouse_status.get("status") != "ok":
        if severity == "low":
            severity = "medium"
        highlights.append(
            "Warehouse status is not fully healthy, so analytics freshness should be checked."
        )

    if severity == "high":
        recommended_action = (
            "Escalate monitoring, focus on the most affected district, "
            "and cross-check live signals with warehouse risk indicators."
        )
    elif severity == "medium":
        recommended_action = (
            "Increase monitoring frequency and prepare targeted operational interventions."
        )

    return severity, highlights, recommended_action


def build_operational_answer(
    snapshot: dict[str, Any] | None,
    warehouse_context: dict[str, Any],
    governance_context: list[dict[str, str]],
    warehouse_status: dict[str, Any],
) -> tuple[str, str, list[str], str]:
    severity, highlights, recommended_action = build_severity_and_highlights(
        snapshot, warehouse_context, warehouse_status
    )

    sections: list[str] = []
    sections.append("**Situation Summary**")
    if snapshot:
        sections.append(
            f"- Current district: {snapshot.get('district', '--')}\n"
            f"- Traffic index: {snapshot.get('traffic_index', '--')} ({snapshot.get('congestion_level', '--')})\n"
            f"- AQI: {snapshot.get('aqi', '--')} ({snapshot.get('air_quality_status', '--')})\n"
            f"- Temperature: {snapshot.get('temperature_c', '--')}°C\n"
            f"- Humidity: {snapshot.get('humidity_pct', '--')}%\n"
            f"- Transit delay: {snapshot.get('transit_delay_min', '--')} min"
        )
    else:
        sections.append("- No live snapshot is currently available.")

    if highlights:
        sections.append("\n**Main Findings**")
        sections.extend([f"- {item}" for item in highlights])

    sections.append("\n**Warehouse Analytics Context**")
    if warehouse_context["top_traffic_districts"]:
        traffic_text = ", ".join(
            f"{item['district']} ({item['avg_traffic_index']})"
            for item in warehouse_context["top_traffic_districts"]
        )
        sections.append(f"- Highest average traffic districts: {traffic_text}")
    if warehouse_context["top_aqi_districts"]:
        aqi_text = ", ".join(
            f"{item['district']} ({item['avg_aqi']})"
            for item in warehouse_context["top_aqi_districts"]
        )
        sections.append(f"- Highest average AQI districts: {aqi_text}")

    sections.append("\n**Recommended Action**")
    sections.append(f"- {recommended_action}")

    if governance_context:
        sections.append("\n**Relevant Governance Context**")
        for item in governance_context:
            sections.append(f"- {item['title']}: {item['content']}")

    return "\n".join(sections), severity, highlights, recommended_action


def build_analytical_answer(
    snapshot: dict[str, Any] | None,
    warehouse_context: dict[str, Any],
    governance_context: list[dict[str, str]],
    warehouse_status: dict[str, Any],
) -> tuple[str, str, list[str], str]:
    severity, highlights, recommended_action = build_severity_and_highlights(
        snapshot, warehouse_context, warehouse_status
    )

    sections: list[str] = []
    sections.append("**Analytical View**")
    sections.append(
        "- Live data shows the most recent operational state.\n"
        "- Warehouse analytics show transformed, more stable indicators across districts."
    )

    if snapshot:
        sections.append(
            f"\n**Current Live Snapshot**\n"
            f"- District: {snapshot.get('district', '--')}\n"
            f"- Traffic: {snapshot.get('traffic_index', '--')}\n"
            f"- AQI: {snapshot.get('aqi', '--')}\n"
            f"- Transit delay: {snapshot.get('transit_delay_min', '--')} min"
        )

    sections.append("\n**Warehouse Evidence**")
    if warehouse_context["high_risk_districts"]:
        sections.append(
            f"- High-risk districts: {', '.join(warehouse_context['high_risk_districts'])}"
        )
    if warehouse_context["medium_risk_districts"]:
        sections.append(
            f"- Medium-risk districts: {', '.join(warehouse_context['medium_risk_districts'])}"
        )
    if warehouse_context["top_traffic_districts"]:
        sections.append(
            "- Top average traffic districts: "
            + ", ".join(
                f"{item['district']} ({item['avg_traffic_index']})"
                for item in warehouse_context["top_traffic_districts"]
            )
        )
    if warehouse_context["top_aqi_districts"]:
        sections.append(
            "- Top average AQI districts: "
            + ", ".join(
                f"{item['district']} ({item['avg_aqi']})"
                for item in warehouse_context["top_aqi_districts"]
            )
        )

    if governance_context:
        sections.append("\n**Interpretation Rules**")
        for item in governance_context:
            sections.append(f"- {item['title']}: {item['content']}")

    sections.append("\n**Recommended Action**")
    sections.append(f"- {recommended_action}")

    return "\n".join(sections), severity, highlights, recommended_action


def build_explanatory_answer(
    snapshot: dict[str, Any] | None,
    warehouse_context: dict[str, Any],
    governance_context: list[dict[str, str]],
    warehouse_status: dict[str, Any],
) -> tuple[str, str, list[str], str]:
    severity, highlights, recommended_action = build_severity_and_highlights(
        snapshot, warehouse_context, warehouse_status
    )

    sections: list[str] = []
    sections.append("**Conceptual Explanation**")
    sections.append(
        "- Live data is used for immediate operational monitoring.\n"
        "- Warehouse analytics are used for transformed, stable, historical or comparative reasoning."
    )

    sections.append("\n**In This Project**")
    sections.append(
        "- Live path: producer → consumer → Redis → FastAPI → dashboard.\n"
        "- Warehouse path: raw signals → DuckDB → dbt → marts → analytics pages."
    )

    sections.append("\n**Why They Differ**")
    sections.append(
        "- Live data is fresher and optimized for the current state.\n"
        "- Warehouse analytics are curated and better suited for trends, comparisons, and risk scoring."
    )

    if governance_context:
        sections.append("\n**Relevant Governance Context**")
        for item in governance_context:
            sections.append(f"- {item['title']}: {item['content']}")

    if snapshot:
        sections.append("\n**Current Example**")
        sections.append(
            f"- The live snapshot currently highlights {snapshot.get('district', '--')} with traffic {snapshot.get('traffic_index', '--')}, AQI {snapshot.get('aqi', '--')}, and transit delay {snapshot.get('transit_delay_min', '--')} min."
        )

    if warehouse_context["high_risk_districts"] or warehouse_context["medium_risk_districts"]:
        districts = (
            warehouse_context["high_risk_districts"]
            or warehouse_context["medium_risk_districts"]
        )
        sections.append(
            f"- The warehouse analytics currently flag these districts as more sensitive: {', '.join(districts)}."
        )

    sections.append("\n**Recommended Reading of the System**")
    sections.append(
        "- Use live data to know what is happening now.\n"
        "- Use warehouse analytics to understand what is systematically risky or historically important."
    )

    return "\n".join(sections), severity, highlights, recommended_action


def build_out_of_scope_answer(question: str) -> str:
    return (
        "**Out-of-Scope Question**\n"
        "This copilot is specialized for the AI for Kuala Lumpur platform.\n\n"
        "It can answer precisely about:\n"
        "- live city operations,\n"
        "- traffic, AQI, weather, humidity, and transit signals,\n"
        "- warehouse analytics,\n"
        "- data governance,\n"
        "- project architecture,\n"
        "- streaming, Redis, DuckDB, dbt, FastAPI, and dashboard logic.\n\n"
        f"Your question was: {question}\n\n"
        "I cannot answer it as a general-purpose assistant here, but I can help if you reframe it around the project."
    )


def build_rag_context_payload(
    question: str,
    snapshot: dict[str, Any] | None,
    warehouse_context: dict[str, Any],
    governance_context: list[dict[str, str]],
    warehouse_status: dict[str, Any],
    intent: str,
) -> dict[str, Any]:
    return {
        "question": question,
        "intent": intent,
        "snapshot": snapshot,
        "warehouse_context": warehouse_context,
        "governance_context": governance_context,
        "warehouse_status": {
            "status": warehouse_status.get("status"),
            "last_success_at": warehouse_status.get("last_success_at"),
        },
    }


def llm_generate_grounded_answer(
    question: str,
    intent: str,
    snapshot: dict[str, Any] | None,
    warehouse_context: dict[str, Any],
    governance_context: list[dict[str, str]],
    warehouse_status: dict[str, Any],
    fallback_answer: str,
) -> str:
    if llm_client is None:
        return fallback_answer

    rag_payload = build_rag_context_payload(
        question=question,
        snapshot=snapshot,
        warehouse_context=warehouse_context,
        governance_context=governance_context,
        warehouse_status=warehouse_status,
        intent=intent,
    )

    system_prompt = (
        "You are the AI Copilot for the 'AI for Kuala Lumpur' platform.\n"
        "You must answer using only the provided grounded context.\n"
        "Do not invent facts outside the provided context.\n"
        "Be precise, professional, and natural.\n"
        "If the question is explanatory, explain the architecture or data logic clearly.\n"
        "If the question is operational, focus on current risk and action.\n"
        "If the question is analytical, focus on warehouse evidence and comparison.\n"
        "If the question is out_of_scope, politely say the copilot is specialized for the project."
    )

    user_prompt = (
        f"Intent: {intent}\n\n"
        f"Grounded context:\n{json.dumps(rag_payload, ensure_ascii=False, indent=2)}\n\n"
        "Write a helpful answer in markdown.\n"
        "Keep it concise but strong.\n"
        "Do not mention that you are using JSON or a prompt.\n"
        "Do not invent unavailable metrics."
    )

    try:
        completion = llm_client.chat.completions.create(
            model=LLM_MODEL,
            temperature=0.2,
            max_tokens=500,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )
        answer = (completion.choices[0].message.content or "").strip()
        return answer or fallback_answer
    except Exception:
        return fallback_answer


def analyze_city_data_with_rag(
    question: str,
    snapshot: dict[str, Any] | None,
    warehouse_risk: list[dict[str, Any]],
    warehouse_latest: list[dict[str, Any]],
    warehouse_status: dict[str, Any],
) -> dict[str, Any]:
    intent = classify_question_intent(question)
    governance_context = retrieve_governance_context(question)
    warehouse_context = format_warehouse_context(warehouse_risk, warehouse_latest)

    if intent == "operational":
        fallback_answer, severity, highlights, recommended_action = build_operational_answer(
            snapshot,
            warehouse_context,
            governance_context,
            warehouse_status,
        )
    elif intent == "analytical":
        fallback_answer, severity, highlights, recommended_action = build_analytical_answer(
            snapshot,
            warehouse_context,
            governance_context,
            warehouse_status,
        )
    elif intent == "explanatory":
        fallback_answer, severity, highlights, recommended_action = build_explanatory_answer(
            snapshot,
            warehouse_context,
            governance_context,
            warehouse_status,
        )
    else:
        fallback_answer = build_out_of_scope_answer(question)
        severity = "low"
        highlights = ["Question detected as out of scope for the project copilot."]
        recommended_action = (
            "Ask a question related to live operations, analytics, governance, or project architecture."
        )

    answer = llm_generate_grounded_answer(
        question=question,
        intent=intent,
        snapshot=snapshot,
        warehouse_context=warehouse_context,
        governance_context=governance_context,
        warehouse_status=warehouse_status,
        fallback_answer=fallback_answer,
    )

    return {
        "answer": answer,
        "severity": severity,
        "highlights": highlights,
        "recommended_action": recommended_action,
        "intent": intent,
        "retrieval": {
            "governance_context": governance_context,
            "warehouse_context": warehouse_context,
            "warehouse_status": {
                "status": warehouse_status.get("status"),
                "last_success_at": warehouse_status.get("last_success_at"),
            },
        },
    }


@app.get("/health")
def health() -> dict[str, Any]:
    redis_connected = is_redis_available()

    return {
        "status": "ok",
        "service": "ai-for-kuala-lumpur-api",
        "redis_connected": redis_connected,
        "redis_url_configured": bool(REDIS_URL),
        "deployment_mode": DEPLOYMENT_MODE,
        "live_generation_enabled": LIVE_GENERATION_ENABLED,
        "llm_configured": llm_client is not None,
        "llm_model": LLM_MODEL,
        "timestamp": now_iso(),
    }


@app.get("/api/live")
def get_live() -> dict[str, Any]:
    snapshot = get_latest_snapshot()
    redis_available = is_redis_available()

    if snapshot is None:
        snapshot = build_random_snapshot()
        save_snapshot(snapshot)

    return {
        "city": "Kuala Lumpur",
        "mode": (
            "streaming-cache"
            if DEPLOYMENT_MODE == "local_realtime" and redis_available
            else "demo-generated"
        ),
        "snapshot": snapshot,
    }


@app.get("/api/live/stream")
def get_live_stream_fallback() -> dict[str, Any]:
    snapshot = get_latest_snapshot()
    redis_available = is_redis_available()

    if snapshot is None:
        snapshot = build_random_snapshot()
        save_snapshot(snapshot)

    return {
        "city": "Kuala Lumpur",
        "mode": (
            "streaming-cache"
            if DEPLOYMENT_MODE == "local_realtime" and redis_available
            else "demo-generated"
        ),
        "snapshot": snapshot,
    }


@app.post("/api/live/generate")
def generate_live_tick() -> dict[str, Any]:
    if not LIVE_GENERATION_ENABLED:
        raise HTTPException(status_code=403, detail="Live generation disabled.")

    snapshot = build_random_snapshot()
    save_snapshot(snapshot)

    return {
        "source": "api-live-generator",
        "deployment_mode": DEPLOYMENT_MODE,
        "snapshot": snapshot,
    }


@app.get("/api/alerts")
def get_alerts() -> dict[str, Any]:
    snapshot = get_latest_snapshot()
    warehouse_risk = get_city_risk()
    return {
        "source": "live-and-warehouse",
        "data": build_live_alerts(snapshot, warehouse_risk),
    }


@app.get("/api/warehouse/risk")
def warehouse_risk() -> dict[str, Any]:
    return {
        "source": "duckdb",
        "data": get_city_risk(),
    }


@app.get("/api/warehouse/latest")
def warehouse_latest() -> dict[str, Any]:
    return {
        "source": "duckdb",
        "data": get_city_latest(),
    }


@app.get("/api/warehouse/status")
def warehouse_status() -> dict[str, Any]:
    return {
        "source": "warehouse-status-file",
        "data": read_warehouse_status(),
    }


@app.post("/api/warehouse/refresh")
def warehouse_refresh() -> dict[str, Any]:
    result = refresh_warehouse()
    return {
        "source": "manual-refresh",
        "data": result,
    }


@app.get("/api/knowledge/governance")
def governance_context() -> dict[str, Any]:
    return {
        "source": "embedded-governance-kb",
        "data": governance_knowledge_base(),
    }


@app.post("/api/ai/copilot")
def ai_copilot(payload: CopilotRequest) -> dict[str, Any]:
    snapshot = payload.snapshot or get_latest_snapshot()
    warehouse_risk_data = get_city_risk()
    warehouse_latest_data = get_city_latest()
    warehouse_status_data = read_warehouse_status()

    result = analyze_city_data_with_rag(
        question=payload.question,
        snapshot=snapshot,
        warehouse_risk=warehouse_risk_data,
        warehouse_latest=warehouse_latest_data,
        warehouse_status=warehouse_status_data,
    )

    return {
        "question": payload.question,
        "analysis": result,
        "timestamp": now_iso(),
    }