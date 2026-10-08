interface Props {
  recipient?: string; // e.g. "Sharma Family"
  extraCount: number; // other selected families
  media: string;
  text: string;
}

// WhatsApp-style bubble showing the message as the first family will get it
export default function MessagePreview({ recipient, extraCount, media, text }: Props) {
  return (
    <div className="wa-preview">
      <div className="muted wa-preview__to">
        {recipient ? `To ${recipient}` : "Pick a family to fill in the names"}
        {extraCount > 0 && ` (+${extraCount} more, each with their own details)`}
      </div>
      {media && <div className="wa-bubble">📎 {media}</div>}
      <div className="wa-bubble">{text}</div>
    </div>
  );
}