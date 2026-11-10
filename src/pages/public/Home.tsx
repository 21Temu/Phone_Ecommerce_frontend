import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPhones } from "../../api/catalog";
import type { PhoneListItem } from "../../types";
import { PhoneCard } from "../../components/product/PhoneCard";

export function Home() {
  const [phones, setPhones] = useState<PhoneListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPhones({ ordering: "-created_at" })
      .then((data) => {
        setPhones(data.results.slice(0, 8));
      })
      .catch((err) => {
        console.error("Failed to load phones:", err);
        setError("We couldn't load the latest phones. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">

      {/* ================= HERO SECTION ================= */}

      <section className="relative overflow-hidden bg-slate-950">

        {/* Background Decorations */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950" />

        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2">

          {/* Hero Text */}
          <div className="text-center lg:text-left">

            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold tracking-wide text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              PREMIUM SMARTPHONE COLLECTION
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Discover the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400">
                phone you love.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg lg:mx-0">
              Explore the latest smartphones and carefully selected
              pre-owned devices. Find your next upgrade with quality
              and value in one place.
            </p>

            {/* Hero Buttons */}
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

              <Link
                to="/phones"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:-translate-y-1 hover:bg-blue-500"
              >
                Explore Phones
                <span className="text-xl">→</span>
              </Link>

              <Link
                to="/track"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white transition duration-300 hover:bg-white/10"
              >
                Track Your Order
              </Link>

            </div>

            {/* Hero Highlights */}
            <div className="mt-12 flex flex-wrap justify-center gap-7 text-sm text-slate-300 lg:justify-start">

              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                Quality checked
              </div>

              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                Secure shopping
              </div>

              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✓</span>
                Convenient delivery
              </div>

            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto flex w-full max-w-lg items-center justify-center">

            <div className="absolute h-72 w-72 rounded-full bg-blue-500/20 blur-3xl sm:h-96 sm:w-96" />

            <div className="relative flex h-80 w-64 rotate-[-7deg] items-center justify-center rounded-[3rem] border border-white/20 bg-gradient-to-br from-slate-700 via-slate-900 to-black p-3 shadow-2xl shadow-blue-900/50 sm:h-[420px] sm:w-72">

              <div className="flex h-full w-full flex-col items-center justify-center rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-950">

                <div className="absolute top-5 h-5 w-20 rounded-full bg-black/80" />

                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl sm:h-56 sm:w-56">

                  <div className="absolute h-36 w-36 rounded-full bg-cyan-300/20 blur-2xl" />

                  <span className="relative text-8xl drop-shadow-2xl sm:text-9xl">
                    📱
                  </span>

                </div>

                <p className="mt-8 text-lg font-bold tracking-widest text-white">
                  PHONESTORE
                </p>

                <p className="mt-2 text-sm text-blue-200">
                  Your next upgrade awaits
                </p>

              </div>
            </div>

            {/* Floating Quality Badge */}
            <div className="absolute -left-2 top-10 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl sm:-left-10">
              <p className="text-sm font-bold text-white">
                ✨ Premium quality
              </p>
              <p className="mt-1 text-xs text-blue-200">
                Selected devices
              </p>
            </div>

            {/* Floating Shopping Badge */}
            <div className="absolute -right-2 bottom-10 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-xl sm:-right-8">
              <p className="text-sm font-bold text-white">
                🛒 Easy shopping
              </p>
              <p className="mt-1 text-xs text-blue-200">
                Find your favorite phone
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= BENEFITS SECTION ================= */}

      <section className="relative z-10 mx-auto -mt-1 max-w-7xl px-5 sm:px-8">

        <div className="grid grid-cols-1 gap-4 border-b border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/50 sm:grid-cols-2 sm:rounded-2xl sm:border lg:grid-cols-4">

          <div className="flex items-center gap-4 p-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              ✓
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Quality Checked
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Carefully selected phones
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 p-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-2xl">
              🚚
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Convenient Delivery
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Get your order delivered
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 p-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
              🔒
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Secure Shopping
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Shop with confidence
              </p>
            </div>

          </div>

          <div className="flex items-center gap-4 p-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-2xl">
              💬
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Customer Support
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                We're here to help
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ================= LATEST ARRIVALS ================= */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">

        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Explore Our Collection
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Latest Arrivals
            </h2>

            <p className="mt-3 max-w-lg text-slate-500">
              Discover the newest smartphones available in our store.
              Your next favorite device might be here.
            </p>

          </div>

          <Link
            to="/phones"
            className="hidden items-center gap-2 font-bold text-blue-600 transition hover:gap-4 hover:text-blue-800 sm:inline-flex"
          >
            View All Phones
            <span className="text-xl">→</span>
          </Link>

        </div>


        {/* Loading State */}
        {loading && (

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {Array.from({ length: 8 }).map((_, index) => (

              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white p-4"
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

          <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-14 text-center">

            <div className="text-4xl">⚠️</div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Something went wrong
            </h3>

            <p className="mt-2 text-slate-600">
              {error}
            </p>

          </div>

        )}


        {/* Empty State */}
        {!loading && !error && phones.length === 0 && (

          <div className="rounded-3xl border border-slate-100 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
              📱
            </div>

            <h3 className="mt-6 text-2xl font-bold text-slate-900">
              No phones available yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              We're preparing our collection. Check back soon to discover
              the latest smartphones.
            </p>

            <Link
              to="/phones"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Browse Collection →
            </Link>

          </div>

        )}


        {/* Phone Products */}
        {!loading && !error && phones.length > 0 && (

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

            {phones.map((phone) => (

              <PhoneCard
                key={phone.id}
                phone={phone}
              />

            ))}

          </div>

        )}


        {/* View All Button */}
        {!loading && !error && phones.length > 0 && (

          <div className="mt-12 text-center">

            <Link
              to="/phones"
              className="inline-flex items-center gap-3 rounded-xl bg-slate-900 px-9 py-4 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
            >
              Explore All Smartphones
              <span className="text-xl">→</span>
            </Link>

          </div>

        )}

      </section>

    </main>
  );
}