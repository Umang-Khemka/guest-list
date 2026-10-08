import { TRAVEL_MODE_LABELS, MOCK_TODAY } from "../../constants/logistics";
import type { Family } from "../../types/family";
import type { Travel, TravelLeg } from "../../types/travel";
import type { AssignmentType, Vehicle, VehicleAssignment } from "../../types/vehicle";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { findLegVehicle } from "../../utils/travelUtils";

interface Props {
  travel: Travel;
  family: Family;
  vehicles: Vehicle[];
  assignments: VehicleAssignment[];
  onEdit: () => void;
  onAssign: (type: AssignmentType, leg: TravelLeg) => void;
}

interface LegProps {
  title: string;
  type: AssignmentType;
  leg?: TravelLeg;
  family: Family;
  vehicles: Vehicle[];
  assignments: VehicleAssignment[];
  onAssign: (type: AssignmentType, leg: TravelLeg) => void;
}

function Leg({ title, type, leg, family, vehicles, assignments, onAssign }: LegProps) {
  if (!leg) {
    return (
      <div className="travel-leg">
        <div className="travel-leg__title">{title}</div>
        <p className="muted">Not added yet.</p>
      </div>
    );
  }

  const vehicle = findLegVehicle(assignments, vehicles, family._id, type, leg);
  const action = type === "pickup" ? "Pickup" : "Drop";
  const mode = TRAVEL_MODE_LABELS[leg.mode] + (leg.number ? ` ${leg.number}` : "");

  return (
    <div className="travel-leg">
      <div className="travel-leg__title">
        {title}
        {leg.date === MOCK_TODAY && <span className="pill pill--pending">Today</span>}
      </div>
      <div>
        <b>{formatDate(leg.date)}</b>, {formatTime(leg.time)}
      </div>
      <div className="muted">
        {mode} · {leg.location}
        {leg.city && ` · ${type === "pickup" ? "from" : "to"} ${leg.city}`}
      </div>

      <div className="travel-leg__car">
        {!leg.carRequired && <span className="muted">No car needed</span>}
        {leg.carRequired && vehicle && <span className="pill">{vehicle.name} assigned</span>}
        {leg.carRequired && !vehicle && (
          <>
            <span className="pill pill--pending">{action} required</span>
            <button className="btn" onClick={() => onAssign(type, leg)}>Assign car</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function TravelCard({ travel, family, vehicles, assignments, onEdit, onAssign }: Props) {
  const shared = { family, vehicles, assignments, onAssign };

  return (
    <article className="travel-card">
      <div className="travel-card__top">
        <div>
          <h3 className="travel-card__name">{family.name} Family</h3>
          <div className="muted">
            {family.primaryContact} · {family.city}
          </div>
        </div>
        <button className="btn" onClick={onEdit}>Edit travel</button>
      </div>

      <div className="travel-legs">
        <Leg title="Arrives" type="pickup" leg={travel.arrival} {...shared} />
        <Leg title="Leaves" type="drop" leg={travel.departure} {...shared} />
      </div>
    </article>
  );
}