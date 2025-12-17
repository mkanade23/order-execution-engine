# 🚀 Order Execution Engine (Mock DEX)

## Overview

This project implements an **Order Execution Engine** that processes **Market Orders** with **DEX routing** and **real-time WebSocket status updates**.

The system compares prices from two decentralized exchanges (**Raydium** and **Meteora**), routes the order to the best execution venue, and streams the full order lifecycle to the client.

A **mock implementation** is used to focus on **architecture, concurrency, and real-time updates**, rather than blockchain integration complexity.

---

## ✨ Features

- Market order execution
- DEX routing (Raydium vs Meteora)
- Best price selection
- Real-time WebSocket updates
- Queue-based concurrent processing
- Retry with exponential backoff
- PostgreSQL persistence
- Redis-backed job queue

---

## 🧠 Why Market Orders?

Market orders execute immediately at the best available price, making them ideal for demonstrating:
- DEX routing logic
- Real-time execution flow
- Queue-based concurrent processing

### Extending to Other Order Types
- **Limit Orders**: Execute when the target price is reached
- **Sniper Orders**: Execute on token launch or migration events

---

## 🔄 Order Execution Flow

1. Client submits an order via `POST /api/orders/execute`
2. API validates the request and returns an `orderId`
3. Client connects to WebSocket using the `orderId`
4. Order is queued using BullMQ
5. Worker processes the order:
   - `pending`
   - `routing`
   - `building`
   - `submitted`
   - `confirmed` or `failed`
6. Status updates are streamed via WebSocket
7. Final execution result is stored in PostgreSQL

---

## 📡 WebSocket Status Lifecycle

```json
pending
routing
building
submitted
confirmed
failed

