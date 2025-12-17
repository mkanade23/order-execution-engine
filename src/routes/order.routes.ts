import { FastifyInstance } from "fastify";
import { v4 as uuid } from "uuid";
import { createOrderDb } from "../repositories/order.repository";
import { Order } from "../types/order";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/api/orders/execute", async (req, reply) => {
    const body = req.body as {
      tokenIn: string;
      tokenOut: string;
      amount: number;
    };


    if (!body.tokenIn || !body.tokenOut || !body.amount) {
      return reply.status(400).send({
        error: "tokenIn, tokenOut and amount are required",
      });
    }

    if (body.amount <= 0) {
      return reply.status(400).send({
        error: "amount must be greater than 0",
      });
    }

    const order: Order = {
      id: uuid(),
      tokenIn: body.tokenIn,
      tokenOut: body.tokenOut,
      amount: body.amount,
      status: "pending",
    };

   
    await createOrderDb(order);


    return {
      orderId: order.id,
    };
  });
}
