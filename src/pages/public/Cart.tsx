
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import { Empty } from "../../components/ui/Empty";

export function Cart() {
  const { items, remove, setQty, subtotal } = useCartStore();
  const navigate = useNavigate();

  const handleQuantityChange = (variantId: number, value: string, stock: number) => {
    const quantity = Math.max(1, Math.min(stock, Number(value) || 1));
    setQty(variantId, quantity);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl text-center bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sm:p-12">
          <div className="w-24 h-24 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 7H6"
              />
              <circle cx="10" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
            Your cart is waiting!
          </h1>

          <p className="text-slate-500 leading-relaxed mb-8">
            You haven't added any phones yet. Explore our collection and find
            the perfect phone for your needs.
          </p>

          <Link
            to="/phones"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            Explore phones
            <span>→</span>
          </Link>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400">
              Quality phones · Secure shopping · Convenient delivery
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-white">Shopping Cart</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Your Shopping Cart
              </h1>

              <p className="text-blue-100 mt-3">
                Review your selected phones before checkout.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/15 rounded-2xl px-5 py-3 w-fit">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M3 3h2l2.4 12.4a2 2 0 002 1.6h8.8a2 2 0 002-1.6L22 7H6"
                  />
                  <circle cx="10" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                </svg>
              </div>

              <div>
                <p className="text-2xl font-bold">{items.length}</p>
                <p className="text-xs text-blue-100">
                  {items.length === 1 ? "Cart item" : "Cart items"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Product List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Cart Items
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage your selected phones
                </p>
              </div>

              <Link
                to="/phones"
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                + Add more phones
              </Link>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-36 sm:h-32 shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <span className="text-5xl">📱</span>
                      )}
                    </div>

                    {/* Product Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg leading-snug">
                            {item.productName}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1">
                            {item.variantLabel}
                          </p>
                        </div>

                        <p className="text-lg font-extrabold text-blue-700 whitespace-nowrap">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 mt-5">
                        {/* Quantity */}
                        <div>
                          <label
                            htmlFor={`quantity-${item.variantId}`}
                            className="block text-xs font-semibold text-slate-500 mb-2"
                          >
                            Quantity
                          </label>

                          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden w-fit">
                            <button
                              type="button"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                handleQuantityChange(
                                  item.variantId,
                                  String(item.quantity - 1),
                                  item.stock
                                )
                              }
                              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <input
                              id={`quantity-${item.variantId}`}
                              type="number"
                              min={1}
                              max={item.stock}
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.variantId,
                                  e.target.value,
                                  item.stock
                                )
                              }
                              className="w-12 h-9 text-center text-sm font-semibold text-slate-900 border-x border-slate-200 outline-none"
                            />

                            <button
                              type="button"
                              disabled={item.quantity >= item.stock}
                              onClick={() =>
                                handleQuantityChange(
                                  item.variantId,
                                  String(item.quantity + 1),
                                  item.stock
                                )
                              }
                              className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <p className="text-xs text-slate-400 mt-1">
                            {item.stock} available
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={() => remove(item.variantId)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.8"
                              d="M19 7l-.9 12.1a2 2 0 01-2 1.9H7.9a2 2 0 01-2-1.9L7 7m3 4v5m4-5v5M5 7h14M9 7V4h6v3"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/phones"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <span>←</span>
                Continue shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-slate-900">
                Order Summary
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Review your order total
              </p>

              <div className="border-t border-slate-100 my-5" />

              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-slate-500">Items</span>
                <span className="font-semibold text-slate-900">
                  {items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(subtotal())}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-slate-500">Delivery</span>
                <span className="font-semibold text-emerald-600">
                  Calculated at checkout
                </span>
              </div>

              <div className="border-t border-dashed border-slate-200 my-5" />

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-2xl font-extrabold text-blue-700">
                  {formatPrice(subtotal())}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-5 rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
              >
                Proceed to Checkout
                <span className="text-xl">→</span>
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-400">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11V7a3 3 0 00-6 0v4m-2 0h10v9H4v-9zm14-3l2 2 4-4"
                  />
                </svg>
                Secure checkout experience
              </div>

              <div className="mt-6 bg-blue-50 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Need help?
                    </p>
                    <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                      Review your phone models and selected variants before
                      completing your order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
