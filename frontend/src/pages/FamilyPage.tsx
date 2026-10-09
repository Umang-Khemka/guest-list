import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssignCarModal from "../components/families/AssignCarModal";
import FamilyCard, { type FamilyAction } from "../components/families/FamilyCard";
import FamilyFilters from "../components/families/FamilyFilters";
import FamilyFormModal, { type FamilyFormData } from "../components/families/FamilyFormModal";
import FamilyRoomsModal, { type RoomChoice } from "../components/families/FamilyRoomModal";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { familyStore } from "../store/familyStore";
import { roomStore } from "../store/roomStore";
import { allocationStore } from "../store/allocationStore";
import { vehicleStore } from "../store/vehicleStore";
import { vehicleAssignmentStore } from "../store/vehicleAssignmentStore";
import { EMPTY_FILTERS, type Family, type FamilyFilters as Filters, type FamilyQuery } from "../types/family";
import type { RoomAllocation } from "../types/room";
import type { VehicleAssignment } from "../types/vehicle";
import { uniqueValues } from "../utils/filterFamilies";
import "./FamilyPage.css";

type ModalState =
  | { mode: "add" }
  | { mode: "edit"; family: Family }
  | { mode: "rooms"; family: Family }
  | { mode: "car"; family: Family }
  | null;

export default function FamiliesPage() {
  const navigate = useNavigate();
  const { rooms, getRooms } = roomStore();
  const {
    allocations: rawAllocations,
    getAllocations,
    createAllocation,
    updateAllocation,
    deleteAllocation,
  } = allocationStore();
  const { vehicles, getVehicles } = vehicleStore();
  const {
    assignments: rawAssignments,
    getAssignments,
    createAssignment,
    updateAssignment,
  } = vehicleAssignmentStore();
  const { families, loading, error, getFamilies, createFamily, updateFamily } = familyStore();
  const { toast, showToast } = useToast();

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [modal, setModal] = useState<ModalState>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Load rooms, allocations, vehicles and car assignments from the API once
  useEffect(() => {
    getRooms().catch(() => { });
    getAllocations().catch(() => { });
    getVehicles().catch(() => { });
    getAssignments().catch(() => { });
  }, [getRooms, getAllocations, getVehicles, getAssignments]);

  // Map API allocations (populated familyId/roomId) to the shape the room modal expects
  const allocations = useMemo<RoomAllocation[]>(
    () =>
      rawAllocations
        .filter((a) => a.familyId && a.roomId) // skip rows whose family/room was deleted
        .map((a) => ({
          _id: a._id,
          family: a.familyId._id,
          room: a.roomId._id,
          people: a.occupantsCount,
        })),
    [rawAllocations]
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
    [rawAssignments]
  );

  // Is this vehicle already booked at this date and time? (replaces the one in useCarAssignment)
  // Returns the name of the family already using this car at that date and time, otherwise null
  const findConflict = (vehicleId: string, date: string, time: string): string | null => {
    const clash = rawAssignments.find(
      (a) => a.vehicleId?._id === vehicleId && a.date.slice(0, 10) === date && a.time === time,
    );
    return clash?.familyId?.name ?? null;
  };

  // Only send filters that are actually set
  const query = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v && v !== "all")
      ) as FamilyQuery,
    [filters]
  );

  // Fetch on load and whenever filters change (300ms wait so typing doesn't fire every key)
  useEffect(() => {
    const t = setTimeout(() => getFamilies(query).catch(() => { }), 300);
    return () => clearTimeout(t);
  }, [query, getFamilies]);

  // Dropdown options only grow, so they don't shrink while a filter is active
  useEffect(() => {
    setCategories((prev) => [...new Set([...prev, ...uniqueValues(families, "category")])].sort());
    setCities((prev) => [...new Set([...prev, ...uniqueValues(families, "city")])].sort());
  }, [families]);

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
        return;
    }
  };

  const handleSaveFamily = async (data: FamilyFormData) => {
    try {
      if (modal?.mode === "edit") {
        await updateFamily(modal.family._id, data);
        showToast("Family saved");
      } else {
        await createFamily(data);
        showToast("Family added");
      }
      setModal(null);
      getFamilies(query).catch(() => { }); // reload so the list matches the active filters
    } catch {
      showToast(familyStore.getState().error ?? "Could not save family");
    }
  };

  const handleSaveRooms = async (family: Family, choices: RoomChoice[]) => {
    const existing = allocations.filter((a) => a.family === family._id);
    const chosenRooms = new Set(choices.map((c) => c.room));

    try {
      await Promise.all([
        // rooms the family no longer uses
        ...existing
          .filter((a) => !chosenRooms.has(a.room))
          .map((a) => deleteAllocation(a._id)),
        // rooms kept (update occupants) or newly added (create)
        ...choices.map((c) => {
          const payload = { familyId: family._id, roomId: c.room, occupantsCount: c.people };
          const match = existing.find((a) => a.room === c.room);
          return match ? updateAllocation(match._id, payload) : createAllocation(payload);
        }),
      ]);
      await getAllocations(); // create/update return unpopulated ids, so reload the list
      setModal(null);
      showToast(`Rooms updated for the ${family.name} Family`);
    } catch {
      showToast(allocationStore.getState().error ?? "Could not update rooms");
    }
  };

  const handleSaveCar = async (
    family: Family,
    data: Omit<VehicleAssignment, "_id" | "family">
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
      await getAssignments(); // create/update return unpopulated ids, so reload the list
      setModal(null);
      showToast("Car assigned");
    } catch {
      showToast(vehicleAssignmentStore.getState().error ?? "Could not assign car");
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Families</h1>
        <button className="btn btn--primary" onClick={() => setModal({ mode: "add" })}>
          Add family
        </button>
      </div>
      <p className="page__sub">{families.length} families</p>

      {error && <p className="muted">{error}</p>}

      <FamilyFilters filters={filters} onChange={setFilters} categories={categories} cities={cities} />

      <div className="family-grid">
        {families.map((family) => (
          <FamilyCard key={family._id} family={family} onAction={handleAction} />
        ))}
        {loading && families.length === 0 && <p className="muted">Loading families...</p>}
        {!loading && families.length === 0 && (
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
          onSave={(data) => handleSaveCar(modal.family, data)}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}