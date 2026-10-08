import { Router } from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller.js";

const router = Router();

router.post("/create", createVehicle);
router.get("/all", getVehicles);
router.get("/create/:id", getVehicleById);
router.put("/create/:id", updateVehicle);
router.delete("/create/:id", deleteVehicle);

export default router;