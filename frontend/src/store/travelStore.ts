import { create } from "zustand";
import axios from "axios";
import travelInstance from "../apis/travelInstance";
import type {
  TravelState,
  TravelResponse,
  TravelRawResponse,
  TravelsResponse,
} from "../types/travel";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const travelStore = create<TravelState>((set) => ({
  travels: [],
  travel: null,
  count: 0,
  loading: false,
  error: null,

  // create and update return unpopulated ids, so they don't touch the list.
  // Call getTravels() after them to reload the populated list.
  createTravel: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await travelInstance.post<TravelRawResponse>("/create", input);
      set({ loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Travel details not created"), loading: false });
      throw err;
    }
  },

  getTravels: async () => {
    set({ loading: true, error: null });
    try {
      const res = await travelInstance.get<TravelsResponse>("/all-travels");
      set({ travels: res.data.data, count: res.data.count, loading: false });
    } catch (err) {
      set({ error: getError(err, "Travel details not found"), loading: false });
      throw err;
    }
  },

  getTravelById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await travelInstance.get<TravelResponse>(`/${id}`);
      set({ travel: res.data.data, loading: false });
    } catch (err) {
      set({ error: getError(err, "Travel details not found"), loading: false });
      throw err;
    }
  },

  // Doesn't store anything: the result is unpopulated, so it can't go in `travel`.
  // A 404 just means "no travel yet", so it returns null instead of setting an error.
  getTravelByFamilyId: async (familyId) => {
    try {
      const res = await travelInstance.get<TravelRawResponse>(`/family/${familyId}`);
      return res.data.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) return null;
      set({ error: getError(err, "Travel details not found") });
      throw err;
    }
  },

  updateTravel: async (id, input) => {
    set({ loading: true, error: null });
    try {
      const res = await travelInstance.put<TravelRawResponse>(`/update/${id}`, input);
      set({ loading: false });
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Travel details not updated"), loading: false });
      throw err;
    }
  },

  deleteTravel: async (id) => {
    set({ loading: true, error: null });
    try {
      await travelInstance.delete(`/delete/${id}`);
      set((state) => ({
        travels: state.travels.filter((t) => t._id !== id),
        count: state.count - 1,
        loading: false,
      }));
    } catch (err) {
      set({ error: getError(err, "Travel details not deleted"), loading: false });
      throw err;
    }
  },
}));