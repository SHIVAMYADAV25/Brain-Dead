import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 400,
  chunkOverlap: 100,
});

export async function splitIntoChunks(text: string): Promise<string[]> {
  return splitter.splitText(text);
}
