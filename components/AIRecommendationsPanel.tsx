import React from "react";
import { AIAnalysisResult } from "../types";
import {
  Sparkles,
  AlertTriangle,
  Flame,
  Salad,
  Dumbbell,
  Moon,
  HeartHandshake,
  Stethoscope,
  Info,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface AIRecommendationsPanelProps {
  analysis: AIAnalysisResult | null;
}

export default function AIRecommendationsPanel({ analysis }: AIRecommendationsPanelProps) {
  if (!analysis) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-64 text-slate-400 gap-3 m-4">
        <div className="p-3 bg-white border border-slate-200 rounded-full text-blue-500 shadow-xs">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-700 text-sm">Deep AI Advice Awaiting Trigger</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Click the "Run Deep AI Analysis" button above to activate the Gemini generative reasoning models on your active profile and historical readings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Overall Summary Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">Gemini AI Synthesis Report</h4>
            <p className="text-xs text-slate-500">Holistic physiologic overview & predictions</p>
          </div>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-2xl">
          {analysis.overallSummary}
        </p>
      </div>

      {/* Critical Alerts (if any exist) */}
      {analysis.alerts && analysis.alerts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-xs mb-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>CRITICAL CLINICAL ALERTS</span>
          </div>
          <ul className="space-y-1 text-xs text-rose-700 list-disc list-inside font-medium">
            {analysis.alerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Risk Predictions Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h4 className="font-bold text-slate-800 text-sm mb-4">Gemini Risk Predictive Models</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.riskPredictions.map((risk, index) => {
            const isHigh = risk.riskLevel === "High";
            const isMed = risk.riskLevel === "Medium";
            return (
              <div
                key={index}
                className={`p-4 rounded-2xl border ${
                  isHigh
                    ? "bg-rose-50/50 border-rose-100"
                    : isMed
                    ? "bg-amber-50/50 border-amber-100"
                    : "bg-emerald-50/50 border-emerald-100"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800 text-xs">{risk.conditionName}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isHigh
                        ? "bg-rose-600 text-white"
                        : isMed
                        ? "bg-amber-500 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {risk.riskLevel} Risk
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 leading-relaxed mb-3">
                  {risk.explanation}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Confidence Level</span>
                  <span>{risk.confidenceScore}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vitals Diagnostics Feedback */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h4 className="font-bold text-slate-800 text-sm mb-4">Physiologic Vitals Analysis</h4>
        <div className="divide-y divide-slate-100">
          {analysis.vitalsAnalysis.map((item, index) => {
            const isCrit = item.status === "Critical" || item.status === "Elevated";
            return (
              <div key={index} className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="flex items-center gap-2 shrink-0">
                  <div className={`w-2 h-2 rounded-full ${isCrit ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
                  <span className="font-bold text-slate-800 text-xs">{item.metric}</span>
                </div>
                <div className="flex-1 sm:max-w-md">
                  <span
                    className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md border mb-1 sm:mb-0 sm:mr-2 ${
                      item.status === "Critical"
                        ? "bg-rose-50 border-rose-200 text-rose-700"
                        : item.status === "Elevated"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : item.status === "Borderline"
                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                        : "bg-emerald-50 border-emerald-200 text-emerald-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed inline sm:block md:inline">
                    {item.analysis}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Bento Grid Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diet & Nutrition */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs border-b border-slate-100 pb-3 mb-4">
            <Salad className="h-4 w-4" />
            <span>DIET & NUTRITIONAL PLANS</span>
          </div>
          <ul className="space-y-2">
            {analysis.recommendations.diet.map((rec, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-400" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Exercise & Cardiovascular Activity */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs border-b border-slate-100 pb-3 mb-4">
            <Dumbbell className="h-4 w-4" />
            <span>PHYSICAL FITNESS & MOVEMENT</span>
          </div>
          <ul className="space-y-2">
            {analysis.recommendations.exercise.map((rec, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sleep & Circadian Hygiene */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-violet-600 font-bold text-xs border-b border-slate-100 pb-3 mb-4">
            <Moon className="h-4 w-4" />
            <span>SLEEP & RECOVERY OPTIMIZATION</span>
          </div>
          <ul className="space-y-2">
            {analysis.recommendations.sleep.map((rec, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-violet-400" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Daily Lifestyle & Stress management */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-sky-600 font-bold text-xs border-b border-slate-100 pb-3 mb-4">
            <HeartHandshake className="h-4 w-4" />
            <span>STRESS & LIFESTYLE MODIFICATIONS</span>
          </div>
          <ul className="space-y-2">
            {analysis.recommendations.lifestyle.map((rec, i) => (
              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed">
                <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sky-400" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Critical Medical Follow-ups */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-slate-800 pointer-events-none">
          <Stethoscope className="h-24 w-24 opacity-10" />
        </div>
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xs border-b border-slate-800 pb-3 mb-4">
          <Stethoscope className="h-4 w-4" />
          <span>RECOMMENDED MEDICAL ACTION ITEMS & SCREENINGS</span>
        </div>
        <ul className="space-y-2 relative">
          {analysis.recommendations.medical.map((rec, i) => (
            <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Formal Medical Disclaimer Box */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3 text-amber-900 shadow-2xs">
        <Info className="h-5 w-5 shrink-0 text-amber-700 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-xs text-amber-800">Professional Medical Disclaimer</h5>
          <p className="text-[10.5px] text-amber-800/90 leading-relaxed">
            {analysis.disclaimer ||
              "This platform is an AI-powered diagnostic and prediction support utility. It does not provide medical treatment, diagnoses, or prescriptions. All risk calculations, predictions, and recommendations must be validated by a licensed clinical healthcare practitioner before taking any medical action."}
          </p>
        </div>
      </div>
    </div>
  );
}
