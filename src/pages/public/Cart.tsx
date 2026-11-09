import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../lib/format";
import { Empty } from "../../components/ui/Empty";

export function Cart() {
  const { items, remove, setQty, subtotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Empty message="Your cart is empty." />
        <div className="text-center">
          <Link to="/phones" className="btn-primary">Browse phones</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your cart</h1>
      <div className="space-y-3">
        {items.map((i) => (
          <div key={i.variantId} className="card p-4 flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
              {i.image ? <img src={i.image} alt="" className="w-full h-full object-cover" /> : null}
            </div>
            <div className="flex-1">
              <p className="font-medium">{i.productName}</p>
              <p className="text-sm text-gray-500">{i.variantLabel}</p>
              <p className="text-brand-600 font-semibold">{formatPrice(i.price)}</p>
            </div>
            <input
              type="number"
              min={1}
              max={i.stock}
              value={i.quantity}
              onChange={(e) => setQty(i.variantId, parseInt(e.target.value || "1"))}
              className="input w-20"
            />
            <button onClick={() => remove(i.variantId)} className="text-red-600 text-sm hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="card p-4 mt-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Subtotal</p>
          <p className="text-2xl font-bold">{formatPrice(subtotal())}</p>
        </div>
        <button onClick={() => navigate("/checkout")} className="btn-primary">
          Checkout →
        </button>
      </div>
    </div>
  );
}