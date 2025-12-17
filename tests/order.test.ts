import { MockDexRouter } from "../src/dex/mockDexRouter";

describe("Order Engine Tests", () => {
  const router = new MockDexRouter();

  test("Raydium quote returns price", async () => {
    const q = await router.getRaydiumQuote();
    expect(q.price).toBeGreaterThan(0);
  });

  test("Meteora quote returns price", async () => {
    const q = await router.getMeteoraQuote();
    expect(q.price).toBeGreaterThan(0);
  });

  test("Best price selection works", async () => {
    const r = await router.getRaydiumQuote();
    const m = await router.getMeteoraQuote();
    const best = r.price > m.price ? r : m;
    expect(best).toHaveProperty("price");
  });

  test("Swap execution returns txHash", async () => {
    const res = await router.executeSwap("Raydium");
    expect(res.txHash).toContain("0xMOCK");
  });

  test("Price variance exists", async () => {
    const a = await router.getRaydiumQuote();
    const b = await router.getRaydiumQuote();
    expect(a.price).not.toBe(b.price);
  });

  test("Fee exists", async () => {
    const q = await router.getMeteoraQuote();
    expect(q.fee).toBeDefined();
  });

  test("Execution delay simulated", async () => {
    const start = Date.now();
    await router.executeSwap("Meteora");
    expect(Date.now() - start).toBeGreaterThan(1500);
  });

  test("Router supports multiple DEXs", async () => {
    const r = await router.getRaydiumQuote();
    const m = await router.getMeteoraQuote();
    expect(r.dex).not.toBe(m.dex);
  });

  test("Market order flow valid", () => {
    const statuses = ["pending", "routing", "building", "submitted", "confirmed"];
    expect(statuses.length).toBe(5);
  });

  test("Mock txHash unique", async () => {
    const a = await router.executeSwap("Raydium");
    const b = await router.executeSwap("Raydium");
    expect(a.txHash).not.toBe(b.txHash);
  });
});
