import React, { useState, useEffect } from "react";
import { HealthMetrics } from "../types";
import { calculateBMI } from "../mockData";
import { ClipboardCheck, Heart, Droplet, Sun, Moon, Info } from "lucide-react";

interface MetricsFormProps {
  latestMetrics: HealthMetrics | null;
  onAddLog: (newMetrics: Omit<HealthMetrics, "id">) => void;
}

export default function MetricsForm({ latestMetrics, onAddLog }: MetricsFormProps) {
  const [systolicBP, setSystolicBP] = useState(latestMetrics?.systolicBP?.toString() || "120");
  const [diastolicBP, setDiastolicBP] = useState(latestMetrics?.diastolicBP?.toString() || "80");
  const [bloodSugar, setBloodSugar] = useState(latestMetrics?.bloodSugar?.toString() || "95");
  const [heartRate, setHeartRate] = useState(latestMetrics?.heartRate?.toString() || "72");
  const [oxygenSat, setOxygenSat] = useState(latestMetrics?.oxygenSat?.toString() || "98");
  const [temperature, setTemperature] = useState(latestMetrics?.temperature?.toString() || "98.4");
  const [respiratoryRate, setRespiratoryRate] = useState(latestMetrics?.respiratoryRate?.toString() || "16");
  const [weight, setWeight] = useState(latestMetrics?.weight?.toString() || "180");
  const [height, setHeight] = useState(latestMetrics?.height?.toString() || "70");
  const [averageSteps, setAverageSteps] = useState(latestMetrics?.averageSteps?.toString() || "7500");
  const [averageSleep, setAverageSleep] = useState(latestMetrics?.averageSleep?.toString() || "7");
  const [waterIntake, setWaterIntake] = useState(latestMetrics?.waterIntake?.toString() || "64");

  const [bmi, setBmi] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Re-calculate BMI when height or weight change
  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      setBmi(calculateBMI(w, h));
    } else {
      setBmi(0);
    }
  }, [weight, height]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newLog: Omit<HealthMetrics, "id"> = {
      date: new Date().toISOString().split("T")[0],
      systolicBP: parseInt(systolicBP) || 120,
      diastolicBP: parseInt(diastolicBP) || 80,
      bloodSugar: parseInt(bloodSugar) || 95,
      heartRate: parseInt(heartRate) || 72,
      oxygenSat: parseInt(oxygenSat) || 98,
      temperature: parseFloat(temperature) || 98.4,
      respiratoryRate: parseInt(respiratoryRate) || 16,
      weight: parseFloat(weight) || 180,
      height: parseFloat(height) || 70,
      bmi: bmi || 25,
      averageSteps: parseInt(averageSteps) || 7500,
      averageSleep: parseFloat(averageSleep) || 7,
      waterIntake: parseInt(waterIntake) || 64,
    };

    onAddLog(newLog);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Vital Signs</h3>
            <p className="text-xs text-slate-500">Log core physiologic measurements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Pressure (Systolic)</label>
            <div className="relative">
              <input
                type="number"
                value={systolicBP}
                onChange={(e) => setSystolicBP(e.target.value)}
                min="70"
                max="250"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">mmHg</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Pressure (Diastolic)</label>
            <div className="relative">
              <input
                type="number"
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(e.target.value)}
                min="40"
                max="150"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">mmHg</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Fasting Blood Sugar</label>
            <div className="relative">
              <input
                type="number"
                value={bloodSugar}
                onChange={(e) => setBloodSugar(e.target.value)}
                min="40"
                max="500"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">mg/dL</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Heart Rate (Resting)</label>
            <div className="relative">
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                min="30"
                max="220"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">BPM</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Oxygen Saturation (SpO2)</label>
            <div className="relative">
              <input
                type="number"
                value={oxygenSat}
                onChange={(e) => setOxygenSat(e.target.value)}
                min="50"
                max="100"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">%</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Body Temperature</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                min="94"
                max="108"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">°F</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Physical Metrics & Body Mass</h3>
            <p className="text-xs text-slate-500">Calculate BMI and track weight trends</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Weight (Pounds)</label>
            <div className="relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="40"
                max="800"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">lbs</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Height (Inches)</label>
            <div className="relative">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="30"
                max="100"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">in</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Calculated BMI</label>
            <div className="w-full px-4 py-2 border border-dashed border-slate-200 bg-slate-50 text-slate-700 font-bold text-sm rounded-lg flex items-center justify-between">
              <span>{bmi > 0 ? bmi : "--"}</span>
              <span className="text-[10px] font-medium text-slate-500 px-2 py-0.5 rounded-sm bg-white border border-slate-200">
                {bmi === 0
                  ? "Awaiting weight/height"
                  : bmi < 18.5
                  ? "Underweight"
                  : bmi < 25
                  ? "Normal"
                  : bmi < 30
                  ? "Overweight"
                  : "Obese"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Lifestyle & Activity Logs</h3>
            <p className="text-xs text-slate-500">Track daily habits and steps</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Daily Steps</label>
            <div className="relative">
              <input
                type="number"
                value={averageSteps}
                onChange={(e) => setAverageSteps(e.target.value)}
                min="0"
                max="100000"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">steps</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Sleep Duration</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                value={averageSleep}
                onChange={(e) => setAverageSleep(e.target.value)}
                min="1"
                max="24"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">hrs</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Water Intake</label>
            <div className="relative">
              <input
                type="number"
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value)}
                min="0"
                max="500"
                className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500 text-sm text-slate-800"
                required
              />
              <span className="absolute right-3 top-2.5 text-[10px] font-bold text-slate-400">oz</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <div className="flex gap-2 text-amber-800">
          <Info className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-xs">
            Logging new metrics updates your current wellness index. This data is preserved locally and used to calculate cardiovascular, metabolic, and sleep apnea scores.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 items-center">
        {isSuccess && (
          <span className="text-xs text-emerald-600 font-medium">
            ✓ Log added to local historical index!
          </span>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl cursor-pointer shadow-sm transition-all duration-150"
        >
          Add Daily Health Log
        </button>
      </div>
    </form>
  );
}
