import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

async function textSlipter(document : string):Promise<string[]> {
    const splitter = new RecursiveCharacterTextSplitter({chunkSize : 400,chunkOverlap :100});
    const text =  splitter.splitText(document)
    return text
}