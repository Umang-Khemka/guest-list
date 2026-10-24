import { Queue } from "bullmq";
import {Redis} from "ioredis";

export const connection = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null });

export const whatsappQueue = new Queue("whatsapp", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
});