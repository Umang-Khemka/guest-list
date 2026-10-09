import { create } from "zustand";
import axios from "axios";
import authInstance from "../apis/userInstance";
import type { AuthState, AuthResponse, CheckAuthResponse } from "../types/auth";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const authStore = create<AuthState>((set) => ({
  user: null,
  checking: true,
  loading: false,
  error: null,

  register: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await authInstance.post<AuthResponse>("/register", input);
      set({ user: res.data.user, loading: false });
      return res.data.user;
    } catch (err) {
      set({ error: getError(err, "Could not create account"), loading: false });
      throw err;
    }
  },

  login: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await authInstance.post<AuthResponse>("/login", input);
      set({ user: res.data.user, loading: false });
      return res.data.user;
    } catch (err) {
      set({ error: getError(err, "Could not sign in"), loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await authInstance.post("/logout");
      set({ user: null, loading: false });
    } catch (err) {
      set({ error: getError(err, "Could not log out"), loading: false });
      throw err;
    }
  },

  // Never throws and never sets an error: no valid cookie simply means logged out.
  checkAuth: async () => {
    try {
      const res = await authInstance.get<CheckAuthResponse>("/check");
      set({ user: res.data.user, checking: false });
    } catch {
      set({ user: null, checking: false });
    }
  },
}));