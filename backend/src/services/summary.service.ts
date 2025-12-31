import { geminiLLM } from "../utils/LLM.utils.js";

export async function createSummary(text: string): Promise<string> {
  try {
    const model = geminiLLM.getGenerativeModel({
      model: "gemini-2.5-flash-lite"
    });

    const prompt = `
        You summarize content accurately without adding opinions or extra information.

        Task:
        Provide a short summary of the text below. Focus only on the main points and avoid unnecessary details.

        TEXT:
        ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log("summary : ",response);

    return response;
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "summary was not generated";
  }
}
