import { create } from "zustand";
import axios from "axios";
import dashboardInstance from "../apis/dashboardInstance";
import type { DashboardData, DashboardState } from "../types/dashboard";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const dashboardStore = create<DashboardState>((set) => ({
  stats: [],
  arrivals: [],
  departures: [],
  needsAction: [],
  loading: false,
  error: null,

  getDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await dashboardInstance.get<DashboardData>("/");
      set({ ...res.data, loading: false });
    } catch (err) {
      set({ error: getError(err, "Dashboard not loaded"), loading: false });
      throw err;
    }
  },
}));