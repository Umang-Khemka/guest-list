import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  GROUP_LABELS,
  GUEST_TYPE_LABELS,
  STATUS_LABELS,
  toOptions,
} from "../../constants/family";
import type { Family, FamilyGroup, FamilyMember, FamilyStatus, GuestType } from "../../types/family";
import Field from "../ui/Field";
import Modal from "../ui/Modal";

// What the form hands back. The page adds _id and timestamps (later: the API does).
export type FamilyFormData = Omit<Family, "_id" | "createdAt" | "updatedAt" | "invitedCount">;

interface Props {
  family?: Family; // present = edit, absent = add
  onSave: (data: FamilyFormData) => void;
  onClose: () => void;
}

// Number inputs are kept as strings while typing
interface FormState {
  name: string;
  members: FamilyMember[];
  city: string;
  group: FamilyGroup;
  relationToGroom: string;
  confirmedCount: string;
  status: FamilyStatus;
  guestType: GuestType;
  notes: string;
}

function initialState(f?: Family): FormState {
  const members = f?.members?.length
    ? f.members.map((member) => ({ ...member }))
    : f
      ? [{
          name: f.primaryContact.replace(/ Ji$/, "").match(/[A-Za-z]/) ? f.primaryContact.replace(/ Ji$/, "") : f.name,
          contactNumber: isValidPhone(f.primaryContact) ? f.primaryContact : f.phone,
          whatsappNumber: f.phone,
        }]
      : [{ name: "", contactNumber: "+91 ", whatsappNumber: "+91 " }];
  return {
    name: f?.name ?? "",
    members,
    city: f?.city ?? "",
    group: f?.group ?? "others",
    relationToGroom: f?.relationToGroom ?? "",
    confirmedCount: String(f?.confirmedCount ?? 0),
    status: f?.status ?? "pending",
    guestType: f?.guestType ?? "local",
    notes: f?.notes ?? "",
  };
}

// Accept the same formats as the backend: 7–15 digits, optional +, spaces, or hyphens.
const isValidPhone = (value: string) => /^\+?[0-9\s-]+$/.test(value.trim()) && (value.match(/\d/g)?.length ?? 0) >= 7 && (value.match(/\d/g)?.length ?? 0) <= 15;
const normalizePhone = (value: string) => value.trim().replace(/[\s-]/g, "");

function validate(f: FormState): string | null {
  if (!f.name.trim()) return "Add a family name";
  if (!f.members.length) return "Add at least one family member";
  for (let i = 0; i < f.members.length; i += 1) {
    const member = f.members[i];
    if (!member.name.trim()) return `Add a name for member ${i + 1}`;
    if (!isValidPhone(member.contactNumber)) return `Enter a valid contact number for ${member.name}`;
    if (!isValidPhone(member.whatsappNumber)) return `Enter a valid WhatsApp number for ${member.name}`;
  }
  if (!f.city.trim()) return "Add a city";

  const confirmed = Number(f.confirmedCount || 0);
  if (!Number.isInteger(confirmed) || confirmed < 0) return "Confirmed people must be 0 or more";

  return null;
}

function Options({ labels }: { labels: Record<string, string> }) {
  return (
    <>
      {toOptions(labels).map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </>
  );
}

export default function FamilyFormModal({ family, onSave, onClose }: Props) {
  const [form, setForm] = useState<FormState>(() => initialState(family));
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof FormState) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm({ ...form, [key]: e.target.value } as FormState);

  const updateMember = (index: number, key: keyof FamilyMember, value: string) => {
    setForm({
      ...form,
      members: form.members.map((member, memberIndex) => memberIndex === index ? { ...member, [key]: value } : member),
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = validate(form);
    if (message) return setError(message);

    const confirmedCount = Number(form.confirmedCount || 0);
    onSave({
      name: form.name.trim().replace(/ family$/i, ""),
      primaryContact: normalizePhone(form.members[0].contactNumber),
      phone: normalizePhone(form.members[0].whatsappNumber),
      members: form.members.map((member) => ({
        name: member.name.trim(),
        contactNumber: normalizePhone(member.contactNumber),
        whatsappNumber: normalizePhone(member.whatsappNumber),
      })),
      city: form.city.trim(),
      group: form.group,
      relationToGroom: form.relationToGroom.trim(),
      confirmedCount,
      status: form.status,
      guestType: form.guestType,
      notes: form.notes.trim() || undefined,
    });
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <h2 className="modal__title">{family ? "Edit family" : "Add family"}</h2>

        <div className="form-grid">
          <Field label="Family name (e.g. Sharma)" full>
            <input value={form.name} onChange={set("name")} autoFocus />
          </Field>
          <Field label="Family members" full>
            <div className="family-member-list">
              {form.members.map((member, index) => (
                <div className="family-member-row" key={index}>
                  <div>
                    <span>Member name</span>
                    <input value={member.name} onChange={(e) => updateMember(index, "name", e.target.value)} />
                  </div>
                  <div>
                    <span>Contact number</span>
                    <input value={member.contactNumber} onChange={(e) => updateMember(index, "contactNumber", e.target.value.replace(/[^\d+\s-]/g, ""))} inputMode="tel" />
                  </div>
                  <div>
                    <span>WhatsApp number</span>
                    <input value={member.whatsappNumber} onChange={(e) => updateMember(index, "whatsappNumber", e.target.value.replace(/[^\d+\s-]/g, ""))} inputMode="tel" />
                  </div>
                  <button type="button" className="btn" onClick={() => setForm({ ...form, members: form.members.filter((_, i) => i !== index) })} aria-label={`Remove ${member.name || `member ${index + 1}`}`}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn" onClick={() => setForm({ ...form, members: [...form.members, { name: "", contactNumber: "+91 ", whatsappNumber: "+91 " }] })}>Add member</button>
            </div>
          </Field>
          <Field label="City">
            <input value={form.city} onChange={set("city")} />
          </Field>
          <Field label="Group">
            <select value={form.group} onChange={set("group")}>
              <Options labels={GROUP_LABELS} />
            </select>
          </Field>
          <Field label="Relation to groom">
            <input value={form.relationToGroom} onChange={set("relationToGroom")} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set("status")}>
              <Options labels={STATUS_LABELS} />
            </select>
          </Field>
          <Field label="Confirmed people">
            <input type="number" min={0} value={form.confirmedCount} onChange={set("confirmedCount")} />
          </Field>
          <Field label="Local / Outstation">
            <select value={form.guestType} onChange={set("guestType")}>
              <Options labels={GUEST_TYPE_LABELS} />
            </select>
          </Field>
          <Field label="Notes" full>
            <input value={form.notes} onChange={set("notes")} />
          </Field>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">Save family</button>
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}
