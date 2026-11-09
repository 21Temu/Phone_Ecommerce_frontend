import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBrands, fetchPhones, type PhoneQuery } from "../../api/catalog";
import type { Brand, PhoneListItem } from "../../types";
import { PhoneCard } from "../../components/product/PhoneCard";

const CONDITIONS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [phones, setPhones] = useState<PhoneListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const brand = searchParams.get("brand") ?? "";
  const condition = searchParams.get("condition") ?? "";
  const minPrice = searchParams.get("min_price") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";
  const search = searchParams.get("search") ?? "";

  useEffect(() => {
    fetchBrands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q: PhoneQuery = {};
    if (brand) q.brand = brand;
    if (condition) q.condition = condition;
    if (minPrice) q.min_price = minPrice;
    if (maxPrice) q.max_price = maxPrice;
    if (search) q.search = search;
    fetchPhones(q)
      .then((d) => {
        setPhones(d.results);
        setCount(d.count);
      })
      .finally(() => setLoading(false));
  }, [brand, condition, minPrice, maxPrice, search]);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 space-y-6">
          <div>
            <label className="label">Search</label>
            <input
              value={search}
              onChange={(e) => setParam("search", e.target.value)}
              placeholder="Search phone…"
              className="input"
            />
          </div>
          <div>
            <p className="label">Brand</p>
            <select value={brand} onChange={(e) => setParam("brand", e.target.value)} className="input">
              <option value="">All brands</option>
              {brands.map((b) => <option key={b.id} value={b.slug}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <p className="label">Condition</p>
            <select value={condition} onChange={(e) => setParam("condition", e.target.value)} className="input">
              {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <p className="label">Price</p>
            <div className="flex gap-2">
              <input
                value={minPrice}
                onChange={(e) => setParam("min_price", e.target.value)}
                placeholder="Min"
                type="number"
                className="input"
              />
              <input
                value={maxPrice}
                onChange={(e) => setParam("max_price", e.target.value)}
                placeholder="Max"
                type="number"
                className="input"
              />
            </div>
          </div>
        </aside>

        <section className="md:col-span-3">
          <p className="text-sm text-gray-500 mb-4">{count} phones found</p>
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : phones.length === 0 ? (
            <p className="text-gray-500">No phones match your filters.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {phones.map((p) => <PhoneCard key={p.id} phone={p} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}