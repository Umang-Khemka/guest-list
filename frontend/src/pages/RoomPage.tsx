import { useEffect, useMemo, useState } from "react";
import AllocateRoomModal from "../components/rooms/AllocateRoomModal";
import RoomCard from "../components/rooms/RoomCard";
import RoomFormModal, { type RoomFormData } from "../components/rooms/RoomFormModal";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { allocationStore } from "../store/allocationStore";
import { familyStore } from "../store/familyStore";
import { roomStore } from "../store/roomStore";
import type { Room, RoomAllocation } from "../types/room";
import { freeBeds } from "../utils/roomUtils";
import "./RoomPage.css";
const ACCEPTED_STATUS = "confirmed";

type ModalState = { mode: "add" } | { mode: "allocate"; room: Room } | null;

export default function RoomsPage() {
  const { rooms, getRooms, createRoom } = roomStore();
  const {
    allocations: rawAllocations,
    getAllocations,
    createAllocation,
    deleteAllocation,
  } = allocationStore();
  const { families, getFamilies } = familyStore();
  const { toast, showToast } = useToast();
  const [modal, setModal] = useState<ModalState>(null);

  // Load rooms, allocations and families from the API once
  useEffect(() => {
    getRooms().catch(() => { });
    getAllocations().catch(() => { });
    getFamilies({}).catch(() => { });
  }, [getRooms, getAllocations, getFamilies]);

  // Map API allocations (populated familyId/roomId) to the shape the room components expect
  const allocations = useMemo<RoomAllocation[]>(
    () =>
      rawAllocations
        .filter((a) => a.familyId && a.roomId) // skip rows whose family/room was deleted
        .map((a) => ({
          _id: a._id,
          family: a.familyId._id,
          room: a.roomId._id,
          people: a.occupantsCount,
        })),
    [rawAllocations],
  );

  const sortedRooms = useMemo(
    () => [...rooms].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })),
    [rooms],
  );
  const sortedFamilies = useMemo(
    () =>
      families
        .filter((f) => f.status === ACCEPTED_STATUS) // only families who accepted the invite
        .sort((a, b) => a.name.localeCompare(b.name)),
    [families],
  );

  const allocatedRooms = new Set(allocations.map((a) => a.room)).size;
  const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const filledBeds = allocations.reduce((sum, a) => sum + a.people, 0);
  const filledPercent = totalBeds ? Math.min(100, (filledBeds / totalBeds) * 100) : 0;

  const familyName = (id: string) => {
    const family = families.find((f) => f._id === id);
    if (family) return `${family.name} Family`;
    // fall back to the populated name on the allocation itself
    const populated = rawAllocations.find((a) => a.familyId?._id === id)?.familyId;
    return populated ? `${populated.name} Family` : "Unknown family";
  };

  const handleAddRoom = async (data: RoomFormData) => {
    try {
      await createRoom(data); // store appends the new room to the list
      setModal(null);
      showToast("Room added");
    } catch {
      showToast(roomStore.getState().error ?? "Could not add room");
    }
  };

  const handleAllocate = async (room: Room, data: { family: string; people: number }) => {
    try {
      await createAllocation({
        familyId: data.family,
        roomId: room._id,
        occupantsCount: data.people,
      });
      await getAllocations(); // create returns unpopulated ids, so reload the list
      setModal(null);
      showToast("Room allocated");
    } catch {
      showToast(allocationStore.getState().error ?? "Could not allocate room");
    }
  };

  const handleRemove = async (allocationId: string) => {
    try {
      await deleteAllocation(allocationId); // store removes it from the list
      showToast("Allocation removed");
    } catch {
      showToast(allocationStore.getState().error ?? "Could not remove allocation");
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Rooms</h1>
        <button className="btn btn--primary" onClick={() => setModal({ mode: "add" })}>
          Add room
        </button>
      </div>
      <p className="page__sub">
        {rooms.length} rooms · {allocatedRooms} allocated · {rooms.length - allocatedRooms} available · {filledBeds} of {totalBeds} beds filled
      </p>
      <div className="occupancy" role="img" aria-label={`${Math.round(filledPercent)} percent of beds filled`}>
        <i style={{ width: `${filledPercent}%` }} />
      </div>

      <div className="room-grid">
        {sortedRooms.map((room) => (
          <RoomCard
            key={room._id}
            room={room}
            allocations={allocations.filter((a) => a.room === room._id)}
            freeBeds={freeBeds(room, allocations)}
            familyName={familyName}
            onAllocate={() => setModal({ mode: "allocate", room })}
            onRemove={handleRemove}
          />
        ))}
        {sortedRooms.length === 0 && <p className="muted">No rooms yet. Add the hotel rooms you have booked.</p>}
      </div>

      {modal?.mode === "add" && (
        <RoomFormModal
          existingNumbers={rooms.map((r) => r.roomNumber)}
          onSave={handleAddRoom}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.mode === "allocate" && (
        <AllocateRoomModal
          room={modal.room}
          families={sortedFamilies}
          allocations={allocations}
          onSave={(data) => handleAllocate(modal.room, data)}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}