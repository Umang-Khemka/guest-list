import { create } from "zustand";
import axios from "axios";
import roomInstance from "../apis/roomInstance";
import type { RoomState, RoomResponse, RoomsResponse } from "../types/room";

const getError = (err: unknown, fallback: string) =>
  axios.isAxiosError(err) ? err.response?.data?.message || fallback : fallback;

export const roomStore = create<RoomState>((set) => ({
  rooms: [],
  room: null,
  count: 0,
  loading: false,
  error: null,

  createRoom: async (input) => {
    set({ loading: true, error: null });
    try {
      const res = await roomInstance.post<RoomResponse>("/create-room", input);
      set((state) => ({
        rooms: [...state.rooms, res.data.data],
        count: state.count + 1,
        loading: false,
      }));
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Room not created"), loading: false });
      throw err;
    }
  },

  getRooms: async () => {
    set({ loading: true, error: null });
    try {
      const res = await roomInstance.get<RoomsResponse>("/get-rooms");
      set({
        rooms: res.data.data,
        count: res.data.count,
        loading: false,
      });
    } catch (err) {
      set({ error: getError(err, "Rooms not found"), loading: false });
      throw err;
    }
  },

  getRoomById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await roomInstance.get<RoomResponse>(`/get-rooms/${id}`);
      set({ room: res.data.data, loading: false });
    } catch (err) {
      set({ error: getError(err, "Room not found"), loading: false });
      throw err;
    }
  },

  updateRoom: async (id, input) => {
    set({ loading: true, error: null });
    try {
      const res = await roomInstance.put<RoomResponse>(`/update-room/${id}`, input);
      set((state) => ({
        rooms: state.rooms.map((r) => (r._id === id ? res.data.data : r)),
        room: state.room?._id === id ? res.data.data : state.room,
        loading: false,
      }));
      return res.data.data;
    } catch (err) {
      set({ error: getError(err, "Room not updated"), loading: false });
      throw err;
    }
  },

  deleteRoom: async (id) => {
    set({ loading: true, error: null });
    try {
      await roomInstance.delete(`/delete-room/${id}`);
      set((state) => ({
        rooms: state.rooms.filter((r) => r._id !== id),
        count: state.count - 1,
        loading: false,
      }));
    } catch (err) {
      set({ error: getError(err, "Room not deleted"), loading: false });
      throw err;
    }
  },
}));