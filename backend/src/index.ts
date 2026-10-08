import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import familyRoutes from "./routes/family.routes.js";
import roomAllocationRoutes from "./routes/room-allocation.routes.js";
import roomRoutes from "./routes/room.routes.js";
import travelRoutes from "./routes/travel.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import vehicleAssignmentRoutes from "./routes/vehicle-assignment.routes.js";

dotenv.config();

const app = express();

const PORT: number = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Wedding Guest API is running",
  });
});

app.use("/api/v1/families", familyRoutes);
app.use("/api/v1/room-allocations", roomAllocationRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/travels", travelRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/vehicle-assignments", vehicleAssignmentRoutes);

app.listen(PORT, (): void => {
  console.log(`Server is running at ${PORT}`);
  connectDB();
});