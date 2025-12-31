import { createEmbedding } from "./embedding.service.js";
import { splitIntoChunks } from "./chunkCreator.service.js";
import { Chunk } from "../models/Chunk.model.js";
import type { Types } from "mongoose";

interface chunkType {
    userId : Types.ObjectId,
    parentType: "content" | "page",
    parentId : Types.ObjectId,
    text: string,
}

export async function storeChunk({userId,parentId,parentType,text} : chunkType) {
    const chunks = await splitIntoChunks(text);

    // creating embedding is async operation we need to run them parallely so aksath promise.all mai resolve hoga
    // chuckDocs => creates an array of promises

    //Promise.all(...):
        // Runs all embedding calls in parallel
        // Waits until all are resolved
        // Returns an array of results

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

    console.log(chunkDocs);
    
    await Chunk.insertMany(chunkDocs);
}