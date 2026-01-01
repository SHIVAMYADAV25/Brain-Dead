import z, { success } from "zod";
import type { Request,Response } from "express";
import { Project } from "../models/Project.model.js";
import { Content } from "../models/Content.model.js";
import { Types } from "mongoose";
import { Page } from "../models/Page.model.js";

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Page text cannot be empty")
});

const objectIdSchema = z.string().min(1, "Invalid ID");

const addContentToProjectInputSchema = z.object({
  contentId: objectIdSchema,
});

const IdParamSchema = z.object({
  id: objectIdSchema
})

const addPageToProjectInputSchema = z.object({
  pageId: objectIdSchema,
});

const projectResponseSchema = z.object({
  _id: z.string(),
  name: z.string(),
  contentIds: z.string(),
  pageIds: z.string()
})

const projectListResponseSchema = z.array(
  projectResponseSchema.pick({
    _id: true,
    name: true,
    contentIds: true,
    pageIds: true
  })
)




export const projectController = {
    // project => post
    async addProject(req:Request,res:Response){
        const parsed = createProjectSchema.safeParse(req.body);

        if(!parsed.success){
            return res.status(400).json({
                    success: false,
                    error: parsed.error.format(),
                });
        }

        try {
            const {name} = parsed.data;
    
            const userId = req.userId
        
            if (!userId) {
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }
    
            const project = await Project.create({
                name,
                userId
            })

            if(!project){
                return res.status(403).json({
                        success:false,
                        error : "error creating the Project"
                    })
            }

            res.status(200).json({
                success : true,
                data : {
                    projectId : project._id,
                    name : project.name
                }
            })
        } catch (error) {
            console.error("Add Project error:", error);
            return res.status(401).json({
                success : false,
                "error" : "Error in creating Project" 
            })
        }
    },

    // /projects => get

    async getProject(req:Request,res:Response){
        try {
            const userId = req.userId;
    
            if (!userId) {
                return res.status(401).json({ success: false, error: "Unauthorized" });
            }

            const projects = await Project.find({userId}).select("_id name contentIds pageIds");

            if(!projects){
                return res.status(403).json({
                        success:false,
                        error : "error creating the Project"
                    })
            }

            const response = projectListResponseSchema.parse(
                projects.map(p=>({
                    _id : p._id.toString(),
                    name : p.name,
                    contentIds : p.contentIds.toString(),
                    pageIds : p.pageIds.toString()
                }))
            )

            res.status(200).json({
                success:true,
                data : response
            })

        }catch(error){
            console.error("getting project error:", error);
            return res.status(401).json({
                success : false,
                "error" : error
            })
        }
    },

    // /projects/:Id => get

    async getProjectById(req:Request,res:Response){
        const parsed = IdParamSchema.safeParse(req.params)

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
 
         const project = await Project.findOne({
             _id : id,
             userId
         })
 
         if(!project){
             return res.status(404).json({
                 success: false,
                 error: "Project not found"
             })
         }
 
         const response = projectResponseSchema.parse({
            _id : project._id.toString(),
            name: project.name,
            contentIds: project.contentIds,
            pageIds: project.pageIds
         })
 
         res.status(200).json({
             success: true,
             data : response
         })
       } catch (error) {
        console.error("getting project error:", error);
            return res.status(401).json({
                success : false,
                "error" : "error on server side"
            })
       }
    },

    

}