"use client";

import { useLanguage } from "@/components/language-provider";

export default function StreamingPage() {
  const { language } = useLanguage();

  const t = {
    en: {
      eyebrow: "Data flow",
      title: "Streaming",
      text:
        "This page will explain the live ingestion path across producer, Redpanda/Kafka-style messaging, Redis serving cache, and FastAPI live endpoints.",
    },
    fr: {
      eyebrow: "Flux de données",
      title: "Streaming",
      text:
        "Cette page expliquera la chaîne d’ingestion live entre producer, messagerie de type Redpanda/Kafka, cache Redis de serving et endpoints live FastAPI.",
    },
  }[language];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="glass-card soft-glow rounded-[30px] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
          {t.eyebrow}
        </p>
        <h1 className="heading-font mt-2 text-3xl font-bold text-white">
          {t.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          {t.text}
        </p>
      </div>
    </div>
  );
}