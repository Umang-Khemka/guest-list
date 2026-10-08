import type {
  Family,
  FamilyGroup,
  FamilyStatus,
  GuestType,
  Priority,
} from "../types/family";

const STAMP = "2026-10-01T09:00:00.000Z";

function family(
  n: number,
  name: string,
  phone: string,
  city: string,
  relationToGroom: string,
  category: string,
  group: FamilyGroup,
  priority: Priority,
  invitedCount: number,
  confirmedCount: number,
  status: FamilyStatus,
  guestType: GuestType,
  notes?: string,
): Family {
  return {
    _id: String(n),
    name,
    primaryContact: `${name} Ji`,
    phone,
    city,
    relationToGroom,
    category,
    group,
    invitedCount,
    confirmedCount,
    status,
    guestType,
    priority,
    notes,
    createdAt: STAMP,
    updatedAt: STAMP,
  };
}

export const mockFamilies: Family[] = [
  family(1, "Sharma", "+91 98200 10001", "Mumbai", "Mother's side", "Relatives", "mom_side", "vip", 5, 4, "confirmed", "outstation", "Elder uncle, needs ground-floor room"),
  family(2, "Patel", "+91 98250 10002", "Surat", "Neighbours", "Friends", "others", "important", 4, 4, "confirmed", "local"),
  family(3, "Mehta", "+91 98250 10003", "Ahmedabad", "Father's friend", "Friends", "business_friends", "important", 3, 0, "pending", "outstation", "Call after Diwali plans settle"),
  family(4, "Joshi", "+91 98110 10004", "Delhi", "Father's side", "Relatives", "dad_side", "vip", 6, 5, "confirmed", "outstation"),
  family(5, "Desai", "+91 98250 10005", "Surat", "Colleague", "Work", "business_friends", "normal", 2, 0, "pending", "local"),
  family(6, "Iyer", "+91 98400 10006", "Chennai", "Grandmother's relative", "Relatives", "grandmother_side", "important", 4, 0, "declined", "outstation", "Sent regrets, travelling abroad"),
  family(7, "Shah", "+91 98240 10007", "Vadodara", "Mother's side", "Relatives", "mom_side", "vip", 5, 3, "confirmed", "outstation"),
  family(8, "Trivedi", "+91 98250 10008", "Surat", "Family friend", "Friends", "others", "important", 3, 3, "confirmed", "local"),
  family(9, "Kapoor", "+91 98900 10009", "Pune", "Brother's college friend", "Friends", "brothers_friends", "normal", 4, 0, "pending", "outstation"),
  family(10, "Nair", "+91 98450 10010", "Bengaluru", "Cousin", "Relatives", "grandmother_side", "vip", 2, 2, "confirmed", "outstation"),
  family(11, "Bhatt", "+91 98250 10011", "Rajkot", "Father's side", "Relatives", "dad_side", "vip", 6, 0, "pending", "outstation", "Large group, ask for headcount"),
  family(12, "Gupta", "+91 98290 10012", "Jaipur", "Father's friend", "Friends", "business_friends", "important", 3, 3, "confirmed", "outstation"),
];