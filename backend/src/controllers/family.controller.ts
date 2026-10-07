import { NextFunction, Request, Response } from "express";
import Family from "../models/Family.js";
import { createFamilySchema } from "../validators/family.validator.js";
import { updateFamilySchema } from "../validators/family.validator.js";

// POST /api/families
export const createFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = createFamilySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const family = await Family.create(parsed.data);

    return res.status(201).json({
      success: true,
      data: family,
    });
  } catch (err) {
    next(err);
  }
};

const str = (value: unknown) =>
  typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/families
// Filters:
// search, status, guestType, priority, category, group, city

export const getFamilies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter: Record<string, unknown> = {};

    const search = str(req.query.search);
    const status = str(req.query.status);
    const guestType = str(req.query.guestType);
    const priority = str(req.query.priority);
    const category = str(req.query.category);
    const group = str(req.query.group);
    const city = str(req.query.city);

    if (status) {
      filter.status = status;
    }

    if (guestType) {
      filter.guestType = guestType;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (category) {
      filter.category = new RegExp(`^${escapeRegex(category)}$`, "i");
    }

    if (group) {
      filter.group = group;
    }

    if (city) {
      filter.city = new RegExp(`^${escapeRegex(city)}$`, "i");
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { name: regex },
        { primaryContact: regex },
        { phone: regex },
        { alternatePhone: regex },
        { city: regex },
      ];
    }

    const families = await Family.find(filter).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: families.length,
      data: families,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/families/:id
export const getFamilyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const family = await Family.findById(req.params.id);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: family,
    });
  } catch (err) {
    next(err);
  }
};


// PUT /api/families/:id
export const updateFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = updateFamilySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const family = await Family.findByIdAndUpdate(
      req.params.id,
      parsed.data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: family,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/families/:id
export const deleteFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const family = await Family.findByIdAndDelete(req.params.id);

    if (!family) {
      return res.status(404).json({
        success: false,
        message: "Family not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Family deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
