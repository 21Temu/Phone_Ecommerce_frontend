export function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(n)) return "—";
  return `ETB ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  payment_review: "Payment Under Review",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<string, string> = {
  pending_payment: "bg-yellow-100 text-yellow-800",
  payment_review: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};