import { HOTEL_NAME } from "../constants/messaging";
import type { Family } from "../types/family";
import type { Room, RoomAllocation } from "../types/room";
import type { Travel } from "../types/travel";
import type { Vehicle, VehicleAssignment } from "../types/vehicle";
import { formatDate, formatTime } from "./dateUtils";

export interface TemplateContext {
  travels: Travel[];
  rooms: Room[];
  allocations: RoomAllocation[];
  vehicles: Vehicle[];
  assignments: VehicleAssignment[];
}

// The value for each {{variable}} for one family
export function buildTemplateValues(family: Family, ctx: TemplateContext): Record<string, string> {
  const arrival = ctx.travels.find((t) => t.family === family._id)?.arrival;

  const roomNumbers = ctx.allocations
    .filter((a) => a.family === family._id)
    .map((a) => ctx.rooms.find((r) => r._id === a.room)?.roomNumber)
    .filter((n): n is string => !!n);

  const pickup = ctx.assignments.find((a) => a.family === family._id && a.type === "pickup");
  const vehicle = pickup && ctx.vehicles.find((v) => v._id === pickup.vehicle);

  return {
    family: `${family.name} Family`,
    primaryContact: family.primaryContact.replace(/ Ji$/, ""),
    city: family.city,
    arrivalDate: arrival ? formatDate(arrival.date) : "(date to be shared)",
    arrivalTime: arrival ? formatTime(arrival.time) : "(time to be shared)",
    hotel: roomNumbers.length ? HOTEL_NAME : "(hotel to be shared)",
    room: roomNumbers.length ? roomNumbers.join(", ") : "(to be assigned)",
    vehicle: vehicle ? `${vehicle.name} (${vehicle.vehicleNumber})` : "(to be assigned)",
  };
}

// Swap {{variable}} for its value. Unknown variables are left as they are.
export function fillTemplate(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => values[key] ?? match);
}