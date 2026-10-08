import { useMemo, useState } from "react";
import AssignFamilyModal from "../components/vehicles/AssignFamilyModal";
import VehicleCard from "../components/vehicles/VehicleCard";
import VehicleFormModal, { type VehicleFormData } from "../components/vehicles/VehicleFormModal";
import Toast from "../components/ui/Toast";
import { useAppData } from "../hooks/useAppData";
import { useCarAssignment } from "../hooks/useCarAssignment";
import { useToast } from "../hooks/useToast";
import type { Vehicle } from "../types/vehicle";
import "./VehiclesPage.css";

type ModalState = { mode: "add" } | { mode: "assign"; vehicle: Vehicle } | null;

export default function VehiclesPage() {
  const { families, vehicles, setVehicles, assignments, setAssignments } = useAppData();
  const { findConflict, addAssignment } = useCarAssignment();
  const { toast, showToast } = useToast();
  const [modal, setModal] = useState<ModalState>(null);

  const sortedFamilies = useMemo(() => [...families].sort((a, b) => a.name.localeCompare(b.name)), [families]);

  // Each car's trips, earliest first
  const tripsOf = (vehicleId: string) =>
    assignments
      .filter((a) => a.vehicle === vehicleId)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  const familyName = (id: string) => {
    const family = families.find((f) => f._id === id);
    return family ? `${family.name} Family` : "Unknown family";
  };

  const handleAddVehicle = (data: VehicleFormData) => {
    setVehicles((prev) => [...prev, { ...data, _id: `v${Date.now()}` }]);
    setModal(null);
    showToast("Vehicle added");
  };

  const handleRemove = (assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a._id !== assignmentId));
    showToast("Assignment removed");
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
          onSave={(data) => {
            addAssignment(data);
            setModal(null);
            showToast("Family assigned");
          }}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}