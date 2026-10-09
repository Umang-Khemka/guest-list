import { Request, Response } from "express";
import Family from "../models/Family.js";
import Travel from "../models/Travel.js";
import Room from "../models/Room.js";
import RoomAllocation from "../models/RoomAllocation.js";
import Vehicle from "../models/Vehicle.js";
import VehicleAssignment from "../models/VehicleAssignment.js";

// "2026-10-09" in IST, so "today" is correct even when the server runs in UTC
const dayKey = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

export const getDashboard = async (_req: Request, res: Response) => {
  const today = dayKey(new Date());

  const [families, travels, allocations, assignments, roomCount, vehicleCount] =
    await Promise.all([
      Family.find().lean(),
      Travel.find().lean(),
      RoomAllocation.find().lean(),
      VehicleAssignment.find().populate("vehicleId").lean(),
      Room.countDocuments(),
      Vehicle.countDocuments(),
    ]);

  const count = (fn: (f: (typeof families)[number]) => boolean) => families.filter(fn).length;
  const roomsUsed = new Set(allocations.map((a) => String(a.roomId))).size;

  const stats = [
    { label: "Families", value: families.length },
    { label: "Invited people", value: families.reduce((sum, f) => sum + f.invitedCount, 0) },
    { label: "Confirmed people", value: families.reduce((sum, f) => sum + f.confirmedCount, 0) },
    { label: "Pending families", value: count((f) => f.status === "pending"), highlight: true },
    { label: "Declined families", value: count((f) => f.status === "declined") },
    { label: "Outstation families", value: count((f) => f.guestType === "outstation") },
    { label: "Rooms used / free", value: `${roomsUsed} / ${roomCount - roomsUsed}` },
    { label: "Cars available", value: vehicleCount },
  ];

  // Cars assigned to a family's trip: "familyId-pickup-2026-10-09" -> "Innova 1"
  const carByKey = new Map<string, string>();
  for (const a of assignments) {
    const name = (a.vehicleId as any)?.name;
    if (!name) continue;
    const key = `${a.familyId}-${a.type}-${dayKey(a.date)}`;
    carByKey.set(key, [carByKey.get(key), name].filter(Boolean).join(", "));
  }

  const familyById = new Map(families.map((f) => [String(f._id), f]));

  // Today's arrivals (pickup) or departures (drop), earliest first
  const tripsToday = (key: "arrival" | "departure", type: "pickup" | "drop") =>
    travels
      .flatMap((t) => {
        const leg = t[key];
        const family = familyById.get(String(t.familyId));
        if (!leg || !family || dayKey(leg.date) !== today) return [];

        const carRequired = type === "pickup" ? leg.pickupRequired : leg.dropRequired;
        return [
          {
            family,
            leg: { ...leg, date: dayKey(leg.date), time: leg.time ?? "", carRequired: !!carRequired },
            vehicleName: carByKey.get(`${family._id}-${type}-${dayKey(leg.date)}`),
          },
        ];
      })
      .sort((a, b) => a.leg.time.localeCompare(b.leg.time));

  const roomFamilies = new Set(allocations.map((a) => String(a.familyId)));

  const needsAction = families.flatMap((family) => {
    if (family.status === "pending") return [{ family, reason: "Waiting for a reply" }];
    if (
      family.status === "confirmed" &&
      family.guestType === "outstation" &&
      !roomFamilies.has(String(family._id))
    ) {
      return [{ family, reason: "Confirmed, no room yet" }];
    }
    return [];
  });

  res.json({
    stats,
    arrivals: tripsToday("arrival", "pickup"),
    departures: tripsToday("departure", "drop"),
    needsAction,
  });
};