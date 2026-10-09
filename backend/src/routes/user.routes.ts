import { Router } from "express";
import { register, login, logout, checkAuth } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check", authMiddleware, checkAuth);

export default router;