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
            console.error("Add Page error:", error);
            return res.status(401).json({
                success : false,
                "error" : error
            })
        }
    },

    // /pages/:id =>  get

    async getPagesById(req:Request,res:Response){
        const parsed = pageIdParamSchema.safeParse(req.params)

        if(!parsed.success){
            return res.status(400).json({
                    success: false,
                    error: parsed.error.format(),
                });
        }

       try {
         const { id } = parsed.data;
         const userId = req.userId;
     
         if (!userId) {
             return res.status(401).json({ success: false, error: "Unauthorized" });
         }
 
         const page = await Page.findOne({
             _id : id,
             userId
         })
 
         if(!page){
             return res.status(404).json({
                 success: false,
                 error: "Page not found"
             })
         }
 
         const response = pageResponseSchema.parse({
             _id : page._id.toString(),
             title : page.title,
             text : page.text
         })
 
         res.status(200).json({
             success: true,
             data : response
         })
       } catch (error) {
        console.error("getting error:", error);
            return res.status(401).json({
                success : false,
                "error" : "error on server side"
            })
       }
    },

    
    // /pages/:id  => patch
    // to learn about session check this => https://chatgpt.com/s/t_69557a25a54881918d87ba10cea0081b
    async editPageById(req:Request,res:Response){
        const session = await mongoose.startSession();
        const paramParsed = pageIdParamSchema.safeParse(req.params);
        const bodyParsed = updatePageSchema.safeParse(req.body);
        const userId = req.userId;

        if(!paramParsed.success || !bodyParsed.success){
            return res.status(400).json({
                success: false,
                error: paramParsed.error?.format() || bodyParsed.error?.format()
            });
        }

        if(!userId){
            return res.status(403).json({
                success: false,
                error: "Unauthorized"
            });
        }

        const {id} = paramParsed.data;
        const {title,text} = bodyParsed.data;

        const updatePayload : Record<string,string> = {}

        if(title !== undefined) updatePayload.title = title;
        if(text !== undefined) updatePayload.text = text;

        try {
            session.startTransaction();
            
            const page = await Page.findOneAndUpdate(
                {_id : id , userId}, //Finds only the Page owned by this user
                updatePayload, // Updates only the provided fields
                {new : true,session}  // Returns the updated Page
            )
    
            if(!page){
                await session.abortTransaction();
                return res.status(404).json({
                    success:false,
                    error : "page not found"
                })
            }
    
            await Chunk.deleteMany({
                parentType:"page",
                parentId : page._id
            },{session})
    
            await storeChunk({
                    userId : new Types.ObjectId(userId),
                    parentId : page._id,
                    parentType : "page",
                    text : page.text,
                    session
                })

            await session.commitTransaction();
    
            res.status(200).json({
                success : true,
                data : {
                    pageId : page._id.toString()
                }
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

    },

    // /pages/:id => delete

    async deletePageById(req:Request,res:Response){
        const session = await mongoose.startSession();
        const parsed = pageIdParamSchema.safeParse(req.params);

        if(!parsed.success){
            return res.status(400).json({
                    success: false,
                    error: parsed.error.format(),
                });
        }

        const { id } = parsed.data;
        const userId = req.userId;
     
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        try {
            session.startTransaction();
            const page = await Page.findOneAndDelete({
                _id : id,
                userId
            },{session})
    
            if(!page){
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    error: "Page not found"
                })
            }
    
            await Chunk.deleteMany({
                parentType : "page",
                parentId : page._id
            },{session})
    
            await session.commitTransaction();

            res.status(200).json({
                success: true
            });
        } catch (error) {
            await session.abortTransaction();
            console.error("Delete page failed:", error);

            res.status(500).json({
                success: false,
                error: "Failed to delete page"
            });
        } finally{
            session.endSession();
        }
    }
    
}
