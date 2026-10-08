import {
  GROUP_LABELS,
  GUEST_TYPE_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  toOptions,
} from "../../constants/family";
import type { FamilyFilters as Filters } from "../../types/family";

interface Props {
  filters: Filters;
  onChange: (next: Filters) => void;
  categories: string[];
  cities: string[];
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

const plain = (values: string[]) => values.map((v) => ({ value: v, label: v }));

export default function FamilyFilters({ filters, onChange, categories, cities }: Props) {
  // Typed helper: update one field, keep the rest
  const set = <K extends keyof Filters>(key: K) => (value: string) =>
    onChange({ ...filters, [key]: value } as Filters);

  return (
    <div className="filters">
      <input
        className="filters__search"
        placeholder="Search name, contact or city"
        value={filters.search}
        onChange={(e) => set("search")(e.target.value)}
      />
      <FilterSelect label="Group" value={filters.group} options={toOptions(GROUP_LABELS)} onChange={set("group")} />
      <FilterSelect label="Status" value={filters.status} options={toOptions(STATUS_LABELS)} onChange={set("status")} />
      <FilterSelect label="Local / Out" value={filters.guestType} options={toOptions(GUEST_TYPE_LABELS)} onChange={set("guestType")} />
      <FilterSelect label="Priority" value={filters.priority} options={toOptions(PRIORITY_LABELS)} onChange={set("priority")} />
      <FilterSelect label="Category" value={filters.category} options={plain(categories)} onChange={set("category")} />
      <FilterSelect label="City" value={filters.city} options={plain(cities)} onChange={set("city")} />
    </div>
  );
}