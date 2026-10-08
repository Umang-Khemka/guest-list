import { create } from "zustand";
import axios from "axios";
import allocationInstance from "../apis/allocationInstance";
import type {
  AllocationState,
  AllocationResponse,
  AllocationRawResponse,
  AllocationsResponse,
} from "../types/room";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const allocationStore = create<AllocationState>((set) => ({
  allocations: [],
  allocation: null,
  count: 0,
  loading: false,
  error: null,

  // create and update return unpopulated ids, so they don't touch the list.
  // Call getAllocations() after them to reload the populated list.
  createAllocation: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await allocationInstance.post<AllocationRawResponse>("/create-room", input);
      set({ loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Allocation not created"), loading: false });
      throw err;
    }
  },

  getAllocations: async () => {
    set({ loading: true, error: null });
    try {
      const res = await allocationInstance.get<AllocationsResponse>("/all-allocations");
      set({
        allocations: res.data.data,
        count: res.data.count,
        loading: false,
      });
    } catch (err) {
      set({ error: getError(err, "Allocations not found"), loading: false });
      throw err;
    }
  },

  getAllocationById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await allocationInstance.get<AllocationResponse>(`/create-room/${id}`);
      set({ allocation: res.data.data, loading: false });
    } catch (err) {
      set({ error: getError(err, "Allocation not found"), loading: false });
      throw err;
    }
  },

  getAllocationByFamilyId: async (familyId) => {
    set({ loading: true, error: null });
    try {
      const res = await allocationInstance.get<AllocationResponse>(`/create-room/family/${familyId}`);
      set({ allocation: res.data.data, loading: false });
    } catch (err) {
      set({ error: getError(err, "Allocation not found"), loading: false });
      throw err;
    }
  },

  updateAllocation: async (id, input) => {
    set({ loading: true, error: null });
    try {
      const res = await allocationInstance.put<AllocationRawResponse>(`/create-room/${id}`, input);
      set({ loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Allocation not updated"), loading: false });
      throw err;
    }
  },

  deleteAllocation: async (id) => {
    set({ loading: true, error: null });
    try {
      await allocationInstance.delete(`/create-room/${id}`);
      set((state) => ({
        allocations: state.allocations.filter((a) => a._id !== id),
        count: state.count - 1,
        loading: false,
      }));
    } catch (err) {
      set({ error: getError(err, "Allocation not deleted"), loading: false });
      throw err;
    }
  },
}));