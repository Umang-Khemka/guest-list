import mongoose, { Document, Schema } from "mongoose";

export interface IVehicleAssignment extends Document {
  familyId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;

  type: "pickup" | "drop";

  date: Date;
  time: string;
  location: string;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const vehicleAssignmentSchema = new Schema<IVehicleAssignment>(
  {
    familyId: {
      type: Schema.Types.ObjectId,
      ref: "Family",
      required: true,
    },

    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    type: {
      type: String,
      enum: ["pickup", "drop"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
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

const VehicleAssignment = mongoose.model<IVehicleAssignment>(
  "VehicleAssignment",
  vehicleAssignmentSchema
);

export default VehicleAssignment;