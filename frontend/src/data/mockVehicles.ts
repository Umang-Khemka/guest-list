import type { AssignmentType, Vehicle, VehicleAssignment } from "../types/vehicle";

const vehicle = (n: number, name: string, vehicleNumber: string, driverName: string, driverPhone: string, capacity: number): Vehicle => ({
  _id: `v${n}`,
  name,
  vehicleNumber,
  driverName,
  driverPhone,
  capacity,
});

export const mockVehicles: Vehicle[] = [
  vehicle(1, "Innova 1", "GJ05 AB 1001", "Ramesh", "+91 99000 00001", 6),
  vehicle(2, "Innova 2", "GJ05 AB 1002", "Suresh", "+91 99000 00002", 6),
  vehicle(3, "Ertiga", "GJ05 CD 2003", "Mahesh", "+91 99000 00003", 5),
  vehicle(4, "Dzire", "GJ05 EF 3004", "Kishan", "+91 99000 00004", 3),
  vehicle(5, "Swift", "GJ05 EF 3005", "Hitesh", "+91 99000 00005", 3),
];

const assign = (id: number, family: number, vehicleNo: number, type: AssignmentType, date: string, time: string, location: string): VehicleAssignment => ({
  _id: `va${id}`,
  family: String(family),
  vehicle: `v${vehicleNo}`,
  type,
  date,
  time,
  location,
});

export const mockAssignments: VehicleAssignment[] = [
  assign(1, 1, 1, "pickup", "2026-12-12", "15:30", "Ahmedabad Airport"),
  assign(2, 4, 1, "pickup", "2026-12-12", "18:10", "Surat Station"),
  assign(3, 10, 2, "pickup", "2026-12-12", "21:00", "Surat Airport"),
  assign(4, 7, 3, "drop", "2026-12-12", "20:00", "Hotel to Vadodara"),
  assign(5, 12, 3, "pickup", "2026-12-13", "10:00", "Surat Station"),
  assign(6, 1, 1, "drop", "2026-12-15", "11:00", "Ahmedabad Airport"),
];