import { Router } from "express";
import { pageController } from "../controllers/page.controller.js";

const router = Router();

router.post("/add",pageController.addPage);
router.get("/pages",pageController.getPages);
router.get("/:id",pageController.getPagesById);
router.patch("/:id",pageController.editPageById);
router.delete("/:id",pageController.deletePageById);

export default router