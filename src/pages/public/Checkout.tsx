import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { createOrder, uploadPaymentProof, initiateChapaPayment } from "../../api/orders";
import { formatPrice } from "../../lib/format";

export function Checkout() {
  const { items, subtotal, clear } = useCartStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<"info" | "payment">("info");
  const [paymentMethod, setPaymentMethod] = useState<"offline" | "chapa">("offline");
  
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
          <h1 className="text-2xl font-extrabold text-slate-900">Your cart is empty</h1>
          <p className="text-slate-500 text-sm mt-3 mb-7">Add some phones to your cart before proceeding to checkout.</p>
          <Link to="/phones" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3 rounded-xl transition-colors">
            Browse phones →
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const submitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      const currentTotal = subtotal();
      const order = await createOrder({
        ...form,
        payment_method: paymentMethod,
        items: items.map((item) => ({ variant_id: item.variantId, quantity: item.quantity })),
      });

      setOrderId(order.id);
      setOrderNumber(order.order_number);
      setOrderTotal(currentTotal);
      setStep("payment");
      clear();
    } catch (err: any) {
      const msg = err?.response?.data;
      if (typeof msg === "string") setError(msg);
      else if (msg && typeof msg === "object") {
        setError(Object.entries(msg).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`).join(" | "));
      } else setError("Unable to place your order. Please try again.");
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
      await uploadPaymentProof(orderId, { transaction_ref: ref.trim(), screenshot: file });
      navigate("/track?success=1&order=" + encodeURIComponent(orderNumber));
    } catch (err: any) {
      const responseData = err?.response?.data;
      if (typeof responseData === "string") setError(responseData);
      else if (responseData && typeof responseData === "object") setError(Object.values(responseData).flat().map(String).join(" "));
      else setError("Payment proof upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChapaRedirect = async () => {
    if (!orderId) return;
    setSubmitting(true);
    setError("");
    try {
      const { checkout_url } = await initiateChapaPayment(orderId);
      // In real life, this redirects to Chapa. 
      // For testing, we open it in a new tab and show a message.
      window.open(checkout_url, "_blank");
      // You can also redirect the current window: window.location.href = checkout_url;
      // For now, let's just mark it as paid for the mock flow:
      navigate("/track?success=1&order=" + encodeURIComponent(orderNumber) + "&chapa=1");
    } catch (err) {
      setError("Could not initiate Chapa payment.");
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
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-white transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-white">Checkout</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {step === "info" ? "Complete Your Order" : "Complete Your Payment"}
          </h1>
          <p className="text-blue-100 mt-3">
            {step === "info" ? "Enter your delivery information to place your order." : `Payment details for order ${orderNumber}`}
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
                <p className="text-sm font-bold text-slate-900">Delivery Details</p>
                <p className="text-xs text-slate-500">Your information</p>
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 rounded-full ${step === "payment" ? "bg-blue-600" : "bg-slate-200"}`} />
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step === "payment" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-200 text-slate-500"}`}>2</div>
              <div>
                <p className={`text-sm font-bold ${step === "payment" ? "text-slate-900" : "text-slate-400"}`}>Payment</p>
                <p className="text-xs text-slate-500">Verify your payment</p>
              </div>
            </div>
          </div>
        </div>

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
              
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0" /></svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Customer Information</h2>
                      <p className="text-sm text-slate-500">Tell us where to deliver your order.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input required type="text" name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Enter your full name" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                        <input required type="email" name="customer_email" value={form.customer_email} onChange={handleChange} placeholder="example@email.com" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                        <input required type="tel" name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="Enter your phone number" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Shipping Address <span className="text-red-500">*</span></label>
                      <textarea required rows={3} name="shipping_address" value={form.shipping_address} onChange={handleChange} placeholder="Enter your city, area, street and delivery details..." className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-y" />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`cursor-pointer border rounded-xl p-4 flex items-start gap-3 transition-all ${paymentMethod === "offline" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20" : "border-slate-200 hover:border-blue-300"}`}>
                      <input type="radio" name="payment" value="offline" checked={paymentMethod === "offline"} onChange={() => setPaymentMethod("offline")} className="mt-1" />
                      <div>
                        <p className="font-bold text-slate-900">Bank / Telebirr</p>
                        <p className="text-sm text-slate-500 mt-1">Pay offline and upload your receipt.</p>
                      </div>
                    </label>
                    <label className={`cursor-pointer border rounded-xl p-4 flex items-start gap-3 transition-all ${paymentMethod === "chapa" ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/20" : "border-slate-200 hover:border-blue-300"}`}>
                      <input type="radio" name="payment" value="chapa" checked={paymentMethod === "chapa"} onChange={() => setPaymentMethod("chapa")} className="mt-1" />
                      <div>
                        <p className="font-bold text-slate-900">Chapa Online</p>
                        <p className="text-sm text-slate-500 mt-1">Pay instantly via Chapa (Test Mode).</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6 lg:sticky lg:top-6">
                <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
                <p className="text-sm text-slate-500 mt-1">{items.length} {items.length === 1 ? "product" : "products"} in your cart</p>
                <div className="border-t border-slate-100 my-5" />
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3">
                      <div className="w-16 h-16 shrink-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex items-center justify-center">
                        {item.image ? <img src={item.image} alt={item.productName} className="w-full h-full object-contain p-1" /> : <span className="text-2xl">📱</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 truncate">{item.productName}</p>
                        <p className="text-xs text-slate-500 mt-1">{item.variantLabel}</p>
                        <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-900 whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 my-5" />
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal())}</span>
                </div>
                <div className="border-t border-dashed border-slate-200 pt-4 mb-6 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-extrabold text-blue-700">{formatPrice(subtotal())}</span>
                </div>
                <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                  {submitting ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing your order...</> : <>Place Order <span className="text-xl">→</span></>}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 flex gap-4">
              <div className="w-12 h-12 shrink-0 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h2 className="font-bold text-emerald-900 text-lg">Order created successfully!</h2>
                <p className="text-sm text-emerald-800 mt-1">Your order number is <strong>{orderNumber}</strong>. Complete the payment below to submit your order.</p>
              </div>
            </div>

            {/* CHAPA PAYMENT UI */}
            {paymentMethod === "chapa" ? (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 text-center">
                 <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M7 15h2m4 0h2M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Pay with Chapa</h2>
                 <p className="text-slate-500 mb-6">You will be redirected to Chapa's secure checkout page to complete your payment of <strong>{formatPrice(orderTotal)}</strong>.</p>
                 <button onClick={handleChapaRedirect} disabled={submitting} className="w-full bg-[#00A859] hover:bg-[#008f4b] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                    {submitting ? "Opening Chapa..." : `Pay ${formatPrice(orderTotal)} with Chapa`}
                 </button>
                 <p className="text-xs text-slate-400 mt-4">Test Mode: Use Chapa's test phone numbers like <strong>0900123456</strong> [citation:6]</p>
              </div>
            ) : (
              /* OFFLINE PAYMENT UI */
              <>
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 10h18M7 15h2m4 0h2M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Payment Details</h2>
                      <p className="text-sm text-slate-500">Transfer to any of the accounts below.</p>
                    </div>
                  </div>
                  
                  {/* Bank Account */}
                  <div className="bg-gradient-to-br from-blue-950 to-blue-800 text-white rounded-2xl p-5 sm:p-6 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-blue-200 text-xs uppercase tracking-wider">Bank Transfer (CBE)</p>
                        <p className="text-2xl font-extrabold mt-1">{formatPrice(orderTotal)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">🏦</div>
                    </div>
                    <div className="space-y-3 border-t border-white/20 pt-4 text-sm">
                      <div className="flex justify-between gap-3"><span className="text-blue-200">Account Number</span><span className="font-bold tracking-wider">1000123456789</span></div>
                      <div className="flex justify-between gap-3"><span className="text-blue-200">Account Name</span><span className="font-bold">PhoneStore</span></div>
                    </div>
                  </div>

                  {/* Telebirr Account */}
                  <div className="bg-emerald-900 text-white rounded-2xl p-5 sm:p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-emerald-200 text-xs uppercase tracking-wider">Telebirr</p>
                        <p className="text-2xl font-extrabold mt-1">{formatPrice(orderTotal)}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">📱</div>
                    </div>
                    <div className="space-y-3 border-t border-white/20 pt-4 text-sm">
                      <div className="flex justify-between gap-3"><span className="text-emerald-200">Phone Number</span><span className="font-bold tracking-wider">0912345678</span></div>
                      <div className="flex justify-between gap-3"><span className="text-emerald-200">Account Name</span><span className="font-bold">PhoneStore</span></div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <p className="font-bold text-amber-900 text-sm mb-1">Order Number: {orderNumber}</p>
                    <p className="text-sm text-amber-800">Use this order number as the payment reference.</p>
                  </div>
                </div>

                <form onSubmit={submitPayment} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">Upload Payment Screenshot</h2>
                      <p className="text-sm text-slate-500">Upload the screenshot of your transfer for the seller to verify.</p>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Transaction Reference <span className="text-red-500">*</span></label>
                      <input required type="text" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Enter your bank/telebirr transaction reference" className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Payment Screenshot <span className="text-red-500">*</span></label>
                      <label className="block cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/50 rounded-2xl p-6 text-center transition-all">
                        <input required type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                        <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 16V4m0 0L7 9m5-5l5 5M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" /></svg>
                        </div>
                        <p className="font-semibold text-slate-800">{file ? file.name : "Click to upload payment screenshot"}</p>
                        <p className="text-xs text-slate-400 mt-2">PNG, JPG or WEBP</p>
                      </label>
                      {file && (
                        <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                          <div className="flex items-center gap-2 min-w-0"><span className="text-emerald-600">✓</span><span className="text-sm text-emerald-800 truncate">{file.name}</span></div>
                          <button type="button" onClick={() => setFile(null)} className="text-sm text-red-600 hover:text-red-700 font-semibold ml-3">Remove</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-slate-100 mt-7 pt-6">
                    <button type="submit" disabled={submitting || !file || !ref.trim()} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                      {submitting ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading payment proof...</> : <>Submit Payment Proof <span className="text-xl">→</span></>}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}