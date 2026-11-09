import { useEffect, useState } from "react";
import {
  adminFetchOrder, adminFetchOrders, adminUpdateOrderStatus, adminVerifyPayment,
} from "../../api/admin";
import type { Order, OrderStatus } from "../../types";
import { formatDate, formatPrice, STATUS_COLORS, STATUS_LABELS } from "../../lib/format";

const STATUSES: OrderStatus[] = [
  "pending_payment", "payment_review", "confirmed", "shipped", "delivered", "cancelled",
];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  const reload = () => adminFetchOrders().then(setOrders).catch(() => {});
  useEffect(() => { reload(); }, []);

  const open = async (id: number) => setSelected(await adminFetchOrder(id));

  const changeStatus = async (id: number, status: OrderStatus) => {
    await adminUpdateOrderStatus(id, status);
    await reload();
    if (selected?.id === id) setSelected(await adminFetchOrder(id));
  };

  const verify = async (orderId: number, proofId: number) => {
    await adminVerifyPayment(orderId, proofId);
    await reload();
    setSelected(await adminFetchOrder(orderId));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Order</th><th className="p-3">Customer</th>
              <th className="p-3">Total</th><th className="p-3">Status</th>
              <th className="p-3">Date</th><th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3 font-medium">{o.order_number}</td>
                <td className="p-3">{o.customer_name}<br /><span className="text-xs text-gray-500">{o.customer_phone}</span></td>
                <td className="p-3">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                </td>
                <td className="p-3 text-xs text-gray-500">{formatDate(o.created_at)}</td>
                <td className="p-3 text-right">
                  <button className="text-brand-600 hover:underline text-xs" onClick={() => open(o.id)}>View</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td className="p-4 text-gray-500" colSpan={6}>No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">{selected.order_number}</h2>
                <p className="text-xs text-gray-500">{formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-900">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><strong>Name:</strong> {selected.customer_name}</p>
              <p><strong>Phone:</strong> {selected.customer_phone}</p>
              <p><strong>Email:</strong> {selected.customer_email}</p>
              <p><strong>Total:</strong> {formatPrice(selected.total)}</p>
            </div>
            <p className="text-sm"><strong>Address:</strong> {selected.shipping_address}</p>

            <div>
              <p className="text-sm font-semibold mb-1">Items</p>
              {selected.items.map((i) => (
                <div key={i.id} className="text-sm flex justify-between border-b py-1">
                  <span>{i.product_name} · {i.variant_label} × {i.quantity}</span>
                  <span>{formatPrice(i.line_total)}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-semibold mb-1">Payment proofs</p>
              {selected.payments.length === 0 && <p className="text-sm text-gray-500">None uploaded.</p>}
              {selected.payments.map((p) => (
                <div key={p.id} className="border rounded p-2 mb-2 text-sm">
                  <p><strong>Ref:</strong> {p.transaction_ref}</p>
                  <a href={p.screenshot} target="_blank" rel="noreferrer" className="text-brand-600 underline">
                    View screenshot
                  </a>
                  {p.is_verified ? (
                    <p className="text-green-600 text-xs mt-1">✓ Verified</p>
                  ) : (
                    <button
                      onClick={() => verify(selected.id, p.id)}
                      className="btn-primary text-xs mt-2"
                    >
                      Verify & confirm order
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="label">Update status</label>
              <select
                className="input"
                value={selected.status}
                onChange={(e) => changeStatus(selected.id, e.target.value as OrderStatus)}
              >
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}