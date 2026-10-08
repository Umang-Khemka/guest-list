import { Router } from "express";
import {
  createVehicleAssignment,
  getVehicleAssignments,
  getVehicleAssignmentById,
  getVehicleAssignmentsByFamilyId,
  updateVehicleAssignment,
  deleteVehicleAssignment,
} from "../controllers/vehicle-assignment.controller.js";

const router = Router();

router.post("/create", createVehicleAssignment);
router.get("/all", getVehicleAssignments);
router.get("/family/:familyId", getVehicleAssignmentsByFamilyId);
router.get("/create/:id", getVehicleAssignmentById);
router.put("/create/:id", updateVehicleAssignment);
router.delete("/create/:id", deleteVehicleAssignment);

export default router;