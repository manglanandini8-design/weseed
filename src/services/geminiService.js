// src/services/geminiService.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeImage(base64Image, mimeType) {
  const prompt = `
You are Seed Agent, an expert civic issue analyst for a hyperlocal cleanup platform.

Analyze the image and return **ONLY** clean, valid JSON. No extra text, no markdown.

{
  "issueType": "Garbage dump / Pothole / Dirty water / Littering / Open burning / etc",
  "severity": "Mild | Moderate | Severe | Critical",
  "risk": "Short description of public health or safety risk",
  "department": "Municipal Corporation / PWD / Water Board / etc",
  "suggestedAction": "Short actionable suggestion",
  "confidence": 85,
  "summary": "One clear human-readable sentence"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            mimeType,
            data: base64Image,
          },
        },
        {
          text: prompt,
        },
      ],
    });

    const text = response.text();
    console.log("Gemini Raw Response:", text);

    // Clean the response
    return text
      .replace(/```json|```/gi, "")
      .trim();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}