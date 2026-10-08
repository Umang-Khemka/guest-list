import { useState, type FormEvent } from "react";
import { toOptions } from "../../constants/family";
import { TRAVEL_MODE_LABELS } from "../../constants/logistics";
import type { Family } from "../../types/family";
import type { Travel, TravelLeg, TravelMode } from "../../types/travel";
import Field from "../ui/Field";
import Modal from "../ui/Modal";
import "./TravelFormModal.css";

export type TravelFormData = Omit<Travel, "_id">;

interface Props {
  travel?: Travel; // present = edit, absent = add
  families: Family[]; // families that can be chosen (add: those without travel yet)
  defaultFamilyId?: string;
  onSave: (data: TravelFormData) => void;
  onClose: () => void;
}

// One leg while typing. Empty date means "no details for this leg".
interface LegForm {
  date: string;
  time: string;
  mode: TravelMode;
  number: string;
  location: string;
  city: string;
  carRequired: boolean;
}

const emptyLeg = (): LegForm => ({ date: "", time: "", mode: "flight", number: "", location: "", city: "", carRequired: true });

const legToForm = (l?: TravelLeg): LegForm =>
  l
    ? { date: l.date, time: l.time, mode: l.mode, number: l.number ?? "", location: l.location, city: l.city ?? "", carRequired: l.carRequired }
    : emptyLeg();

function formToLeg(f: LegForm): TravelLeg | undefined {
  if (!f.date) return undefined;
  return {
    date: f.date,
    time: f.time,
    mode: f.mode,
    number: f.number.trim() || undefined,
    location: f.location.trim(),
    city: f.city.trim() || undefined,
    carRequired: f.carRequired,
  };
}

function legError(name: string, f: LegForm): string | null {
  if (!f.date) return null;
  if (!f.time) return `Add the ${name} time`;
  if (!f.location.trim()) return `Add the ${name} place`;
  return null;
}

interface LegFieldsProps {
  title: string;
  cityLabel: string;
  carLabel: string;
  value: LegForm;
  onChange: (patch: Partial<LegForm>) => void;
}

function LegFields({ title, cityLabel, carLabel, value, onChange }: LegFieldsProps) {
  return (
    <section>
      <h3 className="form-section">{title}</h3>
      <p className="muted">Leave the date empty if this is not known yet.</p>
      <div className="form-grid">
        <Field label="Date">
          <input type="date" value={value.date} onChange={(e) => onChange({ date: e.target.value })} />
        </Field>
        <Field label="Time">
          <input type="time" value={value.time} onChange={(e) => onChange({ time: e.target.value })} />
        </Field>
        <Field label="Mode">
          <select value={value.mode} onChange={(e) => onChange({ mode: e.target.value as TravelMode })}>
            {toOptions(TRAVEL_MODE_LABELS).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Flight / train number">
          <input value={value.number} onChange={(e) => onChange({ number: e.target.value })} />
        </Field>
        <Field label="Airport / station / place">
          <input value={value.location} onChange={(e) => onChange({ location: e.target.value })} />
        </Field>
        <Field label={cityLabel}>
          <input value={value.city} onChange={(e) => onChange({ city: e.target.value })} />
        </Field>
      </div>
      <label className="check">
        <input type="checkbox" checked={value.carRequired} onChange={(e) => onChange({ carRequired: e.target.checked })} />
        {carLabel}
      </label>
    </section>
  );
}

export default function TravelFormModal({ travel, families, defaultFamilyId, onSave, onClose }: Props) {
  const [familyId, setFamilyId] = useState(travel?.family ?? defaultFamilyId ?? families[0]?._id ?? "");
  const [arrival, setArrival] = useState<LegForm>(() => legToForm(travel?.arrival));
  const [departure, setDeparture] = useState<LegForm>(() => legToForm(travel?.departure));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!familyId) return setError("Choose a family");

    const message = legError("arrival", arrival) ?? legError("departure", departure);
    if (message) return setError(message);

    const data: TravelFormData = { family: familyId, arrival: formToLeg(arrival), departure: formToLeg(departure) };
    if (!data.arrival && !data.departure) return setError("Add an arrival or a departure date");

    onSave(data);
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title">{travel ? "Edit travel" : "Add travel"}</h2>

        <Field label="Family">
          <select value={familyId} onChange={(e) => setFamilyId(e.target.value)} disabled={!!travel}>
            {families.map((f) => (
              <option key={f._id} value={f._id}>{f.name} Family · {f.city}</option>
            ))}
          </select>
        </Field>

        <LegFields
          title="Arrival"
          cityLabel="Coming from"
          carLabel="Pickup required"
          value={arrival}
          onChange={(patch) => setArrival({ ...arrival, ...patch })}
        />
        <LegFields
          title="Departure"
          cityLabel="Going to"
          carLabel="Drop required"
          value={departure}
          onChange={(patch) => setDeparture({ ...departure, ...patch })}
        />

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Save travel</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}