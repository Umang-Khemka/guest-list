import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Travel from "../models/Travel.js";
import Family from "../models/Family.js";
import { createTravelSchema,updateTravelSchema } from "../validators/travel.validator.js";

// POST /api/travel
export const createTravel = async (
  req: Request,
  res: Response,
  next: NextFunction,
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

// GET /api/travel
export const getTravels = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const travels = await Travel.find()
      .populate("familyId", "name primaryContact phone city")
      .sort({ "arrival.date": 1 });

    return res.status(200).json({
      success: true,
      count: travels.length,
      data: travels,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/travel/:id
export const getTravelById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const travel = await Travel.findById(req.params.id).populate(
      "familyId",
      "name primaryContact phone city address relationToGroom category group invitedCount confirmedCount status guestType priority notes",
    );

    if (!travel) {
      return res.status(404).json({
        success: false,
        message: "Travel details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: travel,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/travel/family/:familyId
export const getTravelByFamilyId = async (
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

    const travel = await Travel.findOne({
      familyId: new mongoose.Types.ObjectId(familyId),
    });

    if (!travel) {
      return res.status(404).json({
        success: false,
        message: "Travel details not found for this family",
      });
    }

    return res.status(200).json({
      success: true,
      data: travel,
    });
  } catch (err) {
    next(err);
  }
};


// PUT /api/travel/:id
export const updateTravel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid travel ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid travel ID",
      });
    }

    const parsed = updateTravelSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const travel = await Travel.findByIdAndUpdate(
      id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!travel) {
      return res.status(404).json({
        success: false,
        message: "Travel details not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: travel,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/travel/:id
export const deleteTravel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid travel ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid travel ID",
      });
    }

    const travel = await Travel.findByIdAndDelete(id);

    if (!travel) {
      return res.status(404).json({
        success: false,
        message: "Travel details not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Travel details deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};