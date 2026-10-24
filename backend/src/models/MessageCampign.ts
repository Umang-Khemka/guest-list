import mongoose, { Document, Schema } from "mongoose";

export type RecipientStatus = "pending" | "sent" | "delivered" | "read" | "failed";

interface IMessageRecipient {
  _id: mongoose.Types.ObjectId;
  familyId: mongoose.Types.ObjectId;
  memberName: string;
  phone: string; // normalized, digits only, with country code
  status: RecipientStatus;
  waMessageId?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  readAt?: Date;
  error?: string;
}

export interface IMessageCampaign extends Document {
  sender: "mom" | "dad";
  templateId?: mongoose.Types.ObjectId;
  message: string;
  mediaUrl?: string;
  recipients: IMessageRecipient[];
  createdAt: Date;
  updatedAt: Date;
}

const recipientSchema = new Schema<IMessageRecipient>({
  familyId: { type: Schema.Types.ObjectId, ref: "Family", required: true },
  memberName: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "sent", "delivered", "read", "failed"],
    default: "pending",
  },
  waMessageId: { type: String, index: true },
  sentAt: Date,
  deliveredAt: Date,
  readAt: Date,
  error: { type: String, trim: true },
});

const campaignSchema = new Schema<IMessageCampaign>(
  {
    sender: { type: String, enum: ["mom", "dad"], required: true },
    templateId: { type: Schema.Types.ObjectId, ref: "MessageTemplate" },
    message: { type: String, required: true, trim: true },
    mediaUrl: { type: String, trim: true },
    recipients: {
      type: [recipientSchema],
      validate: {
        validator: (r: unknown[]) => r.length > 0,
        message: "Campaign must have at least one recipient",
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model<IMessageCampaign>("MessageCampaign", campaignSchema);