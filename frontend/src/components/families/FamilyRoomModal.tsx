import { useRef, useState, type FormEvent } from "react";
import type { Family } from "../../types/family";
import type { Room, RoomAllocation } from "../../types/room";
import { freeBeds, roomLabel } from "../../utils/roomUtils";
import Field from "../ui/Field";
import Modal from "../ui/Modal";

export interface RoomChoice {
  room: string; // Room._id
  people: number;
}

interface Props {
  family: Family;
  rooms: Room[];
  allocations: RoomAllocation[]; // all families, used to work out free beds
  onSave: (choices: RoomChoice[]) => void;
  onClose: () => void;
}

// A draft row while editing. people stays a string so typing feels natural.
interface Row {
  key: number;
  room: string;
  people: string;
}

export default function FamilyRoomsModal({ family, rooms, allocations, onSave, onClose }: Props) {
  const [rows, setRows] = useState<Row[]>(() =>
    allocations
      .filter((a) => a.family === family._id)
      .map((a, i) => ({ key: i, room: a.room, people: String(a.people) })),
  );
  const [error, setError] = useState<string | null>(null);
  const nextKey = useRef(rows.length);

  // Beds free for this family: other families' beds are taken, its own are free again
  const free = (room: Room) => freeBeds(room, allocations, family._id);

  // A row can pick its own room, or any room with free beds not used by another row
  const optionsFor = (row: Row) =>
    rooms.filter((r) => r._id === row.room || (free(r) > 0 && !rows.some((o) => o.key !== row.key && o.room === r._id)));

  const update = (key: number, patch: Partial<Row>) =>
    setRows(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  const addRow = () => {
    const room = rooms.find((r) => free(r) > 0 && !rows.some((o) => o.room === r._id));
    if (!room) return setError("No free rooms left");
    setError(null);
    setRows([...rows, { key: nextKey.current++, room: room._id, people: "1" }]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const choices: RoomChoice[] = [];

    for (const row of rows) {
      const room = rooms.find((r) => r._id === row.room)!;
      const people = Number(row.people);
      if (!Number.isInteger(people) || people < 1) return setError("People must be at least 1");
      if (people > free(room)) return setError(`${roomLabel(room)} has only ${free(room)} beds free`);
      choices.push({ room: row.room, people });
    }
    onSave(choices);
  };

  const totalPeople = rows.reduce((sum, r) => sum + (Number(r.people) || 0), 0);

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title">Rooms for {family.name} Family</h2>
        <p className="modal__sub">
          {rows.length} room{rows.length === 1 ? "" : "s"} · {totalPeople} people. Change a room, edit people, or add another.
        </p>

        {rows.length === 0 && <p className="muted form-add">No room yet. Add one below.</p>}

        {rows.map((row) => (
          <div className="draft-card" key={row.key}>
            <Field label="Room">
              <select value={row.room} onChange={(e) => update(row.key, { room: e.target.value })}>
                {optionsFor(row).map((r) => (
                  <option key={r._id} value={r._id}>
                    {roomLabel(r)} · {free(r)} beds free
                  </option>
                ))}
              </select>
            </Field>
            <Field label="People staying">
              <input type="number" min={1} value={row.people} onChange={(e) => update(row.key, { people: e.target.value })} />
            </Field>
            <button type="button" className="btn" onClick={() => setRows(rows.filter((r) => r.key !== row.key))}>
              Remove this room
            </button>
          </div>
        ))}

        <button type="button" className="btn form-add" onClick={addRow}>Add another room</button>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Save rooms</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}