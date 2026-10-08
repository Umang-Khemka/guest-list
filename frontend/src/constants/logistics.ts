import type { RoomType } from "../types/room";
import type { AssignmentType } from "../types/vehicle";

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  standard: "Standard",
  deluxe: "Deluxe",
  suite: "Suite",
};

export const ASSIGNMENT_TYPE_LABELS: Record<AssignmentType, string> = {
  pickup: "Pickup",
  drop: "Drop",
};

// Starting values for new pickups/drops (mock wedding dates)
export const DEFAULT_TRAVEL_DATE = "2026-12-12";
export const DEFAULT_TRAVEL_TIME = "15:30";