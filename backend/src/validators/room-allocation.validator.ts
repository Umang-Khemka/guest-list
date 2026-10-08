import { z } from "zod";

export const createRoomAllocationSchema = z
  .object({
    familyId: z.string().min(1, "Family ID is required"),

    roomId: z.string().min(1, "Room ID is required"),

    allocatedFrom: z.coerce.date().optional(),

    allocatedUntil: z.coerce.date().optional(),

    occupantsCount: z
      .number()
      .int()
      .min(1, "Occupants count must be at least 1"),

    notes: z.string().trim().optional(),
  })
  .strict();

export type CreateRoomAllocationInput = z.infer<
  typeof createRoomAllocationSchema
>;

export const updateRoomAllocationSchema =
  createRoomAllocationSchema
    .omit({
      familyId: true,
      roomId: true,
    })
    .partial()
    .strict();

export type UpdateRoomAllocationInput = z.infer<
  typeof updateRoomAllocationSchema
>;

