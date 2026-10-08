import { GROUP_LABELS, GUEST_TYPE_LABELS, PRIORITY_LABELS } from "../../constants/family";
import type { Family } from "../../types/family";
import StatusPill from "../ui/StatusPill";

export type FamilyAction = "open" | "chat" | "room" | "pickup" | "edit";

interface Props {
  family: Family;
  onAction: (action: FamilyAction, family: Family) => void;
}

export default function FamilyCard({ family, onAction }: Props) {
  const telHref = `tel:${family.phone.replace(/\s/g, "")}`;

  return (
    <article className={`family-card family-card--${family.status}`}>
      <div className="family-card__top" onClick={() => onAction("open", family)}>
        <div>
          <h3 className="family-card__name">{family.name} Family</h3>
          <div className="muted">
            {family.primaryContact} · {family.city} · {GUEST_TYPE_LABELS[family.guestType]}
          </div>
        </div>
        <StatusPill status={family.status} />
      </div>

      <div className="muted family-card__meta">
        {GROUP_LABELS[family.group]}
        {family.relationToGroom && ` · ${family.relationToGroom}`}
        {family.category && ` · ${family.category}`}
        {` · ${PRIORITY_LABELS[family.priority]}`}
      </div>

      <div className="family-card__count">
        <b>{family.confirmedCount}</b> confirmed
      </div>
      {family.notes && <div className="muted">{family.notes}</div>}

      <div className="family-card__actions">
        <button className="btn" onClick={() => onAction("chat", family)}>Chat</button>
        <a className="btn" href={telHref}>Call</a>
        <button className="btn" onClick={() => onAction("room", family)}>Room</button>
        <button className="btn" onClick={() => onAction("pickup", family)}>Pickup</button>
        <button className="btn" onClick={() => onAction("edit", family)}>Edit</button>
      </div>
    </article>
  );
}