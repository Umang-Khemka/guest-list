import { SENDERS } from "../../constants/messaging";
import type { Sender } from "../../types/message";

interface Props {
  value: Sender;
  onChange: (sender: Sender) => void;
}

export default function SenderPicker({ value, onChange }: Props) {
  return (
    <div className="sender-picker" role="group" aria-label="Send from">
      {(Object.keys(SENDERS) as Sender[]).map((key) => (
        <button
          key={key}
          type="button"
          className={value === key ? "sender-chip sender-chip--on" : "sender-chip"}
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          <b>{SENDERS[key].label}</b>
          <span>{SENDERS[key].phone}</span>
        </button>
      ))}
    </div>
  );
}