import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../../api/orders";
import type { Order } from "../../types";
import { formatDate, formatPrice, STATUS_COLORS, STATUS_LABELS } from "../../lib/format";
import { Empty } from "../../components/ui/Empty";

export function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My orders</h1>
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : orders.length === 0 ? (
        <>
          <Empty message="You haven't placed any orders yet." />
          <div className="text-center">
            <Link to="/phones" className="btn-primary">Browse phones</Link>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{o.order_number}</p>
                  <p className="text-xs text-gray-500">{formatDate(o.created_at)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[o.status]}`}>
                  {STATUS_LABELS[o.status]}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {o.items.map((it) => (
                  <p key={it.id}>{it.product_name} × {it.quantity}</p>
                ))}
              </div>
              <p className="font-bold text-brand-600 mt-2">{formatPrice(o.total)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}