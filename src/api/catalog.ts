import { api } from "./client";
import type { Brand, Paginated, PhoneDetail, PhoneListItem } from "../types";

export async function fetchBrands(): Promise<Brand[]> {
  const { data } = await api.get<Brand[]>("/catalog/brands/");
  return data;
}

export interface PhoneQuery {
  brand?: string;
  condition?: string;
  min_price?: number | string;
  max_price?: number | string;
  storage?: number | string;
  ram?: number | string;
  search?: string;
  ordering?: string;
  page?: number;
}

export async function fetchPhones(params: PhoneQuery = {}): Promise<Paginated<PhoneListItem>> {
  const { data } = await api.get<Paginated<PhoneListItem>>("/catalog/phones/", { params });
  return data;
}

export async function fetchPhone(slug: string): Promise<PhoneDetail> {
  const { data } = await api.get<PhoneDetail>(`/catalog/phones/${slug}/`);
  return data;
}