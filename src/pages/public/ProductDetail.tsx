import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPhone } from "../../api/catalog";
import type { PhoneDetail as PhoneDetailType, PhoneVariant } from "../../types";
import { formatPrice } from "../../lib/format";
import { VariantSelector } from "../../components/product/VariantSelector";
import { useCartStore } from "../../store/cartStore";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [phone, setPhone] = useState<PhoneDetailType | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [error, setError] = useState("");
  const add = useCartStore((s) => s.add);

  useEffect(() => {
    if (!slug) return;
    fetchPhone(slug)
      .then(setPhone)
      .catch(() => setError("Phone not found."));
  }, [slug]);

  const handleAdd = (v: PhoneVariant) => {
    if (!phone) return;
    add({
      variantId: v.id,
      phoneId: phone.id,
      phoneSlug: phone.slug,
      productName: `${phone.brand.name} ${phone.name}`,
      variantLabel: `${v.color} · ${v.storage_gb}GB${v.ram_gb ? ` · ${v.ram_gb}GB` : ""}`,
      color: v.color,
      storage_gb: v.storage_gb,
      ram_gb: v.ram_gb,
      price: parseFloat(v.price),
      quantity: 1,
      stock: v.stock,
      image: phone.images[activeImg]?.image ?? null,
    });
  };

  if (error) return <div className="max-w-3xl mx-auto p-8 text-red-600">{error}</div>;
  if (!phone) return <div className="max-w-3xl mx-auto p-8">Loading…</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/phones" className="text-sm text-gray-500 hover:underline">← Back to phones</Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {phone.images[activeImg] ? (
              <img src={phone.images[activeImg].image} alt={phone.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">📱</div>
            )}
          </div>
          {phone.images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {phone.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded border-2 overflow-hidden ${
                    i === activeImg ? "border-brand-600" : "border-transparent"
                  }`}
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">{phone.brand.name}</p>
          <h1 className="text-2xl font-bold">{phone.name}</h1>
          <span className="inline-block text-xs px-2 py-0.5 rounded bg-gray-100 capitalize mt-1">
            {phone.condition}
          </span>

          <p className="text-2xl font-bold text-brand-600 mt-4">
            {phone.min_price ? formatPrice(phone.min_price) : "—"}
          </p>

          <div className="mt-6">
            <VariantSelector phone={phone} onAdd={handleAdd} />
          </div>

          {phone.description && (
            <div className="mt-8">
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{phone.description}</p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {phone.screen_size && <Spec label="Screen" value={`${phone.screen_size}"`} />}
            {phone.battery_mah && <Spec label="Battery" value={`${phone.battery_mah} mAh`} />}
            {phone.camera_mp && <Spec label="Camera" value={`${phone.camera_mp} MP`} />}
            {phone.os && <Spec label="OS" value={phone.os} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="border rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}