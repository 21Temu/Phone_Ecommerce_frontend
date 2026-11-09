import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trackOrder } from "../../api/orders";
import type { Order } from "../../types";
import { formatDate, formatPrice, STATUS_COLORS, STATUS_LABELS } from "../../lib/format";

export function OrderTrack() {
  const [params] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const success = params.get("success") === "1";

  const lookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    try {
      const o = await trackOrder(orderNumber, email);
      setOrder(o);
    } catch {
      setError("Order not found. Check your order number and email.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const n = params.get("order");
    if (n) setOrderNumber(n);
  }, [params]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Track your order</h1>
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded mb-4 text-sm">
          Payment proof received! We'll verify it within 24 hours.
        </div>
      )}
      <form onSubmit={lookup} className="card p-4 space-y-3 mb-6">
        <div>
          <label className="label">Order number</label>
          <input required className="input" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Searching…" : "Find my order"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {order && (
        <div className="card p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Order</p>
              <p className="font-bold">{order.order_number}</p>
              <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <div className="border-t pt-2 space-y-1">
            {order.items.map((it) => (
              <div key={it.id} className="flex justify-between text-sm">
                <span>{it.product_name} × {it.quantity}</span>
                <span>{formatPrice(it.line_total)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-brand-600">{formatPrice(order.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}