import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";

const router = Router();

router.post("/add",projectController.addProject);
router.get("/projects",projectController.getProject);
router.get("/projects/:id",projectController.getProjectById);
router.post("/projects/:id/add-content",projectController.addContentToProjectById);
router.post("/projects/:id/add-page",projectController.addPageToProjectById);

export default router;