import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Travel from "../models/Travel.js";
import Family from "../models/Family.js";
import { createTravelSchema } from "../validators/travel.validator.js";

// POST /api/travel
export const createTravel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createTravelSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { familyId } = parsed.data;

    if (!mongoose.Types.ObjectId.isValid(familyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid family ID",
      });
    }

    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    const existingTravel = await Travel.findOne({ familyId });

    if (existingTravel) {
      return res.status(409).json({
        success: false,
        message: "Travel details already exist for this family",
      });
    }

    const travel = await Travel.create({
      ...parsed.data,
      familyId: new mongoose.Types.ObjectId(familyId),
    } as mongoose.AnyObject);

    return res.status(201).json({
      success: true,
      data: travel,
    });
  } catch (err) {
    next(err);
  }
};