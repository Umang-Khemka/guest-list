import { ROOM_TYPE_LABELS } from "../../constants/logistics";
import type { Room, RoomAllocation } from "../../types/room";

interface Props {
  room: Room;
  allocations: RoomAllocation[]; // only this room's allocations
  freeBeds: number;
  familyName: (familyId: string) => string;
  onAllocate: () => void;
  onRemove: (allocationId: string) => void;
}

export default function RoomCard({ room, allocations, freeBeds, familyName, onAllocate, onRemove }: Props) {
  const allocated = allocations.length > 0;

  return (
    <article className="room-card">
      <div className="room-card__top">
        <h3>Room {room.roomNumber}</h3>
        <span className={allocated ? "pill" : "pill pill--pending"}>{allocated ? "Allocated" : "Available"}</span>
      </div>

      <div className="muted">
        {ROOM_TYPE_LABELS[room.type]} · sleeps {room.capacity} · {freeBeds} free
      </div>
      {room.notes && <div className="muted">{room.notes}</div>}

      {allocations.map((a) => (
        <div className="room-card__alloc" key={a._id}>
          <span>
            {familyName(a.family)} · {a.people} people
          </span>
          <button className="btn" onClick={() => onRemove(a._id)}>Remove</button>
        </div>
      ))}

      <button className="btn room-card__add" onClick={onAllocate} disabled={freeBeds <= 0}>
        {freeBeds <= 0 ? "Room full" : "Allocate to a family"}
      </button>
    </article>
  );
}