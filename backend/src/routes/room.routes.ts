import { Router } from "express";
import {
  createRoom,
  getRoomById,
  getRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/room.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);

router.post("/create-room", createRoom);
router.get("/get-rooms", getRooms);
router.get("/get-rooms/:id", getRoomById);
router.put("/update-room/:id", updateRoom);
router.delete("/delete-room/:id", deleteRoom);

export default router;
