import { useEffect, useMemo, useState } from "react";
import AssignFamilyModal from "../components/vehicles/AssignFamilyModal";
import VehicleCard from "../components/vehicles/VehicleCard";
import VehicleFormModal, { type VehicleFormData } from "../components/vehicles/VehicleFormModal";
import Toast from "../components/ui/Toast";
import { useToast } from "../hooks/useToast";
import { familyStore } from "../store/familyStore";
import { vehicleStore } from "../store/vehicleStore";
import { vehicleAssignmentStore } from "../store/vehicleAssignmentStore";
import type { Vehicle, VehicleAssignment } from "../types/vehicle";
import "../styles/VehiclesPage.css";

type ModalState = { mode: "add" } | { mode: "assign"; vehicle: Vehicle } | null;

export default function VehiclesPage() {
  const { families, getFamilies } = familyStore();
  const { vehicles, getVehicles, createVehicle } = vehicleStore();
  const {
    assignments: rawAssignments,
    getAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  } = vehicleAssignmentStore();
  const { toast, showToast } = useToast();
  const [modal, setModal] = useState<ModalState>(null);

  // Load families, vehicles and car assignments from the API once
  useEffect(() => {
    getFamilies({}).catch(() => { }); // no filters, so every family is available
    getVehicles().catch(() => { });
    getAssignments().catch(() => { });
  }, [getFamilies, getVehicles, getAssignments]);

  // Map API assignments (populated familyId/vehicleId) to the shape the components expect
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

  const sortedFamilies = useMemo(() => [...families].sort((a, b) => a.name.localeCompare(b.name)), [families]);

  // Each car's trips, earliest first
  const tripsOf = (vehicleId: string) =>
    assignments
      .filter((a) => a.vehicle === vehicleId)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const familyName = (id: string) => {
    const family = families.find((f) => f._id === id);
    if (family) return `${family.name} Family`;
    // fall back to the populated name on the assignment itself
    const populated = rawAssignments.find((a) => a.familyId?._id === id)?.familyId;
    return populated ? `${populated.name} Family` : "Unknown family";
  };

  const handleAddVehicle = async (data: VehicleFormData) => {
    try {
      await createVehicle(data); // store appends the new vehicle to the list
      setModal(null);
      showToast("Vehicle added");
    } catch {
      showToast(vehicleStore.getState().error ?? "Could not add vehicle");
    }
  };

  const handleAssign = async (data: Omit<VehicleAssignment, "_id">) => {
    // the backend allows one assignment per family per type (pickup / drop)
    const existing = assignments.find((a) => a.family === data.family && a.type === data.type);
    const payload = {
      familyId: data.family,
      vehicleId: data.vehicle,
      type: data.type,
      date: data.date,
      time: data.time,
      location: data.location,
    };

    try {
      if (existing) {
        const {familyId: _familyId, ...changes} = payload;
        await updateAssignment(existing._id, changes);
      } else {
        await createAssignment(payload);
      }
      await getAssignments(); // create/update return unpopulated ids, so reload the list
      setModal(null);
      showToast("Family assigned");
    } catch {
      showToast(vehicleAssignmentStore.getState().error ?? "Could not assign family");
    }
  };

  const handleRemove = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId); // store removes it from the list
      showToast("Assignment removed");
    } catch {
      showToast(vehicleAssignmentStore.getState().error ?? "Could not remove assignment");
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Vehicles</h1>
        <button className="btn btn--primary" onClick={() => setModal({ mode: "add" })}>
          Add vehicle
        </button>
      </div>
      <p className="page__sub">One car can serve many families at different times.</p>

      <div className="vehicle-grid">
        {vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle._id}
            vehicle={vehicle}
            assignments={tripsOf(vehicle._id)}
            familyName={familyName}
            onAssign={() => setModal({ mode: "assign", vehicle })}
            onRemove={handleRemove}
          />
        ))}
        {vehicles.length === 0 && <p className="muted">No vehicles yet. Add the cars you have arranged.</p>}
      </div>

      {modal?.mode === "add" && <VehicleFormModal onSave={handleAddVehicle} onClose={() => setModal(null)} />}

      {modal?.mode === "assign" && (
        <AssignFamilyModal
          vehicle={modal.vehicle}
          families={sortedFamilies}
          findConflict={findConflict}
          onSave={handleAssign}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}