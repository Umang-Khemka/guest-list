import { Link } from "react-router-dom";
import type { ActionItem } from "../../types/dashboard";
import StatusPill from "../ui/StatusPill";

// One family that needs attention. Opens the Families page for now.
export default function ActionRow({ family, reason }: ActionItem) {
  return (
    <Link to="/families" className="action-row">
      <div>
        <b>{family.name} Family</b>
        <div className="muted">{reason}</div>
      </div>
      <StatusPill status={family.status} />
    </Link>
  );
}