
import { api } from "./client";
import type {
  AdminDashboard,
  Brand,
  Order,
  OrderStatus,
  User,
} from "../types";

// ============================================================
// ADMIN DASHBOARD
// ============================================================

export async function adminDashboard(): Promise<AdminDashboard> {
  const { data } = await api.get<AdminDashboard>("/admin/dashboard/");
  return data;
}

// ============================================================
// ADMIN PHONE TYPES
// ============================================================

export interface AdminPhoneVariant {
  id: number;
  phone: number;
  color: string;
  storage_gb: number;
  ram_gb: number | null;
  price: string;
  stock: number;
  sku: string;
}

export interface AdminPhoneImage {
  id: number;
  phone: number;
  image: string;
  is_primary: boolean;
  order: number;
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
  variants: AdminPhoneVariant[];
  images: AdminPhoneImage[];
}

// ============================================================
// ADMIN PHONE API
// ============================================================

export async function adminFetchPhones(): Promise<AdminPhone[]> {
  const { data } = await api.get("/admin/phones/", {
    params: { page_size: 100 },
  });

  return data.results ?? data;
}

export async function adminCreatePhone(
  payload: Partial<AdminPhone>
): Promise<AdminPhone> {
  const { data } = await api.post<AdminPhone>(
    "/admin/phones/",
    payload
  );

  return data;
}

export async function adminUpdatePhone(
  id: number,
  payload: Partial<AdminPhone>
): Promise<AdminPhone> {
  const { data } = await api.patch<AdminPhone>(
    `/admin/phones/${id}/`,
    payload
  );

  return data;
}

export async function adminDeletePhone(id: number): Promise<void> {
  await api.delete(`/admin/phones/${id}/`);
}

// ============================================================
// ADMIN BRAND API
// ============================================================

export async function adminFetchBrands(): Promise<Brand[]> {
  const { data } = await api.get("/admin/brands/", {
    params: { page_size: 100 },
  });

  return data.results ?? data;
}

export async function adminCreateBrand(
  payload: { name: string }
): Promise<Brand> {
  const { data } = await api.post<Brand>(
    "/admin/brands/",
    payload
  );

  return data;
}

// ============================================================
// ADMIN PHONE VARIANT API
// ============================================================

export type AdminVariantPayload = {
  phone: number;
  color: string;
  storage_gb: number;
  ram_gb: number | null;
  price: string;
  stock: number;
  sku: string;
};

export async function adminFetchVariants(
  phoneId?: number
): Promise<AdminPhoneVariant[]> {
  const { data } = await api.get("/admin/variants/", {
    params: {
      page_size: 100,
      ...(phoneId !== undefined ? { phone: phoneId } : {}),
    },
  });

  return data.results ?? data;
}

export async function adminCreateVariant(
  payload: AdminVariantPayload
): Promise<AdminPhoneVariant> {
  const { data } = await api.post<AdminPhoneVariant>(
    "/admin/variants/",
    payload
  );

  return data;
}

export async function adminUpdateVariant(
  id: number,
  payload: Partial<AdminVariantPayload>
): Promise<AdminPhoneVariant> {
  const { data } = await api.patch<AdminPhoneVariant>(
    `/admin/variants/${id}/`,
    payload
  );

  return data;
}

export async function adminDeleteVariant(id: number): Promise<void> {
  await api.delete(`/admin/variants/${id}/`);
}

// ============================================================
// ADMIN PHONE IMAGE API
// ============================================================

export interface AdminPhoneImagePayload {
  phone: number;
  image: File;
  is_primary: boolean;
  order: number;
}

export async function adminFetchImages(
  phoneId?: number
): Promise<AdminPhoneImage[]> {
  const { data } = await api.get("/admin/images/", {
    params: {
      page_size: 100,
      ...(phoneId !== undefined ? { phone: phoneId } : {}),
    },
  });

  return data.results ?? data;
}

export async function adminCreateImage(
  payload: AdminPhoneImagePayload
): Promise<AdminPhoneImage> {
  const formData = new FormData();

  formData.append("phone", String(payload.phone));
  formData.append("image", payload.image);
  formData.append("is_primary", String(payload.is_primary));
  formData.append("order", String(payload.order));

  const { data } = await api.post<AdminPhoneImage>(
    "/admin/images/",
    formData
  );

  return data;
}

export async function adminUpdateImage(
  id: number,
  payload: {
    image?: File;
    is_primary?: boolean;
    order?: number;
  }
): Promise<AdminPhoneImage> {
  const formData = new FormData();

  if (payload.image) {
    formData.append("image", payload.image);
  }

  if (payload.is_primary !== undefined) {
    formData.append("is_primary", String(payload.is_primary));
  }

  if (payload.order !== undefined) {
    formData.append("order", String(payload.order));
  }

  const { data } = await api.patch<AdminPhoneImage>(
    `/admin/images/${id}/`,
    formData
  );

  return data;
}

export async function adminDeleteImage(id: number): Promise<void> {
  await api.delete(`/admin/images/${id}/`);
}

// ============================================================
// ADMIN ORDER API
// ============================================================

export async function adminFetchOrders(): Promise<Order[]> {
  const { data } = await api.get("/admin/orders/", {
    params: { page_size: 100 },
  });

  return data.results ?? data;
}

export async function adminFetchOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/admin/orders/${id}/`);
  return data;
}

export async function adminUpdateOrderStatus(
  id: number,
  status: OrderStatus
): Promise<Order> {
  const { data } = await api.patch<Order>(
    `/admin/orders/${id}/`,
    { status }
  );

  return data;
}

export async function adminVerifyPayment(
  orderId: number,
  proofId: number
): Promise<Order> {
  const { data } = await api.post<Order>(
    `/admin/orders/${orderId}/verify-payment/`,
    { proof_id: proofId }
  );

  return data;
}

// ============================================================
// ADMIN USER API
// ============================================================

export async function adminFetchUsers(): Promise<User[]> {
  const { data } = await api.get("/admin/users/", {
    params: { page_size: 100 },
  });

  return data.results ?? data;
}

export async function adminBlockUser(
  id: number
): Promise<{ id: number; is_active: boolean }> {
  const { data } = await api.post(`/admin/users/${id}/block/`);
  return data;
}
