import mongoose, { Document, Schema } from "mongoose";

interface IMessageRecipient {
  familyId: mongoose.Types.ObjectId;
  status: "pending" | "sent" | "failed";
  sentAt?: Date;
  error?: string;
}

export interface IMessageCampaign extends Document {
  templateId?: mongoose.Types.ObjectId;

  message: string;
  mediaUrl?: string;

  recipients: IMessageRecipient[];

  createdAt: Date;
  updatedAt: Date;
}

const messageRecipientSchema = new Schema<IMessageRecipient>(
  {
    familyId: {
      type: Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },

    sentAt: {
      type: Date,
    },

    error: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const messageCampaignSchema = new Schema<IMessageCampaign>(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "MessageTemplate",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    mediaUrl: {
      type: String,
      trim: true,
    },

    recipients: {
      type: [messageRecipientSchema],
      required: true,
      validate: {
        validator: (recipients: IMessageRecipient[]) =>
          recipients.length > 0,
        message: "Campaign must have at least one recipient",
      },
    },
  },
  {
    timestamps: true,
  }
);

const MessageCampaign = mongoose.model<IMessageCampaign>(
  "MessageCampaign",
  messageCampaignSchema
);

export default MessageCampaign;