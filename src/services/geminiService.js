import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

export async function analyzeImage(base64Image, mimeType) {
  const prompt = `
You are Seed Agent, an AI civic assistant for WeSeed.

Analyze the uploaded image of a community or environmental issue.

Identify:
1. Issue Type
2. Specific Problem
3. Severity
4. Risk Level
5. Resolution Type

Resolution Type must be exactly one of:
- Community Action
- Authority Required
- Emergency Attention

Then provide:
- Estimated volunteers required
- Estimated duration
- Required materials
- Estimated Cost
- Suggested immediate action
- Suitable Authority Department
- Authority notification


Return ONLY valid JSON.

{
  "issueType": "",
  "severity": "",
  "risk": "",
  "department": "",
  "volunteers": "",
  "duration": "",
  "action": ""
}

Do not return markdown.
Do not return explanations.
Do not return any text outside JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          data: base64Image,
          mimeType,
        },
      },
      prompt,
    ],
  });

  return response.text;
}