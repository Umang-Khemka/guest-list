import { z } from "zod";

const travelDetailsSchema = z
  .object({
    date: z.coerce.date(),
    time: z.string().trim().optional(),

    mode: z.enum(["flight", "train", "bus", "car", "other"]),

    number: z.string().trim().optional(),
    location: z.string().trim().optional(),

    from: z.string().trim().optional(),
    to: z.string().trim().optional(),

    pickupRequired: z.boolean().default(false),
    dropRequired: z.boolean().default(false),
  })
  .strict();

export const createTravelSchema = z
  .object({
    familyId: z.string().min(1, "Family ID is required"),

    arrival: travelDetailsSchema.optional(),

    departure: travelDetailsSchema.optional(),

    notes: z.string().trim().optional(),
  })
  .strict()
  .refine(
    (data) => data.arrival || data.departure,
    {
      message: "Arrival or departure details are required",
    }
  );

export type CreateTravelInput = z.infer<typeof createTravelSchema>;

export const updateTravelSchema = createTravelSchema
  .omit({
    familyId: true,
  })
  .partial()
  .strict();

export type UpdateTravelInput = z.infer<typeof updateTravelSchema>;