import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssignCarModal from "../components/families/AssignCarModal";
import FamilyCard, { type FamilyAction } from "../components/families/FamilyCard";
import FamilyFilters from "../components/families/FamilyFilters";
import FamilyFormModal, { type FamilyFormData } from "../components/families/FamilyFormModal";
import FamilyRoomsModal, { type RoomChoice } from "../components/families/FamilyRoomModal";
import Toast from "../components/ui/Toast";
import { useAppData } from "../hooks/useAppData";
import { useCarAssignment } from "../hooks/useCarAssignment";
import { useToast } from "../hooks/useToast";
import { EMPTY_FILTERS, type Family, type FamilyFilters as Filters } from "../types/family";
import { filterFamilies, uniqueValues } from "../utils/filterFamilies";
import "./FamilyPage.css";

// Which popup is open (if any)
type ModalState =
  | { mode: "add" }
  | { mode: "edit"; family: Family }
  | { mode: "rooms"; family: Family }
  | { mode: "car"; family: Family }
  | null;

export default function FamiliesPage() {
  const navigate = useNavigate();
  const { families, setFamilies, rooms, allocations, setAllocations, vehicles } = useAppData();
  const { findConflict, addAssignment } = useCarAssignment();
  const { toast, showToast } = useToast();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [modal, setModal] = useState<ModalState>(null);

  const visible = useMemo(() => filterFamilies(families, filters), [families, filters]);
  const categories = useMemo(() => uniqueValues(families, "category"), [families]);
  const cities = useMemo(() => uniqueValues(families, "city"), [families]);

  const handleAction = (action: FamilyAction, family: Family) => {
    switch (action) {
      case "chat":
        return navigate(`/whatsapp?family=${family._id}`);
      case "room":
        return setModal({ mode: "rooms", family });
      case "pickup":
        return setModal({ mode: "car", family });
      case "edit":
        return setModal({ mode: "edit", family });
      case "open":
        return; // family detail view comes in a later step
    }
  };

  const handleSaveFamily = (data: FamilyFormData) => {
    const now = new Date().toISOString();

    if (modal?.mode === "edit") {
      const id = modal.family._id;
      setFamilies((prev) => prev.map((f) => (f._id === id ? { ...f, ...data, updatedAt: now } : f)));
      showToast("Family saved");
    } else {
      setFamilies((prev) => [...prev, { ...data, _id: String(Date.now()), createdAt: now, updatedAt: now }]);
      showToast("Family added");
    }
    setModal(null);
  };

  // Replace all of this family's allocations with the edited list
  const handleSaveRooms = (family: Family, choices: RoomChoice[]) => {
    setAllocations((prev) => [
      ...prev.filter((a) => a.family !== family._id),
      ...choices.map((c, i) => ({ _id: `${Date.now()}-${i}`, family: family._id, room: c.room, people: c.people })),
    ]);
    setModal(null);
    showToast(`Rooms updated for the ${family.name} Family`);
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Families</h1>
        <button className="btn btn--primary" onClick={() => setModal({ mode: "add" })}>
          Add family
        </button>
      </div>
      <p className="page__sub">
        {visible.length} of {families.length} families
      </p>

      <FamilyFilters filters={filters} onChange={setFilters} categories={categories} cities={cities} />

      <div className="family-grid">
        {visible.map((family) => (
          <FamilyCard key={family._id} family={family} onAction={handleAction} />
        ))}
        {visible.length === 0 && (
          <p className="muted">No family matches. Clear a filter or add a new family.</p>
        )}
      </div>

      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <FamilyFormModal
          family={modal.mode === "edit" ? modal.family : undefined}
          onSave={handleSaveFamily}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.mode === "rooms" && (
        <FamilyRoomsModal
          family={modal.family}
          rooms={rooms}
          allocations={allocations}
          onSave={(choices) => handleSaveRooms(modal.family, choices)}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.mode === "car" && (
        <AssignCarModal
          family={modal.family}
          vehicles={vehicles}
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