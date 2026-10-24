import { Router } from "express";
import { createCampaign, getCampaign } from "../controllers/campaign.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/send", createCampaign);
router.get("/:id", getCampaign);

export default router;