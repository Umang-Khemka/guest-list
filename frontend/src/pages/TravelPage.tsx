import { useMemo, useState } from "react";
import AssignCarModal from "../components/families/AssignCarModal";
import TravelCard from "../components/travel/TravelCard";
import TravelFormModal, { type TravelFormData } from "../components/travel/TravelFormModal";
import Toast from "../components/ui/Toast";
import { useAppData } from "../hooks/useAppData";
import { useCarAssignment } from "../hooks/useCarAssignment";
import { useToast } from "../hooks/useToast";
import type { Family } from "../types/family";
import type { Travel, TravelLeg } from "../types/travel";
import type { AssignmentType } from "../types/vehicle";
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
  const { families, travels, setTravels, vehicles, assignments } = useAppData();
  const { findConflict, addAssignment } = useCarAssignment();
  const { toast, showToast } = useToast();
  const [modal, setModal] = useState<ModalState>(null);

  const sorted = useMemo(() => [...travels].sort((a, b) => sortKey(a).localeCompare(sortKey(b))), [travels]);

  const withoutTravel = useMemo(
    () => families.filter((f) => !travels.some((t) => t.family === f._id)),
    [families, travels],
  );

  // Confirmed outstation families we still need travel details for
  const missing = withoutTravel.filter((f) => f.guestType === "outstation" && f.status === "confirmed");

  const familyOf = (id: string) => families.find((f) => f._id === id);

  const handleSaveTravel = (data: TravelFormData) => {
    if (modal?.mode === "edit") {
      const id = modal.travel._id;
      setTravels((prev) => prev.map((t) => (t._id === id ? { ...t, ...data } : t)));
      showToast("Travel saved");
    } else {
      setTravels((prev) => [...prev, { ...data, _id: `t${Date.now()}` }]);
      showToast("Travel added");
    }
    setModal(null);
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
          onSave={(data) => {
            addAssignment(data);
            setModal(null);
            showToast("Car assigned");
          }}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}