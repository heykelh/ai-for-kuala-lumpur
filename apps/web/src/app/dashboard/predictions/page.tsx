export default function PredictionsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="glass-card soft-glow rounded-[30px] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/90">
          ML layer
        </p>
        <h1 className="heading-font mt-2 text-3xl font-bold text-white">
          Predictions
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          This page will contain congestion forecasting, anomaly detection,
          district-level risk prediction, and future short-term operational
          scenarios.
        </p>
      </div>
    </div>
  );
}