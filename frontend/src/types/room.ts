export type RoomType = "standard" | "deluxe" | "suite";

// An actual hotel room. No family info here: that lives in RoomAllocation.
export interface Room {
  _id: string;
  roomNumber: string;
  type: RoomType;
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