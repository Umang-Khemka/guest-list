import type { Family } from "../types/family";


export function uniqueValues(families: Family[], key: "category" | "city"): string[] {
  const values = families.map((fam) => fam[key]).filter((v): v is string => !!v);
  return [...new Set(values)].sort();
}