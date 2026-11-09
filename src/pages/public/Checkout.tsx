import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { createOrder, uploadPaymentProof } from "../../api/orders";
import { formatPrice } from "../../lib/format";

export function Checkout() {
  const { items, subtotal, clear } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<"info" | "payment">("info");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>("");
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
    navigate("/cart");
    return null;
  }

  const submitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const order = await createOrder({
        ...form,
        items: items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      });
      setOrderId(order.id);
      setOrderNumber(order.order_number);
      setStep("payment");
      clear();
    } catch (err: any) {
      const msg = err?.response?.data;
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !file || !ref) {
      setError("Transaction reference and screenshot are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await uploadPaymentProof(orderId, { transaction_ref: ref, screenshot: file });
      navigate("/track?success=1&order=" + orderNumber);
    } catch (err: any) {
      setError("Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {step === "info" ? "Checkout" : `Pay for order ${orderNumber}`}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {step === "info" && (
        <form onSubmit={submitInfo} className="space-y-4">
          <div className="card p-4 space-y-3">
            <div>
              <label className="label">Full name</label>
              <input required className="input" value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Email</label>
                <input required type="email" className="input" value={form.customer_email}
                  onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input required className="input" value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="label">Shipping address</label>
              <textarea required rows={3} className="input" value={form.shipping_address}
                onChange={(e) => setForm({ ...form, shipping_address: e.target.value })} />
            </div>
            <div>
              <label className="label">Note (optional)</label>
              <textarea rows={2} className="input" value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>
          </div>

          <div className="card p-4">
            <div className="flex justify-between mb-2 text-sm">
              <span>Subtotal</span><span>{formatPrice(subtotal())}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span><span className="text-brand-600">{formatPrice(subtotal())}</span>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </form>
      )}

      {step === "payment" && (
        <form onSubmit={submitPayment} className="space-y-4">
          <div className="card p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              Transfer <strong>{formatPrice(subtotal())}</strong> to our account, then upload the
              screenshot below. We'll verify within 24 hours.
            </p>
            <p className="text-sm text-blue-900 mt-2">
              Bank: <strong>CBE</strong> · Account: <strong>1000123456789</strong> · Name: <strong>PhoneStore</strong>
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <div>
              <label className="label">Transaction reference</label>
              <input required className="input" value={ref} onChange={(e) => setRef(e.target.value)} />
            </div>
            <div>
              <label className="label">Screenshot</label>
              <input required type="file" accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="input" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Uploading…" : "Submit payment proof"}
          </button>
        </form>
      )}
    </div>
  );
}