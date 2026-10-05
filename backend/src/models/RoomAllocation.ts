import mongoose, { Document, Schema } from "mongoose";

export interface IRoomAllocation extends Document {
  familyId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;

  allocatedFrom?: Date;
  allocatedUntil?: Date;

  occupantsCount: number;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const roomAllocationSchema = new Schema<IRoomAllocation>(
  {
    familyId: {
      type: Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    allocatedFrom: {
      type: Date,
    },

    allocatedUntil: {
      type: Date,
    },

    occupantsCount: {
      type: Number,
      required: true,
      min: 1,
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

const RoomAllocation = mongoose.model<IRoomAllocation>(
  "RoomAllocation",
  roomAllocationSchema
);

export default RoomAllocation;