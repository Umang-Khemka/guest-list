import type { ApiLeg, TravelLeg } from "../types/travel";

type Kind = "arrival" | "departure";

// Backend -> frontend shape (for display and the form)
export const fromApiLeg = (leg: ApiLeg | undefined, kind: Kind): TravelLeg | undefined =>
  leg
    ? {
        date: leg.date.slice(0, 10), // ISO -> YYYY-MM-DD
        time: leg.time ?? "",
        mode: leg.mode,
        number: leg.number,
        location: leg.location ?? "",
        city: kind === "arrival" ? leg.from : leg.to,
        carRequired: kind === "arrival" ? !!leg.pickupRequired : !!leg.dropRequired,
      }
    : undefined;

// Frontend -> backend shape (for saving)
export const toApiLeg = (leg: TravelLeg | undefined, kind: Kind): ApiLeg | undefined =>
  leg
    ? {
        date: leg.date,
        time: leg.time || undefined,
        mode: leg.mode,
        number: leg.number || undefined,
        location: leg.location || undefined,
        ...(kind === "arrival"
          ? { from: leg.city || undefined, pickupRequired: leg.carRequired }
          : { to: leg.city || undefined, dropRequired: leg.carRequired }),
      }
    : undefined;