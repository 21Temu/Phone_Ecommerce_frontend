
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { trackOrder } from "../../api/orders";
import type { Order } from "../../types";
import {
  formatDate,
  formatPrice,
  STATUS_COLORS,
  STATUS_LABELS,
} from "../../lib/format";

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

    if (loading) return;

    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const result = await trackOrder(orderNumber.trim(), email.trim());
      setOrder(result);
    } catch {
      setError(
        "We couldn't find your order. Please check your order number and email address."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const number = params.get("order");

    if (number) {
      setOrderNumber(number);
    }
  }, [params]);

  const getStatusStep = (status: string) => {
    const normalized = status.toUpperCase();

    if (["DELIVERED", "COMPLETED"].includes(normalized)) return 4;
    if (["SHIPPED", "OUT_FOR_DELIVERY"].includes(normalized)) return 3;
    if (["PROCESSING", "CONFIRMED", "PAID"].includes(normalized)) return 2;
    if (["PENDING", "PAYMENT_PENDING", "AWAITING_PAYMENT", "PAYMENT_SUBMITTED"].includes(normalized)) return 1;

    return 0;
  };

  const statusSteps = [
    {
      title: "Order Placed",
      description: "Your order has been received.",
      icon: "🛒",
    },
    {
      title: "Processing",
      description: "Your order is being prepared.",
      icon: "📦",
    },
    {
      title: "Shipped",
      description: "Your phone is on its way.",
      icon: "🚚",
    },
    {
      title: "Delivered",
      description: "Your order has arrived.",
      icon: "✓",
    },
  ];

  const status = order ? order.status.toUpperCase() : "";
  const currentStep = order ? getStatusStep(status) : 0;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">

          <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Track Order</span>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm text-blue-100 mb-5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Order tracking
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Track Your Order
            </h1>

            <p className="text-blue-100 mt-4 text-base sm:text-lg leading-relaxed">
              Stay updated on your purchase. Enter your order number and email
              to see the latest information about your delivery.
            </p>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Payment Success Message */}
        {success && (
          <div className="mb-7 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-11 h-11 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div>
              <h2 className="font-bold text-emerald-900">
                Payment proof submitted successfully!
              </h2>
              <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                We received your payment information. Your payment is awaiting
                verification. You can use the tracking form below to check your
                order status.
              </p>
            </div>
          </div>
        )}

        {/* Search Section */}
        <div className="max-w-3xl mx-auto">

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="p-5 sm:p-7 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                    <path strokeLinecap="round" strokeWidth="1.8" d="M16 16l5 5" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Find Your Order
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Enter your order information below.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={lookup} className="p-5 sm:p-7 space-y-5">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Order Number
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    #
                  </span>

                  <input
                    required
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter your order number"
                    className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email used during checkout"
                  autoComplete="email"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !orderNumber.trim() || !email.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching for your order...
                  </>
                ) : (
                  <>
                    Track My Order
                    <span className="text-xl">→</span>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-slate-400">
                Your order number and email must match your checkout information.
              </p>

            </form>
          </div>

        </div>

        {/* Order Results */}
        {order && (
          <div className="max-w-4xl mx-auto mt-10 space-y-6">

            {/* Order Overview */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Order Number
                  </p>

                  <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                    #{order.order_number}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-sm text-slate-500 mb-2">
                    Current Status
                  </p>

                  <span
                    className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full ${
                      STATUS_COLORS[order.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

              </div>

              <div className="border-t border-slate-100 mt-6 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Order Reference
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    #{order.order_number}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    Order Date
                  </p>
                  <p className="font-semibold text-slate-800 mt-1">
                    {formatDate(order.created_at)}
                  </p>
                </div>

              </div>
            </div>

            {/* Order Progress */}
            {currentStep > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">

                <h2 className="text-xl font-bold text-slate-900">
                  Order Progress
                </h2>

                <p className="text-sm text-slate-500 mt-1 mb-8">
                  Follow the progress of your purchase.
                </p>

                <div className="relative">
                  <div className="absolute left-5 sm:left-6 top-6 bottom-6 w-0.5 bg-slate-200" />

                  <div
                    className="absolute left-5 sm:left-6 top-6 w-0.5 bg-emerald-500 transition-all"
                    style={{
                      height: `${Math.max(0, (currentStep - 1) / 3) * 100}%`,
                    }}
                  />

                  <div className="relative space-y-7">
                    {statusSteps.map((item, index) => {
                      const completed = index + 1 <= currentStep;

                      return (
                        <div key={item.title} className="flex items-center gap-4">

                          <div
                            className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full flex items-center justify-center z-10 border-4 border-white ${
                              completed
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {completed ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span>{item.icon}</span>
                            )}
                          </div>

                          <div>
                            <p className={`font-bold ${
                              completed ? "text-slate-900" : "text-slate-400"
                            }`}>
                              {item.title}
                            </p>

                            <p className="text-xs text-slate-500 mt-1">
                              {item.description}
                            </p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* Payment or Exceptional Status */}
            {[
              "PENDING",
              "PAYMENT_PENDING",
              "AWAITING_PAYMENT",
              "PAYMENT_SUBMITTED",
              "CANCELLED",
              "REJECTED",
            ].includes(status) && (
              <div className={`rounded-2xl border p-5 ${
                ["CANCELLED", "REJECTED"].includes(status)
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}>
                <h3 className={`font-bold ${
                  ["CANCELLED", "REJECTED"].includes(status)
                    ? "text-red-900"
                    : "text-amber-900"
                }`}>
                  {status === "PAYMENT_SUBMITTED"
                    ? "Payment proof submitted"
                    : status === "CANCELLED" || status === "REJECTED"
                    ? "Order needs attention"
                    : "Waiting for payment"}
                </h3>

                <p className={`text-sm mt-1 ${
                  ["CANCELLED", "REJECTED"].includes(status)
                    ? "text-red-800"
                    : "text-amber-800"
                }`}>
                  {status === "PAYMENT_SUBMITTED"
                    ? "Your payment proof has been received and is awaiting verification."
                    : status === "CANCELLED" || status === "REJECTED"
                    ? "Please contact customer support for more information about this order."
                    : "Complete your payment and submit the payment proof to continue processing your order."}
                </p>
              </div>
            )}

            {/* Ordered Products */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              <div className="p-5 sm:p-7 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  Ordered Products
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Products included in this order.
                </p>
              </div>

              <div className="p-5 sm:p-7 space-y-5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900">
                        {item.product_name}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-bold text-slate-900 whitespace-nowrap">
                      {formatPrice(item.line_total)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 border-t border-slate-100 p-5 sm:p-7">

                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-lg">
                    Order Total
                  </span>

                  <span className="text-2xl font-extrabold text-blue-700">
                    {formatPrice(order.total)}
                  </span>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setOrder(null);
                  setError("");
                }}
                className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
              >
                ← Track another order
              </button>

              <Link
                to="/phones"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors"
              >
                Continue Shopping →
              </Link>
            </div>

          </div>
        )}

        {/* Help Section */}
        {!order && (
          <div className="max-w-3xl mx-auto mt-8 bg-white border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-11 h-11 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Need help with your order?
              </h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                Make sure you enter the same email address used when placing
                your order. If you still cannot find it, contact our support
                team.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
