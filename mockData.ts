import { UserProfile, HealthMetrics, HealthConditionRisk } from "./types";

export const DEFAULT_PROFILE: UserProfile = {
  age: "45",
  gender: "Male",
  existingConditions: "Mild hypercholesterolemia",
  familyHistory: "Father had Type 2 Diabetes, Mother has Hypertension",
  allergies: "Penicillin",
  medications: "Atorvastatin 10mg daily",
  activityLevel: "Moderate",
  dietaryPreference: "Balanced, low sodium",
  smoke: false,
  alcohol: "Occasional",
};

export const MOCK_HISTORY: HealthMetrics[] = [
  {
    id: "log_1",
    date: "2026-06-14",
    systolicBP: 132,
    diastolicBP: 82,
    bloodSugar: 104,
    heartRate: 72,
    oxygenSat: 98,
    temperature: 98.4,
    respiratoryRate: 16,
    weight: 194.5,
    height: 70,
    bmi: 27.9,
    averageSteps: 6200,
    averageSleep: 6.5,
    waterIntake: 45,
  },
  {
    id: "log_2",
    date: "2026-06-15",
    systolicBP: 134,
    diastolicBP: 84,
    bloodSugar: 108,
    heartRate: 74,
    oxygenSat: 97,
    temperature: 98.6,
    respiratoryRate: 17,
    weight: 194.2,
    height: 70,
    bmi: 27.9,
    averageSteps: 7100,
    averageSleep: 6.2,
    waterIntake: 50,
  },
  {
    id: "log_3",
    date: "2026-06-16",
    systolicBP: 128,
    diastolicBP: 80,
    bloodSugar: 98,
    heartRate: 68,
    oxygenSat: 99,
    temperature: 98.2,
    respiratoryRate: 15,
    weight: 193.8,
    height: 70,
    bmi: 27.8,
    averageSteps: 9400,
    averageSleep: 7.0,
    waterIntake: 64,
  },
  {
    id: "log_4",
    date: "2026-06-17",
    systolicBP: 136,
    diastolicBP: 85,
    bloodSugar: 112,
    heartRate: 76,
    oxygenSat: 98,
    temperature: 98.5,
    respiratoryRate: 18,
    weight: 194.0,
    height: 70,
    bmi: 27.8,
    averageSteps: 5400,
    averageSleep: 5.8,
    waterIntake: 40,
  },
  {
    id: "log_5",
    date: "2026-06-18",
    systolicBP: 130,
    diastolicBP: 82,
    bloodSugar: 101,
    heartRate: 70,
    oxygenSat: 98,
    temperature: 98.1,
    respiratoryRate: 16,
    weight: 193.5,
    height: 70,
    bmi: 27.8,
    averageSteps: 8200,
    averageSleep: 6.8,
    waterIntake: 55,
  },
  {
    id: "log_6",
    date: "2026-06-19",
    systolicBP: 135,
    diastolicBP: 83,
    bloodSugar: 105,
    heartRate: 73,
    oxygenSat: 98,
    temperature: 98.3,
    respiratoryRate: 16,
    weight: 193.1,
    height: 70,
    bmi: 27.7,
    averageSteps: 6800,
    averageSleep: 6.4,
    waterIntake: 48,
  },
  {
    id: "log_7",
    date: "2026-06-20",
    systolicBP: 138,
    diastolicBP: 86,
    bloodSugar: 115,
    heartRate: 78,
    oxygenSat: 97,
    temperature: 98.7,
    respiratoryRate: 18,
    weight: 193.6,
    height: 70,
    bmi: 27.8,
    averageSteps: 5100,
    averageSleep: 5.5,
    waterIntake: 32,
  },
  {
    id: "log_8",
    date: "2026-06-21",
    systolicBP: 126,
    diastolicBP: 79,
    bloodSugar: 96,
    heartRate: 67,
    oxygenSat: 99,
    temperature: 98.0,
    respiratoryRate: 14,
    weight: 192.4,
    height: 70,
    bmi: 27.6,
    averageSteps: 10500,
    averageSleep: 7.5,
    waterIntake: 80,
  },
  {
    id: "log_9",
    date: "2026-06-22",
    systolicBP: 132,
    diastolicBP: 81,
    bloodSugar: 102,
    heartRate: 71,
    oxygenSat: 98,
    temperature: 98.3,
    respiratoryRate: 15,
    weight: 192.0,
    height: 70,
    bmi: 27.5,
    averageSteps: 8900,
    averageSleep: 7.1,
    waterIntake: 70,
  },
  {
    id: "log_10",
    date: "2026-06-23",
    systolicBP: 134,
    diastolicBP: 83,
    bloodSugar: 106,
    heartRate: 74,
    oxygenSat: 98,
    temperature: 98.4,
    respiratoryRate: 16,
    weight: 192.2,
    height: 70,
    bmi: 27.6,
    averageSteps: 7800,
    averageSleep: 6.7,
    waterIntake: 60,
  }
];

