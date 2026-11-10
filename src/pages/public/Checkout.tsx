
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { createOrder, uploadPaymentProof } from "../../api/orders";
import { formatPrice } from "../../lib/format";

export function Checkout() {
  const { items, subtotal, clear } = useCartStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<"info" | "payment">("info");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTotal, setOrderTotal] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    note: "",
  });

  const [ref, setRef] = useState("");
  const [file, setFile] = useState<File | null>(null);

  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">🛒</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            Your cart is empty
          </h1>

          <p className="text-slate-500 text-sm mt-3 mb-7">
            Add some phones to your cart before proceeding to checkout.
          </p>

          <Link
            to="/phones"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors"
          >
            Browse phones →
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submitInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    setError("");
    setSubmitting(true);

    try {
      // Save the total before clearing the cart.
      const currentTotal = subtotal();

      const order = await createOrder({
        ...form,
        items: items.map((item) => ({
          variant_id: item.variantId,
          quantity: item.quantity,
        })),
      });

      setOrderId(order.id);
      setOrderNumber(order.order_number);
      setOrderTotal(currentTotal);

      // Move to payment step.
      setStep("payment");

      // Clear cart only after order creation succeeds.
      clear();

    } catch (err: any) {
      const msg = err?.response?.data;

      if (typeof msg === "string") {
        setError(msg);
      } else if (msg && typeof msg === "object") {
        setError(
          Object.entries(msg)
            .map(([key, value]) => {
              const message = Array.isArray(value)
                ? value.join(", ")
                : String(value);

              return `${key}: ${message}`;
            })
            .join(" | ")
        );
      } else {
        setError("Unable to place your order. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitting) return;

    if (!orderId || !file || !ref.trim()) {
      setError("Transaction reference and payment screenshot are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await uploadPaymentProof(orderId, {
        transaction_ref: ref.trim(),
        screenshot: file,
      });

      navigate(
        "/track?success=1&order=" + encodeURIComponent(orderNumber)
      );

    } catch (err: any) {
      const responseData = err?.response?.data;

      if (typeof responseData === "string") {
        setError(responseData);
      } else if (responseData && typeof responseData === "object") {
        setError(
          Object.values(responseData)
            .flat()
            .map(String)
            .join(" ")
        );
      } else {
        setError("Payment proof upload failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

          <div className="flex items-center gap-2 text-sm text-blue-200 mb-4">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-white transition-colors">
              Cart
            </Link>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {step === "info" ? "Complete Your Order" : "Complete Your Payment"}
          </h1>

          <p className="text-blue-100 mt-3">
            {step === "info"
              ? "Enter your delivery information to place your order."
              : `Payment details for order ${orderNumber}`}
          </p>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Checkout Steps */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-600/20">
                {step === "payment" ? "✓" : "1"}
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Delivery Details
                </p>
                <p className="text-xs text-slate-500">Your information</p>
              </div>
            </div>

            <div className={`flex-1 h-1 mx-4 rounded-full ${
              step === "payment" ? "bg-blue-600" : "bg-slate-200"
            }`} />

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === "payment"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-slate-200 text-slate-500"
              }`}>
                2
              </div>

              <div>
                <p className={`text-sm font-bold ${
                  step === "payment" ? "text-slate-900" : "text-slate-400"
                }`}>
                  Payment
                </p>
                <p className="text-xs text-slate-500">Verify your payment</p>
              </div>
            </div>

          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <p className="text-sm leading-relaxed">{error}</p>
          </div>
        )}

        {/* Delivery Information Step */}
        {step === "info" && (
          <form onSubmit={submitInfo}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* Form */}
              <div className="lg:col-span-2 space-y-6">

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">

                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        Customer Information
                      </h2>
                      <p className="text-sm text-slate-500">
                        Tell us where to deliver your order.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>

                      <input
                        required
                        type="text"
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>

                        <input
                          required
                          type="email"
                          name="customer_email"
                          value={form.customer_email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                          autoComplete="email"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>

                        <input
                          required
                          type="tel"
                          name="customer_phone"
                          value={form.customer_phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          autoComplete="tel"
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                        />
                      </div>

                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Shipping Address <span className="text-red-500">*</span>
                      </label>

                      <textarea
                        required
                        rows={4}
                        name="shipping_address"
                        value={form.shipping_address}
                        onChange={handleChange}
                        placeholder="Enter your city, area, street and delivery details..."
                        autoComplete="street-address"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-y"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Additional Note
                        <span className="text-slate-400 font-normal"> (Optional)</span>
                      </label>

                      <textarea
                        rows={3}
                        name="note"
                        value={form.note}
                        onChange={handleChange}
                        placeholder="Any special delivery instructions?"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-y"
                      />
                    </div>

                  </div>
                </div>

                {/* Security Information */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4" />
                    </svg>
                  </div>

                  <div>
                    <h3 className="font-bold text-emerald-900">
                      Your information is protected
                    </h3>
                    <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                      Your delivery details are used to process and deliver your order.
                    </p>
                  </div>
                </div>

              </div>

              {/* Order Summary */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-6">

                <h2 className="text-xl font-bold text-slate-900">
                  Order Summary
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {items.length} {items.length === 1 ? "product" : "products"} in your cart
                </p>

                <div className="border-t border-slate-100 my-5" />

                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3">
                      <div className="w-16 h-16 shrink-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-2xl">📱</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.variantLabel}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-slate-900 whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 my-5" />

                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {formatPrice(subtotal())}
                  </span>
                </div>

                <div className="flex justify-between text-sm mb-4">
                  <span className="text-slate-500">Delivery</span>
                  <span className="text-emerald-600 font-semibold">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-200 pt-4 mb-6 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-extrabold text-blue-700">
                    {formatPrice(subtotal())}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing your order...
                    </>
                  ) : (
                    <>
                      Place Order
                      <span className="text-xl">→</span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4">
                  You will proceed to payment after placing your order.
                </p>

              </div>
            </div>
          </form>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="max-w-3xl mx-auto">

            {/* Order Created */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h2 className="font-bold text-emerald-900 text-lg">
                  Order created successfully!
                </h2>
                <p className="text-sm text-emerald-800 mt-1">
                  Your order number is <strong>{orderNumber}</strong>. Complete the payment below to submit your order for verification.
                </p>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 mb-6">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M7 15h2m4 0h2M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Bank Transfer Details
                  </h2>
                  <p className="text-sm text-slate-500">
                    Use the account details below to make your payment.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-950 to-blue-800 text-white rounded-2xl p-5 sm:p-6 mb-6">

                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-blue-200 text-xs uppercase tracking-wider">
                      Payment Amount
                    </p>
                    <p className="text-3xl font-extrabold mt-2">
                      {formatPrice(orderTotal)}
                    </p>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">
                    🏦
                  </div>
                </div>

                <div className="space-y-4 border-t border-white/20 pt-5">

                  <div className="flex justify-between gap-3">
                    <span className="text-blue-200 text-sm">Bank</span>
                    <span className="font-bold">CBE</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-blue-200 text-sm">Account Number</span>
                    <span className="font-bold tracking-wider">
                      1000123456789
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-blue-200 text-sm">Account Name</span>
                    <span className="font-bold">PhoneStore</span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-blue-200 text-sm">Order Number</span>
                    <span className="font-bold">{orderNumber}</span>
                  </div>

                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-xl">💡</span>
                  <div>
                    <p className="font-bold text-amber-900 text-sm">
                      Important payment instructions
                    </p>
                    <ul className="text-sm text-amber-800 mt-2 space-y-1 list-disc pl-4">
                      <li>Transfer the exact amount shown above.</li>
                      <li>Keep your transaction reference number.</li>
                      <li>Take a clear screenshot of your successful transfer.</li>
                      <li>Upload the screenshot using the form below.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>

            {/* Payment Proof Form */}
            <form onSubmit={submitPayment} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">

              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Submit Payment Proof
                  </h2>
                  <p className="text-sm text-slate-500">
                    Upload your transaction information.
                  </p>
                </div>
              </div>

              <div className="space-y-5">

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Transaction Reference
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    required
                    type="text"
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="Enter your bank transaction reference"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />

                  <p className="text-xs text-slate-400 mt-2">
                    Enter the reference number provided by your bank.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Payment Screenshot
                    <span className="text-red-500"> *</span>
                  </label>

                  <label className="block cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-6 text-center transition-all">

                    <input
                      required
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const selectedFile = e.target.files?.[0] ?? null;
                        setFile(selectedFile);
                      }}
                    />

                    <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" />
                      </svg>
                    </div>

                    <p className="font-semibold text-slate-800">
                      {file ? file.name : "Click to upload payment screenshot"}
                    </p>

                    <p className="text-xs text-slate-400 mt-2">
                      PNG, JPG or WEBP
                    </p>

                  </label>

                  {file && (
                    <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-emerald-600">✓</span>
                        <span className="text-sm text-emerald-800 truncate">
                          {file.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-sm text-red-600 hover:text-red-700 font-semibold ml-3"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

              </div>

              <div className="border-t border-slate-100 mt-7 pt-6">

                <div className="flex justify-between items-center mb-5">
                  <span className="text-slate-500 text-sm">Amount to pay</span>
                  <span className="text-2xl font-extrabold text-blue-700">
                    {formatPrice(orderTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !file || !ref.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading payment proof...
                    </>
                  ) : (
                    <>
                      Submit Payment Proof
                      <span className="text-xl">→</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-400 mt-4 leading-relaxed">
                  Your payment will be reviewed before your order is confirmed.
                </p>

              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
}
