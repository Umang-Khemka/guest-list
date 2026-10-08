import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Family } from "../types/family";
import type { Room, RoomAllocation } from "../types/room";
import type { Travel } from "../types/travel";
import type { Vehicle, VehicleAssignment } from "../types/vehicle";
import type { Campaign } from "../types/message";

type Setter<T> = Dispatch<SetStateAction<T[]>>;

// Everything the pages share. Later each list moves to the API.
export interface AppData {
  families: Family[];
  setFamilies: Setter<Family>;
  travels: Travel[];
  setTravels: Setter<Travel>;
  rooms: Room[];
  setRooms: Setter<Room>;
  allocations: RoomAllocation[];
  setAllocations: Setter<RoomAllocation>;
  vehicles: Vehicle[];
  setVehicles: Setter<Vehicle>;
  assignments: VehicleAssignment[];
  setAssignments: Setter<VehicleAssignment>;
  setCampaigns: Setter<Campaign>;
}

export const AppDataContext = createContext<AppData | null>(null);