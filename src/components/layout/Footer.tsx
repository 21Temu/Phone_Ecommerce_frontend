import { Link } from "react-router-dom";
import {
  Smartphone,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#080d18] text-slate-300">

      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          {/* Brand */}
          <div>
            <Link to="/" className="mb-5 inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/25">
                <Smartphone size={23} className="text-white" />
              </div>

              <span className="text-xl font-extrabold tracking-tight text-white">
                Phone<span className="text-blue-400">Store</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-slate-400">
              Discover smartphones that match your lifestyle. Explore quality
              devices, compare options, and find your next upgrade with confidence.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7v3h2.8v8h3.7z" />
</svg>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-400"
              >
                <svg
  width="18"
  height="18"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  aria-hidden="true"
>
  <rect x="3" y="3" width="18" height="18" rx="5" />
  <circle cx="12" cy="12" r="4" />
  <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
</svg>
              </a>

              <a
                href="mailto:support@phonestore.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="transition-colors hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/phones" className="transition-colors hover:text-blue-400">
                  Browse Phones
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition-colors hover:text-blue-400">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/track" className="transition-colors hover:text-blue-400">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="transition-colors hover:text-blue-400">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Customer Support
            </h3>

            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Mail size={17} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">Email us</p>
                  <a
                    href="mailto:support@phonestore.com"
                    className="break-all transition-colors hover:text-blue-400"
                  >
                    support@phonestore.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Phone size={17} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">Call us</p>
                  <span className="text-slate-300">Add your support number</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <MapPin size={17} />
                </div>
                <div>
                  <p className="mb-1 text-xs text-slate-500">Our location</p>
                  <span className="text-slate-300">Add your business address</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Why PhoneStore */}
          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white">
              Shop With Confidence
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={21} className="mt-0.5 shrink-0 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Quality Devices</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Explore carefully described smartphones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck size={21} className="mt-0.5 shrink-0 text-blue-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Order Tracking</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Follow your order status online.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Headphones size={21} className="mt-0.5 shrink-0 text-purple-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Customer Support</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Get help with your shopping experience.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/phones"
              className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-blue-400 transition-all hover:gap-3 hover:text-blue-300"
            >
              Explore Phones
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} PhoneStore. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Made for a better shopping experience.
          </p>
        </div>
      </div>
    </footer>
  );
}