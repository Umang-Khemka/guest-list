import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  GROUP_LABELS,
  GUEST_TYPE_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  toOptions,
} from "../../constants/family";
import type { Family, FamilyGroup, FamilyStatus, GuestType, Priority } from "../../types/family";
import Field from "../ui/Field";
import Modal from "../ui/Modal";

// What the form hands back. The page adds _id and timestamps (later: the API does).
export type FamilyFormData = Omit<Family, "_id" | "createdAt" | "updatedAt">;

interface Props {
  family?: Family; // present = edit, absent = add
  onSave: (data: FamilyFormData) => void;
  onClose: () => void;
}

// Number inputs are kept as strings while typing
interface FormState {
  name: string;
  primaryContact: string;
  phone: string;
  city: string;
  group: FamilyGroup;
  relationToGroom: string;
  category: string;
  priority: Priority;
  confirmedCount: string;
  invitedCount: string;
  status: FamilyStatus;
  guestType: GuestType;
  notes: string;
}

function initialState(f?: Family): FormState {
  return {
    name: f?.name ?? "",
    primaryContact: f?.primaryContact ?? "",
    phone: f?.phone ?? "+91 ",
    city: f?.city ?? "",
    group: f?.group ?? "others",
    relationToGroom: f?.relationToGroom ?? "",
    category: f?.category ?? "Relatives",
    priority: f?.priority ?? "normal",
    confirmedCount: String(f?.confirmedCount ?? 0),
    invitedCount: f ? String(f.invitedCount) : "",
    status: f?.status ?? "pending",
    guestType: f?.guestType ?? "local",
    notes: f?.notes ?? "",
  };
}

const PHONE_RE = /^\+?[0-9\s-]{7,15}$/; // same rule as the backend validator

function validate(f: FormState): string | null {
  if (!f.name.trim()) return "Add a family name";
  if (!f.primaryContact.trim()) return "Add a primary contact";
  if (!PHONE_RE.test(f.phone.trim())) return "Enter a valid phone number";
  if (!f.city.trim()) return "Add a city";

  const confirmed = Number(f.confirmedCount || 0);
  if (!Number.isInteger(confirmed) || confirmed < 0) return "Confirmed people must be 0 or more";

  if (f.invitedCount.trim() !== "") {
    const invited = Number(f.invitedCount);
    if (!Number.isInteger(invited) || invited < 1) return "Invited people must be at least 1";
  }
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = validate(form);
    if (message) return setError(message);

    const confirmedCount = Number(form.confirmedCount || 0);
    // The API needs invitedCount (min 1). If left blank, fall back to the confirmed count.
    const invitedCount = form.invitedCount.trim() === "" ? Math.max(confirmedCount, 1) : Number(form.invitedCount);

    onSave({
      name: form.name.trim().replace(/ family$/i, ""),
      primaryContact: form.primaryContact.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      group: form.group,
      relationToGroom: form.relationToGroom.trim() || undefined,
      category: form.category.trim() || undefined,
      priority: form.priority,
      confirmedCount,
      invitedCount,
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
          <Field label="Primary contact">
            <input value={form.primaryContact} onChange={set("primaryContact")} />
          </Field>
          <Field label="WhatsApp / phone">
            <input value={form.phone} onChange={set("phone")} inputMode="tel" />
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
          <Field label="Category">
            <input value={form.category} onChange={set("category")} />
          </Field>
          <Field label="Priority">
            <select value={form.priority} onChange={set("priority")}>
              <Options labels={PRIORITY_LABELS} />
            </select>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set("status")}>
              <Options labels={STATUS_LABELS} />
            </select>
          </Field>
          <Field label="Confirmed people">
            <input type="number" min={0} value={form.confirmedCount} onChange={set("confirmedCount")} />
          </Field>
          <Field label="Invited people (optional)">
            <input type="number" min={1} value={form.invitedCount} onChange={set("invitedCount")} />
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