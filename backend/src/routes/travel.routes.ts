import { Router } from "express";
import {
  createTravel,
  getTravels,
  getTravelById,
  getTravelByFamilyId,
  updateTravel,
  deleteTravel,
} from "../controllers/travel.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/create", createTravel);
router.get("/all-travels", getTravels);
router.put("/update/:id", updateTravel);
router.get("/:id", getTravelById);
router.get("/family/:familyId", getTravelByFamilyId);
router.delete("/delete/:id",deleteTravel);

export default router;