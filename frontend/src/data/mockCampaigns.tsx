import type { Campaign } from "../types/message";

export const mockCampaigns: Campaign[] = [
  {
    _id: "c3",
    sentAt: "2026-12-11T16:00:00",
    sender: "mom",
    template: "Travel Information",
    recipients: [
      { family: "1", status: "sent" },
      { family: "4", status: "sent" },
      { family: "10", status: "sent" },
      { family: "12", status: "sent" },
    ],
  },
  {
    _id: "c2",
    sentAt: "2026-12-10T11:15:00",
    sender: "dad",
    template: "RSVP",
    recipients: [
      { family: "3", status: "sent" },
      { family: "5", status: "sent" },
      { family: "9", status: "sent" },
      { family: "11", status: "failed" },
    ],
  },
  {
    _id: "c1",
    sentAt: "2026-12-08T19:40:00",
    sender: "mom",
    template: "Wedding Invitation",
    recipients: [
      { family: "1", status: "sent" },
      { family: "2", status: "sent" },
      { family: "3", status: "failed" },
      { family: "4", status: "sent" },
    ],
  },
];