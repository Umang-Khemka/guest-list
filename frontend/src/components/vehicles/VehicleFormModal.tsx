import { useState, type FormEvent } from "react";
import type { Vehicle } from "../../types/vehicle";
import Field from "../ui/Field";
import Modal from "../ui/Modal";

export type VehicleFormData = Omit<Vehicle, "_id">;

interface Props {
  onSave: (data: VehicleFormData) => void;
  onClose: () => void;
}

const PHONE_RE = /^\+?[0-9\s-]{7,15}$/;

export default function VehicleFormModal({ onSave, onClose }: Props) {
  const [name, setName] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("+91 ");
  const [capacity, setCapacity] = useState("4");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const seats = Number(capacity);

    if (!name.trim()) return setError("Give the vehicle a name");
    if (!vehicleNumber.trim()) return setError("Add the vehicle number");
    if (!driverName.trim()) return setError("Add the driver's name");
    if (!PHONE_RE.test(driverPhone.trim())) return setError("Enter a valid driver phone number");
    if (!Number.isInteger(seats) || seats < 1) return setError("Seats must be at least 1");

    onSave({
      name: name.trim(),
      vehicleNumber: vehicleNumber.trim(),
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      capacity: seats,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title">Add vehicle</h2>

        <div className="form-grid">
          <Field label="Name (e.g. Innova 3)">
            <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </Field>
          <Field label="Vehicle number">
            <input value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
          </Field>
          <Field label="Driver name">
            <input value={driverName} onChange={(e) => setDriverName(e.target.value)} />
          </Field>
          <Field label="Driver phone">
            <input value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} inputMode="tel" />
          </Field>
          <Field label="Seats">
            <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </Field>
          <Field label="Notes (optional)">
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Save vehicle</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}