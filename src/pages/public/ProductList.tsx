import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchBrands, fetchPhones, type PhoneQuery } from "../../api/catalog";
import type { Brand, PhoneListItem } from "../../types";
import { PhoneCard } from "../../components/product/PhoneCard";

const CONDITIONS = [
  { value: "", label: "All Conditions" },
  { value: "new", label: "Brand New" },
  { value: "used", label: "Pre-Owned" },
  { value: "refurbished", label: "Refurbished" },
];

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [phones, setPhones] = useState<PhoneListItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const brand = searchParams.get("brand") ?? "";
  const condition = searchParams.get("condition") ?? "";
  const minPrice = searchParams.get("min_price") ?? "";
  const maxPrice = searchParams.get("max_price") ?? "";
  const search = searchParams.get("search") ?? "";

  // Load available brands
  useEffect(() => {
    fetchBrands()
      .then(setBrands)
      .catch((err) => {
        console.error("Failed to load brands:", err);
      });
  }, []);

  // Load phones whenever filters change
  useEffect(() => {
    let cancelled = false;

    const loadPhones = async () => {
      setLoading(true);
      setError("");

      const query: PhoneQuery = {};

      if (brand) query.brand = brand;
      if (condition) query.condition = condition;
      if (minPrice) query.min_price = minPrice;
      if (maxPrice) query.max_price = maxPrice;
      if (search) query.search = search;

      try {
        const data = await fetchPhones(query);

        if (!cancelled) {
          setPhones(data.results);
          setCount(data.count);
        }
      } catch (err) {
        console.error("Failed to load phones:", err);

        if (!cancelled) {
          setPhones([]);
          setCount(0);
          setError("Unable to load phones. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPhones();

    return () => {
      cancelled = true;
    };
  }, [brand, condition, minPrice, maxPrice, search]);

  // Update URL search parameters
  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    setSearchParams(next);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  // Check whether filters are active
  const hasFilters = Boolean(
    brand || condition || minPrice || maxPrice || search
  );

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ================= PAGE HERO ================= */}

      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950">

        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">

          <div className="max-w-2xl">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
              Discover Your Next Upgrade
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
              Explore Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">
                Smartphone Collection
              </span>
            </h1>

            <p className="mt-5 max-w-xl leading-7 text-blue-100">
              Find the perfect smartphone for your lifestyle.
              Explore different brands, compare conditions,
              and discover your next favorite device.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-blue-100">

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                📱 Latest Smartphones
              </span>

              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                ✨ Quality Selection
              </span>

            </div>

          </div>

        </div>
      </section>


      {/* ================= MAIN CONTENT ================= */}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">


          {/* ================= FILTER SIDEBAR ================= */}

          <aside className="lg:col-span-1">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">

              {/* Filter Header */}
              <div className="mb-7 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    ⚙️
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Filters
                    </h2>

                    <p className="text-xs text-slate-500">
                      Find your perfect phone
                    </p>
                  </div>

                </div>

                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Clear all
                  </button>
                )}

              </div>


              {/* Search Filter */}
              <div className="mb-7">

                <label
                  htmlFor="phone-search"
                  className="mb-3 block text-sm font-bold text-slate-800"
                >
                  Search Phones
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                    🔍
                  </span>

                  <input
                    id="phone-search"
                    type="search"
                    value={search}
                    onChange={(e) => setParam("search", e.target.value)}
                    placeholder="Search phone..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>


              <div className="mb-7 border-t border-slate-100" />


              {/* Brand Filter */}
              <div className="mb-7">

                <label
                  htmlFor="brand-filter"
                  className="mb-3 block text-sm font-bold text-slate-800"
                >
                  Smartphone Brand
                </label>

                <select
                  id="brand-filter"
                  value={brand}
                  onChange={(e) => setParam("brand", e.target.value)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="">
                    All Brands
                  </option>

                  {brands.map((b) => (
                    <option key={b.id} value={b.slug}>
                      {b.name}
                    </option>
                  ))}

                </select>

              </div>


              <div className="mb-7 border-t border-slate-100" />


              {/* Condition Filter */}
              <div className="mb-7">

                <label
                  htmlFor="condition-filter"
                  className="mb-3 block text-sm font-bold text-slate-800"
                >
                  Phone Condition
                </label>

                <div className="space-y-2">

                  {CONDITIONS.map((item) => (

                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setParam("condition", item.value)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                        condition === item.value
                          ? "border-blue-200 bg-blue-50 font-bold text-blue-700"
                          : "border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >

                      <span>{item.label}</span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                          condition === item.value
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300"
                        }`}
                      >
                        {condition === item.value ? "✓" : ""}
                      </span>

                    </button>

                  ))}

                </div>

              </div>


              <div className="mb-7 border-t border-slate-100" />


              {/* Price Filter */}
              <div className="mb-7">

                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Price Range
                </h3>

                <p className="mb-4 text-xs text-slate-500">
                  Enter your preferred minimum and maximum price.
                </p>

                <div className="grid grid-cols-2 gap-3">

                  <div>

                    <label
                      htmlFor="min-price"
                      className="mb-2 block text-xs font-medium text-slate-500"
                    >
                      Minimum
                    </label>

                    <input
                      id="min-price"
                      type="number"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setParam("min_price", e.target.value)}
                      placeholder="Min"
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                  <div>

                    <label
                      htmlFor="max-price"
                      className="mb-2 block text-xs font-medium text-slate-500"
                    >
                      Maximum
                    </label>

                    <input
                      id="max-price"
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setParam("max_price", e.target.value)}
                      placeholder="Max"
                      className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                  </div>

                </div>

              </div>


              {/* Clear Filters */}
              {hasFilters && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  Reset All Filters
                </button>

              )}

            </div>

          </aside>


          {/* ================= PRODUCT SECTION ================= */}

          <section className="lg:col-span-3">


            {/* Product Toolbar */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <h2 className="text-xl font-extrabold text-slate-900">
                    All Smartphones
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {loading
                      ? "Finding available phones..."
                      : `${count} ${count === 1 ? "phone" : "phones"} found`}
                  </p>

                </div>

                <Link
                  to="/track"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  📦 Track Order
                </Link>

              </div>


              {/* Active Filter Chips */}
              {hasFilters && (

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">

                  <span className="mr-1 self-center text-xs font-semibold text-slate-500">
                    Active filters:
                  </span>

                  {search && (
                    <button
                      type="button"
                      onClick={() => setParam("search", "")}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Search: {search} ×
                    </button>
                  )}

                  {brand && (
                    <button
                      type="button"
                      onClick={() => setParam("brand", "")}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Brand: {brands.find((b) => b.slug === brand)?.name ?? brand} ×
                    </button>
                  )}

                  {condition && (
                    <button
                      type="button"
                      onClick={() => setParam("condition", "")}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Condition: {CONDITIONS.find((c) => c.value === condition)?.label ?? condition} ×
                    </button>
                  )}

                  {minPrice && (
                    <button
                      type="button"
                      onClick={() => setParam("min_price", "")}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Min: {minPrice} ×
                    </button>
                  )}

                  {maxPrice && (
                    <button
                      type="button"
                      onClick={() => setParam("max_price", "")}
                      className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Max: {maxPrice} ×
                    </button>
                  )}

                </div>

              )}

            </div>


            {/* Loading Skeleton */}
            {loading && (

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {Array.from({ length: 6 }).map((_, index) => (

                  <div
                    key={index}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
                  >

                    <div className="aspect-square rounded-xl bg-slate-100" />

                    <div className="mt-5 h-4 w-3/4 rounded bg-slate-100" />

                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />

                    <div className="mt-5 h-10 rounded-lg bg-slate-100" />

                  </div>

                ))}

              </div>

            )}


            {/* Error State */}
            {!loading && error && (

              <div className="rounded-2xl border border-red-100 bg-white px-6 py-20 text-center">

                <div className="text-5xl">⚠️</div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  Unable to load products
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => setParam("refresh", Date.now().toString())}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Try Again
                </button>

              </div>

            )}


            {/* Empty State */}
            {!loading && !error && phones.length === 0 && (

              <div className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
                  📱
                </div>

                <h3 className="mt-6 text-2xl font-extrabold text-slate-900">
                  No phones found
                </h3>

                <p className="mx-auto mt-3 max-w-md text-slate-500">
                  We couldn't find any smartphones matching your current
                  filters. Try changing your search or clearing your filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-7 rounded-xl bg-blue-600 px-7 py-3 font-bold text-white transition hover:bg-blue-700"
                >
                  Clear All Filters
                </button>

              </div>

            )}


            {/* Product Grid */}
            {!loading && !error && phones.length > 0 && (

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {phones.map((phone) => (

                  <PhoneCard
                    key={phone.id}
                    phone={phone}
                  />

                ))}

              </div>

            )}


            {/* Bottom Results Information */}
            {!loading && !error && phones.length > 0 && (

              <div className="mt-8 rounded-xl border border-slate-200 bg-white px-5 py-4 text-center">

                <p className="text-sm text-slate-500">
                  Showing {phones.length} products from {count} available phones.
                </p>

                <Link
                  to="/phones"
                  className="mt-2 inline-block text-sm font-bold text-blue-600 hover:text-blue-800"
                >
                  Explore our collection →
                </Link>

              </div>

            )}

          </section>

        </div>

      </div>

    </main>
  );
}