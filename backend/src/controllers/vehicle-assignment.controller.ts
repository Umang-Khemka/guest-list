import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import VehicleAssignment from "../models/VehicleAssignment.js";
import Family from "../models/Family.js";
import Vehicle from "../models/Vehicle.js";
import {
  createVehicleAssignmentSchema,
  updateVehicleAssignmentSchema,
} from "../validators/vehicle-assignment.validator.js";

export const createVehicleAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = createVehicleAssignmentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { familyId, vehicleId } = parsed.data;

    if (
      !mongoose.Types.ObjectId.isValid(familyId) ||
      !mongoose.Types.ObjectId.isValid(vehicleId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid family ID or vehicle ID",
      });
    }

    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const existingAssignment = await VehicleAssignment.findOne({
      familyId,
      type: parsed.data.type,
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: `Vehicle ${parsed.data.type} assignment already exists for this family`,
      });
    }

    const assignment = await VehicleAssignment.create({
      ...parsed.data,
      familyId: new mongoose.Types.ObjectId(familyId),
      vehicleId: new mongoose.Types.ObjectId(vehicleId),
    });

    return res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

export const getVehicleAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const assignments = await VehicleAssignment.find()
      .populate(
        "familyId",
        "name primaryContact phone city confirmedCount status",
      )
      .populate(
        "vehicleId",
        "name vehicleNumber driverName driverPhone capacity notes",
      )
      .sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

export const getVehicleAssignmentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle assignment ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle assignment ID",
      });
    }

    const assignment = await VehicleAssignment.findById(id)
      .populate(
        "familyId",
        "name primaryContact phone city confirmedCount status",
      )
      .populate(
        "vehicleId",
        "name vehicleNumber driverName driverPhone capacity notes",
      );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Vehicle assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

export const getVehicleAssignmentsByFamilyId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { familyId } = req.params;

    if (typeof familyId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid family ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(familyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid family ID",
      });
    }

    const assignments = await VehicleAssignment.find({
      familyId: new mongoose.Types.ObjectId(familyId),
    })
      .populate(
        "familyId",
        "name primaryContact phone city confirmedCount status",
      )
      .populate(
        "vehicleId",
        "name vehicleNumber driverName driverPhone capacity notes",
      )
      .sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

export const updateVehicleAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle assignment ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle assignment ID",
      });
    }

    const parsed = updateVehicleAssignmentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const assignment = await VehicleAssignment.findByIdAndUpdate(
      id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Vehicle assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVehicleAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle assignment ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle assignment ID",
      });
    }

    const assignment = await VehicleAssignment.findByIdAndDelete(id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Vehicle assignment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle assignment deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
