import mongoose, { Document, Schema } from "mongoose";

interface ITravelDetails {
  date: Date;
  time?: string;
  mode: "flight" | "train" | "other";
  number?: string;
  location?: string;
  from?: string;
  to?: string;
  pickupRequired?: boolean;
  dropRequired?: boolean;
}

export interface ITravel extends Document {
  familyId: mongoose.Types.ObjectId;

  arrival?: ITravelDetails;
  departure?: ITravelDetails;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const travelDetailsSchema = new Schema<ITravelDetails>(
  {
    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
    },

    mode: {
      type: String,
      enum: ["flight", "train", "other"],
      required: true,
    },

    number: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    from: {
      type: String,
      trim: true,
    },

    to: {
      type: String,
      trim: true,
    },

    pickupRequired: {
      type: Boolean,
      default: false,
    },

    dropRequired: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const travelSchema = new Schema<ITravel>(
  {
    familyId: {
      type: Schema.Types.ObjectId,
      ref: "Family",
      required: true,
      unique: true,
    },

    arrival: {
      type: travelDetailsSchema,
    },

    departure: {
      type: travelDetailsSchema,
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

const Travel = mongoose.model<ITravel>("Travel", travelSchema);

export default Travel;