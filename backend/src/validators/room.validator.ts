import { z } from "zod";

export const createRoomSchema = z
  .object({
    roomNumber: z.string().trim().min(1, "Room number is required"),

    roomType: z.string().trim().optional(),

    capacity: z.number().int().min(1, "Capacity must be at least 1"),

    notes: z.string().trim().optional(),
  })
  .strict();

export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const updateRoomSchema = createRoomSchema.partial().strict();

export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;