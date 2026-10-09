import { useMemo } from "react";
import { MOCK_TODAY } from "../constants/logistics";
import type { ActionItem, Stat, TodayTrip } from "../types/dashboard";
import type { Family } from "../types/family";
import type { AssignmentType } from "../types/vehicle";
import { findLegVehicle } from "../utils/travelUtils";
import { useAppData } from "./useAppData";

// Everything the dashboard shows, worked out from the shared data.
// Later this can read from the API instead; the page won't need to change.
export function useDashboardData() {
  const { families, travels, rooms, allocations, vehicles, assignments } = useAppData();

  return useMemo(() => {
    const count = (fn: (f: Family) => boolean) => families.filter(fn).length;
    const roomsUsed = new Set(allocations.map((a) => a.room)).size;

    const stats: Stat[] = [
      { label: "Families", value: families.length },
      { label: "Invited people", value: families.reduce((sum, f) => sum + f.invitedCount, 0) },
      { label: "Confirmed people", value: families.reduce((sum, f) => sum + f.confirmedCount, 0) },
      { label: "Pending families", value: count((f) => f.status === "pending"), highlight: true },
      { label: "Declined families", value: count((f) => f.status === "declined") },
      { label: "Outstation families", value: count((f) => f.guestType === "outstation") },
      { label: "Rooms used / free", value: `${roomsUsed} / ${rooms.length - roomsUsed}` },
      { label: "Cars available", value: vehicles.length },
    ];

    // Today's arrivals (pickup) or departures (drop), earliest first
    const tripsToday = (key: "arrival" | "departure", type: AssignmentType): TodayTrip[] =>
      travels
        .flatMap((t) => {
          const leg = t[key];
          const family = families.find((f) => f._id === t.family);
          if (!leg || !family || leg.date !== MOCK_TODAY) return [];
          const vehicle = findLegVehicle(assignments, vehicles, family._id, type, leg);
          return [{ family, leg, vehicleName: vehicle?.name }];
        })
        .sort((a, b) => a.leg.time.localeCompare(b.leg.time));

    const needsAction: ActionItem[] = families.flatMap((family) => {
      if (family.status === "pending") return [{ family, reason: "Waiting for a reply" }];
      const hasRoom = allocations.some((a) => a.family === family._id);
      if (family.status === "confirmed" && family.guestType === "outstation" && !hasRoom) {
        return [{ family, reason: "Confirmed, no room yet" }];
      }
      return [];
    });

    return {
      stats,
      arrivals: tripsToday("arrival", "pickup"),
      departures: tripsToday("departure", "drop"),
      needsAction,
    };
  }, [families, travels, rooms, allocations, vehicles, assignments]);
}