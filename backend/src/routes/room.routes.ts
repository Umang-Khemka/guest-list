import { Router } from "express";
import {
  createRoom,
  getRoomById,
  getRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";

const router = Router();

router.post("/create-room", createRoom);
router.get("/get-rooms", getRooms);
router.get("/get-rooms/:id", getRoomById);
router.put("/update-room/:id", updateRoom);
router.delete("/delete-room/:id", deleteRoom);

export default router;
