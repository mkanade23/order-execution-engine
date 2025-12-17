import { pool } from "../db/pg";
import { Order } from "../types/order";

/**
 * Create order row
 */
export async function createOrderDb(order: Order) {
  await pool.query(
    `
    INSERT INTO orders
      (id, token_in, token_out, amount, status)
    VALUES
      ($1, $2, $3, $4, $5)
    `,
    [
      order.id,
      order.tokenIn,
      order.tokenOut,
      order.amount,
      order.status,
    ]
  );
}

/**
 * Update order status safely (explicit mapping)
 */
export async function updateOrderStatus(
  id: string,
  data: Partial<Order>
) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.status) {
    fields.push(`status = $${idx++}`);
    values.push(data.status);
  }

  if (data.dex) {
    fields.push(`dex = $${idx++}`);
    values.push(data.dex);
  }

  if (data.txHash) {
    fields.push(`tx_hash = $${idx++}`);
    values.push(data.txHash);
  }

  if (data.executedPrice !== undefined) {
    fields.push(`executed_price = $${idx++}`);
    values.push(data.executedPrice);
  }

  if (data.error) {
    fields.push(`error = $${idx++}`);
    values.push(data.error);
  }

  
  fields.push(`updated_at = NOW()`);

  await pool.query(
    `
    UPDATE orders
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    `,
    [...values, id]
  );
}
