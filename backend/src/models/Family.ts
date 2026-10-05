import mongoose, { Document, Schema } from "mongoose";

export interface IFamily extends Document {
  name: string;
  primaryContact: string;
  phone: string;
  alternatePhone?: string;

  city: string;
  address?: string;

  relationToGroom?: string;
  category?: string;

  invitedCount: number;
  confirmedCount: number;

  status: "pending" | "confirmed" | "declined" | "partial";

  guestType: "local" | "outstation";

  priority: "normal" | "important" | "vip";

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const familySchema = new Schema<IFamily>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    primaryContact: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    alternatePhone: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    relationToGroom: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    invitedCount: {
      type: Number,
      required: true,
      min: 1,
    },

    confirmedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "declined", "partial"],
      default: "pending",
    },

    guestType: {
      type: String,
      enum: ["local", "outstation"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["normal", "important", "vip"],
      default: "normal",
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Family = mongoose.model<IFamily>("Family", familySchema);

export default Family;