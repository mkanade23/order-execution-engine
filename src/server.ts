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

app.listen({ port: Number(process.env.PORT) || 3000 });
