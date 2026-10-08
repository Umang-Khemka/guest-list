import { useState, type ReactNode } from "react";
import { mockFamilies } from "../data/mockFamilies";
import { mockAllocations, mockRooms } from "../data/mockRooms";
import { mockTravels } from "../data/mockTravel";
import { mockAssignments, mockVehicles } from "../data/mockVehicles";
import type { Family } from "../types/family";
import type { Room, RoomAllocation } from "../types/room";
import type { Travel } from "../types/travel";
import type { Vehicle, VehicleAssignment } from "../types/vehicle";
import { AppDataContext } from "./AppDataContext";

export default function AppDataProvider({ children }: { children: ReactNode }) {
  const [families, setFamilies] = useState<Family[]>(mockFamilies);
  const [travels, setTravels] = useState<Travel[]>(mockTravels);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [allocations, setAllocations] = useState<RoomAllocation[]>(mockAllocations);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [assignments, setAssignments] = useState<VehicleAssignment[]>(mockAssignments);

  return (
    <AppDataContext.Provider
      value={{
        families, setFamilies,
        travels, setTravels,
        rooms, setRooms,
        allocations, setAllocations,
        vehicles, setVehicles,
        assignments, setAssignments,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}