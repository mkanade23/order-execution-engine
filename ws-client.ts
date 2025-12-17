import WebSocket from "ws";

const ORDER_ID = "22956ad3-291f-4846-abc5-2b18a16ecfb8";

const ws = new WebSocket(
  `ws://localhost:3000/ws/orders?orderId=${ORDER_ID}`
);

ws.on("open", () => {
  console.log("✅ WS connected");
});

ws.on("message", (data) => {
  console.log("📩", data.toString());
});

ws.on("close", () => {
  console.log("🔌 WS closed");
});

ws.on("error", (err) => {
  console.error("❌ WS error", err);
});
