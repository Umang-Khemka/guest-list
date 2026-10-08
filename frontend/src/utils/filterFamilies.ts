import type { Family, FamilyFilters } from "../types/family";

export function filterFamilies(families: Family[], f: FamilyFilters): Family[] {
  const q = f.search.trim().toLowerCase();

  return families.filter((fam) => {
    if (q) {
      const haystack = `${fam.name} ${fam.primaryContact} ${fam.city} ${fam.phone}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.group && fam.group !== f.group) return false;
    if (f.status && fam.status !== f.status) return false;
    if (f.guestType && fam.guestType !== f.guestType) return false;
    if (f.priority && fam.priority !== f.priority) return false;
    if (f.category && fam.category !== f.category) return false;
    if (f.city && fam.city !== f.city) return false;
    return true;
  });
}

export function uniqueValues(families: Family[], key: "category" | "city"): string[] {
  const values = families.map((fam) => fam[key]).filter((v): v is string => !!v);
  return [...new Set(values)].sort();
}