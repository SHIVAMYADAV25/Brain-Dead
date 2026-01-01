import z from "zod";
import mongoose, {Types} from "mongoose";
import type {Request, Response} from 'express';
import { Page } from "../models/Page.model.js";
import { storeChunk } from "../services/storeChunk.service.js";
import { Chunk } from "../models/Chunk.model.js";
// https://chatgpt.com/share/69558250-98e0-800b-914a-eb5820eae62e

const createPageSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title too long"),

  text: z
    .string()
    .min(1, "Page text cannot be empty")
})

const updatePageSchema = z
  .object({
    title: z
      .string()
      .min(1)
      .max(200)
      .optional(),

    text: z
      .string()
      .min(1)
      .optional()
  })
  .refine(
    (data) => data.title !== undefined || data.text !== undefined,
    {
      message: "At least one field must be updated"
    }
  )


const pageIdParamSchema = z.object({
  id: z.string().min(1, "Page ID is required")
})

const pageResponseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  text: z.string()
})

const pageListResponseSchema = z.array(
  pageResponseSchema.pick({
    _id: true,
    title: true,
    text : true
  })
)




export const pageController = {
    // /page =>  post
    async addPage(req:Request,res:Response){

        const parsed = createPageSchema.safeParse(req.body);

        if(!parsed.success){
            return res.status(400).json({
                    success: false,
                    error: parsed.error.format(),
                });
        }

        try {
            const { title , text} = parsed.data;
            const userId = req.userId
    
            if (!userId) {
                    return res.status(401).json({ success: false, error: "Unauthorized" });
                }
    
            const page = await Page.create({
                userId,
                title,
                text
            })
    
            if(!page){
                return res.status(403).json({
                        success:false,
                        error : "error creating the Page"
                })
            }
    
            await storeChunk({
                userId : new Types.ObjectId(userId),
                parentId : page._id,
                parentType : "page",
                text
            })
    
            res.status(200).json({
                    success : true,
                    data : {
                        "pageId" : page._id 
                    } 
                })
        } catch (error) {
            console.error("Add Page error:", error);
            return res.status(401).json({
                success : false,
                "error" : "error in creating Page" 
            })
        }
    },

    //pages =>  get

    async getPages(req:Request,res:Response){
        try {
            const userId = req.userId;
    
            if (!userId) {
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }
    
            const pages = await Page.find({
                userId
            }).select("_id title text")
    
            if(!pages){
                return res.status(401).json({
                    success : false,
                    "error" : "Did not find the Content" 
                })
            }
    
            const response = pageListResponseSchema.parse(
                pages.map(p=>({
                    _id : p._id.toString(),
                    title : p.title,
                    text : p.text
                }))
            )
    
            res.status(200).json({
                success : true,
                data : response
            })
        } catch (error) {
            console.error("Add content error:", error);
            return res.status(401).json({
                success : false,
                "error" : error
            })
        }
    },

    
}
