import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import websocket from "@fastify/websocket";

import "./queue/order.worker";
import { orderRoutes } from "./routes/order.routes";
import { orderWebSocket } from "./websocket/order.socket";

const app = Fastify({ logger: true });


app.register(websocket);

app.register(orderRoutes);
app.register(orderWebSocket);

const PORT = Number(process.env.PORT) || 3000;

app.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

