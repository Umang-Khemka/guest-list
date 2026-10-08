import { create } from "zustand";
import axios from "axios";
import familyInstance from "../apis/familyInstance";
import type {
  FamilyState,
  FamilyResponse,
  FamiliesResponse,
} from "../types/family";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const familyStore = create<FamilyState>((set) => ({
  families: [],
  family: null,
  count: 0,
  loading: false,
  error: null,

  createFamily: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await familyInstance.post<FamilyResponse>("/add-family", input);
      set((state) => ({
        families: [...state.families, res.data.data],
        count: state.count + 1,
        loading: false,
      }));
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Family not created"), loading: false });
      throw err;
    }
  },

  getFamilies: async (query = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await familyInstance.get<FamiliesResponse>("/search", {
        params: query,
      });
      set({
        families: res.data.data,
        count: res.data.count,
        loading: false,
      });
    } catch (err) {
      set({ error: getError(err, "Families not found"), loading: false });
      throw err;
    }
  },

  getFamilyById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await familyInstance.get<FamilyResponse>(`/${id}`);
      set({ family: res.data.data, loading: false });
    } catch (err) {
      set({ error: getError(err, "Family not found"), loading: false });
      throw err;
    }
  },

  updateFamily: async (id, input) => {
    set({ loading: true, error: null });
    try {
      const res = await familyInstance.put<FamilyResponse>(`/${id}`, input);
      set((state) => ({
        families: state.families.map((f) => (f._id === id ? res.data.data : f)),
        family: state.family?._id === id ? res.data.data : state.family,
        loading: false,
      }));
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Family not updated"), loading: false });
      throw err;
    }
  },

  deleteFamily: async (id) => {
    set({ loading: true, error: null });
    try {
      await familyInstance.delete(`/${id}`);
      set((state) => ({
        families: state.families.filter((f) => f._id !== id),
        count: state.count - 1,
        loading: false,
      }));
    } catch (err) {
      set({ error: getError(err, "Family not deleted"), loading: false });
      throw err;
    }
  },
}));