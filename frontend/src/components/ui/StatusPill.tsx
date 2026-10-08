import { STATUS_LABELS } from "../../constants/family";
import type { FamilyStatus } from "../../types/family";

export default function StatusPill({ status }: { status: FamilyStatus }) {
  return <span className={`pill pill--${status}`}>{STATUS_LABELS[status]}</span>;
}