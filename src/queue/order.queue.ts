import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const orderQueue = new Queue("orders", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    removeOnComplete: true,
    removeOnFail: true,
  },
});
