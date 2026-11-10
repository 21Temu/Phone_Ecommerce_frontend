import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchPhone } from "../../api/catalog";
import type {
  PhoneDetail as PhoneDetailType,
  PhoneVariant,
} from "../../types";
import { formatPrice } from "../../lib/format";
import { VariantSelector } from "../../components/product/VariantSelector";
import { useCartStore } from "../../store/cartStore";

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const [phone, setPhone] = useState<PhoneDetailType | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const add = useCartStore((s) => s.add);

  // Fetch product details
  useEffect(() => {
    if (!slug) {
      setError("Invalid phone address.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError("");
    setPhone(null);
    setActiveImg(0);

    fetchPhone(slug)
      .then((data) => {
        if (!cancelled) {
          setPhone(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load phone:", err);

        if (!cancelled) {
          setError("Phone not found. It may have been removed from the store.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Add selected phone variant to cart
  const handleAdd = (variant: PhoneVariant) => {
    if (!phone) return;

    add({
      variantId: variant.id,
      phoneId: phone.id,
      phoneSlug: phone.slug,
      productName: `${phone.brand.name} ${phone.name}`,
      variantLabel: `${variant.color} · ${variant.storage_gb}GB${
        variant.ram_gb ? ` · ${variant.ram_gb}GB` : ""
      }`,
      color: variant.color,
      storage_gb: variant.storage_gb,
      ram_gb: variant.ram_gb,
      price: parseFloat(variant.price),
      quantity: 1,
      stock: variant.stock,
      image: phone.images[activeImg]?.image ?? null,
    });
  };

  // ================= LOADING STATE =================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-7xl animate-pulse">

          <div className="mb-8 h-4 w-40 rounded bg-slate-200" />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">

            <div className="aspect-square rounded-3xl bg-slate-200" />

            <div className="space-y-5 py-5">

              <div className="h-5 w-32 rounded bg-slate-200" />

              <div className="h-10 w-3/4 rounded bg-slate-200" />

              <div className="h-6 w-28 rounded bg-slate-200" />

              <div className="h-12 w-48 rounded bg-slate-200" />

              <div className="h-40 rounded-2xl bg-slate-200" />

              <div className="h-16 rounded-xl bg-slate-200" />

            </div>
          </div>
        </div>
      </main>
    );
  }

  // ================= ERROR STATE =================

  if (error || !phone) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">

        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl">
            📱
          </div>

          <h2 className="mt-6 text-2xl font-extrabold text-slate-900">
            Phone Not Found
          </h2>

          <p className="mt-3 leading-7 text-slate-500">
            {error || "We couldn't find the requested phone."}
          </p>

          <Link
            to="/phones"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white transition hover:bg-blue-700"
          >
            ← Browse All Phones
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">

      {/* ================= BREADCRUMB ================= */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-4 text-sm sm:px-8">

          <Link
            to="/"
            className="text-slate-500 transition hover:text-blue-600"
          >
            Home
          </Link>

          <span className="text-slate-300">/</span>

          <Link
            to="/phones"
            className="text-slate-500 transition hover:text-blue-600"
          >
            Phones
          </Link>

          <span className="text-slate-300">/</span>

          <span className="max-w-[200px] truncate font-semibold text-slate-900">
            {phone.brand.name} {phone.name}
          </span>

        </div>

      </div>


      {/* ================= PRODUCT DETAILS ================= */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">


          {/* ================= PRODUCT IMAGE GALLERY ================= */}

          <div>

            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">

              {/* Condition Badge */}
              <span className="absolute left-7 top-7 z-10 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                {phone.condition}
              </span>

              {/* Main Product Image */}
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-slate-50">

                {phone.images[activeImg] ? (

                  <img
                    src={phone.images[activeImg].image}
                    alt={`${phone.brand.name} ${phone.name}`}
                    className="h-full w-full object-contain p-4 transition duration-500 hover:scale-105"
                  />

                ) : (

                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-300">

                    <span className="text-8xl">📱</span>

                    <p className="mt-4 text-sm font-medium">
                      Product image unavailable
                    </p>

                  </div>

                )}

              </div>

            </div>


            {/* Image Thumbnails */}
            {phone.images.length > 1 && (

              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">

                {phone.images.map((image, index) => (

                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActiveImg(index)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={activeImg === index}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white p-1 transition sm:h-24 sm:w-24 ${
                      activeImg === index
                        ? "border-blue-600 shadow-md"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >

                    <img
                      src={image.image}
                      alt={`${phone.name} view ${index + 1}`}
                      className="h-full w-full rounded-lg object-contain"
                    />

                  </button>

                ))}

              </div>

            )}


            {/* Image Information */}
            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">

              <p className="text-sm font-medium text-slate-600">
                Product Gallery
              </p>

              <p className="text-sm font-semibold text-blue-600">
                {phone.images.length > 0
                  ? `${activeImg + 1} / ${phone.images.length}`
                  : "No images"}
              </p>

            </div>

          </div>


          {/* ================= PRODUCT INFORMATION ================= */}

          <div>

            {/* Brand */}
            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                {phone.brand.name}
              </span>

              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold capitalize text-slate-600">
                {phone.condition}
              </span>

            </div>


            {/* Product Name */}
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
              {phone.name}
            </h1>


            {/* Product Description Short Intro */}
            <p className="mt-4 leading-7 text-slate-500">
              Explore the features and available configurations of this
              smartphone. Select your preferred variant to continue shopping.
            </p>


            {/* Price */}
            <div className="mt-7 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">

              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Starting Price
              </p>

              <div className="mt-2 flex flex-wrap items-baseline gap-3">

                <span className="text-3xl font-extrabold text-blue-700 sm:text-4xl">
                  {phone.min_price
                    ? formatPrice(phone.min_price)
                    : "Price unavailable"}
                </span>

              </div>

              <p className="mt-2 text-xs text-slate-500">
                Final price depends on your selected configuration.
              </p>

            </div>


            {/* Product Variants */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

              <div className="mb-5">

                <h2 className="text-lg font-extrabold text-slate-900">
                  Choose Your Configuration
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select your preferred color, storage, and RAM.
                </p>

              </div>

              <VariantSelector
                phone={phone}
                onAdd={handleAdd}
              />

            </div>


            {/* Product Benefits */}
            <div className="mt-7 grid grid-cols-2 gap-3">

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">

                <span className="text-2xl">✓</span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Quality
                  </p>

                  <p className="text-xs text-slate-500">
                    Selected devices
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">

                <span className="text-2xl">🔒</span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Secure
                  </p>

                  <p className="text-xs text-slate-500">
                    Shopping experience
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ================= SPECIFICATIONS ================= */}

        <section className="mt-16">

          <div className="mb-7">

            <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Technical Information
            </span>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Product Specifications
            </h2>

            <p className="mt-2 text-slate-500">
              Explore the main technical details of this smartphone.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {phone.screen_size && (
              <Spec
                label="Screen Size"
                value={`${phone.screen_size}"`}
                icon="📱"
              />
            )}

            {phone.battery_mah && (
              <Spec
                label="Battery Capacity"
                value={`${phone.battery_mah} mAh`}
                icon="🔋"
              />
            )}

            {phone.camera_mp && (
              <Spec
                label="Camera"
                value={`${phone.camera_mp} MP`}
                icon="📷"
              />
            )}

            {phone.os && (
              <Spec
                label="Operating System"
                value={phone.os}
                icon="⚙️"
              />
            )}

          </div>

          {!phone.screen_size &&
            !phone.battery_mah &&
            !phone.camera_mp &&
            !phone.os && (

              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No technical specifications available for this phone yet.
              </div>

            )}

        </section>


        {/* ================= DESCRIPTION ================= */}

        {phone.description && (

          <section className="mt-14">

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">

              <span className="text-sm font-bold uppercase tracking-wider text-blue-600">
                About This Device
              </span>

              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                Product Description
              </h2>

              <div className="mt-5 border-t border-slate-100 pt-5">

                <p className="whitespace-pre-line text-base leading-8 text-slate-600">
                  {phone.description}
                </p>

              </div>

            </div>

          </section>

        )}

      </section>

    </main>
  );
}


// ================= SPECIFICATION CARD =================

function Spec({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (

    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl transition group-hover:bg-blue-100">
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 break-words text-xl font-extrabold text-slate-900">
        {value}
      </p>

    </div>

  );
}