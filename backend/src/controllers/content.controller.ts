import z from 'zod';
import {Types} from "mongoose";
import type { Request,Response } from 'express';
import { detectType } from '../utils/detectType.utils.js';
import { extractor } from '../services/extractor.service.js';
import { createSummary } from '../services/summary.service.js';
import { Content } from '../models/Content.model.js';
import { storeChunk } from '../services/storeChunk.service.js';

export const ContentInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1,"title is required"),

  url: z
    .string()
    .min(1, "Url is required"),  
});

export const contentController = {
    async addcontent(req:Request,res:Response) {
        const parsed = ContentInputSchema.safeParse(req.body);

        if(!parsed.success){
            return res.status(400).json({
                    success: false,
                    error: parsed.error.format(),
                });
        }

        try {
            const {title,url} = parsed.data;

            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }
    
            const contentType = detectType(url);
    
            const extractedText = extractor;
    
            const summariedData = await createSummary(extractedText);
    
            const contentCreated = await Content.create({
                userId,
                title,
                sourceUrl : url,
                type : contentType,
                extractedText : extractedText,
                summary : summariedData
            })
    
            if(!contentCreated){
                return res.status(403).json({
                    success:false,
                    error : "error creating the content"
                })
            }

            const userObjectId = new Types.ObjectId(userId);
    
            await storeChunk({
                userId : userObjectId,
                parentId : contentCreated._id,
                parentType : "content",
                text : extractedText
            });
    
            res.status(200).json({
                success : true,
                data : {
                    contentId : contentCreated._id.toString(),
                    summary : summariedData
                } 
            })
        } catch (error) {
            console.error("Add content error:", error);
            return res.status(401).json({
                success : false,
                "error" : "error in adding content" 
            })
        }

    },
    // check(req:Request,res:Response){
    //     if(!req.userId){
    //        return res.status(200).json({
    //         message : "nahi mila token"
    //     }) 
    //     }

    //     console.log( req.userId);
        
    //     res.status(200).json({
    //         message : req.userId
    //     })
    // }

    async getContent(req : Request,res:Response){
        try {
            const userId = new Types.ObjectId(req.userId);
    
            if (!userId) {
                    return res.status(401).json({ success: false, error: "Unauthorized" });
                }
    
            const allContent = await Content.find({
                userId
            })

            if(!allContent){
                return res.status(401).json({
                    success : false,
                    "error" : "Did not find the Content" 
                })
            }
    
            res.status(200).json({
                success : true,
                data : allContent.map((content) => (
                    {
                    "_id" : content._id,
                    "title" : content.title,
                    "summary" : content.summary,
                    "type" : content.type,
                    "URL" : content.sourceUrl
                }
                ))
            })
        } catch (error){
            console.error("Add content error:", error);
            return res.status(401).json({
                success : false,
                "error" : error
            })
        }
    }
}