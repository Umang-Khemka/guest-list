import { z } from "zod";

export const createVehicleSchema = z
  .object({
    name: z.string().trim().min(1, "Vehicle name is required"),
    vehicleNumber: z
      .string()
      .trim()
      .min(1, "Vehicle number is required"),
    driverName: z.string().trim().min(1, "Driver name is required"),
    driverPhone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number"),
    capacity: z.number().int().min(1, "Capacity must be at least 1"),
    notes: z.string().trim().optional(),
  })
  .strict();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

export const updateVehicleSchema = createVehicleSchema.partial().strict();

export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;