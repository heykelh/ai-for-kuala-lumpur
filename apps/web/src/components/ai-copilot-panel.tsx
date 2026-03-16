"use client";

import { useState } from "react";

type LiveSnapshot = {
  timestamp?: string;
  district: string;
  traffic_index: number;
  congestion_level?: string;
  aqi: number;
  air_quality_status?: string;
  temperature_c: number;
  humidity_pct: number;
  transit_delay_min: number;
  source?: string;
};

const API_BASE_URL = "http://localhost:8000";

const suggestedQuestions = [
  "Give me a live situation summary.",
  "Analyze the current traffic conditions.",
  "Analyze the air quality situation.",
  "What is your recommended action right now?",
];

type CopilotResponse = {
  question: string;
  analysis: {
    answer: string;
    severity?: string;
    highlights?: string[];
    recommended_action?: string;
  };
  timestamp: string;
};

function severityBadge(severity?: string) {
  if (severity === "high") {
    return "border-red-400/20 bg-red-500/10 text-red-200";
  }
  if (severity === "medium") {
    return "border-amber-400/20 bg-amber-500/10 text-amber-200";
  }
  return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
}

export default function AICopilotPanel({
  snapshot,
}: {
  snapshot: LiveSnapshot | undefined;
}) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CopilotResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runAnalysis(userQuestion: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/copilot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
          snapshot,
        }),
      });

      if (!res.ok) {
        throw new Error("AI copilot request failed.");
      }

      const json: CopilotResponse = await res.json();
      setResponse(json);
      setQuestion(userQuestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown AI error");
    } finally {
      setLoading(false);
    }
  }

  const analysis = response?.analysis;
  const severity = analysis?.severity ?? "low";
  const highlights = analysis?.highlights ?? [];
  const recommendedAction =
    analysis?.recommended_action ?? "No recommended action returned.";

  return (
    <div className="glass-card soft-glow rounded-[30px] p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
          AI copilot
        </p>
        <h2 className="heading-font mt-2 text-xl font-semibold text-white">
          Live operations analyst
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Ask the AI copilot to interpret the current live snapshot and the
          warehouse analytics to produce an operational assessment.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((item) => (
          <button
            key={item}
            onClick={() => runAnalysis(item)}
            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
        <label className="mb-2 block text-sm text-slate-400">
          Custom question
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Analyze the current city risks and recommend an action."
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0b1623] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button
            onClick={() => runAnalysis(question)}
            disabled={loading || !question.trim()}
            className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Run analysis"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-[22px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {analysis && (
        <div className="mt-5 space-y-4">
          <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">AI answer</p>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${severityBadge(
                  severity
                )}`}
              >
                {severity} severity
              </span>
            </div>
            <div className="whitespace-pre-wrap text-base leading-7 text-white">
              {analysis.answer}
            </div>
          </div>

          {highlights.length > 0 && (
            <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
              <p className="mb-3 text-sm text-slate-400">Highlights</p>
              <div className="space-y-2">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[24px] border border-cyan-400/15 bg-cyan-500/8 p-5">
            <p className="text-sm text-cyan-200">Recommended action</p>
            <p className="mt-2 text-base leading-7 text-white">
              {recommendedAction}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}