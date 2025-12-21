import { Worker, Job } from "bullmq";
import { MockDexRouter } from "../dex/mockDexRouter";
import { redis } from "./redis";
import { emitStatus } from "../services/order.service";
import { Order } from "../types/order";

const dex = new MockDexRouter();

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const orderWorker = new Worker(
  "orders",
  async (job: Job) => {
    const { orderId } = job.data as { orderId: string };

    try {
      // 1️⃣ routing
      await sleep(3000);
      await emitStatus(orderId, "routing");

      const raydium = await dex.getRaydiumQuote();
      const meteora = await dex.getMeteoraQuote();

      const selectedDex: NonNullable<Order["dex"]> =
        raydium.price > meteora.price ? "Raydium" : "Meteora";

      // 2️⃣ building
      await sleep(3000);
      await emitStatus(orderId, "building", { dex: selectedDex });

      // 3️⃣ submitted
      await sleep(3000);
      await emitStatus(orderId, "submitted");

      // 4️⃣ execute
      const result = await dex.executeSwap(selectedDex);

      // 5️⃣ confirmed
      await sleep(3000);
      await emitStatus(orderId, "confirmed", {
        dex: selectedDex,
        txHash: result.txHash,
        executedPrice: result.executedPrice,
      });
    } catch (err: any) {
      // ❌ failed
      await emitStatus(orderId, "failed", {
        error: err?.message || "Execution failed",
      });

      // IMPORTANT: rethrow so BullMQ retries
      throw err;
    }
  },
  {
    connection: redis,

    // 🔥 concurrency requirement
    concurrency: 10,

    // 🔥 rate limit: 100 orders / minute
    limiter: {
      max: 100,
      duration: 60_000,
    },
  }
);
