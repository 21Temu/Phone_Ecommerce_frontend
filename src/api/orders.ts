import { api } from "./client";
import type { Order } from "../types";

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  note?: string;
  items: { variant_id: number; quantity: number }[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const { data } = await api.post<Order>("/orders/", payload);
  return data;
}

export async function trackOrder(orderNumber: string, email: string): Promise<Order> {
  const { data } = await api.get<Order>("/orders/track/", {
    params: { order_number: orderNumber, email },
  });
  return data;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders/my/");
  return data;
}

export async function uploadPaymentProof(
  orderId: number,
  payload: { transaction_ref: string; screenshot: File; note?: string }
): Promise<void> {
  const form = new FormData();
  form.append("transaction_ref", payload.transaction_ref);
  form.append("screenshot", payload.screenshot);
  if (payload.note) form.append("note", payload.note);
  await api.post(`/orders/${orderId}/pay-proof/`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  note?: string;
  payment_method: "offline" | "chapa"; // <-- ADD THIS
  items: { variant_id: number; quantity: number }[];
}

export async function initiateChapaPayment(orderId: number): Promise<{ checkout_url: string }> {
  // MUST BE api.post, not api.get
  const { data } = await api.post<{ checkout_url: string }>(`/orders/${orderId}/chapa-initiate/`);
  return data;
}