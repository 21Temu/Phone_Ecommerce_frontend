import { Link } from "react-router-dom";
import {
  Smartphone,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#080d18] text-slate-300">

      {/* Background Effects */}
      <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-10">

        {/* Main Footer Row */}
        <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">

          {/* Brand */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/25 transition-transform duration-300 group-hover:scale-110">
              <Smartphone size={25} className="text-white" />
            </div>

            <span className="text-2xl font-extrabold tracking-tight text-white">
              Phone<span className="text-blue-400">Store</span>
            </span>
          </Link>

          {/* Contact Information */}
          <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3 lg:w-auto lg:gap-8">

            {/* Email */}
            <a
              href="mailto:support@phonestore.com"
              className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/10"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                <Mail size={20} />
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-slate-500">
                  Email us
                </p>
                <p className="text-sm font-semibold text-white">
                  support@phonestore.com
                </p>
              </div>
            </a>

            {/* Phone */}
            <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                <Phone size={20} />
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-slate-500">
                  Call us
                </p>
                <p className="text-sm font-semibold text-white">
                  Add your support number
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/10">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                <MapPin size={20} />
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-slate-500">
                  Our location
                </p>
                <p className="text-sm font-semibold text-white">
                  Add your business address
                </p>
              </div>
            </div>

          </div>

          {/* Social Media */}
          <div className="flex items-center gap-3">

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} PhoneStore. All rights reserved.
          </p>

          <Link
            to="/"
            className="text-xs font-semibold text-slate-400 transition-colors hover:text-blue-400"
          >
            PhoneStore
          </Link>
        </div>

      </div>
    </footer>
  );
}