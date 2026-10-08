import type { Travel, TravelLeg, TravelMode } from "../types/travel";

const leg = (
  date: string,
  time: string,
  mode: TravelMode,
  number: string,
  location: string,
  city: string,
  carRequired: boolean,
): TravelLeg => ({ date, time, mode, number: number || undefined, location, city, carRequired });

export const mockTravels: Travel[] = [
  {
    _id: "t1",
    family: "1",
    arrival: leg("2026-12-12", "15:30", "flight", "AI123", "Ahmedabad Airport", "Mumbai", true),
    departure: leg("2026-12-15", "11:00", "flight", "AI124", "Ahmedabad Airport", "Mumbai", true),
  },
  {
    _id: "t4",
    family: "4",
    arrival: leg("2026-12-12", "18:10", "train", "12952", "Surat Station", "Delhi", true),
    departure: leg("2026-12-16", "09:00", "train", "12951", "Surat Station", "Delhi", true),
  },
  {
    _id: "t7",
    family: "7",
    arrival: leg("2026-12-11", "17:00", "car", "", "Hotel", "Vadodara", false),
    departure: leg("2026-12-12", "20:00", "car", "", "Hotel", "Vadodara", true),
  },
  {
    _id: "t10",
    family: "10",
    arrival: leg("2026-12-12", "21:00", "flight", "6E512", "Surat Airport", "Bengaluru", true),
    departure: leg("2026-12-14", "07:30", "flight", "6E511", "Surat Airport", "Bengaluru", true),
  },
  {
    _id: "t12",
    family: "12",
    arrival: leg("2026-12-13", "10:00", "train", "12957", "Surat Station", "Jaipur", true),
    departure: leg("2026-12-14", "18:00", "train", "12958", "Surat Station", "Jaipur", true),
  },
];