import { geminiLLM } from "../utils/LLM.utils.js";

export async function createEmbedding(text: string): Promise<number[]> {
  const model = geminiLLM.getGenerativeModel({
    model: "gemini-embedding-001",
  });

  const result = await model.embedContent(text);
  return result.embedding.values;
}
