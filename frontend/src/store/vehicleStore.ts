import { create } from "zustand";
import axios from "axios";
import vehicleInstance from "../apis/vehicleInstance";
import type { VehicleState, VehicleResponse, VehiclesResponse } from "../types/vehicle";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const vehicleStore = create<VehicleState>((set) => ({
  vehicles: [],
  vehicle: null,
  count: 0,
  loading: false,
  error: null,

  createVehicle: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleInstance.post<VehicleResponse>("/create", input);
      set((state) => ({
        vehicles: [...state.vehicles, res.data.data],
        count: state.count + 1,
        loading: false,
      }));
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Vehicle not created"), loading: false });
      throw err;
    }
  },

  getVehicles: async () => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleInstance.get<VehiclesResponse>("/all");
      set({ vehicles: res.data.data, count: res.data.count, loading: false });
    } catch (err) {
      set({ error: getError(err, "Vehicles not found"), loading: false });
      throw err;
    }
  },

  getVehicleById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleInstance.get<VehicleResponse>(`/create/${id}`);
      set({ vehicle: res.data.data, loading: false });
    } catch (err) {
      set({ error: getError(err, "Vehicle not found"), loading: false });
      throw err;
    }
  },

  updateVehicle: async (id, input) => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleInstance.put<VehicleResponse>(`/create/${id}`, input);
      set((state) => ({
        vehicles: state.vehicles.map((v) => (v._id === id ? res.data.data : v)),
        vehicle: state.vehicle?._id === id ? res.data.data : state.vehicle,
        loading: false,
      }));
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Vehicle not updated"), loading: false });
      throw err;
    }
  },

  deleteVehicle: async (id) => {
    set({ loading: true, error: null });
    try {
      await vehicleInstance.delete(`/create/${id}`);
      set((state) => ({
        vehicles: state.vehicles.filter((v) => v._id !== id),
        count: state.count - 1,
        loading: false,
      }));
    } catch (err) {
      set({ error: getError(err, "Vehicle not deleted"), loading: false });
      throw err;
    }
  },
}));