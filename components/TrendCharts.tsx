import React, { useState } from "react";
import { HealthMetrics } from "../types";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Activity, Heart, Eye, TrendingUp, Calendar, Trash2 } from "lucide-react";

interface TrendChartsProps {
  history: HealthMetrics[];
  onDeleteLog: (id: string) => void;
}

type TabType = "vitals" | "glucose" | "lifestyle" | "sleepWeight";

export default function TrendCharts({ history, onDeleteLog }: TrendChartsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("vitals");
  const [limit, setLimit] = useState<number>(10);

  // Sort history chronologically for the charts, but take only the latest N logs
  const sortedHistory = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-limit);

  // Reverse chronological list for displaying logs as a table or deletable list
  const recentLogs = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Top Controls & Tab Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("vitals")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "vitals"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Vitals (BP & HR)
          </button>
          <button
            onClick={() => setActiveTab("glucose")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "glucose"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Blood Sugar
          </button>
          <button
            onClick={() => setActiveTab("lifestyle")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "lifestyle"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Lifestyle & Steps
          </button>
          <button
            onClick={() => setActiveTab("sleepWeight")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === "sleepWeight"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Sleep & Weight
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Calendar className="h-4 w-4" /> Filter Logs:
          </span>
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-hidden"
          >
            <option value={7}>Last 7 logs</option>
            <option value={10}>Last 10 logs</option>
            <option value={20}>Last 20 logs</option>
            <option value={100}>All logs</option>
          </select>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="h-80 w-full">
          {sortedHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <Activity className="h-10 w-10 animate-pulse text-blue-400" />
              <p className="text-sm font-medium">No logged history found to visualize.</p>
              <p className="text-xs">Add your first daily health log above!</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === "vitals" ? (
                <LineChart data={sortedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={["dataMin - 10", "dataMax + 10"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "none" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                    itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Line type="monotone" dataKey="systolicBP" name="Systolic BP (mmHg)" stroke="#ef4444" strokeWidth={3} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="diastolicBP" name="Diastolic BP (mmHg)" stroke="#f59e0b" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="heartRate" name="Heart Rate (BPM)" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              ) : activeTab === "glucose" ? (
                <AreaChart data={sortedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGlucose" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={["dataMin - 10", "dataMax + 10"]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "none" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                    itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Area type="monotone" dataKey="bloodSugar" name="Glucose (mg/dL)" stroke="#3b82f6" fillOpacity={1} fill="url(#colorGlucose)" strokeWidth={3} />
                </AreaChart>
              ) : activeTab === "lifestyle" ? (
                <LineChart data={sortedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis yAxisId="left" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "none" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                    itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Line yAxisId="left" type="monotone" dataKey="averageSteps" name="Daily Steps" stroke="#3b82f6" strokeWidth={3} />
                  <Line yAxisId="right" type="monotone" dataKey="waterIntake" name="Water (oz)" stroke="#06b6d4" strokeWidth={2.5} />
                </LineChart>
              ) : (
                <AreaChart data={sortedHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
                    }}
                  />
                  <YAxis yAxisId="weight" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
                  <YAxis yAxisId="sleep" orientation="right" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 12]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "none" }}
                    labelStyle={{ color: "#94a3b8", fontSize: "11px", fontWeight: "bold" }}
                    itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                  <Area yAxisId="weight" type="monotone" dataKey="weight" name="Weight (lbs)" stroke="#f43f5e" fillOpacity={1} fill="url(#colorWeight)" strokeWidth={3} />
                  <Line yAxisId="sleep" type="monotone" dataKey="averageSleep" name="Sleep (hours)" stroke="#8b5cf6" strokeWidth={2.5} />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Historical Data Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Historical Metric Index</h4>
            <p className="text-xs text-slate-500">View and manage raw entries</p>
          </div>
          <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1 rounded-md">
            {history.length} Logs Saved
          </span>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3 rounded-l-lg">Date</th>
                <th className="py-2.5 px-3">BP (mmHg)</th>
                <th className="py-2.5 px-3">Sugar (mg/dL)</th>
                <th className="py-2.5 px-3">HR (bpm)</th>
                <th className="py-2.5 px-3">Sleep</th>
                <th className="py-2.5 px-3">Steps</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3 rounded-r-lg text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 text-slate-800">
                    {new Date(log.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-3">
                    {log.systolicBP}/{log.diastolicBP}
                  </td>
                  <td className="py-3 px-3">{log.bloodSugar}</td>
                  <td className="py-3 px-3">{log.heartRate}</td>
                  <td className="py-3 px-3">{log.averageSleep}h</td>
                  <td className="py-3 px-3">{log.averageSteps.toLocaleString()}</td>
                  <td className="py-3 px-3">{log.weight} lbs</td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer inline-flex items-center justify-center"
                      title="Delete log"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {recentLogs.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No logs recorded. Log a reading in the sidebar to populate this index!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
