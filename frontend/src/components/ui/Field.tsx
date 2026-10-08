import type { ReactNode } from "react";
import "./Form.css";

// Label + control wrapper used by every form
export default function Field({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) {
  return (
    <label className={full ? "field field--full" : "field"}>
      <span className="field__label">{label}</span>
      {children}
    </label>
  );
}