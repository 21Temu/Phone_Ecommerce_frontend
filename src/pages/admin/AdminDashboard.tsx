import { useEffect, useState } from "react";
import { adminDashboard } from "../../api/admin";
import type { AdminDashboard as D } from "../../types";
import { formatPrice } from "../../lib/format";

export function AdminDashboard() {
  const [data, setData] = useState<D | null>(null);

  useEffect(() => {
    adminDashboard().then(setData).catch(() => {});
  }, []);

  if (!data) return <p>Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat label="Total orders" value={data.total_orders} />
        <Stat label="Today" value={data.today_orders} />
        <Stat label="Pending payment" value={data.pending_payment} />
        <Stat label="Payment review" value={data.payment_review} />
        <Stat label="Confirmed" value={data.confirmed_orders} />
        <Stat label="Revenue" value={formatPrice(data.revenue)} wide />
      </div>

      <h2 className="text-lg font-semibold mb-3">Low stock (≤ 5)</h2>
      {data.low_stock.length === 0 ? (
        <p className="text-gray-500 text-sm">All variants have healthy stock.</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr><th className="p-3">SKU</th><th className="p-3">Phone</th><th className="p-3">Stock</th></tr>
            </thead>
            <tbody>
              {data.low_stock.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.sku}</td>
                  <td className="p-3">{r.phone__name}</td>
                  <td className={`p-3 font-medium ${r.stock === 0 ? "text-red-600" : "text-orange-600"}`}>{r.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, wide }: { label: string; value: string | number; wide?: boolean }) {
  return (
    <div className={`card p-4 ${wide ? "col-span-2" : ""}`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}