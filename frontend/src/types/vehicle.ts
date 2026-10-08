export type AssignmentType = "pickup" | "drop";

// A car and its driver. No family info here: that lives in VehicleAssignment.
export interface Vehicle {
  _id: string;
  name: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  notes?: string;
}

// One pickup or drop. A car can have many assignments at different times.
export interface VehicleAssignment {
  _id: string;
  family: string; // Family._id
  vehicle: string; // Vehicle._id
  type: AssignmentType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  location: string;
}