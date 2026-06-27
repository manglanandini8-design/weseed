import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeImage(base64Image, mimeType) {

  const prompt = `
Analyze this civic issue image.

Return ONLY valid JSON.

{
  "issueType": "",
  "severity": "",
  "risk": "",
  "department": "",
  "confidence": ""
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
    console.log("FULL RESPONSE:",response);
    const text = response.text();

    console.log("RAW GEMINI RESPONSE:", text);

    return text
      .replace(/```json|```/gi, "")
      .trim();

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}