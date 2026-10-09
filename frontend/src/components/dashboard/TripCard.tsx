import { TRAVEL_MODE_LABELS } from "../../constants/logistics";
import type { TodayTrip } from "../../types/dashboard";
import { formatTime } from "../../utils/dateUtils";

interface Props extends TodayTrip {
  kind: "arrival" | "departure";
}

// An arrival or departure happening today, with its car status
export default function TripCard({ family, leg, vehicleName, kind }: Props) {
  const action = kind === "arrival" ? "Pickup" : "Drop";
  const mode = TRAVEL_MODE_LABELS[leg.mode] + (leg.number ? ` ${leg.number}` : "");

  return (
    <div className="trip-card">
      <b>{family.name} Family</b>
      <div>
        {formatTime(leg.time)} · {mode}
      </div>
      <div className="muted">{leg.location}</div>

      <div className="trip-card__car">
        {!leg.carRequired && <span className="muted">No car needed</span>}
        {leg.carRequired && vehicleName && <span className="pill">{vehicleName} assigned</span>}
        {leg.carRequired && !vehicleName && <span className="pill pill--pending">{action} required</span>}
      </div>
    </div>
  );
}