import type { TravelLeg } from "../types/travel";
import type { AssignmentType, Vehicle, VehicleAssignment } from "../types/vehicle";

// The car already assigned to this leg (same family, type, date and time), if any
export function findLegVehicle(
  assignments: VehicleAssignment[],
  vehicles: Vehicle[],
  familyId: string,
  type: AssignmentType,
  leg: TravelLeg,
): Vehicle | undefined {
  const match = assignments.find(
    (a) => a.family === familyId && a.type === type && a.date === leg.date && a.time === leg.time,
  );
  return match && vehicles.find((v) => v._id === match.vehicle);
}