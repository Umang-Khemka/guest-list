import type { RoomType } from "../types/room";
import type { TravelMode } from "../types/travel";
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

export const TRAVEL_MODE_LABELS: Record<TravelMode, string> = {
  flight: "Flight",
  train: "Train",
  car: "Car",
  bus: "Bus",
  other: "Other",
};

// Starting values for new pickups/drops (mock wedding dates)
export const DEFAULT_TRAVEL_DATE = "2026-12-12";
export const DEFAULT_TRAVEL_TIME = "15:30";

// "Today" for the prototype, so the mock data shows arrivals. Swap for the real date later.
export const MOCK_TODAY = "2026-12-12";