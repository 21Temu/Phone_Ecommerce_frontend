import { useMemo, useState } from "react";
import type { PhoneDetail, PhoneVariant } from "../../types";
import { formatPrice } from "../../lib/format";

interface Props {
  phone: PhoneDetail;
  onAdd: (variant: PhoneVariant) => void;
}

export function VariantSelector({ phone, onAdd }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(phone.variants[0]?.id ?? null);
  const selected = useMemo(
    () => phone.variants.find((v) => v.id === selectedId) ?? null,
    [selectedId, phone.variants]
  );

  const storages = Array.from(new Set(phone.variants.map((v) => v.storage_gb))).sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      <div>
        <p className="label">Storage</p>
        <div className="flex flex-wrap gap-2">
          {storages.map((gb) => {
            const has = phone.variants.some((v) => v.storage_gb === gb && v.id === selectedId);
            const variantWithGb = phone.variants.find((v) => v.storage_gb === gb && v.in_stock) ||
              phone.variants.find((v) => v.storage_gb === gb);
            return (
              <button
                key={gb}
                onClick={() => variantWithGb && setSelectedId(variantWithGb.id)}
                className={`px-3 py-1.5 rounded-lg border text-sm ${
                  has ? "border-brand-600 bg-brand-50 text-brand-700" : "border-gray-300"
                } ${!variantWithGb?.in_stock ? "opacity-50" : ""}`}
              >
                {gb} GB
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="label">Variants</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {phone.variants.map((v) => {
            const isSel = v.id === selectedId;
            return (
              <button
                key={v.id}
                disabled={!v.in_stock}
                onClick={() => setSelectedId(v.id)}
                className={`p-3 border rounded-lg text-left text-sm ${
                  isSel ? "border-brand-600 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                } ${!v.in_stock ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="flex justify-between">
                  <span className="font-medium">{v.color}</span>
                  <span className="text-brand-600">{formatPrice(v.price)}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {v.storage_gb}GB{v.ram_gb ? ` · ${v.ram_gb}GB RAM` : ""} · {v.in_stock ? `${v.stock} in stock` : "Out of stock"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        disabled={!selected || !selected.in_stock}
        onClick={() => selected && onAdd(selected)}
        className="btn-primary w-full"
      >
        {selected && !selected.in_stock ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}