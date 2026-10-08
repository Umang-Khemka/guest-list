import { ASSIGNMENT_TYPE_LABELS } from "../../constants/logistics";
import type { Vehicle, VehicleAssignment } from "../../types/vehicle";
import { formatDate, formatTime } from "../../utils/dateUtils";

interface Props {
  vehicle: Vehicle;
  assignments: VehicleAssignment[]; // only this car's, already sorted by time
  familyName: (familyId: string) => string;
  onAssign: () => void;
  onRemove: (assignmentId: string) => void;
}

export default function VehicleCard({ vehicle, assignments, familyName, onAssign, onRemove }: Props) {
  return (
    <article className="vehicle-card">
      <div className="vehicle-card__top">
        <h3>{vehicle.name}</h3>
        <a className="btn" href={`tel:${vehicle.driverPhone.replace(/\s/g, "")}`}>
          Call {vehicle.driverName}
        </a>
      </div>

      <div className="muted">
        {vehicle.vehicleNumber} · seats {vehicle.capacity}
      </div>
      {vehicle.notes && <div className="muted">{vehicle.notes}</div>}

      {assignments.length === 0 && <p className="muted vehicle-card__free">Free all day.</p>}

      {assignments.map((a) => (
        <div className="vehicle-card__trip" key={a._id}>
          <span>
            <b>{formatTime(a.time)}</b> {formatDate(a.date)} · {ASSIGNMENT_TYPE_LABELS[a.type]}
            <br />
            {familyName(a.family)}
            {a.location && ` · ${a.location}`}
          </span>
          <button className="btn" onClick={() => onRemove(a._id)}>Remove</button>
        </div>
      ))}

      <button className="btn vehicle-card__add" onClick={onAssign}>Assign a family</button>
    </article>
  );
}