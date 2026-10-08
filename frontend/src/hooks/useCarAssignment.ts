import type { VehicleAssignment } from "../types/vehicle";
import { useAppData } from "./useAppData";

// Shared by the Families and Travel pages
export function useCarAssignment() {
  const { families, assignments, setAssignments } = useAppData();

  // Name of the family already using this car at this date and time, or null
  const findConflict = (vehicleId: string, date: string, time: string) => {
    const clash = assignments.find((a) => a.vehicle === vehicleId && a.date === date && a.time === time);
    return clash ? (families.find((f) => f._id === clash.family)?.name ?? "another") : null;
  };

  const addAssignment = (data: Omit<VehicleAssignment, "_id">) =>
    setAssignments((prev) => [...prev, { ...data, _id: String(Date.now()) }]);

  return { findConflict, addAssignment };
}