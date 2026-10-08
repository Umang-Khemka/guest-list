import { useMemo, useState } from "react";
import AllocateRoomModal from "../components/rooms/AllocateRoomModal";
import RoomCard from "../components/rooms/RoomCard";
import RoomFormModal, { type RoomFormData } from "../components/rooms/RoomFormModal";
import Toast from "../components/ui/Toast";
import { useAppData } from "../hooks/useAppData";
import { useToast } from "../hooks/useToast";
import type { Room } from "../types/room";
import { freeBeds } from "../utils/roomUtils";
import "./RoomPage.css";

type ModalState = { mode: "add" } | { mode: "allocate"; room: Room } | null;

export default function RoomsPage() {
  const { families, rooms, setRooms, allocations, setAllocations } = useAppData();
  const { toast, showToast } = useToast();
  const [modal, setModal] = useState<ModalState>(null);

  const sortedRooms = useMemo(
    () => [...rooms].sort((a, b) => a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true })),
    [rooms],
  );
  const sortedFamilies = useMemo(() => [...families].sort((a, b) => a.name.localeCompare(b.name)), [families]);

  const allocatedRooms = new Set(allocations.map((a) => a.room)).size;
  const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
  const filledBeds = allocations.reduce((sum, a) => sum + a.people, 0);
  const filledPercent = totalBeds ? Math.min(100, (filledBeds / totalBeds) * 100) : 0;

  const familyName = (id: string) => {
    const family = families.find((f) => f._id === id);
    return family ? `${family.name} Family` : "Unknown family";
  };

  const handleAddRoom = (data: RoomFormData) => {
    setRooms((prev) => [...prev, { ...data, _id: `r${Date.now()}` }]);
    setModal(null);
    showToast("Room added");
  };

  const handleAllocate = (room: Room, data: { family: string; people: number }) => {
    setAllocations((prev) => [...prev, { _id: `ra${Date.now()}`, room: room._id, ...data }]);
    setModal(null);
    showToast("Room allocated");
  };

  const handleRemove = (allocationId: string) => {
    setAllocations((prev) => prev.filter((a) => a._id !== allocationId));
    showToast("Allocation removed");
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