export type Condition = "new" | "used" | "refurbished";

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface PhoneVariant {
  id: number;
  color: string;
  storage_gb: number;
  ram_gb: number | null;
  price: string;
  stock: number;
  in_stock: boolean;
  sku: string;
}

export interface PhoneImage {
  id: number;
  image: string;
  is_primary: boolean;
  order: number;
}

export interface PhoneListItem {
  id: number;
  slug: string;
  name: string;
  brand: Brand;
  condition: Condition;
  min_price: string | null;
  in_stock: boolean;
  primary_image: string | null;
  screen_size: string | null;
  battery_mah: number | null;
  camera_mp: number | null;
  os: string;
}

export interface PhoneDetail extends PhoneListItem {
  description: string;
  images: PhoneImage[];
  variants: PhoneVariant[];
  created_at: string;
  updated_at: string;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  is_admin: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export type OrderStatus =
  | "pending_payment"
  | "payment_review"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: number;
  product_name: string;
  variant_label: string;
  unit_price: string;
  quantity: number;
  line_total: string;
}

export interface PaymentProof {
  id: number;
  transaction_ref: string;
  screenshot: string;
  note: string;
  is_verified: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  note: string;
  subtotal: string;
  shipping_fee: string;
  total: string;
  items: OrderItem[];
  payments: PaymentProof[];
  created_at: string;
}

export interface CartItem {
  variantId: number;
  phoneId: number;
  phoneSlug: string;
  productName: string;
  variantLabel: string;
  color: string;
  storage_gb: number;
  ram_gb: number | null;
  price: number;
  quantity: number;
  stock: number;
  image: string | null;
}

export interface AdminDashboard {
  total_orders: number;
  today_orders: number;
  pending_payment: number;
  payment_review: number;
  confirmed_orders: number;
  revenue: number;
  low_stock: { id: number; sku: string; stock: number; phone__name: string }[];
}