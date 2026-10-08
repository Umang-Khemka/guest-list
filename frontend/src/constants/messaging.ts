import type { Sender, TemplateId } from "../types/message";

export const SENDERS: Record<Sender, { label: string; phone: string }> = {
  mom: { label: "Mom", phone: "+91 98XXX 11111" },
  dad: { label: "Dad", phone: "+91 97XXX 22222" },
};

export const TEMPLATES: Record<TemplateId, { label: string; body: string }> = {
  invitation: {
    label: "Wedding Invitation",
    body: "Namaste {{primaryContact}} Ji,\n\nWe are delighted to invite the {{family}} from {{city}} to celebrate the wedding with us.\n\nLooking forward to seeing you!",
  },
  rsvp: {
    label: "RSVP",
    body: "Namaste {{primaryContact}} Ji, could you please confirm how many members of the {{family}} will join us? Thank you!",
  },
  travel: {
    label: "Travel Information",
    body: "Namaste {{primaryContact}} Ji, we have noted your arrival on {{arrivalDate}} at {{arrivalTime}}. Our car {{vehicle}} will receive you.",
  },
  accommodation: {
    label: "Accommodation",
    body: "Namaste {{primaryContact}} Ji, your stay is arranged at {{hotel}}, room(s) {{room}}. Please call us if you need anything.",
  },
  pickup: {
    label: "Pickup",
    body: "Namaste {{primaryContact}} Ji, {{vehicle}} will pick up the {{family}} on {{arrivalDate}} at {{arrivalTime}}.",
  },
  custom: { label: "Custom", body: "Namaste {{primaryContact}} Ji, " },
};

export const TEMPLATE_VARIABLES = [
  "family",
  "primaryContact",
  "city",
  "arrivalDate",
  "arrivalTime",
  "hotel",
  "room",
  "vehicle",
];

// Mock attachments for the prototype
export const MEDIA_OPTIONS = [
  { value: "", label: "None" },
  { value: "Invitation card.jpg", label: "Image: Invitation card.jpg" },
  { value: "Teaser.mp4", label: "Video: Teaser.mp4" },
  { value: "Schedule.pdf", label: "PDF: Schedule.pdf" },
];

// There is no hotel record yet, so this name fills {{hotel}}
export const HOTEL_NAME = "Hotel Grand Surat";