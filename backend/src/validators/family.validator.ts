import { z } from "zod";

export const GROUPS = [
  "mom_side",
  "dad_side",
  "grandmother_side",
  "brothers_friends",
  "business_friends",
  "others",
] as const;

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number");

export const createFamilySchema = z
  .object({
    name: z.string().trim().min(1, "Family name is required"),
    primaryContact: z.string().trim().min(1, "Primary contact is required"),
    phone,
    alternatePhone: phone.optional(),

    city: z.string().trim().min(1, "City is required"),
    address: z.string().trim().optional(),

    relationToGroom: z.string().trim().optional(),
    category: z.string().trim().optional(),
    group: z.enum(GROUPS),

    invitedCount: z.number().int().min(1),
    confirmedCount: z.number().int().min(0).default(0),

    status: z.enum(["pending", "confirmed", "declined"]).default("pending"),
    guestType: z.enum(["local", "outstation"]),
    priority: z.enum(["normal", "important", "vip"]).default("normal"),

    notes: z.string().trim().optional(),
  })
  .strict(); // rejects unknown fields such as _id, createdAt

export type CreateFamilyInput = z.infer<typeof createFamilySchema>;

export const updateFamilySchema = createFamilySchema.partial().strict();

export type UpdateFamilyInput = z.infer<typeof updateFamilySchema>;