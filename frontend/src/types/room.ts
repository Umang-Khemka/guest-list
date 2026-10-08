export type RoomType = "standard" | "deluxe" | "suite";

// An actual hotel room. No family info here: that lives in RoomAllocation.
export interface Room {
  _id: string;
  roomNumber: string;
  roomType: RoomType;
  capacity: number;
  notes?: string;
}

// Links one family to one room. A family can have many allocations.
export interface RoomAllocation {
  _id: string;
  family: string; // Family._id
  room: string; // Room._id
  people: number;
}

export type CreateRoomInput = Omit<Room, "_id">;

export type UpdateRoomInput = Partial<CreateRoomInput>;

export interface RoomResponse {
  success: boolean;
  data: Room;
}

export interface RoomsResponse {
  success: boolean;
  count: number;
  data: Room[];
}

export interface RoomState {
  rooms: Room[];
  room: Room | null;
  count: number;
  loading: boolean;
  error: string | null;

  createRoom: (input: CreateRoomInput) => Promise<Room>;
  getRooms: () => Promise<void>;
  getRoomById: (id: string) => Promise<void>;
  updateRoom: (id: string, input: UpdateRoomInput) => Promise<Room>;
  deleteRoom: (id: string) => Promise<void>;
}

// GET responses populate familyId and roomId into objects
export interface AllocationFamily {
  _id: string;
  name: string;
  primaryContact: string;
  phone: string;
  city: string;
  confirmedCount: number;
  status: string;
}

export interface AllocationRoom {
  _id: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  notes?: string;
}

export interface Allocation {
  _id: string;
  familyId: AllocationFamily;
  roomId: AllocationRoom;
  occupantsCount: number;
  allocatedFrom?: string;
  createdAt: string;
  updatedAt: string;
}

// create and update responses are NOT populated, so the ids are plain strings
export interface AllocationRaw {
  _id: string;
  familyId: string;
  roomId: string;
  occupantsCount: number;
  allocatedFrom?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAllocationInput {
  familyId: string;
  roomId: string;
  occupantsCount: number;
  allocatedFrom?: string;
}

export type UpdateAllocationInput = Partial<CreateAllocationInput>;

export interface AllocationResponse {
  success: boolean;
  data: Allocation;
}

export interface AllocationRawResponse {
  success: boolean;
  data: AllocationRaw;
}

export interface AllocationsResponse {
  success: boolean;
  count: number;
  data: Allocation[];
}

export interface AllocationState {
  allocations: Allocation[];
  allocation: Allocation | null;
  count: number;
  loading: boolean;
  error: string | null;

  createAllocation: (input: CreateAllocationInput) => Promise<AllocationRaw>;
  getAllocations: () => Promise<void>;
  getAllocationById: (id: string) => Promise<void>;
  getAllocationByFamilyId: (familyId: string) => Promise<void>;
  updateAllocation: (id: string, input: UpdateAllocationInput) => Promise<AllocationRaw>;
  deleteAllocation: (id: string) => Promise<void>;
}