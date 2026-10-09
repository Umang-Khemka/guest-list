import { z } from "zod";

export const createVehicleAssignmentSchema = z
  .object({
    familyId: z.string().min(1, "Family ID is required"),
    vehicleId: z.string().min(1, "Vehicle ID is required"),
    type: z.enum(["pickup", "drop"]),
    date: z.coerce.date(),
    time: z.string().trim().min(1, "Time is required"),
    location: z.string().trim().min(1, "Location is required"),
    notes: z.string().trim().optional(),
  })
  .strict();

export type CreateVehicleAssignmentInput = z.infer<
  typeof createVehicleAssignmentSchema
>;

export const updateVehicleAssignmentSchema = createVehicleAssignmentSchema
  .omit({
    familyId: true
  })
  .partial()
  .strict();

export type UpdateVehicleAssignmentInput = z.infer<
  typeof updateVehicleAssignmentSchema
>;