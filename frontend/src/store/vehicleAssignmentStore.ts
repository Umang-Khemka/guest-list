import { create } from "zustand";
import axios from "axios";
import vehicleAssignmentInstance from "../apis/vehicleAssignmentInstance";
import type {
  VehicleAssignmentState,
  VehicleAssignmentResponse,
  VehicleAssignmentRawResponse,
  VehicleAssignmentsResponse,
} from "../types/vehicle";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const vehicleAssignmentStore = create<VehicleAssignmentState>((set) => ({
  assignments: [],
  assignment: null,
  count: 0,
  loading: false,
  error: null,

  // create and update return unpopulated ids, so they don't touch the list.
  // Call getAssignments() after them to reload the populated list.
  createAssignment: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleAssignmentInstance.post<VehicleAssignmentRawResponse>("/create", input);
      set({ loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Assignment not created"), loading: false });
      throw err;
    }
  },

  getAssignments: async () => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleAssignmentInstance.get<VehicleAssignmentsResponse>("/all");
      set({ assignments: res.data.data, count: res.data.count, loading: false });
    } catch (err) {
      set({ error: getError(err, "Assignments not found"), loading: false });
      throw err;
    }
  },

  getAssignmentById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleAssignmentInstance.get<VehicleAssignmentResponse>(`/create/${id}`);
      set({ assignment: res.data.data, loading: false });
    } catch (err) {
      set({ error: getError(err, "Assignment not found"), loading: false });
      throw err;
    }
  },

  // Replaces the list with just this family's assignments (populated).
  getAssignmentsByFamilyId: async (familyId) => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleAssignmentInstance.get<VehicleAssignmentsResponse>(`/family/${familyId}`);
      set({ assignments: res.data.data, count: res.data.count, loading: false });
    } catch (err) {
      set({ error: getError(err, "Assignments not found"), loading: false });
      throw err;
    }
  },

  updateAssignment: async (id, input) => {
    set({ loading: true, error: null });
    try {
      const res = await vehicleAssignmentInstance.put<VehicleAssignmentRawResponse>(`/create/${id}`, input);
      set({ loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Assignment not updated"), loading: false });
      throw err;
    }
  },

  deleteAssignment: async (id) => {
    set({ loading: true, error: null });
    try {
      await vehicleAssignmentInstance.delete(`/create/${id}`);
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
        count: state.count - 1,
        loading: false,
      }));
    } catch (err) {
      set({ error: getError(err, "Assignment not deleted"), loading: false });
      throw err;
    }
  },
}));