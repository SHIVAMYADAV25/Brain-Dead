import  { Router , type Router as ExpressRouter}from "express";
import { authController } from "../controllers/auth.controller.js";

const router : ExpressRouter  = Router();

router.post("/signup",authController.signUp);
router.post("/signin",authController.signIn);

export default router