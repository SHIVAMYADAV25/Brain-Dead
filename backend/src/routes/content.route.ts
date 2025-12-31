import  { Router , type Router as ExpressRouter}from "express";
import {contentController} from "../controllers/content.controller.js"

const router : ExpressRouter  = Router();

router.post("/add",contentController.addcontent);
router.get("/get",contentController.getContent);
// router.get("/healthcheck",contentController.check);

export default router
