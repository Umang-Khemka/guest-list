import { useState, type FormEvent } from "react";
import { toOptions } from "../../constants/family";
import { ASSIGNMENT_TYPE_LABELS, DEFAULT_TRAVEL_DATE, DEFAULT_TRAVEL_TIME } from "../../constants/logistics";
import type { Family } from "../../types/family";
import type { AssignmentType, Vehicle, VehicleAssignment } from "../../types/vehicle";
import Field from "../ui/Field";
import Modal from "../ui/Modal";

interface Props {
  vehicle: Vehicle;
  families: Family[];
  // Name of the family already using this car at that time, or null
  findConflict: (vehicleId: string, date: string, time: string) => string | null;
  onSave: (data: Omit<VehicleAssignment, "_id">) => void;
  onClose: () => void;
}

export default function AssignFamilyModal({ vehicle, families, findConflict, onSave, onClose }: Props) {
  const [familyId, setFamilyId] = useState(families[0]?._id ?? "");
  const [type, setType] = useState<AssignmentType>("pickup");
  const [date, setDate] = useState(DEFAULT_TRAVEL_DATE);
  const [time, setTime] = useState(DEFAULT_TRAVEL_TIME);
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!familyId) return setError("Choose a family");
    if (!date || !time) return setError("Choose a date and time");
    if (!location.trim()) return setError("Enter the pickup or drop place");

    const busyWith = findConflict(vehicle._id, date, time);
    if (busyWith) return setError(`${vehicle.name} is already booked then for the ${busyWith} Family`);

    onSave({ family: familyId, vehicle: vehicle._id, type, date, time, location: location.trim() });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title">Assign {vehicle.name}</h2>
        <p className="modal__sub">{vehicle.vehicleNumber} · driver {vehicle.driverName}</p>

        <div className="form-grid">
          <Field label="Family">
            <select value={familyId} onChange={(e) => setFamilyId(e.target.value)}>
              {families.map((f) => (
                <option key={f._id} value={f._id}>{f.name} Family · {f.city}</option>
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
          <button type="submit" className="btn btn--primary">Assign family</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}