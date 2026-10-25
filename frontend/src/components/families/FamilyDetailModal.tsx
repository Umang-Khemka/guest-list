import { GROUP_LABELS, GUEST_TYPE_LABELS } from "../../constants/family";
import type { Family } from "../../types/family";
import type { Room, RoomAllocation } from "../../types/room";
import type { Vehicle, VehicleAssignment } from "../../types/vehicle";
import { formatPhone } from "../../utils/formatPhone";
import Modal from "../ui/Modal";
import StatusPill from "../ui/StatusPill";

interface Props {
  family: Family;
  rooms: Room[];
  allocations: RoomAllocation[];
  vehicles: Vehicle[];
  assignments: VehicleAssignment[];
  onClose: () => void;
}

export default function FamilyDetailsModal({ family, allocations, vehicles, assignments, onClose }: Props) {
  const familyRooms = allocations.filter((a) => a.family === family._id);
  const familyCars = assignments.filter((a) => a.family === family._id);

  return (
    <Modal onClose={onClose}>
      <div className="family-details__head">
        <h2 className="modal__title">{family.name} Family</h2>
        <StatusPill status={family.status} />
      </div>

      <p className="family-details__row">
        {family.city} · {GUEST_TYPE_LABELS[family.guestType]}
      </p>
      <p className="family-details__row">
        {GROUP_LABELS[family.group]}
        {family.relationToGroom && ` · ${family.relationToGroom}`}
      </p>
      <p className="family-details__row"><b>{family.confirmedCount}</b> confirmed</p>
      {family.notes && <p className="family-details__row muted">{family.notes}</p>}

      <h4 className="family-details__title">Members</h4>
      {(family.members ?? []).map((m, i) => (
        <p key={i} className="family-details__row">
          {m.name} · {formatPhone(m.contactNumber)}
        </p>
      ))}

      <h4 className="family-details__title">Rooms</h4>
      {familyRooms.length === 0 && <p className="muted">No rooms assigned</p>}
      {familyRooms.map((a) => (
        <p key={a._id} className="family-details__row">
          Room · {a.people} people
        </p>
      ))}

      <h4 className="family-details__title">Cars</h4>
      {familyCars.length === 0 && <p className="muted">No car assigned</p>}
      {familyCars.map((a) => (
        <p key={a._id} className="family-details__row">
          {a.type}: {vehicles.find((v) => v._id === a.vehicle)?.name ?? "Car"} · {a.date} {a.time} · {a.location}
        </p>
      ))}

      <div className="form-actions">
        <button type="button" className="btn" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}