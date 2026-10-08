import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Vehicle from "../models/Vehicle.js";
import { createVehicleSchema, updateVehicleSchema } from "../validators/vehicle.validator.js";

// POST /api/vehicles
export const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createVehicleSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const existingVehicle = await Vehicle.findOne({
      vehicleNumber: parsed.data.vehicleNumber,
    });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: "Vehicle with this number already exists",
      });
    }

    const vehicle = await Vehicle.create(parsed.data);

    return res.status(201).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/vehicles
export const getVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vehicles = await Vehicle.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/vehicles/:id
export const getVehicleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/vehicles/:id
export const updateVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const parsed = updateVehicleSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (parsed.data.vehicleNumber) {
      const existingVehicle = await Vehicle.findOne({
        vehicleNumber: parsed.data.vehicleNumber,
        _id: { $ne: id },
      });

      if (existingVehicle) {
        return res.status(409).json({
          success: false,
          message: "Vehicle with this number already exists",
        });
      }
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: vehicle,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/vehicles/:id
export const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

