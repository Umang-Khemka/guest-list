// Mirrors the backend Mongoose model (IFamily) so API data drops in later.

export type FamilyGroup =
  | "mom_side"
  | "dad_side"
  | "grandmother_side"
  | "brothers_friends"
  | "business_friends"
  | "others";

export type FamilyStatus = "pending" | "confirmed" | "declined";
export type GuestType = "local" | "outstation";
export type Priority = "normal" | "important" | "vip";

export interface Family {
  _id: string;
  name: string;
  primaryContact: string;
  phone: string;
  alternatePhone?: string;

  city: string;
  address?: string;

  relationToGroom?: string;
  category?: string;
  group: FamilyGroup;

  invitedCount: number;
  confirmedCount: number;

  status: FamilyStatus;
  guestType: GuestType;
  priority: Priority;

  notes?: string;

  createdAt: string;
  updatedAt: string;
}

// "" means "no filter applied"
export interface FamilyFilters {
  search: string;
  group: "" | FamilyGroup;
  status: "" | FamilyStatus;
  guestType: "" | GuestType;
  priority: "" | Priority;
  category: string;
  city: string;
}

export const EMPTY_FILTERS: FamilyFilters = {
  search: "",
  group: "",
  status: "",
  guestType: "",
  priority: "",
  category: "",
  city: "",
};