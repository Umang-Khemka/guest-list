import { useState, type FormEvent } from "react";
import { toOptions } from "../../constants/family";
import { ROOM_TYPE_LABELS } from "../../constants/logistics";
import type { Room, RoomType } from "../../types/room";
import Field from "../ui/Field";
import Modal from "../ui/Modal";

export type RoomFormData = Omit<Room, "_id">;

interface Props {
  existingNumbers: string[]; // to stop duplicate room numbers
  onSave: (data: RoomFormData) => void;
  onClose: () => void;
}

export default function RoomFormModal({ existingNumbers, onSave, onClose }: Props) {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("standard");
  const [capacity, setCapacity] = useState("2");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const number = roomNumber.trim();
    const beds = Number(capacity);

    if (!number) return setError("Enter a room number");
    if (existingNumbers.includes(number)) return setError(`Room ${number} already exists`);
    if (!Number.isInteger(beds) || beds < 1) return setError("Capacity must be at least 1");

    onSave({ roomNumber: number, roomType: roomType, capacity: beds, notes: notes.trim() || undefined });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title">Add room</h2>

        <div className="form-grid">
          <Field label="Room number">
            <input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} autoFocus />
          </Field>
          <Field label="Type">
            <select value={roomType} onChange={(e) => setRoomType(e.target.value as RoomType)}>
              {toOptions(ROOM_TYPE_LABELS).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Capacity">
            <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </Field>
          <Field label="Notes (optional)">
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Save room</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}