import type { Room, RoomAllocation, RoomType } from "../types/room";

const room = (n: number, type: RoomType, capacity: number): Room => ({
  _id: `r${n}`,
  roomNumber: String(n),
  type,
  capacity,
});

export const mockRooms: Room[] = [
  room(101, "standard", 2),
  room(102, "standard", 2),
  room(103, "standard", 2),
  room(201, "deluxe", 3),
  room(202, "deluxe", 3),
  room(203, "deluxe", 3),
  room(301, "suite", 4),
  room(302, "suite", 4),
  room(303, "suite", 4),
];

const alloc = (id: number, family: number, roomNumber: number, people: number): RoomAllocation => ({
  _id: `ra${id}`,
  family: String(family),
  room: `r${roomNumber}`,
  people,
});

export const mockAllocations: RoomAllocation[] = [
  alloc(1, 1, 201, 3),
  alloc(2, 1, 202, 2),
  alloc(3, 4, 301, 4),
  alloc(4, 4, 302, 3),
  alloc(5, 7, 203, 3),
  alloc(6, 10, 101, 2),
  alloc(7, 12, 102, 2),
  alloc(8, 12, 103, 1),
];