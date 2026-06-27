import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON request bodies
app.use(express.json());

// Initialize Gemini SDK securely
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// AI analysis endpoint
app.post("/api/analyze-health", async (req, res) => {
  try {
    const { profile, metrics, history } = req.body;

    if (!metrics) {
      return res.status(400).json({ error: "Missing health metrics data." });
    }

    // Construct a comprehensive prompt for Gemini
    const prompt = `
Analyze the following patient's health profile and current/historical metrics to perform a detailed risk factor analysis, predict potential health conditions, and provide actionable, personalized health recommendations.

Patient Profile:
- Age: ${profile?.age ?? "Not provided"}
- Gender: ${profile?.gender ?? "Not provided"}
- Existing Conditions: ${profile?.existingConditions ?? "None declared"}
- Family History: ${profile?.familyHistory ?? "None declared"}
- Allergies: ${profile?.allergies ?? "None declared"}
- Medication list: ${profile?.medications ?? "None declared"}
- Physical Activity level: ${profile?.activityLevel ?? "Moderate"}
- Dietary preference: ${profile?.dietaryPreference ?? "No specific diet"}
- Smoke: ${profile?.smoke ? "Yes" : "No"}, Alcohol: ${profile?.alcohol ?? "No/Occasional"}

Current Metrics:
- Systolic Blood Pressure: ${metrics.systolicBP ?? "Not provided"} mmHg
- Diastolic Blood Pressure: ${metrics.diastolicBP ?? "Not provided"} mmHg
- Fasting Blood Sugar: ${metrics.bloodSugar ?? "Not provided"} mg/dL
- Heart Rate (resting): ${metrics.heartRate ?? "Not provided"} bpm
- SpO2 (Oxygen Saturation): ${metrics.oxygenSat ?? "Not provided"} %
- Temperature: ${metrics.temperature ?? "Not provided"} °F
- Respiratory Rate: ${metrics.respiratoryRate ?? "Not provided"} breaths/min
- Body Weight: ${metrics.weight ?? "Not provided"} lbs
- Height: ${metrics.height ?? "Not provided"} inches
- BMI: ${metrics.bmi ?? "Not calculated"}
- Daily Steps (Average): ${metrics.averageSteps ?? "Not provided"}
- Sleep Duration (Average): ${metrics.averageSleep ?? "Not provided"} hours
- Water Intake: ${metrics.waterIntake ?? "Not provided"} oz

Historical Trend Summary:
${JSON.stringify(history ?? [])}

Please generate:
1. Overall summary of health status.
2. Immediate critical alerts if any vital metric is outside safe thresholds (e.g., highly elevated BP, high blood sugar, low oxygen).
3. Risk predictions for conditions (like Cardiovascular Disease, Diabetes Type II, Hypertension, Sleep Apnea, Metabolic Syndrome).
4. Individual vitals analysis.
5. Personalized lifestyle, dietary, physical activity, sleep, and medical follow-up advice.

Provide a scientific, evidence-based assessment. Ensure you highlight a professional medical disclaimer stating that this analysis is an AI-powered helper tool and does not substitute for professional medical diagnosis or clinical consultation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional medical AI consultant. Your role is to analyze patient vitals and health history, calculate and predict potential clinical risk levels using advanced reasoning, and provide clear, structured, and clinically sound health recommendations. Always include a prominent medical disclaimer.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallSummary: {
              type: Type.STRING,
              description: "A summary of the current health profile and dynamic score. Keep it engaging, professional, and clear."
            },
            alerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Urgent red or amber warning alerts for values that are clinically borderline or critical."
            },
            riskPredictions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  conditionName: { type: Type.STRING, description: "The medical condition, e.g., 'Type 2 Diabetes', 'Hypertension', 'Cardiovascular Disease'" },
                  riskLevel: { type: Type.STRING, description: "Risk category: Low, Medium, or High" },
                  confidenceScore: { type: Type.INTEGER, description: "AI confidence percentage from 0 to 100 based on input metrics and clinical models" },
                  explanation: { type: Type.STRING, description: "Detailed, patient-friendly medical explanation of what factors (e.g. high BMI, family history, blood sugar) contributed to this prediction." }
                },
                required: ["conditionName", "riskLevel", "confidenceScore", "explanation"]
              }
            },
            vitalsAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metric: { type: Type.STRING, description: "The metric analyzed, e.g., 'Blood Pressure', 'Blood Glucose', 'SpO2'" },
                  status: { type: Type.STRING, description: "Status: Normal, Borderline, Elevated, or Critical" },
                  analysis: { type: Type.STRING, description: "Physiological feedback explaining what the current reading implies for health." }
                },
                required: ["metric", "status", "analysis"]
              }
            },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                diet: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific dietary adjustments, food items to include or limit" },
                exercise: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Physical activity recommendations based on age/conditions" },
                sleep: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sleep hygiene and recovery improvement steps" },
                lifestyle: { type: Type.ARRAY, items: { type: Type.STRING }, description: "General lifestyle tips (hydration, stress, substance reduction)" },
                medical: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Crucial medical suggestions (e.g., consult GP, get blood panels, monitor daily, eye screenings)" }
              },
              required: ["diet", "exercise", "sleep", "lifestyle", "medical"]
            },
            disclaimer: {
              type: Type.STRING,
              description: "Professional medical disclaimer stating that this AI-generated response is for informational and educational purposes only."
            }
          },
          required: ["overallSummary", "alerts", "riskPredictions", "vitalsAnalysis", "recommendations", "disclaimer"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini API");
    }

    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Error analyzing health metrics:", error);
    res.status(500).json({
      error: "Failed to analyze health metrics.",
      details: error.message || error,
    });
  }
});

// Setup development or production build configuration
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted for development.");
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving production static assets.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Health Platform server running on http://localhost:${PORT}`);
  });
}

setupServer();
