
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminDashboard } from "../../api/admin";
import type { AdminDashboard as D } from "../../types";
import { formatPrice } from "../../lib/format";

export function AdminDashboard() {
  const [data, setData] = useState<D | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    adminDashboard()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch(() => {
        if (mounted) {
          setError("Unable to load dashboard information. Please try again.");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-7">
        <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse" />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>

        <div className="h-64 bg-white border border-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-slate-900">
          Dashboard unavailable
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {error || "No dashboard data is available."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Orders",
      value: data.total_orders,
      icon: "📦",
      color: "bg-blue-50 text-blue-700",
      description: "All orders received",
    },
    {
      label: "Today's Orders",
      value: data.today_orders,
      icon: "📅",
      color: "bg-purple-50 text-purple-700",
      description: "Orders placed today",
    },
    {
      label: "Pending Payment",
      value: data.pending_payment,
      icon: "⏳",
      color: "bg-amber-50 text-amber-700",
      description: "Awaiting customer payment",
    },
    {
      label: "Payment Review",
      value: data.payment_review,
      icon: "🔍",
      color: "bg-orange-50 text-orange-700",
      description: "Awaiting payment verification",
    },
    {
      label: "Confirmed Orders",
      value: data.confirmed_orders,
      icon: "✓",
      color: "bg-emerald-50 text-emerald-700",
      description: "Successfully confirmed",
    },
  ];

  const outOfStock = data.low_stock.filter((item) => item.stock === 0).length;
  const lowStock = data.low_stock.length;

  return (
    <div className="min-h-screen space-y-8">

      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3 py-1.5 text-xs text-blue-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Administration Panel
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Dashboard Overview
            </h1>

            <p className="text-blue-100 mt-3 text-sm sm:text-base">
              Monitor your store performance, orders, payments and inventory.
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M3 3v18h18M8 16v-3m4 3V7m4 9v-6m4 6V5" />
            </svg>
          </div>

        </div>

      </div>

      {/* Revenue Highlight */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>
            <p className="text-sm font-semibold text-slate-500">
              Total Store Revenue
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              {formatPrice(data.revenue)}
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Revenue reported by your store dashboard.
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <svg className="w-9 h-9 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8c-2.2 0-4 1.1-4 2.5S9.8 13 12 13s4 1.1 4 2.5S14.2 18 12 18m0-10V6m0 14v-2m9-6a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

        </div>

      </div>

      {/* Statistics */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Store Statistics
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Your store's order and payment overview.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >

              <div className="flex items-start justify-between gap-3">

                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {stat.label}
                  </p>

                  <p className="text-3xl font-extrabold text-slate-900 mt-3">
                    {stat.value}
                  </p>

                  <p className="text-xs text-slate-400 mt-2">
                    {stat.description}
                  </p>
                </div>

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.color}`}>
                  {stat.icon}
                </div>

              </div>

            </div>
          ))}

        </div>
      </div>

      {/* Inventory Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="p-5 sm:p-6 border-b border-slate-100">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-extrabold text-slate-900">
                  Inventory Alerts
                </h2>

                {lowStock > 0 && (
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full">
                    {lowStock} Alerts
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-500 mt-1">
                Phone variants with stock of 5 or fewer.
              </p>
            </div>

            {outOfStock > 0 && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-600">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {outOfStock} Out of Stock
              </span>
            )}

          </div>

        </div>

        {data.low_stock.length === 0 ? (

          <div className="p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 className="font-bold text-slate-900">
              Inventory looks healthy!
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              All phone variants have more than 5 units in stock.
            </p>
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm text-left">

              <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4 font-bold">SKU</th>
                  <th className="px-5 py-4 font-bold">Phone</th>
                  <th className="px-5 py-4 font-bold">Stock Level</th>
                  <th className="px-5 py-4 font-bold">Availability</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {data.low_stock.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >

                    <td className="px-5 py-4">
                      <span className="font-mono font-semibold text-slate-700">
                        {item.sku}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800">
                        {item.phone__name}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        <span className={`font-extrabold ${
                          item.stock === 0
                            ? "text-red-600"
                            : "text-orange-600"
                        }`}>
                          {item.stock}
                        </span>

                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.stock === 0
                                ? "bg-red-500"
                                : "bg-orange-400"
                            }`}
                            style={{
                              width: `${Math.min(item.stock / 5, 1) * 100}%`,
                            }}
                          />
                        </div>

                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {item.stock === 0 ? (
                        <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                          Out of Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-xs font-bold">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                          Low Stock
                        </span>
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* Admin Quick Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💳</span>
            <h3 className="font-bold text-blue-950">
              Payment Reviews
            </h3>
          </div>

          <p className="text-sm text-blue-800 leading-relaxed">
            {data.payment_review > 0
              ? `You have ${data.payment_review} payment submission(s) awaiting review. Check the payment management page to review them.`
              : "There are currently no payment submissions awaiting review."}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📦</span>
            <h3 className="font-bold text-amber-950">
              Inventory Management
            </h3>
          </div>

          <p className="text-sm text-amber-800 leading-relaxed">
            {lowStock > 0
              ? `${lowStock} phone variant(s) have low stock. Consider updating your inventory.`
              : "All phone variants currently have healthy stock levels."}
          </p>
        </div>

      </div>

    </div>
  );
}
