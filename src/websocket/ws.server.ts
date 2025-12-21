import WebSocket, { Server } from "ws";
import { IncomingMessage } from "http";
import { orderEvents } from "../services/order.service";

export function initWsServer(server: any) {
  const wss = new Server({ server });

  wss.on(
    "connection",
    (ws: WebSocket, req: IncomingMessage) => {
      console.log("🔌 WS connected");

      const url = new URL(req.url || "", "http://localhost");
      const orderId = url.searchParams.get("orderId");

      if (!orderId) {
        ws.send(JSON.stringify({ error: "orderId missing" }));
        ws.close();
        return;
      }

      const handler = (order: {
        id: string;
        status: string;
        [key: string]: any;
      }) => {
        if (order.id === orderId) {
          ws.send(JSON.stringify(order));

          // close socket on terminal states
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

      ws.on("error", (err: Error) => {
        console.error("❌ WS error", err.message);
      });
    }
  );
}
