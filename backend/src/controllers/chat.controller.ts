import z from "zod";
import { v4 as uuid } from "uuid";
import type { Request,Response } from "express";
import { Page } from "../models/Page.model.js";
import { Content } from "../models/Content.model.js";
import { ChatContext } from "../models/ChatContext.model.js";
import mongoose, { Types } from "mongoose";
import { Chat } from "../models/Chat.model.js";
import { createEmbedding } from "../services/embedding.service.js";
import { similaritySerach } from "../services/RAG/similarity.service.js";
import { RAGLLM } from "../services/RAG/RAGLLM.service.js";

const chatContextInputSchema = z.object({
  scope: z.enum(["page", "content"]),
  scopeIds: z.array(z.string().min(1)).min(1)
});

const chatInputSchema = z.object({
  message : z.string().min(1),
  contextToken : z.string().optional(),
  chatId : z.string().optional()
}).refine(
  d => (d.contextToken && !d.chatId) ||
  (!d.contextToken && d.chatId),
  {message : "Either contextToken or chatId is required"}
);


export const ChatController = {
  // /chat/context
  async chatContext(req:Request,res:Response){ 
    // 1. Validate input using Zod
    // 2. Verify user authentication
    // 3. Verify ownership of ALL scopeIds
    // 4. Generate UUID token
    // 5. Save ChatContext with expiry (e.g. now + 30 min)
    // 6. Return token

    const parsed = chatContextInputSchema.safeParse(req.body);

    if(!parsed.success){
      return res.status(400).json({
                    success: false,
                    error: parsed.error.format(),
                });
    }

    try {
      const {scope,scopeIds} = parsed.data;
      const userId = req.userId;
  
      if (!userId) {
                  return res.status(401).json({ success: false, error: "Unauthorized" });
              }
  
      const objectIds = scopeIds.map((id)=> new mongoose.Types.ObjectId(id));
  
      let ownedCount = 0;
  
      // https://chatgpt.com/share/69575699-d9e8-800b-89d4-213ed56e4329
      if(scope === "page"){
        ownedCount = await Page.countDocuments({
          _id : {$in : objectIds},
          userId,
        });
      }else{
        ownedCount = await Content.countDocuments({
          _id : {$in : objectIds},
          userId
        });
      }
  
      if(ownedCount !== objectIds.length){
        return res.status(403).json({
          success: false,
          error: "One or more selected items are invalid or unauthorized",
        });
      }
  
      const token = uuid();
  
      await ChatContext.create({
        token,
        userId,
        scope,
        scopeIds : objectIds,
        expiresAt : new Date(Date.now() + 30 * 60 *1000)
      })
      
      return res.status(200).json({
        success : true,
        data : {
          contextToken : token
        }
      })
    } catch (error) {
      console.error("chatContext error:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  },
  // /chat
  async chat(req:Request,res:Response){

    const parsed = chatInputSchema.safeParse(req.body);

    if(!parsed.success){
      return res.status(400).json({
                    success: false,
                    error: parsed.error.format(),
                });
    }

    const {message,contextToken,chatId} = parsed.data;

    const userId = req.userId;

    if (!userId) {
                  return res.status(401).json({ success: false, error: "Unauthorized" });
              }

    let scope:"page" | "content" ;
    let scopeIds:Types.ObjectId[];
    let chat;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      // MODE 1 - first Message
      if(contextToken){
        const chatcontext = await ChatContext.findOne({
          token : contextToken,
          userId,
          expiresAt : {$gt : new Date()}  //a comparison query operator meaning "greater than" (>) that selects documents where a field's value is numerically or lexicographically larger than the specified value
        }).session(session);
  
        if(!chatcontext){
          await session.abortTransaction();
          return res.status(400).json({
            success : false,
            error : "context is expired"
          })
        }
  
        scope = chatcontext.scope; 
        scopeIds = chatcontext.scopeIds;
        
  
        const queryEmbedding = await createEmbedding(message);
  
        const context = await similaritySerach({queryEmbedding:queryEmbedding,userId: userId,parentType : scope ,parentIds : scopeIds})
  
        const answer = await RAGLLM(context,message);
  
        const chatDoc = new Chat({
          userId,
          scope,
          scopeIds,
          messages: [
            { role: "user", text: message },
            { role: "ai", text: answer }
          ],
          lastMessageAt: new Date()
        });

        await chatDoc.save({ session });

        await ChatContext.deleteOne(
          { token: contextToken, userId },
          { session }
        );

        await session.commitTransaction();

        return res.json({
          success: true,
          data: { chatId: chatDoc._id, answer }
        });

      } 
  
      /* MODE 2 — CONTINUATION */
    
      chat = await Chat.findOne({
        _id:chatId,
        userId
      }).session(session);
  
      if (!chat) {
        await session.abortTransaction();
        return res.status(404).json({ success: false, error: "Chat not found" });
      }
  
      //@ts-ignores
      scope = chat.scope;
      scopeIds = chat.scopeIds;
  
      // message ke embedding
  
      const queryEmbedding = await createEmbedding(message)
  
      // similarity search
  
      const context = await similaritySerach({queryEmbedding,userId,parentType:scope,parentIds :scopeIds})
  
      // give text store with embedding to llm
      
      // llm out 
      const output_LLM = await RAGLLM(context,message);
  
      // save the llm out 
  
      chat.messages.push(
        { role: "user", text: message },
        { role: "ai", text: output_LLM }
      )
      chat.lastMessageAt = new Date();
  
      await chat.save({ session });
  
      await session.commitTransaction();
      // send the response
  
      return res.status(200).json({
        success : true,
        data: {answer : output_LLM}
      })
    } catch (error) {
      await session.abortTransaction();
      console.error("Edit page failed:", error);

      res.status(500).json({
          success: false,
          error: "Failed to update page"
      });

    }finally{
        session.endSession();
    }
  }
}