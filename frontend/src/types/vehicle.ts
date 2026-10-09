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

// One pickup or drop. Stays local for now: there is no backend for it yet.
export interface VehicleAssignment {
  _id: string;
  family: string; // Family._id
  vehicle: string; // Vehicle._id
  type: AssignmentType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  location: string;
}

export type CreateVehicleInput = Omit<Vehicle, "_id">;

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export interface VehicleResponse {
  success: boolean;
  data: Vehicle;
}

export interface VehiclesResponse {
  success: boolean;
  count: number;
  data: Vehicle[];
}

export interface VehicleState {
  vehicles: Vehicle[];
  vehicle: Vehicle | null;
  count: number;
  loading: boolean;
  error: string | null;

  createVehicle: (input: CreateVehicleInput) => Promise<Vehicle>;
  getVehicles: () => Promise<void>;
  getVehicleById: (id: string) => Promise<void>;
  updateVehicle: (id: string, input: UpdateVehicleInput) => Promise<Vehicle>;
  deleteVehicle: (id: string) => Promise<void>;
}

// GET responses populate familyId and vehicleId into objects
export interface AssignmentFamily {
  _id: string;
  name: string;
  primaryContact: string;
  phone: string;
  city: string;
  confirmedCount: number;
  status: string;
}

export interface AssignmentVehicle {
  _id: string;
  name: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  notes?: string;
}

// Populated: returned by GET /all, GET /create/:id and GET /family/:familyId
export interface VehicleAssignmentPopulated {
  _id: string;
  familyId: AssignmentFamily;
  vehicleId: AssignmentVehicle;
  type: AssignmentType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm (24h)
  location: string;
  createdAt: string;
  updatedAt: string;
}

// NOT populated: returned by create and update
export interface VehicleAssignmentRaw {
  _id: string;
  familyId: string;
  vehicleId: string;
  type: AssignmentType;
  date: string;
  time: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleAssignmentInput {
  familyId: string;
  vehicleId: string;
  type: AssignmentType;
  date: string;
  time: string;
  location: string;
}

export type UpdateVehicleAssignmentInput = Partial<CreateVehicleAssignmentInput>;

export interface VehicleAssignmentResponse {
  success: boolean;
  data: VehicleAssignmentPopulated;
}

export interface VehicleAssignmentRawResponse {
  success: boolean;
  data: VehicleAssignmentRaw;
}

export interface VehicleAssignmentsResponse {
  success: boolean;
  count: number;
  data: VehicleAssignmentPopulated[];
}

export interface VehicleAssignmentState {
  assignments: VehicleAssignmentPopulated[];
  assignment: VehicleAssignmentPopulated | null;
  count: number;
  loading: boolean;
  error: string | null;

  createAssignment: (input: CreateVehicleAssignmentInput) => Promise<VehicleAssignmentRaw>;
  getAssignments: () => Promise<void>;
  getAssignmentById: (id: string) => Promise<void>;
  getAssignmentsByFamilyId: (familyId: string) => Promise<void>;
  updateAssignment: (id: string, input: UpdateVehicleAssignmentInput) => Promise<VehicleAssignmentRaw>;
  deleteAssignment: (id: string) => Promise<void>;
}