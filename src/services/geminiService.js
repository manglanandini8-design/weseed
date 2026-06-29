import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeImage(base64Image, mimeType) {
  const prompt = `
You are Seed Agent, an expert civic issue analyst for a hyperlocal community cleanup platform.

Analyze the uploaded image and return ONLY valid JSON with no extra text, no markdown, no code blocks.

{
  "issueType": "Garbage dump / Pothole / Dirty water / Littering / Open burning / Illegal dumping / etc",
  "severity": "Mild | Moderate | Severe | Critical",
  "risk": "Short description of public health or safety risk (1-2 sentences)",
  "department": "Municipal Corporation / PWD / Water Board / Health Department / etc",
  "suggestedAction": "Short actionable suggestion for citizens or authorities",
  "confidence": 87,
  "summary": "One clear, human-readable sentence describing the issue and urgency",
  "estimatedAffectedArea": "Small (< 10m²) | Medium (10–50m²) | Large (> 50m²)",
  "urgency": "Low | Medium | High | Immediate",
  "healthHazard": "None | Low | Moderate | High",
  "environmentImpact": "Minimal | Moderate | Significant | Severe"
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

console.log("================================");
console.log("RAW GEMINI RESPONSE");
console.log(text);
console.log("TYPE:", typeof text);
console.log("================================");

return text
  .replace(/```json|```/gi, "")
  .trim();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
