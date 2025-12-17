import { FastifyInstance } from "fastify";
import { orderQueue } from "../queue/order.queue";
import { orderEvents } from "../services/order.service";

const activeOrders = new Set<string>();

export async function orderWebSocket(app: FastifyInstance) {
  app.get(
    "/ws/orders",
    { websocket: true },
    (connection, request) => {
      const orderId = (request.query as any)?.orderId;

      if (!orderId) {
        connection.socket.close();
        return;
      }


      connection.socket.send(
        JSON.stringify({ id: orderId, status: "pending" })
      );

      const handler = (payload: any) => {
        if (payload.id === orderId) {
          connection.socket.send(JSON.stringify(payload));

          if (
            payload.status === "confirmed" ||
            payload.status === "failed"
          ) {
            activeOrders.delete(orderId);
            connection.socket.close();
          }
        }
      };

      orderEvents.on("status", handler);

      if (!activeOrders.has(orderId)) {
        activeOrders.add(orderId);
        orderQueue.add("execute", { orderId });
      }

      connection.socket.on("close", () => {
        orderEvents.off("status", handler);
      });
    }
  );
}
