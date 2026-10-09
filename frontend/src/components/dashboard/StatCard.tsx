import type { Stat } from "../../types/dashboard";

export default function StatCard({ label, value, highlight }: Stat) {
  return (
    <div className={highlight ? "stat-card stat-card--hot" : "stat-card"}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}