
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../../api/orders";
import type { Order } from "../../types";
import {
  formatDate,
  formatPrice,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../../lib/format";
import { Empty } from "../../components/ui/Empty";

export function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    fetchMyOrders()
      .then((data) => {
        if (mounted) setOrders(data);
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load your orders. Please try again.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const totalSpent = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const totalItems = orders.reduce(
    (total, order) =>
      total +
      order.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0),
    0
  );

  const getStatusIcon = (status: string) => {
    const normalized = status.toUpperCase();

    if (["DELIVERED", "COMPLETED"].includes(normalized)) return "✓";
    if (["SHIPPED", "OUT_FOR_DELIVERY"].includes(normalized)) return "🚚";
    if (["CANCELLED", "REJECTED"].includes(normalized)) return "✕";
    if (["PROCESSING", "CONFIRMED", "PAID"].includes(normalized)) return "📦";

    return "◷";
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">My Orders</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm text-blue-100 mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Your shopping history
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                My Orders
              </h1>

              <p className="text-blue-100 mt-4 text-base sm:text-lg">
                Manage your purchases and follow your deliveries.
              </p>
            </div>

            <Link
              to="/phones"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Continue Shopping
              <span>→</span>
            </Link>

          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Loading State */}
        {loading ? (
          <div className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 bg-white rounded-2xl animate-pulse border border-slate-200"
                />
              ))}
            </div>

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse"
              >
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-1/4" />
              </div>
            ))}

          </div>
        ) : error ? (

          /* Error State */
          <div className="max-w-xl mx-auto bg-white border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Something went wrong
            </h2>

            <p className="text-slate-500 mt-2 text-sm">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>

        ) : orders.length === 0 ? (

          /* Empty State */
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-sm">

            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l2.4 12.2a2 2 0 002 1.6h8.9a2 2 0 002-1.6L22 7H6" />
                <circle cx="10" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
              </svg>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900">
              No orders yet
            </h2>

            <p className="text-slate-500 mt-3 leading-relaxed">
              Your shopping journey starts here. Explore our phones and find
              something you'll love.
            </p>

            <Link
              to="/phones"
              className="inline-flex items-center gap-2 mt-7 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
            >
              Explore Phones →
            </Link>

          </div>

        ) : (

          <>
            {/* Order Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Total Orders
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">
                      {orders.length}
                    </p>
                  </div>

                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Items Purchased
                    </p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-2">
                      {totalItems}
                    </p>
                  </div>

                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">🛍️</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Total Order Value
                    </p>
                    <p className="text-2xl font-extrabold text-blue-700 mt-2">
                      {formatPrice(totalSpent)}
                    </p>
                  </div>

                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Orders Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">
                  Your Purchases
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  You have {orders.length} order
                  {orders.length !== 1 ? "s" : ""}.
                </p>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-5">

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >

                  {/* Order Header */}
                  <div className="p-5 sm:p-6 border-b border-slate-100">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                            Order
                          </span>

                          <h3 className="font-extrabold text-lg text-slate-900">
                            #{order.order_number}
                          </h3>
                        </div>

                        <p className="text-sm text-slate-500 mt-2">
                          Placed on {formatDate(order.created_at)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-2 self-start sm:self-auto text-xs font-bold px-4 py-2 rounded-full ${
                          STATUS_COLORS[order.status] ||
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span>{getStatusIcon(order.status)}</span>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>

                    </div>

                  </div>

                  {/* Product Details */}
                  <div className="p-5 sm:p-6">

                    <div className="space-y-4">

                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3 min-w-0">

                            <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
                              <span className="text-xl">📱</span>
                            </div>

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800">
                                {item.product_name}
                              </p>

                              <p className="text-sm text-slate-500 mt-1">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                          </div>

                          <p className="font-bold text-slate-900 whitespace-nowrap">
                            {formatPrice(item.line_total)}
                          </p>

                        </div>
                      ))}

                    </div>

                    {/* Order Footer */}
                    <div className="border-t border-slate-100 mt-6 pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      <div>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                          Order Total
                        </p>

                        <p className="text-2xl font-extrabold text-blue-700 mt-1">
                          {formatPrice(order.total)}
                        </p>
                      </div>

                      <Link
                        to={`/track?order=${encodeURIComponent(order.order_number)}`}
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/10"
                      >
                        Track Order
                        <span>→</span>
                      </Link>

                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* Bottom Banner */}
            <div className="mt-9 bg-gradient-to-r from-slate-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">

              <div>
                <h3 className="text-xl font-bold">
                  Looking for your next upgrade?
                </h3>

                <p className="text-blue-200 text-sm mt-2">
                  Discover more smartphones in our collection.
                </p>
              </div>

              <Link
                to="/phones"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold px-6 py-3 rounded-xl transition-colors shrink-0"
              >
                Browse Phones →
              </Link>

            </div>

          </>
        )}

      </div>
    </div>
  );
}
