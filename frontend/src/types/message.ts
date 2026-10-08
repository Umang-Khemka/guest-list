export type Sender = "mom" | "dad";
export type TemplateId = "invitation" | "rsvp" | "travel" | "accommodation" | "pickup" | "custom";

// While sending: pending -> sending -> sent / failed
export type SendStatus = "pending" | "sending" | "sent" | "failed";

export interface CampaignRecipient {
  family: string; // Family._id
  status: "sent" | "failed";
}

// One batch of messages sent together
export interface Campaign {
  _id: string;
  sentAt: string; // ISO date-time
  sender: Sender;
  template: string; // template name, e.g. "Wedding Invitation"
  recipients: CampaignRecipient[];
}