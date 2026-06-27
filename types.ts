export interface UserProfile {
  age: string;
  gender: string;
  existingConditions: string;
  familyHistory: string;
  allergies: string;
  medications: string;
  activityLevel: "Sedentary" | "Light" | "Moderate" | "Active";
  dietaryPreference: string;
  smoke: boolean;
  alcohol: "No" | "Occasional" | "Regular";
}

export interface HealthMetrics {
  id: string;
  date: string; // ISO date string or YYYY-MM-DD
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  bloodSugar: number; // mg/dL (fasting or normal check)
  heartRate: number; // bpm
  oxygenSat: number; // % (SpO2)
  temperature: number; // °F
  respiratoryRate: number; // breaths/min
  weight: number; // lbs
  height: number; // inches
  bmi: number; // calculated BMI
  averageSteps: number; // steps/day
  averageSleep: number; // hours/day
  waterIntake: number; // oz/day
}

export interface HealthConditionRisk {
  conditionName: string;
  riskLevel: "Low" | "Medium" | "High";
  confidenceScore: number; // 0 - 100
  explanation: string;
}

export interface VitalsAnalysisItem {
  metric: string;
  status: "Normal" | "Borderline" | "Elevated" | "Critical";
  analysis: string;
}

export interface RecommendationsGroup {
  diet: string[];
  exercise: string[];
  sleep: string[];
  lifestyle: string[];
  medical: string[];
}

export interface AIAnalysisResult {
  overallSummary: string;
  alerts: string[];
  riskPredictions: HealthConditionRisk[];
  vitalsAnalysis: VitalsAnalysisItem[];
  recommendations: RecommendationsGroup;
  disclaimer: string;
}
