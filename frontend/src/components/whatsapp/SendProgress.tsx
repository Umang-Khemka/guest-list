import type { SendStatus } from "../../types/message";

export interface SendRow {
  family: string;
  status: SendStatus;
}

interface Props {
  rows: SendRow[];
  nameOf: (familyId: string) => string;
}

const PILL_CLASS: Record<SendStatus, string> = {
  pending: "pill pill--pending",
  sending: "pill pill--pending",
  sent: "pill",
  failed: "pill pill--declined",
};

const LABELS: Record<SendStatus, string> = {
  pending: "Pending",
  sending: "Sending",
  sent: "Sent",
  failed: "Failed",
};

export default function SendProgress({ rows, nameOf }: Props) {
  if (rows.length === 0) return null;

  return (
    <section className="send-progress" aria-live="polite">
      <h2 className="send-progress__title">Sending</h2>
      {rows.map((r) => (
        <div className="send-progress__row" key={r.family}>
          <span>{nameOf(r.family)}</span>
          <span className={PILL_CLASS[r.status]}>{LABELS[r.status]}</span>
        </div>
      ))}
    </section>
  );
}