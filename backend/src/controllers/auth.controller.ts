import type { Request, Response } from "express";
import { User } from "../models/User.model.js";
import { bcryptConfig } from "../utils/bcrypt.utils.js";
import { jwtConfig } from "../config/jwt.config.js";
import z from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
});

export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});


const authController = {
    async signUp(req :Request,res : Response){
        const parsed = signupSchema.safeParse(req.body);

        if(!parsed.success){
            return res.status(400).json({
                success: false,
                error: parsed.error.format(),
            });
        }

        try {
            const { name, email, password } = parsed.data;
    
            const userExist = await User.find({email})
    
            if(userExist){
                return res.status(400).json({
                    success: false,
                    error: "User already exists",
                });
            }
    
            const hashPassword = await bcryptConfig.hash(password);
    
            const user = await User.create({
                name,
                email,
                password : hashPassword
            })
    
            if(!user){
                return res.status(400).json({
                    success: false,
                    error: "Error creating a User",
                });
            }
    
            return res.status(200).json({
                success : true,
                data : {
                    _id : user._id,
                    email : user.email
                }
            })
        } catch (error) {
            return res.status(500).json({
                success : false,
                "error" : `Iternal server Error ${error}`
            })
        }
    },

}

export {authController}