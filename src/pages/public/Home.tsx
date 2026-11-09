import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPhones } from "../../api/catalog";
import type { PhoneListItem } from "../../types";
import { PhoneCard } from "../../components/product/PhoneCard";

export function Home() {
  const [phones, setPhones] = useState<PhoneListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhones({ ordering: "-created_at" })
      .then((d) => setPhones(d.results.slice(0, 8)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
          <span className="text-blue-300 font-semibold tracking-wider uppercase text-sm mb-3">
            Premium Quality
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl">
            Find your perfect phone, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              brand new or pre-owned.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl">
            Discover the latest models with full warranty, or grab a certified refurbished device at an unbeatable price.
          </p>
          <div className="flex gap-4">
            <Link to="/phones" className="btn bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:-translate-y-0.5">
              Shop All Phones
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Arrivals</h2>
            <p className="text-gray-500 mt-1">Fresh stock just added to the store.</p>
          </div>
          <Link to="/phones" className="hidden sm:block text-blue-600 font-semibold hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : phones.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500 text-lg">No phones added yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {phones.map((p) => (
              <PhoneCard key={p.id} phone={p} />
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/phones" className="btn-secondary w-full">
            View all phones
          </Link>
        </div>
      </section>
    </div>
  );
}