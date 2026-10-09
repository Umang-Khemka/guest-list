import { Router } from "express";
import {
  createVehicleAssignment,
  getVehicleAssignments,
  getVehicleAssignmentById,
  getVehicleAssignmentsByFamilyId,
  updateVehicleAssignment,
  deleteVehicleAssignment,
} from "../controllers/vehicle-assignment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/create", createVehicleAssignment);
router.get("/all", getVehicleAssignments);
router.get("/family/:familyId", getVehicleAssignmentsByFamilyId);
router.get("/create/:id", getVehicleAssignmentById);
router.put("/create/:id", updateVehicleAssignment);
router.delete("/create/:id", deleteVehicleAssignment);

export default router;