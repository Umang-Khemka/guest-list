import mongoose, { Document, Schema } from "mongoose";

export interface IMessageTemplate extends Document {
  name: string;
  type:
    | "invitation"
    | "rsvp"
    | "travel"
    | "accommodation"
    | "pickup"
    | "custom";

  message: string;
  mediaUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}

const messageTemplateSchema = new Schema<IMessageTemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "invitation",
        "rsvp",
        "travel",
        "accommodation",
        "pickup",
        "custom",
      ],
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const MessageTemplate = mongoose.model<IMessageTemplate>(
  "MessageTemplate",
  messageTemplateSchema
);

export default MessageTemplate;