// Simple, clinical-rule-based Risk Score Calculator (instant client-side ML predictor substitute)
export function calculateClientRisks(profile: UserProfile, latestMetrics: HealthMetrics): HealthConditionRisk[] {
  const risks: HealthConditionRisk[] = [];
  const ageNum = parseInt(profile.age) || 40;
  const isSmoker = profile.smoke;
  const alcoholReg = profile.alcohol === "Regular";
  const familyDiabetes = profile.familyHistory.toLowerCase().includes("diab");
  const familyHypertension = profile.familyHistory.toLowerCase().includes("hyper") || profile.familyHistory.toLowerCase().includes("tension");

  // 1. Cardiovascular Risk
  let cvPoints = 0;
  if (latestMetrics.systolicBP >= 140 || latestMetrics.diastolicBP >= 90) cvPoints += 3;
  else if (latestMetrics.systolicBP >= 130 || latestMetrics.diastolicBP >= 80) cvPoints += 1.5;
  if (latestMetrics.bmi >= 30) cvPoints += 2.5;
  else if (latestMetrics.bmi >= 25) cvPoints += 1;
  if (isSmoker) cvPoints += 3;
  if (ageNum >= 55) cvPoints += 2;
  else if (ageNum >= 45) cvPoints += 1;
  if (latestMetrics.averageSteps < 5000) cvPoints += 1.5;
  if (profile.existingConditions.toLowerCase().includes("cholesterol") || profile.existingConditions.toLowerCase().includes("lipid")) cvPoints += 2;

  let cvLevel: "Low" | "Medium" | "High" = "Low";
  let cvConf = Math.min(60 + cvPoints * 3, 95);
  if (cvPoints >= 6.5) cvLevel = "High";
  else if (cvPoints >= 3) cvLevel = "Medium";

  risks.push({
    conditionName: "Cardiovascular Disease",
    riskLevel: cvLevel,
    confidenceScore: cvConf,
    explanation: cvLevel === "High"
      ? "Elevated risk is determined due to high blood pressure, elevated BMI, family history, and smoking status if present."
      : cvLevel === "Medium"
      ? "Moderate cardiovascular risk. Contributing factors include borderline elevated blood pressure readings and body mass index."
      : "Low current cardiovascular risk. Maintain regular physical activity and a low-sodium diet."
  });

  // 2. Type 2 Diabetes Risk
  let dbPoints = 0;
  if (latestMetrics.bloodSugar >= 126) dbPoints += 5; // diabetic
  else if (latestMetrics.bloodSugar >= 100) dbPoints += 3; // prediabetic
  if (latestMetrics.bmi >= 30) dbPoints += 3;
  else if (latestMetrics.bmi >= 25) dbPoints += 1.5;
  if (familyDiabetes) dbPoints += 3;
  if (latestMetrics.averageSteps < 6000) dbPoints += 1;
  if (ageNum >= 45) dbPoints += 1;

  let dbLevel: "Low" | "Medium" | "High" = "Low";
  let dbConf = Math.min(55 + dbPoints * 4, 95);
  if (dbPoints >= 7) dbLevel = "High";
  else if (dbPoints >= 3.5) dbLevel = "Medium";

  risks.push({
    conditionName: "Type 2 Diabetes",
    riskLevel: dbLevel,
    confidenceScore: dbConf,
    explanation: dbLevel === "High"
      ? "High risk associated with fasting blood sugar in the prediabetic/diabetic range, coupled with elevated BMI and immediate family history."
      : dbLevel === "Medium"
      ? "Moderate risk. Prediabetic blood sugar trends and elevated BMI suggest potential insulin resistance risks."
      : "Low diabetes risk. Keep tracking fasting blood glucose and continue staying physically active."
  });

  // 3. Hypertension Risk
  let htPoints = 0;
  if (latestMetrics.systolicBP >= 140 || latestMetrics.diastolicBP >= 90) htPoints += 5;
  else if (latestMetrics.systolicBP >= 130 || latestMetrics.diastolicBP >= 80) htPoints += 2.5;
  if (latestMetrics.weight >= 200 || latestMetrics.bmi >= 28) htPoints += 2;
  if (familyHypertension) htPoints += 2.5;
  if (alcoholReg) htPoints += 1.5;
  if (latestMetrics.waterIntake < 40) htPoints += 1;

  let htLevel: "Low" | "Medium" | "High" = "Low";
  let htConf = Math.min(65 + htPoints * 3, 98);
  if (htPoints >= 6) htLevel = "High";
  else if (htPoints >= 3) htLevel = "Medium";

  risks.push({
    conditionName: "Hypertension (High Blood Pressure)",
    riskLevel: htLevel,
    confidenceScore: htConf,
    explanation: htLevel === "High"
      ? "High risk due to persistent blood pressure readings exceeding 130/80 mmHg, family genetic markers, and low hydration levels."
      : htLevel === "Medium"
      ? "Moderate hypertension risk. Your blood pressure reads in the elevated stage; watch sodium intake and increase cardio exercise."
      : "Low hypertension risk. Vitals are consistently normal."
  });

  // 4. Sleep Apnea Risk
  let saPoints = 0;
  if (latestMetrics.bmi >= 30) saPoints += 3;
  else if (latestMetrics.bmi >= 27) saPoints += 1.5;
  if (latestMetrics.averageSleep < 6) saPoints += 2;
  if (profile.gender === "Male") saPoints += 1;
  if (latestMetrics.respiratoryRate >= 18) saPoints += 1.5;

  let saLevel: "Low" | "Medium" | "High" = "Low";
  let saConf = Math.min(50 + saPoints * 5, 90);
  if (saPoints >= 5) saLevel = "High";
  else if (saPoints >= 3) saLevel = "Medium";

  risks.push({
    conditionName: "Obstructive Sleep Apnea",
    riskLevel: saLevel,
    confidenceScore: saConf,
    explanation: saLevel === "High"
      ? "Significant risk factors present: high BMI, sleep durations under 6 hours, male gender, and elevated sleeping respiratory rates."
      : saLevel === "Medium"
      ? "Moderate sleep apnea risk. Borderline BMI and fragmented/short sleep durations may affect nighttime breathing cycles."
      : "Low sleep apnea risk. Satisfying average sleep duration and optimal metrics."
  });

  return risks;
}

