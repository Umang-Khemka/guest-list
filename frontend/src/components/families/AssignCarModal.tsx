import { useState, type FormEvent } from "react";
import { ASSIGNMENT_TYPE_LABELS, DEFAULT_TRAVEL_DATE, DEFAULT_TRAVEL_TIME } from "../../constants/logistics";
import { toOptions } from "../../constants/family";
import type { Family } from "../../types/family";
import type { AssignmentType, Vehicle, VehicleAssignment } from "../../types/vehicle";
import Field from "../ui/Field";
import Modal from "../ui/Modal";

export type AssignmentData = Omit<VehicleAssignment, "_id">;

interface Props {
  family: Family;
  vehicles: Vehicle[];
  // Optional starting values, e.g. from a travel leg
  initial?: { type?: AssignmentType; date?: string; time?: string; location?: string };
  // Returns the name of the family already using that car at that time, or null
  findConflict: (vehicleId: string, date: string, time: string) => string | null;
  onSave: (data: AssignmentData) => void;
  onClose: () => void;
}

export default function AssignCarModal({ family, vehicles, initial, findConflict, onSave, onClose }: Props) {
  const [vehicle, setVehicle] = useState(vehicles[0]?._id ?? "");
  const [type, setType] = useState<AssignmentType>(initial?.type ?? "pickup");
  const [date, setDate] = useState(initial?.date ?? DEFAULT_TRAVEL_DATE);
  const [time, setTime] = useState(initial?.time ?? DEFAULT_TRAVEL_TIME);
  const [location, setLocation] = useState(initial?.location ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!vehicle) return setError("Add a vehicle first");
    if (!date || !time) return setError("Choose a date and time");

    const busyWith = findConflict(vehicle, date, time);
    if (busyWith) {
      const name = vehicles.find((v) => v._id === vehicle)?.name;
      return setError(`${name} is already booked then for the ${busyWith} Family`);
    }
    onSave({ family: family._id, vehicle, type, date, time, location: location.trim() });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title">Assign a car</h2>
        <p className="modal__sub">For the {family.name} Family</p>

        <div className="form-grid">
          <Field label="Car">
            <select value={vehicle} onChange={(e) => setVehicle(e.target.value)}>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>{v.name} · {v.driverName}</option>
              ))}
            </select>
          </Field>
          <Field label="Pickup or drop">
            <select value={type} onChange={(e) => setType(e.target.value as AssignmentType)}>
              {toOptions(ASSIGNMENT_TYPE_LABELS).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Date">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Time">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
          <Field label="Place" full>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Airport, station or hotel" />
          </Field>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Assign car</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}