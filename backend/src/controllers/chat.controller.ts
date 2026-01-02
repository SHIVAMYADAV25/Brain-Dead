import z from "zod";
import { v4 as uuid } from "uuid";
import type { Request,Response } from "express";
import { Page } from "../models/Page.model.js";
import { Content } from "../models/Content.model.js";
import { ChatContext } from "../models/ChatContext.model.js";
import mongoose from "mongoose";

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


const ChatController = {
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
        scopeId : objectIds,
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

  }
}