// BMI helper
export function calculateBMI(weightLbs: number, heightInches: number): number {
  if (!weightLbs || !heightInches) return 0;
  return parseFloat(((weightLbs * 703) / (heightInches * heightInches)).toFixed(1));
}

// Generate automatic vitals health status
export function getMetricStatus(name: string, value: number, systBP?: number): {
  status: "Normal" | "Borderline" | "Elevated" | "Critical";
  color: string;
  badgeBg: string;
} {
  switch (name) {
    case "Blood Pressure":
      const sys = systBP || 120;
      const dia = value;
      if (sys >= 140 || dia >= 90) return { status: "Critical", color: "text-rose-600", badgeBg: "bg-rose-50 border-rose-200 text-rose-700" };
      if (sys >= 130 || dia >= 80) return { status: "Elevated", color: "text-amber-600", badgeBg: "bg-amber-50 border-amber-200 text-amber-700" };
      if (sys >= 120) return { status: "Borderline", color: "text-yellow-600", badgeBg: "bg-yellow-50 border-yellow-200 text-yellow-700" };
      return { status: "Normal", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700" };

    case "Blood Glucose":
      if (value >= 126) return { status: "Critical", color: "text-rose-600", badgeBg: "bg-rose-50 border-rose-200 text-rose-700" };
      if (value >= 100) return { status: "Elevated", color: "text-amber-600", badgeBg: "bg-amber-50 border-amber-200 text-amber-700" };
      if (value >= 90) return { status: "Borderline", color: "text-yellow-600", badgeBg: "bg-yellow-50 border-yellow-200 text-yellow-700" };
      return { status: "Normal", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700" };

    case "Heart Rate":
      if (value > 100 || value < 50) return { status: "Critical", color: "text-rose-600", badgeBg: "bg-rose-50 border-rose-200 text-rose-700" };
      if (value > 85 || value < 60) return { status: "Borderline", color: "text-yellow-600", badgeBg: "bg-yellow-50 border-yellow-200 text-yellow-700" };
      return { status: "Normal", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700" };

    case "Oxygen Saturation":
      if (value < 92) return { status: "Critical", color: "text-rose-600", badgeBg: "bg-rose-50 border-rose-200 text-rose-700" };
      if (value < 95) return { status: "Elevated", color: "text-amber-600", badgeBg: "bg-amber-50 border-amber-200 text-amber-700" };
      return { status: "Normal", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700" };

    case "Sleep Duration":
      if (value < 5 || value > 10) return { status: "Critical", color: "text-rose-600", badgeBg: "bg-rose-50 border-rose-200 text-rose-700" };
      if (value < 7) return { status: "Borderline", color: "text-yellow-600", badgeBg: "bg-yellow-50 border-yellow-200 text-yellow-700" };
      return { status: "Normal", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700" };

    case "Water Intake":
      if (value < 35) return { status: "Critical", color: "text-rose-600", badgeBg: "bg-rose-50 border-rose-200 text-rose-700" };
      if (value < 64) return { status: "Borderline", color: "text-yellow-600", badgeBg: "bg-yellow-50 border-yellow-200 text-yellow-700" };
      return { status: "Normal", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700" };

    case "Steps":
      if (value < 4000) return { status: "Critical", color: "text-rose-600", badgeBg: "bg-rose-50 border-rose-200 text-rose-700" };
      if (value < 7500) return { status: "Borderline", color: "text-yellow-600", badgeBg: "bg-yellow-50 border-yellow-200 text-yellow-700" };
      return { status: "Normal", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700" };

    default:
      return { status: "Normal", color: "text-emerald-600", badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700" };
  }
}
