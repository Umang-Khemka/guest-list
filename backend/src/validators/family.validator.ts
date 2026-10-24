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
  .regex(/^\+?[0-9\s-]+$/, "Enter a valid phone number")
  .refine((value) => {
    const digits = value.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 15;
  }, "Phone number must contain 7 to 15 digits");

const familyMember = z.object({
  name: z.string().trim().min(1, "Member name is required"),
  contactNumber: phone,
  whatsappNumber: phone,
}).strict();

export const createFamilySchema = z
  .object({
    name: z.string().trim().min(1, "Family name is required"),
    primaryContact: phone,
    phone,
    members: z.array(familyMember).min(1, "Add at least one family member"),

    city: z.string().trim().min(1, "City is required"),
    address: z.string().trim().optional(),

    relationToGroom: z.string().trim().optional(),
    category: z.string().trim().optional(),
    group: z.enum(GROUPS),

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
