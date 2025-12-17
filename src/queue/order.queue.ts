import { Queue } from "bullmq";
import Redis from "ioredis";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set");
}

export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const orderQueue = new Queue("orders", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: true,
    removeOnFail: true,
  },
});

