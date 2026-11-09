import { Link } from "react-router-dom";
import type { PhoneListItem } from "../../types";
import { formatPrice } from "../../lib/format";

export function PhoneCard({ phone }: { phone: PhoneListItem }) {
  return (
    <Link
      to={`/phones/${phone.slug}`}
      className="card overflow-hidden hover:shadow-md transition group"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {phone.primary_image ? (
          <img
            src={phone.primary_image}
            alt={phone.name}
            className="w-full h-full object-cover group-hover:scale-105 transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
            📱
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-500">{phone.brand.name}</p>
        <p className="font-medium truncate">{phone.name}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-brand-600 font-semibold">
            {phone.min_price ? formatPrice(phone.min_price) : "Out of stock"}
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 capitalize">
            {phone.condition}
          </span>
        </div>
      </div>
    </Link>
  );
}