import { Server } from "ws";
import { orderEvents } from "../services/order.service";

export function initWsServer(server: any) {
  const wss = new Server({ server });

  wss.on("connection", (ws, req) => {
    console.log("🔌 WS connected");

    const url = new URL(req.url || "", "http://localhost");
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      ws.send(JSON.stringify({ error: "orderId missing" }));
      return;
    }


    const handler = (order: any) => {
      if (order.id === orderId) {
        ws.send(JSON.stringify(order));

       
        if (order.status === "confirmed" || order.status === "failed") {
          ws.close();
        }
      }
    };

    orderEvents.on("status", handler);

    ws.on("close", () => {
      console.log("🔌 WS closed");
      orderEvents.off("status", handler);
    });

    ws.on("error", (err) => {
      console.error("❌ WS error", err);
    });
  });
}
