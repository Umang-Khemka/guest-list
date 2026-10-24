import { Request, Response } from "express";
import Family from "../models/Family.js";
import MessageCampaign from "../models/MessageCampign.js";
import { normalizePhone } from "../utils/phone.js";
import { whatsappQueue } from "../queues/whatsapp.queue.js";

export const createCampaign = async (req: Request, res: Response) => {
  const { sender, familyIds, templateId, message, mediaUrl } = req.body;

  if (!["mom", "dad"].includes(sender)) return res.status(400).json({ message: "Invalid sender" });
  if (!Array.isArray(familyIds) || familyIds.length === 0)
    return res.status(400).json({ message: "Select at least one family" });
  if (!message?.trim()) return res.status(400).json({ message: "Message is required" });

  const families = await Family.find({ _id: { $in: familyIds } });

  const seen = new Set<string>();
  const recipients: any[] = [];
  const skipped: { family: string; member: string; reason: string }[] = [];

  for (const family of families) {
    for (const m of family.members) {
      const phone = normalizePhone(m.whatsappNumber);
      if (!phone) {
        skipped.push({ family: family.name, member: m.name, reason: "Invalid number" });
        continue;
      }
      if (seen.has(phone)) continue; // same number in two families
      seen.add(phone);
      recipients.push({ familyId: family._id, memberName: m.name, phone });
    }
  }

  if (recipients.length === 0)
    return res.status(400).json({ message: "No valid WhatsApp numbers found", skipped });

  const campaign = await MessageCampaign.create({ sender, templateId, message, mediaUrl, recipients });

  await whatsappQueue.addBulk(
    campaign.recipients.map((r) => ({
      name: "send",
      data: { campaignId: campaign.id, recipientId: r._id.toString() },
    })),
  );

  res.status(201).json({ campaignId: campaign.id, total: recipients.length, skipped });
};

export const getCampaign = async (req: Request, res: Response) => {
  const campaign = await MessageCampaign.findById(req.params.id);
  if (!campaign) return res.status(404).json({ message: "Not found" });
  res.json(campaign);
};