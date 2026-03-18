"use client";

import { useMemo, useState } from "react";

type Language = "en" | "fr";

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

type CopilotResponse = {
  question: string;
  analysis: {
    answer: string;
    severity?: string;
    highlights?: string[];
    recommended_action?: string;
    intent?: string;
    retrieval?: {
      governance_context?: Array<{
        id?: string;
        title: string;
        content: string;
      }>;
      warehouse_context?: {
        high_risk_districts?: string[];
        medium_risk_districts?: string[];
        top_traffic_districts?: Array<{
          district: string;
          avg_traffic_index: number;
        }>;
        top_aqi_districts?: Array<{
          district: string;
          avg_aqi: number;
        }>;
      };
      warehouse_status?: {
        status?: string;
        last_success_at?: string | null;
      };
    };
  };
  timestamp: string;
};

type ChatMessage =
  | {
      id: string;
      role: "user";
      content: string;
    }
  | {
      id: string;
      role: "assistant";
      content: string;
      severity?: string;
      intent?: string;
      highlights?: string[];
      recommendedAction?: string;
    };

const API_BASE_URL = "http://localhost:8000";

const uiText = {
  en: {
    sectionTag: "AI copilot",
    title: "Chat analyst",
    subtitle:
      "Ask questions about live city operations, warehouse analytics, governance, or architecture.",
    placeholder:
      "Ask something like: How do live data and warehouse analytics differ?",
    send: "Send",
    sending: "Thinking...",
    quickPrompts: [
      "Give me a live situation summary.",
      "How do live data and warehouse analytics differ?",
      "Which district looks most sensitive and why?",
      "What should an operations manager watch first?",
    ],
    highlights: "Highlights",
    recommendedAction: "Recommended action",
    severityHigh: "High severity",
    severityMedium: "Medium severity",
    severityLow: "Low severity",
    intentOperational: "Operational",
    intentAnalytical: "Analytical",
    intentExplanatory: "Explanatory",
    intentOut: "Out of scope",
    emptyState:
      "Start the conversation with the copilot. The assistant uses live signals, warehouse analytics, and governance context.",
  },
  fr: {
    sectionTag: "AI copilot",
    title: "Chat analyste",
    subtitle:
      "Pose des questions sur les opérations live de la ville, les analytics warehouse, la gouvernance ou l’architecture.",
    placeholder:
      "Pose une question du style : Quelle est la différence entre live data et warehouse analytics ?",
    send: "Envoyer",
    sending: "Réflexion...",
    quickPrompts: [
      "Fais-moi un résumé de la situation live.",
      "Quelle est la différence entre live data et warehouse analytics ?",
      "Quel district semble le plus sensible et pourquoi ?",
      "Que doit surveiller en priorité un operations manager ?",
    ],
    highlights: "Points clés",
    recommendedAction: "Action recommandée",
    severityHigh: "Sévérité élevée",
    severityMedium: "Sévérité moyenne",
    severityLow: "Sévérité faible",
    intentOperational: "Opérationnel",
    intentAnalytical: "Analytique",
    intentExplanatory: "Explicatif",
    intentOut: "Hors périmètre",
    emptyState:
      "Commence la conversation avec le copilot. L’assistant utilise les signaux live, les analytics warehouse et le contexte de gouvernance.",
  },
};

function severityBadgeClass(severity?: string) {
  if (severity === "high") {
    return "border-red-400/20 bg-red-500/10 text-red-200";
  }
  if (severity === "medium") {
    return "border-amber-400/20 bg-amber-500/10 text-amber-200";
  }
  return "border-emerald-400/20 bg-emerald-500/10 text-emerald-200";
}

function intentBadgeClass(intent?: string) {
  if (intent === "operational") {
    return "border-cyan-400/20 bg-cyan-500/10 text-cyan-200";
  }
  if (intent === "analytical") {
    return "border-violet-400/20 bg-violet-500/10 text-violet-200";
  }
  if (intent === "explanatory") {
    return "border-blue-400/20 bg-blue-500/10 text-blue-200";
  }
  return "border-slate-400/20 bg-slate-500/10 text-slate-200";
}

function renderIntentLabel(intent: string | undefined, language: Language) {
  const t = uiText[language];
  if (intent === "operational") return t.intentOperational;
  if (intent === "analytical") return t.intentAnalytical;
  if (intent === "explanatory") return t.intentExplanatory;
  return t.intentOut;
}

function renderSeverityLabel(severity: string | undefined, language: Language) {
  const t = uiText[language];
  if (severity === "high") return t.severityHigh;
  if (severity === "medium") return t.severityMedium;
  return t.severityLow;
}

export default function AICopilotPanel({
  snapshot,
  language = "en",
}: {
  snapshot: LiveSnapshot | undefined;
  language?: Language;
}) {
  const t = uiText[language];
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts = useMemo(() => t.quickPrompts, [t]);

  async function runAnalysis(userQuestion: string) {
    if (!userQuestion.trim()) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: userQuestion.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/copilot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion.trim(),
          snapshot,
        }),
      });

      if (!res.ok) {
        throw new Error("AI copilot request failed.");
      }

      const json: CopilotResponse = await res.json();

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: json.analysis.answer,
        severity: json.analysis.severity,
        intent: json.analysis.intent,
        highlights: json.analysis.highlights ?? [],
        recommendedAction: json.analysis.recommended_action,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown AI error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-card soft-glow rounded-[30px] p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
          {t.sectionTag}
        </p>
        <h2 className="heading-font mt-2 text-xl font-semibold text-white">
          {t.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{t.subtitle}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {quickPrompts.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => runAnalysis(item)}
            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08]"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="rounded-[28px] border border-white/8 bg-[#08111b]/90">
        <div className="max-h-[560px] min-h-[320px] space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-slate-300">
              {t.emptyState}
            </div>
          )}

          {messages.map((message) => {
            if (message.role === "user") {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-[24px] bg-cyan-400 px-4 py-3 text-sm leading-6 text-slate-950">
                    {message.content}
                  </div>
                </div>
              );
            }

            return (
              <div key={message.id} className="flex justify-start">
                <div className="max-w-[90%] rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4 text-white">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${severityBadgeClass(
                        message.severity
                      )}`}
                    >
                      {renderSeverityLabel(message.severity, language)}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-medium ${intentBadgeClass(
                        message.intent
                      )}`}
                    >
                      {renderIntentLabel(message.intent, language)}
                    </span>
                  </div>

                  <div className="whitespace-pre-wrap text-sm leading-7 text-white">
                    {message.content}
                  </div>

                  {message.highlights && message.highlights.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                        {t.highlights}
                      </p>
                      <div className="space-y-2">
                        {message.highlights.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/8 bg-white/[0.04] px-3 py-2 text-sm text-slate-200"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {message.recommendedAction && (
                    <div className="mt-4 rounded-2xl border border-cyan-400/15 bg-cyan-500/8 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">
                        {t.recommendedAction}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white">
                        {message.recommendedAction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-4 text-sm text-slate-300">
                {t.sending}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/8 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && question.trim()) {
                  runAnalysis(question);
                }
              }}
              placeholder={t.placeholder}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0b1623] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => runAnalysis(question)}
              disabled={loading || !question.trim()}
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t.sending : t.send}
            </button>
          </div>

          {error && (
            <div className="mt-3 rounded-[18px] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}