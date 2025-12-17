import { sleep } from "../utils/sleep";

export class MockDexRouter {
  private basePrice = 100;

  async getRaydiumQuote() {
    await sleep(200);
    return {
      dex: "Raydium",
      price: this.basePrice * (0.98 + Math.random() * 0.04),
      fee: 0.003
    };
  }

  async getMeteoraQuote() {
    await sleep(200);
    return {
      dex: "Meteora",
      price: this.basePrice * (0.97 + Math.random() * 0.05),
      fee: 0.002
    };
  }

  async executeSwap(dex: string) {
    await sleep(2000 + Math.random() * 1000);
    return {
      txHash: "0xMOCK_" + Math.random().toString(36).substring(2),
      executedPrice: this.basePrice
    };
  }
}
