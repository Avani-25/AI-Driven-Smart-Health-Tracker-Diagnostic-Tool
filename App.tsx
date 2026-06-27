import React, { useState, useEffect } from "react";
import { UserProfile, HealthMetrics, AIAnalysisResult } from "./types";
import {
  DEFAULT_PROFILE,
  MOCK_HISTORY,
  getMetricStatus,
  calculateBMI,
} from "./mockData";
import ProfileForm from "./components/ProfileForm";
import MetricsForm from "./components/MetricsForm";
import TrendCharts from "./components/TrendCharts";
import RiskPredictorCard from "./components/RiskPredictorCard";
import AIRecommendationsPanel from "./components/AIRecommendationsPanel";
import {
  Activity,
  Heart,
  Settings,
  ClipboardList,
  Sparkles,
  Download,
  Upload,
  RotateCcw,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function App() {
  // Load state from local storage or fall back to mock data
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("ai_health_profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [history, setHistory] = useState<HealthMetrics[]>(() => {
    const saved = localStorage.getItem("ai_health_history");
    return saved ? JSON.parse(saved) : MOCK_HISTORY;
  });

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(() => {
    const saved = localStorage.getItem("ai_health_analysis");
    return saved ? JSON.parse(saved) : null;
  });

  // Active view in the sidebar: "log" | "profile"
  const [sidebarTab, setSidebarTab] = useState<"log" | "profile">("log");

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem("ai_health_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("ai_health_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (aiAnalysis) {
      localStorage.setItem("ai_health_analysis", JSON.stringify(aiAnalysis));
    } else {
      localStorage.removeItem("ai_health_analysis");
    }
  }, [aiAnalysis]);

  // Extract latest metrics reading
  const latestMetrics = history.length > 0 ? history[history.length - 1] : null;

  // Handle adding a new health log
  const handleAddLog = (newLogFields: Omit<HealthMetrics, "id">) => {
    const newLog: HealthMetrics = {
      ...newLogFields,
      id: "log_" + Date.now(),
    };

    // Prevent duplicate entries on the exact same date by replacing them, otherwise append
    setHistory((prev) => {
      const existingIndex = prev.findIndex((item) => item.date === newLog.date);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = newLog;
        return updated;
      }
      return [...prev, newLog];
    });
  };

  // Handle deleting a log entry
  const handleDeleteLog = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle backup export
  const handleExportBackup = () => {
    const backupData = {
      profile,
      history,
      aiAnalysis,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai_health_platform_backup_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Handle backup import
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.history) {
          setProfile(parsed.profile);
          setHistory(parsed.history);
          if (parsed.aiAnalysis) {
            setAiAnalysis(parsed.aiAnalysis);
          }
          alert("Backup metrics and profile imported successfully!");
        } else {
          alert("Invalid backup file format. Must contain profile and history schema.");
        }
      } catch (err) {
        alert("Failed to parse JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  // Reset to initial preloaded mock data
  const handleResetData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all metrics to the default clinical demo profile? This will overwrite your active logs."
      )
    ) {
      setProfile(DEFAULT_PROFILE);
      setHistory(MOCK_HISTORY);
      setAiAnalysis(null);
      localStorage.clear();
    }
  };

  // Quick stat thresholds styling
  const renderQuickStatCard = (title: string, value: string | number, unit: string, statusConfig: any) => {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between min-h-28 transition-all hover:scale-[1.02] hover:shadow-sm">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <div className="my-1.5">
          <span className="text-xl font-black text-slate-800">{value}</span>
          <span className="text-xs text-slate-400 font-bold ml-1">{unit}</span>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border max-w-fit uppercase tracking-wider ${statusConfig.badgeBg}`}>
          {statusConfig.status}
        </span>
      </div>
    );
  };

  // Calculate dynamic wellness score
  const calculateWellnessScore = () => {
    if (!latestMetrics) return 85;
    let score = 100;
    if (latestMetrics.systolicBP >= 140 || latestMetrics.diastolicBP >= 90) score -= 12;
    else if (latestMetrics.systolicBP >= 130 || latestMetrics.diastolicBP >= 80) score -= 6;
    if (latestMetrics.bloodSugar >= 126) score -= 12;
    else if (latestMetrics.bloodSugar >= 100) score -= 6;
    if (latestMetrics.heartRate > 95 || latestMetrics.heartRate < 55) score -= 5;
    if (latestMetrics.oxygenSat < 95) score -= 10;
    if (latestMetrics.averageSteps < 5000) score -= 5;
    if (latestMetrics.averageSleep < 6) score -= 5;
    return Math.max(score, 42);
  };

  const wellnessScore = calculateWellnessScore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation Bar in Bento theme */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 md:px-12 flex items-center justify-between flex-shrink-0 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-xs">
            <Heart className="h-4 w-4 text-white animate-pulse" />
          </div>
          <span className="text-lg font-black tracking-tight text-slate-800">
            AuraHealth<span className="text-blue-600 font-black">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 text-xs font-semibold">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            AI Analysis Live
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold leading-none text-slate-800">avanimohite25@gmail.com</p>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-0.5">Patient ID: AH-9921</p>
            </div>
            <div className="w-9 h-9 bg-slate-100 rounded-full border border-slate-200 shadow-xs flex items-center justify-center text-blue-600 font-extrabold text-xs">
              AM
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Wrapper */}
      <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-8 space-y-6">
        
        {/* Top Control Bar with Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-800">Aura Biometric Synthesis</h2>
            <p className="text-xs text-slate-500">Collect metrics, forecast cardiovascular risk, and generate lifestyle adjustments.</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              title="Export metrics as JSON backup"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>

            <label
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              title="Import metrics backup"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetData}
              className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset to default mock profile"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dynamic Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* COLUMN 1: SIDEBAR TAB CONTROLS & FORMS (Bento Card - Left Column - span 4 on large, span 12 on mobile) */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs flex gap-1">
              <button
                onClick={() => setSidebarTab("log")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  sidebarTab === "log"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <PlusCircle className="h-4 w-4" /> Add Daily Log
              </button>
              <button
                onClick={() => setSidebarTab("profile")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  sidebarTab === "profile"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Settings className="h-4 w-4" /> Clinical Profile
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1">
              {sidebarTab === "log" ? (
                <MetricsForm
                  latestMetrics={latestMetrics}
                  onAddLog={handleAddLog}
                />
              ) : (
                <ProfileForm
                  initialProfile={profile}
                  onSave={setProfile}
                />
              )}
            </div>
          </div>

          {/* COLUMN 2: DASHBOARD & ANALYTICS (Bento Cards - span 8 on large, span 12 on mobile) */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Bento Row 1: KPI Panels */}
            {latestMetrics ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderQuickStatCard(
                  "Blood Pressure",
                  `${latestMetrics.systolicBP}/${latestMetrics.diastolicBP}`,
                  "mmHg",
                  getMetricStatus("Blood Pressure", latestMetrics.diastolicBP, latestMetrics.systolicBP)
                )}
                {renderQuickStatCard(
                  "Blood Glucose",
                  latestMetrics.bloodSugar,
                  "mg/dL",
                  getMetricStatus("Blood Glucose", latestMetrics.bloodSugar)
                )}
                {renderQuickStatCard(
                  "Heart Rate",
                  latestMetrics.heartRate,
                  "bpm",
                  getMetricStatus("Heart Rate", latestMetrics.heartRate)
                )}
                {renderQuickStatCard(
                  "Oxygen Saturation",
                  latestMetrics.oxygenSat,
                  "%",
                  getMetricStatus("Oxygen Saturation", latestMetrics.oxygenSat)
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2 h-28">
                <AlertCircle className="h-6 w-6 text-slate-300" />
                <p className="font-semibold">No logs registered yet.</p>
                <p>Use the "Add Daily Log" tab to record your first vital parameters.</p>
              </div>
            )}

            {/* Bento Row 2: Wellness Score Highlight (Slate-900) & Sleep/Lifestyle Block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Holistic Wellness Score Card (Bento Card 2 from design theme) */}
              <div className="md:col-span-5 bg-slate-900 rounded-3xl p-6 flex flex-col items-center justify-center text-center text-white border border-slate-800 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1.5">Aura Wellness Index</p>
                <div className="text-6xl font-black text-white mb-2 tracking-tight">
                  {wellnessScore}
                  <span className="text-xl text-blue-400 font-bold">/100</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full mb-4 max-w-[180px]">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${wellnessScore}%` }}
                  ></div>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed max-w-[200px]">
                  {wellnessScore >= 85
                    ? "Optimal physical integrity. You score higher than 92% of your demographic."
                    : wellnessScore >= 70
                    ? "Borderline score. Lifestyle habits have slight inflammatory weights."
                    : "Action recommended. Consult our generative health recommendations below."}
                </p>
              </div>

              {/* Sleep Cycle / Mini Stats Bento (Bento Card 6 from design theme) */}
              <div className="md:col-span-7 bg-indigo-50 rounded-3xl border border-indigo-100 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Sleep Cycle & Steps</p>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-2xl font-black text-indigo-950">
                      {latestMetrics ? `${latestMetrics.averageSleep} hours` : "7h 42m"}
                    </h3>
                    <span className="text-[10px] text-indigo-600 font-bold bg-white/60 px-2 py-0.5 rounded-md border border-indigo-100">
                      Restorative Index: Good
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                  <div className="bg-white/80 rounded-xl p-3 border border-indigo-100/50">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Daily Activity</p>
                    <p className="text-sm font-black text-slate-800">
                      {latestMetrics ? latestMetrics.averageSteps.toLocaleString() : "7,800"} <span className="text-[9px] text-slate-400 font-bold">steps</span>
                    </p>
                  </div>
                  <div className="bg-white/80 rounded-xl p-3 border border-indigo-100/50">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Hydration</p>
                    <p className="text-sm font-black text-slate-800">
                      {latestMetrics ? latestMetrics.waterIntake : "60"} <span className="text-[9px] text-slate-400 font-bold">oz</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold text-indigo-800">
                    <span>REM Sleep Ratio</span>
                    <span>24%</span>
                  </div>
                  <div className="w-full bg-indigo-200/40 h-1 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[24%]" />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold text-indigo-800">
                    <span>Deep Sleep Ratio</span>
                    <span>41%</span>
                  </div>
                  <div className="w-full bg-indigo-200/40 h-1 rounded-full overflow-hidden">
                    <div className="bg-indigo-700 h-full w-[41%]" />
                  </div>
                </div>
              </div>

            </div>

            {/* Bento Row 3: Biometric Trend Analysis Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-1">
              <TrendCharts history={history} onDeleteLog={handleDeleteLog} />
            </div>

            {/* Bento Row 4: Risk Predictor Engine */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-1">
              <RiskPredictorCard
                profile={profile}
                latestMetrics={latestMetrics}
                history={history}
                onAnalysisResult={setAiAnalysis}
                currentAiResult={aiAnalysis}
              />
            </div>

            {/* Bento Row 5: AI Insights Panel */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-1">
              <AIRecommendationsPanel analysis={aiAnalysis} />
            </div>

          </div>

        </div>
      </main>

      {/* Footer copyright */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6 text-center text-xs text-slate-500 font-medium mt-16 flex-shrink-0">
        <p>© 2026 AuraHealthAI • Developed in partnership with Google AI Studio</p>
        <p className="mt-1.5 text-[10px] text-slate-400 max-w-lg mx-auto leading-relaxed">
          Disclaimer: This application is for experimental lifestyle and biological metric analysis support only. It does not replace professional medical diagnosis, prescriptions, or physician consulting.
        </p>
      </footer>
    </div>
  );
}
