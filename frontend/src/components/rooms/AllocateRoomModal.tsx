import { useState, type FormEvent } from "react";
import type { Family } from "../../types/family";
import type { Room, RoomAllocation } from "../../types/room";
import { freeBeds, roomLabel } from "../../utils/roomUtils";
import Field from "../ui/Field";
import Modal from "../ui/Modal";

interface Props {
  room: Room;
  families: Family[];
  allocations: RoomAllocation[]; // all allocations, to work out free beds
  onSave: (data: { family: string; people: number }) => void;
  onClose: () => void;
}

export default function AllocateRoomModal({ room, families, allocations, onSave, onClose }: Props) {
  const free = freeBeds(room, allocations);
  const [familyId, setFamilyId] = useState(families[0]?._id ?? "");
  const [people, setPeople] = useState(String(Math.max(1, Math.min(2, free))));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const count = Number(people);

    if (!familyId) return setError("Choose a family");
    if (!Number.isInteger(count) || count < 1) return setError("People must be at least 1");
    if (count > free) return setError(`${roomLabel(room)} has only ${free} beds free`);
    if (allocations.some((a) => a.room === room._id && a.family === familyId)) {
      return setError("This family is already in this room. Edit it from the Families page.");
    }
    onSave({ family: familyId, people: count });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title">Allocate {roomLabel(room)}</h2>
        <p className="modal__sub">{free} beds free</p>

        <Field label="Family">
          <select value={familyId} onChange={(e) => setFamilyId(e.target.value)}>
            {families.map((f) => (
              <option key={f._id} value={f._id}>{f.name} Family · {f.city}</option>
            ))}
          </select>
        </Field>
        <Field label="People staying">
          <input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} />
        </Field>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Allocate room</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}