import { Worker, UnrecoverableError } from "bullmq";
import MessageCampaign from "../models/MessageCampign.js";
import { connection } from "../queues/whatsapp.queue.js";
import { SENDERS, WA_TOKEN, WA_API } from "../config/whatsapp.js";

const setStatus = (campaignId: string, recipientId: string, set: Record<string, unknown>) =>
  MessageCampaign.updateOne(
    { _id: campaignId },
    { $set: Object.fromEntries(Object.entries(set).map(([k, v]) => [`recipients.$[r].${k}`, v])) },
    { arrayFilters: [{ "r._id": recipientId }] },
  );

export const worker = new Worker(
  "whatsapp",
  async (job) => {
    const { campaignId, recipientId } = job.data;
    const campaign = await MessageCampaign.findById(campaignId);
    const recipient = campaign?.recipients.find((r) => r._id.toString() === recipientId);
    if (!campaign || !recipient) throw new UnrecoverableError("Campaign/recipient missing");

    const res = await fetch(`${WA_API}/${SENDERS[campaign.sender]}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${WA_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient.phone,
        type: "template",
        template: {
          name: process.env.WA_TEMPLATE_NAME ?? "hello_world", // approved template
          language: { code: "en" },
          // when your template has {{1}} for the member name, add:
          // components: [{ type: "body", parameters: [{ type: "text", text: recipient.memberName }] }],
        },
      }),
    });

    const body: any = await res.json();
    if (!res.ok) {
      const msg = body?.error?.message ?? `HTTP ${res.status}`;
      // 429 and 5xx are worth retrying; other 4xx (bad number, bad template) are not
      if (res.status === 429 || res.status >= 500) throw new Error(msg);
      throw new UnrecoverableError(msg);
    }

    await setStatus(campaignId, recipientId, {
      status: "sent",
      waMessageId: body.messages[0].id,
      sentAt: new Date(),
    });
  },
  { connection, concurrency: 5, limiter: { max: 10, duration: 1000 } },
);

worker.on("failed", async (job, err) => {
  if (!job) return;
  const final = err.name === "UnrecoverableError" || job.attemptsMade >= (job.opts.attempts ?? 1);
  if (final) await setStatus(job.data.campaignId, job.data.recipientId, { status: "failed", error: err.message });
});