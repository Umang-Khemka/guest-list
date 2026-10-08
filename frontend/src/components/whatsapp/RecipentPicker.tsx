import { useMemo, useState } from "react";
import type { Family } from "../../types/family";

interface Props {
  families: Family[]; // already sorted
  selected: Set<string>;
  onToggle: (familyId: string) => void;
  onSelectMany: (familyIds: string[]) => void;
  onClear: () => void;
}

export default function RecipientPicker({ families, selected, onToggle, onSelectMany, onClear }: Props) {
  const [search, setSearch] = useState("");

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return families;
    return families.filter((f) => `${f.name} ${f.primaryContact} ${f.city}`.toLowerCase().includes(q));
  }, [families, search]);

  return (
    <div>
      <input placeholder="Search families" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="recipient-tools">
        <button type="button" className="btn" onClick={() => onSelectMany(shown.map((f) => f._id))}>
          Select shown
        </button>
        <button type="button" className="btn" onClick={onClear} disabled={selected.size === 0}>
          Clear
        </button>
      </div>

      <div className="recipient-list">
        {shown.map((f) => (
          <label className="recipient" key={f._id}>
            <input type="checkbox" checked={selected.has(f._id)} onChange={() => onToggle(f._id)} />
            <span>
              {f.name} Family <span className="muted">· {f.city}</span>
            </span>
          </label>
        ))}
        {shown.length === 0 && <p className="muted recipient__empty">No family matches.</p>}
      </div>
    </div>
  );
}