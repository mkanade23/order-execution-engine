import Fastify from "fastify";
import "./queue/order.worker";
import { orderRoutes } from './routes/order.routes';
import { initWsServer } from './websocket/ws.server';
import "dotenv/config";   // 👈 MUST be first



export async function buildApp() {
  const app = Fastify({ logger: true });

  app.register(orderRoutes, { prefix: "/api/orders" });

  app.ready().then(() => {
    initWsServer(app.server); 
  });

  return app;
}
