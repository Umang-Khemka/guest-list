import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MessagePreview from "../components/whatsapp/MessagePreview";
import RecipientPicker from "../components/whatsapp/RecipentPicker";
import SenderPicker from "../components/whatsapp/SendPicker";
import SendProgress, { type SendRow } from "../components/whatsapp/SendProgress";
import Field from "../components/ui/Field";
import Toast from "../components/ui/Toast";
import { MEDIA_OPTIONS, SENDERS, TEMPLATES, TEMPLATE_VARIABLES } from "../constants/messaging";
import { useAppData } from "../hooks/useAppData";
import { useToast } from "../hooks/useToast";
import type { CampaignRecipient, Sender, TemplateId } from "../types/message";
import { buildTemplateValues, fillTemplate } from "../utils/templateUtils";
import "../styles/WhatsAppPage.css";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Nothing is really sent in the prototype. About 1 in 10 "fails" so the failed state can be seen.
const simulateSend = () => Math.random() > 0.1;

export default function WhatsAppPage() {
  const { families, travels, rooms, allocations, vehicles, assignments, setCampaigns } = useAppData();
  const [params] = useSearchParams();
  const { toast, showToast } = useToast();

  const [sender, setSender] = useState<Sender>("mom");
  const [selected, setSelected] = useState<Set<string>>(() => {
    const id = params.get("family"); // set by the Chat button on a family card
    return id && families.some((f) => f._id === id) ? new Set([id]) : new Set();
  });
  const [templateId, setTemplateId] = useState<TemplateId>("invitation");
  const [message, setMessage] = useState(TEMPLATES.invitation.body);
  const [media, setMedia] = useState("");
  const [rows, setRows] = useState<SendRow[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const sortedFamilies = useMemo(() => [...families].sort((a, b) => a.name.localeCompare(b.name)), [families]);
  const recipients = sortedFamilies.filter((f) => selected.has(f._id));
  const first = recipients[0];

  const context = { travels, rooms, allocations, vehicles, assignments };
  const previewText = first ? fillTemplate(message, buildTemplateValues(first, context)) : message;

  const nameOf = (id: string) => {
    const family = families.find((f) => f._id === id);
    return family ? `${family.name} Family` : "Unknown family";
  };

  const toggle = (id: string) => {
    setError(null);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleTemplate = (id: TemplateId) => {
    setTemplateId(id);
    setMessage(TEMPLATES[id].body);
    setError(null);
  };

  const handleSend = async () => {
    if (recipients.length === 0) return setError("Select at least one family");
    if (!message.trim()) return setError("Write a message first");

    setError(null);
    setSending(true);
    setRows(recipients.map((f) => ({ family: f._id, status: "pending" })));

    const results: CampaignRecipient[] = [];
    for (let i = 0; i < recipients.length; i++) {
      setRows((prev) => prev.map((r, j) => (j === i ? { ...r, status: "sending" } : r)));
      await sleep(550);
      if (!mounted.current) return; // left the page mid-send

      const ok = simulateSend();
      setRows((prev) => prev.map((r, j) => (j === i ? { ...r, status: ok ? "sent" : "failed" } : r)));
      results.push({ family: recipients[i]._id, status: ok ? "sent" : "failed" });
    }

    setCampaigns((prev) => [
      {
        _id: `c${Date.now()}`,
        sentAt: new Date().toISOString(),
        sender,
        template: TEMPLATES[templateId].label,
        recipients: results,
      },
      ...prev,
    ]);
    setSending(false);

    const failed = results.filter((r) => r.status === "failed").length;
    showToast(
      failed === 0
        ? `Sent to ${results.length} families from ${SENDERS[sender].label}`
        : `Sent to ${results.length - failed} of ${results.length}. ${failed} failed`,
    );
  };

  return (
    <div className="page">
      <h1 className="page__title">WhatsApp</h1>
      <p className="page__sub">Pick a number, pick families, send.</p>

      <div className="wa-layout">
        <fieldset className="wa-composer" disabled={sending}>
          <Field label="Send from">
            <SenderPicker value={sender} onChange={setSender} />
          </Field>

          <div className="field">
            <span className="field__label">Families ({selected.size} selected)</span>
            <RecipientPicker
              families={sortedFamilies}
              selected={selected}
              onToggle={toggle}
              onSelectMany={(ids) => setSelected((prev) => new Set([...prev, ...ids]))}
              onClear={() => setSelected(new Set())}
            />
          </div>

          <Field label="Template">
            <select value={templateId} onChange={(e) => handleTemplate(e.target.value as TemplateId)}>
              {(Object.keys(TEMPLATES) as TemplateId[]).map((id) => (
                <option key={id} value={id}>{TEMPLATES[id].label}</option>
              ))}
            </select>
          </Field>

          <Field label="Message">
            <textarea rows={7} value={message} onChange={(e) => setMessage(e.target.value)} />
          </Field>
          <p className="muted">Variables: {TEMPLATE_VARIABLES.map((v) => `{{${v}}}`).join(" ")}</p>

          <Field label="Attachment">
            <select value={media} onChange={(e) => setMedia(e.target.value)}>
              {MEDIA_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {error && <p className="form-error" role="alert">{error}</p>}

          <div className="wa-actions">
            <button type="button" className="btn" onClick={() => previewRef.current?.scrollIntoView({ behavior: "smooth" })}>
              Preview
            </button>
            <button type="button" className="btn btn--primary" onClick={handleSend}>
              {sending ? "Sending…" : "Send message"}
            </button>
          </div>
        </fieldset>

        <div ref={previewRef}>
          <h2 className="wa-heading">Preview</h2>
          <MessagePreview
            recipient={first && `${first.name} Family`}
            extraCount={Math.max(0, recipients.length - 1)}
            media={media}
            text={previewText}
          />
          <SendProgress rows={rows} nameOf={nameOf} />
        </div>
      </div>

      {toast && <Toast message={toast} />}
    </div>
  );
}