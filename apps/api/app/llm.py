import os
from openai import OpenAI

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "llama3-70b-8192")

client = None

if OPENAI_API_KEY:
    client = OpenAI(
        api_key=OPENAI_API_KEY,
        base_url=OPENAI_BASE_URL,
    )


def analyze_city_data(snapshot: dict | None, warehouse_risk: list | None, question: str):
    if client is None:
        return {
            "answer": "LLM not configured. Using fallback logic.",
            "severity": "low",
        }

    system_prompt = """
You are an AI urban operations analyst monitoring Kuala Lumpur.

Your job is to analyze:

1) Real-time city signals
2) Data warehouse analytics (dbt marts)

Provide:
- a clear explanation
- potential risk
- recommended action
- short summary
"""

    user_prompt = f"""
User question:
{question}

LIVE SNAPSHOT:
{snapshot}

WAREHOUSE ANALYTICS:
{warehouse_risk}

Respond with a concise analysis.
"""

    completion = client.chat.completions.create(
        model=OPENAI_MODEL,
        temperature=0.2,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )

    return {
        "answer": completion.choices[0].message.content
    }