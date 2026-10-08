import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import RoomAllocation from "../models/RoomAllocation.js";
import Family from "../models/Family.js";
import Room from "../models/Room.js";
import { createRoomAllocationSchema,updateRoomAllocationSchema } from "../validators/room-allocation.validator.js";

// POST /api/room-allocations
export const createRoomAllocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createRoomAllocationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const { familyId, roomId } = parsed.data;

    if (
      !mongoose.Types.ObjectId.isValid(familyId) ||
      !mongoose.Types.ObjectId.isValid(roomId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid family ID or room ID",
      });
    }

    const family = await Family.findById(familyId);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    if (parsed.data.occupantsCount > room.capacity) {
      return res.status(400).json({
        success: false,
        message: "Occupants count exceeds room capacity",
      });
    }

    const existingAllocation = await RoomAllocation.findOne({
      familyId,
    });

    if (existingAllocation) {
      return res.status(409).json({
        success: false,
        message: "Room allocation already exists for this family",
      });
    }

    const allocation = await RoomAllocation.create({
      ...parsed.data,
      familyId: new mongoose.Types.ObjectId(familyId),
      roomId: new mongoose.Types.ObjectId(roomId),
    });

    return res.status(201).json({
      success: true,
      data: allocation,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/room-allocations
export const getRoomAllocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allocations = await RoomAllocation.find()
      .populate(
        "familyId",
        "name primaryContact phone city confirmedCount status"
      )
      .populate(
        "roomId",
        "roomNumber roomType capacity notes"
      )
      .sort({ allocatedFrom: 1 });

    return res.status(200).json({
      success: true,
      count: allocations.length,
      data: allocations,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/room-allocations/:id
export const getRoomAllocationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid room allocation ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room allocation ID",
      });
    }

    const allocation = await RoomAllocation.findById(id)
      .populate(
        "familyId",
        "name primaryContact phone city confirmedCount status"
      )
      .populate(
        "roomId",
        "roomNumber roomType capacity notes"
      );

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Room allocation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/room-allocations/family/:familyId
export const getRoomAllocationByFamilyId = async (
  req: Request,
  res: Response,
  next: NextFunction
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

    const allocation = await RoomAllocation.findOne({
      familyId: new mongoose.Types.ObjectId(familyId),
    })
      .populate(
        "familyId",
        "name primaryContact phone city confirmedCount status"
      )
      .populate(
        "roomId",
        "roomNumber roomType capacity notes"
      );

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Room allocation not found for this family",
      });
    }

    return res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/room-allocations/:id
export const updateRoomAllocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid room allocation ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room allocation ID",
      });
    }

    const parsed = updateRoomAllocationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const allocation = await RoomAllocation.findByIdAndUpdate(
      id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Room allocation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: allocation,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteRoomAllocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid room allocation ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room allocation ID",
      });
    }

    const allocation = await RoomAllocation.findByIdAndDelete(id);

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Room allocation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room allocation deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};