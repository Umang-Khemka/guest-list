import type { Family } from "./family";
import type { TravelLeg } from "./travel";

export interface Stat {
  label: string;
  value: string | number;
  highlight?: boolean; // shown in red, for things that need attention
}

// One arrival or departure happening today
export interface TodayTrip {
  family: Family;
  leg: TravelLeg;
  vehicleName?: string; // car already assigned, if any
}

// A family that needs someone to act
export interface ActionItem {
  family: Family;
  reason: string;
}

export interface DashboardData {
  stats: Stat[];
  arrivals: TodayTrip[];
  departures: TodayTrip[];
  needsAction: ActionItem[];
}

export interface DashboardState extends DashboardData {
  loading: boolean;
  error: string | null;
  getDashboard: () => Promise<void>;
}