import { Router } from "express";
import { createFamily,getFamilies,getFamilyById, updateFamily,deleteFamily } from "../controllers/family.controller.js";

const router = Router();

router.post("/add-family", createFamily);
router.get("/search", getFamilies);
router.get("/:id", getFamilyById);
router.put("/:id", updateFamily);
router.delete("/:id", deleteFamily);

export default router;