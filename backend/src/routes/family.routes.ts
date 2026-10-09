import { Router } from "express";
import { createFamily,getFamilies,getFamilyById, updateFamily,deleteFamily } from "../controllers/family.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
    
router.use(authMiddleware);

router.post("/add-family", createFamily);
router.get("/search", getFamilies);
router.get("/:id", getFamilyById);
router.put("/:id", updateFamily);
router.delete("/:id", deleteFamily);

export default router;