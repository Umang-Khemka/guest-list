import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Family } from "../types/family";
import type { Room, RoomAllocation } from "../types/room";
import type { Vehicle, VehicleAssignment } from "../types/vehicle";

type Setter<T> = Dispatch<SetStateAction<T[]>>;

// Everything the pages share. Later each list moves to the API.
export interface AppData {
  families: Family[];
  setFamilies: Setter<Family>;
  rooms: Room[];
  setRooms: Setter<Room>;
  allocations: RoomAllocation[];
  setAllocations: Setter<RoomAllocation>;
  vehicles: Vehicle[];
  setVehicles: Setter<Vehicle>;
  assignments: VehicleAssignment[];
  setAssignments: Setter<VehicleAssignment>;
}

export const AppDataContext = createContext<AppData | null>(null);