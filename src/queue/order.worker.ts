import { Worker } from "bullmq";
import { MockDexRouter } from "../dex/mockDexRouter";
import { redis } from "../config/redis"
import { emitStatus } from "../services/order.service";
import { Order } from "../types/order";

const dex = new MockDexRouter();

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export const orderWorker = new Worker(
  "orders",
  async (job) => {
    const { orderId } = job.data as { orderId: string };

    try {
      await sleep(3000);
      emitStatus(orderId, "routing");

      const raydium = await dex.getRaydiumQuote();
      const meteora = await dex.getMeteoraQuote();

      const selectedDex: NonNullable<Order["dex"]> =
        raydium.price > meteora.price ? "Raydium" : "Meteora";

      await sleep(3000);
      emitStatus(orderId, "building", { dex: selectedDex });

      await sleep(3000);
      emitStatus(orderId, "submitted");

      const result = await dex.executeSwap(selectedDex);

      await sleep(3000);
      emitStatus(orderId, "confirmed", {
        dex: selectedDex,
        txHash: result.txHash,
        executedPrice: result.executedPrice,
      });
    } catch (err: any) {
      emitStatus(orderId, "failed", {
        error: err?.message || "Execution failed",
      });
      throw err; // ✅ important for retries
    }
  },
  {
    connection: redis,
    concurrency: 10,

    // ✅ THIS IS CORRECT (meets doc requirement)
    limiter: {
      max: 100,       // 100 jobs
      duration: 60_000, // per minute
    },
  }
);
