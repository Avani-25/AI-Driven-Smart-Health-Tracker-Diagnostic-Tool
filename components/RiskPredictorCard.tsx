import React, { useState, useEffect } from "react";
import { UserProfile, HealthMetrics, HealthConditionRisk, AIAnalysisResult } from "../types";
import { calculateClientRisks } from "../mockData";
import { ShieldAlert, Cpu, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

interface RiskPredictorCardProps {
  profile: UserProfile;
  latestMetrics: HealthMetrics | null;
  history: HealthMetrics[];
  onAnalysisResult: (result: AIAnalysisResult) => void;
  currentAiResult: AIAnalysisResult | null;
}

const CLINICAL_LOADING_STEPS = [
  "Parsing systolic and diastolic pulse curves...",
  "Correlating fasting glucose index with calculated BMI...",
  "Querying parental hereditary predispositions...",
  "Running multi-variate risk regression models...",
  "Synthesizing customized cardiopulmonary recommendations...",
  "Reviewing guidelines for medical safety disclaimers...",
];

export default function RiskPredictorCard({
  profile,
  latestMetrics,
  history,
  onAnalysisResult,
  currentAiResult,
}: RiskPredictorCardProps) {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Rotate loading text for high-fidelity clinical simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % CLINICAL_LOADING_STEPS.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!latestMetrics) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-center text-center text-slate-400 gap-2 h-48">
        <AlertCircle className="h-8 w-8 text-slate-300" />
        <p className="text-sm font-semibold">Awaiting Metrics Log</p>
        <p className="text-xs max-w-xs">Please log your first vital metrics reading to calculate real-time risks.</p>
      </div>
    );
  }

  // Calculate instant client-side prediction scores
  const clientRisks = calculateClientRisks(profile, latestMetrics);

  const handleRunAiAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          metrics: latestMetrics,
          history: history.slice(-5), // send last 5 historical records
        }),
      });

      if (!response.ok) {
        throw new Error("The AI backend is currently warming up or encountered an error. Please try again.");
      }

      const data = await response.json();
      onAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to run AI clinical evaluation.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: "Low" | "Medium" | "High") => {
    switch (level) {
      case "High":
        return {
          bar: "bg-rose-500",
          bg: "bg-rose-50 border-rose-100",
          text: "text-rose-700",
          badge: "bg-rose-500 text-white",
        };
      case "Medium":
        return {
          bar: "bg-amber-500",
          bg: "bg-amber-50 border-amber-100",
          text: "text-amber-700",
          badge: "bg-amber-500 text-white",
        };
      case "Low":
        return {
          bar: "bg-emerald-500",
          bg: "bg-emerald-50 border-emerald-100",
          text: "text-emerald-700",
          badge: "bg-emerald-500 text-white",
        };
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Risk Predictions Cards Grid */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-slate-500" /> Clinical Metric Predictions
            </h4>
            <p className="text-xs text-slate-500">Calculated via multi-factor statistical weight mapping</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
            Realtime Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clientRisks.map((risk) => {
            const styles = getRiskColor(risk.riskLevel);
            return (
              <div
                key={risk.conditionName}
                className={`p-4 rounded-2xl border bg-white ${styles.bg} transition-all duration-200 hover:scale-[1.01]`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h5 className="font-bold text-slate-800 text-xs leading-tight">{risk.conditionName}</h5>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${styles.badge}`}>
                    {risk.riskLevel}
                  </span>
                </div>

                <p className="text-[10.5px] text-slate-600 leading-relaxed mb-4 min-h-12">
                  {risk.explanation}
                </p>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-1">
                    <span>Statistical Score</span>
                    <span>{risk.confidenceScore}% confidence</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
                      style={{ width: `${risk.confidenceScore}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Deep Evaluation Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white relative overflow-hidden shadow-md">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {loading ? (
          <div className="flex flex-col items-center justify-center text-center py-6 min-h-40">
            <RefreshCw className="h-8 w-8 text-blue-400 animate-spin mb-3" />
            <h5 className="font-semibold text-xs mb-1 text-blue-200">Consulting Gemini Medical Model...</h5>
            <p className="text-[11px] text-slate-400 max-w-xs animate-pulse">
              {CLINICAL_LOADING_STEPS[loadingStep]}
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold text-blue-300 bg-blue-950/40 border border-blue-900/50 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Gemini AI Powered
              </span>
              <h4 className="text-base font-bold tracking-tight text-white">
                Deep Clinical Evaluation & Advice
              </h4>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                Unlock full generative reasoning. Send your profile and historical logs to Gemini to evaluate borderline validity, predict risk correlations, and receive clinical action plans.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-2">
              <button
                onClick={handleRunAiAnalysis}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <Cpu className="h-4 w-4" /> Run Deep AI Analysis
              </button>
              {currentAiResult && (
                <span className="text-[10px] text-emerald-400 font-semibold">
                  ✓ Analysis synchronized
                </span>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
