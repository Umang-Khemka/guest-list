import { useEffect, useMemo, useState } from "react";
import AssignCarModal from "../components/families/AssignCarModal";
import TravelCard from "../components/travel/TravelCard";
import TravelFormModal, { type TravelFormData } from "../components/travel/TravelFormModal";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { familyStore } from "../store/familyStore";
import { travelStore } from "../store/travelStore";
import { vehicleStore } from "../store/vehicleStore";
import { vehicleAssignmentStore } from "../store/vehicleAssignmentStore";
import type { Family } from "../types/family";
import type { Travel, TravelLeg } from "../types/travel";
import type { AssignmentType, VehicleAssignment } from "../types/vehicle";
import { fromApiLeg, toApiLeg } from "../utils/travelMapper";
import "./TravelPage.css";

type ModalState =
  | { mode: "add"; familyId?: string }
  | { mode: "edit"; travel: Travel }
  | { mode: "car"; family: Family; type: AssignmentType; leg: TravelLeg }
  | null;

// Sort key: first date we know about, then time
const sortKey = (t: Travel) => {
  const leg = t.arrival ?? t.departure;
  return leg ? `${leg.date} ${leg.time}` : "9999";
};

export default function TravelPage() {
  const { families, getFamilies } = familyStore();
  const { travels: rawTravels, getTravels, createTravel, updateTravel } = travelStore();
  const { vehicles, getVehicles } = vehicleStore();
  const {
    assignments: rawAssignments,
    getAssignments,
    createAssignment,
    updateAssignment,
  } = vehicleAssignmentStore();
  const { toast, showToast } = useToast();
  const [modal, setModal] = useState<ModalState>(null);

  // Load everything this page needs from the API once
  useEffect(() => {
    getFamilies({}).catch(() => { }); // no filters, so every family is available
    getTravels().catch(() => { });
    getVehicles().catch(() => { });
    getAssignments().catch(() => { });
  }, [getFamilies, getTravels, getVehicles, getAssignments]);

  // Map API travel (populated familyId) to the shape TravelCard and TravelFormModal expect
  const travels = useMemo<Travel[]>(
    () =>
      rawTravels
        .filter((t) => t.familyId) // skip rows whose family was deleted
        .map((t) => ({
          _id: t._id,
          family: t.familyId._id,
          arrival: fromApiLeg(t.arrival, "arrival"),
          departure: fromApiLeg(t.departure, "departure"),
        })),
    [rawTravels],
  );

  // Map API car assignments (populated familyId/vehicleId) to the shape the car modal expects
  const assignments = useMemo<VehicleAssignment[]>(
    () =>
      rawAssignments
        .filter((a) => a.familyId && a.vehicleId) // skip rows whose family/vehicle was deleted
        .map((a) => ({
          _id: a._id,
          family: a.familyId._id,
          vehicle: a.vehicleId._id,
          type: a.type,
          date: a.date.slice(0, 10),
          time: a.time,
          location: a.location,
        })),
    [rawAssignments],
  );

  // Is this vehicle already booked at this date and time?
  // Returns the name of the family already using this car at that date and time, otherwise null
  const findConflict = (vehicleId: string, date: string, time: string): string | null => {
    const clash = rawAssignments.find(
      (a) => a.vehicleId?._id === vehicleId && a.date.slice(0, 10) === date && a.time === time,
    );
    return clash?.familyId?.name ?? null;
  };

  const sorted = useMemo(() => [...travels].sort((a, b) => sortKey(a).localeCompare(sortKey(b))), [travels]);

  const withoutTravel = useMemo(
    () => families.filter((f) => !travels.some((t) => t.family === f._id)),
    [families, travels],
  );

  // Confirmed outstation families we still need travel details for
  const missing = withoutTravel.filter((f) => f.guestType === "outstation" && f.status === "confirmed");

  const familyOf = (id: string) => families.find((f) => f._id === id);

  const handleSaveTravel = async (data: TravelFormData) => {
    if (data.arrival && data.departure && data.departure.date < data.arrival.date) {
      return showToast("Departure can't be before arrival");
    }

    const arrival = toApiLeg(data.arrival, "arrival");
    const departure = toApiLeg(data.departure, "departure");

    try {
      if (modal?.mode === "edit") {
        await updateTravel(modal.travel._id, { arrival, departure });
        showToast("Travel saved");
      } else {
        await createTravel({ familyId: data.family, arrival, departure });
        showToast("Travel added");
      }
      await getTravels();
      setModal(null);
    } catch {
      showToast(travelStore.getState().error ?? "Could not save travel");
    }
  };

  const handleSaveCar = async (
    family: Family,
    data: Omit<VehicleAssignment, "_id" | "family">,
  ) => {
    // the backend allows one assignment per family per type (pickup / drop)
    const existing = assignments.find((a) => a.family === family._id && a.type === data.type);
    const payload = {
      familyId: family._id,
      vehicleId: data.vehicle,
      type: data.type,
      date: data.date,
      time: data.time,
      location: data.location,
    };

    try {
      if (existing) {
        const { familyId: _familyId, ...changes } = payload;
        await updateAssignment(existing._id, changes);
      } else {
        await createAssignment(payload);
      }
      await getAssignments();
      setModal(null);
      showToast("Car assigned");
    } catch {
      showToast(vehicleAssignmentStore.getState().error ?? "Could not assign car");
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Travel</h1>
        <button className="btn btn--primary" onClick={() => setModal({ mode: "add" })} disabled={withoutTravel.length === 0}>
          Add travel
        </button>
      </div>
      <p className="page__sub">{travels.length} families with travel details, by arrival date.</p>

      {missing.length > 0 && (
        <section className="missing">
          <h2 className="missing__title">Travel details needed ({missing.length})</h2>
          {missing.map((f) => (
            <div className="missing__row" key={f._id}>
              <span>
                <b>{f.name} Family</b> <span className="muted">· {f.city}</span>
              </span>
              <button className="btn" onClick={() => setModal({ mode: "add", familyId: f._id })}>Add</button>
            </div>
          ))}
        </section>
      )}

      <div className="travel-grid">
        {sorted.map((travel) => {
          const family = familyOf(travel.family);
          if (!family) return null;
          return (
            <TravelCard
              key={travel._id}
              travel={travel}
              family={family}
              vehicles={vehicles}
              assignments={assignments}
              onEdit={() => setModal({ mode: "edit", travel })}
              onAssign={(type, leg) => setModal({ mode: "car", family, type, leg })}
            />
          );
        })}
        {sorted.length === 0 && <p className="muted">No travel details yet. Add arrival and departure for outstation families.</p>}
      </div>

      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <TravelFormModal
          travel={modal.mode === "edit" ? modal.travel : undefined}
          families={modal.mode === "edit" ? families.filter((f) => f._id === modal.travel.family) : withoutTravel}
          defaultFamilyId={modal.mode === "add" ? modal.familyId : undefined}
          onSave={handleSaveTravel}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.mode === "car" && (
        <AssignCarModal
          family={modal.family}
          vehicles={vehicles}
          initial={{ type: modal.type, date: modal.leg.date, time: modal.leg.time, location: modal.leg.location }}
          findConflict={findConflict}
          onSave={(data) => handleSaveCar(modal.family, data)}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}