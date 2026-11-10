
import { useEffect, useMemo, useState } from "react";
import {
  adminFetchOrder,
  adminFetchOrders,
  adminUpdateOrderStatus,
  adminVerifyPayment,
} from "../../api/admin";
import type { Order, OrderStatus } from "../../types";
import {
  formatDate,
  formatPrice,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../../lib/format";

const STATUSES: OrderStatus[] = [
  "pending_payment",
  "payment_review",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const reload = async () => {
    setError("");

    try {
      const result = await adminFetchOrders();
      setOrders(result);
    } catch {
      setError("Unable to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const open = async (id: number) => {
    setSelected(null);
    setActionError("");
    setDetailsLoading(true);

    try {
      const result = await adminFetchOrder(id);
      setSelected(result);
    } catch {
      setError("Unable to load order details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const changeStatus = async (id: number, status: OrderStatus) => {
    if (actionLoading) return;

    setActionLoading(true);
    setActionError("");

    try {
      await adminUpdateOrderStatus(id, status);

      await reload();

      const updated = await adminFetchOrder(id);
      setSelected(updated);
    } catch {
      setActionError("Unable to update order status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const verify = async (orderId: number, proofId: number) => {
    if (actionLoading) return;

    setActionLoading(true);
    setActionError("");

    try {
      await adminVerifyPayment(orderId, proofId);

      await reload();

      const updated = await adminFetchOrder(orderId);
      setSelected(updated);
    } catch {
      setActionError(
        "Payment verification failed. Please check the payment and try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.order_number.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_phone.toLowerCase().includes(query) ||
        order.customer_email.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const pendingCount = orders.filter(
    (order) => order.status === "pending_payment"
  ).length;

  const reviewCount = orders.filter(
    (order) => order.status === "payment_review"
  ).length;

  const confirmedCount = orders.filter(
    (order) => order.status === "confirmed"
  ).length;

  const totalRevenue = orders
    .filter((order) =>
      ["confirmed", "shipped", "delivered"].includes(order.status)
    )
    .reduce((total, order) => total + Number(order.total || 0), 0);

  return (
    <div className="min-h-screen space-y-7">

      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs text-blue-100 mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Store Management
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Order Management
            </h1>

            <p className="text-blue-100 mt-3 text-sm sm:text-base">
              Manage customer orders, review payments and update delivery
              statuses.
            </p>
          </div>

          <button
            onClick={reload}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <span>↻</span>
            Refresh Orders
          </button>

        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        <Stat
          label="Total Orders"
          value={orders.length}
          icon="📦"
          color="bg-blue-50 text-blue-700"
        />

        <Stat
          label="Pending Payment"
          value={pendingCount}
          icon="⏳"
          color="bg-amber-50 text-amber-700"
        />

        <Stat
          label="Payment Review"
          value={reviewCount}
          icon="🔍"
          color="bg-orange-50 text-orange-700"
        />

        <Stat
          label="Confirmed Orders"
          value={confirmedCount}
          icon="✓"
          color="bg-emerald-50 text-emerald-700"
        />

      </div>

      {/* Revenue Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex items-center justify-between gap-4">

        <div>
          <p className="text-sm font-semibold text-slate-500">
            Revenue from confirmed and later-stage orders
          </p>

          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {formatPrice(totalRevenue)}
          </p>
        </div>

        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-3xl">💰</span>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                All Orders
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Search and manage customer purchases.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search */}
              <div className="relative flex-1">
                <svg
                  className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                  <path strokeLinecap="round" strokeWidth="1.8" d="M16 16l5 5" />
                </svg>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders or customers..."
                  className="w-full sm:w-64 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 bg-white"
              >
                <option value="all">All Statuses</option>

                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="m-5 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (

          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-16 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm text-left">

              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4 font-bold">Order</th>
                  <th className="px-5 py-4 font-bold">Customer</th>
                  <th className="px-5 py-4 font-bold">Total</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 font-bold">Date</th>
                  <th className="px-5 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50 transition-colors"
                  >

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900">
                        #{order.order_number}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        ID: {order.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {order.customer_phone}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {formatPrice(order.total)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex text-xs font-bold px-3 py-1.5 rounded-full ${
                          STATUS_COLORS[order.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => open(order.id)}
                        className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
                      >
                        View Details
                        <span>→</span>
                      </button>
                    </td>

                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <div className="text-4xl mb-3">📦</div>

                      <h3 className="font-bold text-slate-800">
                        No orders found
                      </h3>

                      <p className="text-sm text-slate-500 mt-2">
                        Try changing your search or status filter.
                      </p>
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        )}

        {/* Table Footer */}
        {!loading && (
          <div className="border-t border-slate-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              Showing {filteredOrders.length} of {orders.length} orders
            </p>

            <p>PhoneStore Administration</p>
          </div>
        )}

      </div>

      {/* Loading Details */}
      {detailsLoading && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700 mt-4">
              Loading order details...
            </p>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selected && (

        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 z-50"
          onClick={() => {
            if (!actionLoading) setSelected(null);
          }}
        >

          <div
            className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-slate-950 to-blue-900 text-white p-5 sm:p-7 rounded-t-2xl sm:rounded-t-3xl">

              <div className="flex justify-between items-start gap-4">

                <div>
                  <p className="text-xs text-blue-200 uppercase tracking-wider font-bold">
                    Order Details
                  </p>

                  <h2 className="text-2xl font-extrabold mt-2">
                    #{selected.order_number}
                  </h2>

                  <p className="text-sm text-blue-200 mt-2">
                    {formatDate(selected.created_at)}
                  </p>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  disabled={actionLoading}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition-colors disabled:opacity-50"
                  aria-label="Close order details"
                >
                  ×
                </button>

              </div>

              <div className="mt-5">
                <span
                  className={`inline-flex text-xs font-bold px-3 py-2 rounded-full ${
                    STATUS_COLORS[selected.status] ||
                    "bg-white/10 text-white"
                  }`}
                >
                  {STATUS_LABELS[selected.status] || selected.status}
                </span>
              </div>

            </div>

            <div className="p-5 sm:p-7 space-y-7">

              {/* Action Error */}
              {actionError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                  {actionError}
                </div>
              )}

              {/* Customer Information */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-xl">👤</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Customer Information
                    </h3>
                    <p className="text-xs text-slate-500">
                      Order contact and delivery details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-2xl p-5">

                  <Info label="Customer Name" value={selected.customer_name} />
                  <Info label="Phone Number" value={selected.customer_phone} />
                  <Info label="Email Address" value={selected.customer_email} />
                  <Info label="Shipping Address" value={selected.shipping_address} />

                </div>
              </section>

              {/* Ordered Items */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <span className="text-xl">📱</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Ordered Products
                    </h3>
                    <p className="text-xs text-slate-500">
                      Items included in this order
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">

                  {selected.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b last:border-b-0 border-slate-100"
                    >

                      <div>
                        <p className="font-bold text-slate-900">
                          {item.product_name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          {item.variant_label} × {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold text-blue-700 whitespace-nowrap">
                        {formatPrice(item.line_total)}
                      </p>

                    </div>
                  ))}

                  <div className="bg-slate-50 p-5 flex justify-between items-center">
                    <span className="font-bold text-slate-700">
                      Order Total
                    </span>

                    <span className="text-xl font-extrabold text-blue-700">
                      {formatPrice(selected.total)}
                    </span>
                  </div>

                </div>
              </section>

              {/* Payment Proofs */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <span className="text-xl">💳</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Payment Verification
                    </h3>
                    <p className="text-xs text-slate-500">
                      Review submitted transaction information
                    </p>
                  </div>
                </div>

                {selected.payments.length === 0 ? (

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                    <span className="text-3xl">📄</span>

                    <p className="font-semibold text-slate-700 mt-3">
                      No payment proofs uploaded
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      The customer has not submitted payment information yet.
                    </p>
                  </div>

                ) : (

                  <div className="space-y-4">

                    {selected.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="border border-slate-200 rounded-2xl p-4 sm:p-5"
                      >

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                          <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                              Transaction Reference
                            </p>

                            <p className="font-bold text-slate-900 mt-1 break-all">
                              {payment.transaction_ref}
                            </p>
                          </div>

                          {payment.is_verified ? (
                            <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-2 rounded-full self-start">
                              <span>✓</span>
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-2 rounded-full self-start">
                              <span>◷</span>
                              Pending Review
                            </span>
                          )}

                        </div>

                        {/* Payment Screenshot */}
                        <div className="mt-4">

                          <p className="text-xs text-slate-500 font-semibold mb-2">
                            Payment Screenshot
                          </p>

                          <a
                            href={payment.screenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <span>🖼️</span>
                            Open Payment Screenshot ↗
                          </a>

                        </div>

                        {/* Verify Payment */}
                        {!payment.is_verified && (
                          <button
                            onClick={() => verify(selected.id, payment.id)}
                            disabled={actionLoading}
                            className="mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
                          >
                            {actionLoading ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <span>✓</span>
                                Verify & Confirm Order
                              </>
                            )}
                          </button>
                        )}

                      </div>
                    ))}

                  </div>

                )}

              </section>

              {/* Update Order Status */}
              <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚙️</span>

                  <div>
                    <h3 className="font-extrabold text-blue-950">
                      Update Order Status
                    </h3>

                    <p className="text-xs text-blue-700 mt-1">
                      Change the current processing or delivery status.
                    </p>
                  </div>
                </div>

                <select
                  className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                  value={selected.status}
                  disabled={actionLoading}
                  onChange={(e) =>
                    changeStatus(selected.id, e.target.value as OrderStatus)
                  }
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>

                {actionLoading && (
                  <p className="text-xs text-blue-700 mt-3">
                    Updating order information...
                  </p>
                )}

              </section>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  onClick={() => setSelected(null)}
                  disabled={actionLoading}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        </div>

      )}

    </div>
  );
}

function Stat({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">

      <div className="flex items-center justify-between gap-3">

        <div>
          <p className="text-sm font-semibold text-slate-500">
            {label}
          </p>

          <p className="text-3xl font-extrabold text-slate-900 mt-3">
            {value}
          </p>
        </div>

        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
        {label}
      </p>

      <p className="text-sm font-semibold text-slate-800 mt-1 break-words">
        {value || "Not provided"}
      </p>
    </div>
  );
}
