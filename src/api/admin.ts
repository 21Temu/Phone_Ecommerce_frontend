import { api } from "./client";
import type { AdminDashboard, Brand, Order, OrderStatus, User } from "../types";

export async function adminDashboard(): Promise<AdminDashboard> {
  const { data } = await api.get<AdminDashboard>("/admin/dashboard/");
  return data;
}

export interface AdminPhone {
  id: number;
  slug: string;
  name: string;
  brand: number;
  brand_name: string;
  description: string;
  condition: string;
  screen_size: string | null;
  battery_mah: number | null;
  camera_mp: number | null;
  os: string;
  is_active: boolean;
}

export async function adminFetchPhones(): Promise<AdminPhone[]> {
  const { data } = await api.get("/admin/phones/", { params: { page_size: 100 } });
  return data.results;
}

export async function adminCreatePhone(payload: Partial<AdminPhone>): Promise<AdminPhone> {
  const { data } = await api.post<AdminPhone>("/admin/phones/", payload);
  return data;
}

export async function adminUpdatePhone(id: number, payload: Partial<AdminPhone>): Promise<AdminPhone> {
  const { data } = await api.patch<AdminPhone>(`/admin/phones/${id}/`, payload);
  return data;
}

export async function adminDeletePhone(id: number): Promise<void> {
  await api.delete(`/admin/phones/${id}/`);
}

export async function adminFetchBrands(): Promise<Brand[]> {
  const { data } = await api.get("/admin/brands/", { params: { page_size: 100 } });
  return data.results;
}

export async function adminCreateBrand(payload: { name: string }): Promise<Brand> {
  const { data } = await api.post<Brand>("/admin/brands/", payload);
  return data;
}

export async function adminFetchOrders(): Promise<Order[]> {
  const { data } = await api.get("/admin/orders/", { params: { page_size: 100 } });
  return data.results;
}

export async function adminFetchOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/admin/orders/${id}/`);
  return data;
}

export async function adminUpdateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const { data } = await api.patch<Order>(`/admin/orders/${id}/`, { status });
  return data;
}

export async function adminVerifyPayment(orderId: number, proofId: number): Promise<Order> {
  const { data } = await api.post<Order>(`/admin/orders/${orderId}/verify-payment/`, {
    proof_id: proofId,
  });
  return data;
}

export async function adminFetchUsers(): Promise<User[]> {
  const { data } = await api.get("/admin/users/", { params: { page_size: 100 } });
  return data.results;
}

export async function adminBlockUser(id: number): Promise<{ id: number; is_active: boolean }> {
  const { data } = await api.post(`/admin/users/${id}/block/`);
  return data;
}