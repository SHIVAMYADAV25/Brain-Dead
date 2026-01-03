import { Types } from "mongoose";
import { Chunk } from "../../models/Chunk.model.js";

type similarityInput = {
    queryEmbedding : number[],
    userId : string,
    parentType  : "page" | "content",
    parentIds : Types.ObjectId[]
}


export async function similaritySerach({queryEmbedding,userId,parentType,parentIds}:similarityInput):Promise<string>{
    const similarity = await Chunk.aggregate([
        {
            $vectorSearch : {
                index : "chunk_vector_index",  // Name of the vector index you created in Atlas.
                queryVector : queryEmbedding, // This is the embedding of user’s question
                path : "embedding",  // Field in your document that contains vectors.
                numCandidates : 100,  //From the whole collection, first shortlist ~100 likely matches
                limit : 5,  // Final number of results returned.
                filter:{ //ONLY search inside documents that belong to this user AND these pages/content.
                    userId : new Types.ObjectId(userId),
                    parentType,
                    parentId : {$in : parentIds}
                }
            }
        },{
            $project : {    // decides what fields to keep or remove in the final output.
                text : 1,   // keep
                parentId : 1,   // keep
                score : {$meta : "vectorSearchScore"} //Also include the similarity score MongoDB calculated.
            }
        }
    ])

    return similarity.filter(r => r.text).join("\n\n")
} 
