import { createEmbedding } from "./embedding.service.js";
import { splitIntoChunks } from "./chunkCreator.service.js";
import { Chunk } from "../models/Chunk.model.js";

interface chunkType {
    userId : string,
    parentType: "content" | "page",
    parentId : string,
    text: string,
}


export async function storeChunk({userId,parentId,parentType,text} : chunkType) {
    const chunks = await splitIntoChunks(text);

    const chunkDocs = await Promise.all(
        chunks.map(async (chunk,index)=>{
        const embedding = await createEmbedding(chunk);

        return {
            userId,
            parentType,
            parentId,
            index,
            text:chunk,
            embedding
        }
        })
    )
    
    await Chunk.insertMany(chunkDocs);
}