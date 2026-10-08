import { ROOM_TYPE_LABELS } from "../constants/logistics";
import type { Room, RoomAllocation } from "../types/room";

// "Deluxe - 201"
export const roomLabel = (room: Room) => `${ROOM_TYPE_LABELS[room.roomType]} - ${room.roomNumber}`;

// Beds left in a room. Pass excludeFamilyId when editing that family's own rooms,
// so its current beds count as free again.
export function freeBeds(room: Room, allocations: RoomAllocation[], excludeFamilyId?: string) {
  const used = allocations
    .filter((a) => a.room === room._id && a.family !== excludeFamilyId)
    .reduce((sum, a) => sum + a.people, 0);
  return room.capacity - used;
}