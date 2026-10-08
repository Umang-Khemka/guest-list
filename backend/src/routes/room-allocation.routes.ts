import { Router } from "express";
import {
  createRoomAllocation,
  getRoomAllocations,
  getRoomAllocationById,
  getRoomAllocationByFamilyId,
  updateRoomAllocation,
  deleteRoomAllocation,
} from "../controllers/room-allocation.controller.js";

const router = Router();

router.post("/create-room", createRoomAllocation);
router.get("/all-allocations", getRoomAllocations);
router.get("/create-room/:id", getRoomAllocationById);
router.get("/create-room/family/:familyId", getRoomAllocationByFamilyId);
router.put("/create-room/:id", updateRoomAllocation);
router.delete("/create-room/:id", deleteRoomAllocation);

export default router;
