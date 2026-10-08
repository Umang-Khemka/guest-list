import type {
  FamilyGroup,
  FamilyStatus,
  GuestType,
  Priority,
} from "../types/family";

export const GROUP_LABELS: Record<FamilyGroup, string> = {
  mom_side: "Mom's side",
  dad_side: "Dad's side",
  grandmother_side: "Grandmother's side",
  brothers_friends: "Brother's friends",
  business_friends: "Business friends",
  others: "Others",
};

export const STATUS_LABELS: Record<FamilyStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
};

export const GUEST_TYPE_LABELS: Record<GuestType, string> = {
  local: "Local",
  outstation: "Outstation",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  normal: "Normal",
  important: "Important",
  vip: "VIP",
};

// Turns a label map into <option> data: [{ value, label }]
export function toOptions<T extends string>(labels: Record<T, string>) {
  return (Object.keys(labels) as T[]).map((value) => ({
    value,
    label: labels[value],
  }));
}