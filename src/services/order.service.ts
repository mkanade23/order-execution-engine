import { EventEmitter } from "events";
import { Order, OrderStatus } from "../types/order";
import { updateOrderStatus } from "../repositories/order.repository";

export const orderEvents = new EventEmitter();

export async function emitStatus(
  orderId: string,
  status: OrderStatus,
  extra: Partial<Order> = {}
) {

  await updateOrderStatus(orderId, {
    status,
    ...extra,
  });


  orderEvents.emit("status", {
    id: orderId,
    status,
    ...extra,
  });
}
