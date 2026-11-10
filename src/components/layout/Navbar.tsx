import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import {
  ShoppingCart,
  Smartphone,
  PackageSearch,
  UserRound,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const count = useCartStore((s) => s.count());
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080d18]/90 shadow-lg shadow-black/10 backdrop-blur-2xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex shrink-0 items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/25 transition-transform duration-300 group-hover:scale-105">
            <Smartphone size={23} className="text-white" />
          </div>

          <div>
            <span className="block text-xl font-extrabold tracking-tight text-white">
              Phone<span className="text-blue-400">Store</span>
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:block">
              Your next upgrade
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            to="/phones"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5 hover:text-blue-400"
          >
            Phones
          </Link>

          <Link
            to="/track"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5 hover:text-blue-400"
          >
            <PackageSearch size={17} />
            Track Order
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:bg-white/5 hover:text-blue-400"
          >
            <ShoppingCart size={18} />
            Cart

            {count > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-blue-500/30">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {user.is_admin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-400 transition-all hover:border-blue-400/40 hover:bg-blue-500/20"
                >
                  <LayoutDashboard size={16} />
                  Admin
                </Link>
              )}

              <Link
                to="/account/orders"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <UserRound size={16} />
                </div>

                <span className="max-w-[110px] truncate text-sm font-semibold text-white">
                  @{user.username}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-400 transition-all hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-600/30"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#080d18] px-4 pb-5 pt-3 shadow-2xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">

            <Link
              to="/phones"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-blue-400"
            >
              <Smartphone size={18} />
              Browse Phones
            </Link>

            <Link
              to="/track"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-blue-400"
            >
              <PackageSearch size={18} />
              Track Order
            </Link>

            <Link
              to="/cart"
              onClick={closeMobileMenu}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-blue-400"
            >
              <span className="flex items-center gap-3">
                <ShoppingCart size={18} />
                Shopping Cart
              </span>

              {count > 0 && (
                <span className="rounded-full bg-blue-500 px-2.5 py-1 text-xs font-bold text-white">
                  {count}
                </span>
              )}
            </Link>

            <div className="my-2 border-t border-white/10" />

            {user ? (
              <>
                {user.is_admin && (
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-blue-400 transition-colors hover:bg-blue-500/10"
                  >
                    <LayoutDashboard size={18} />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/account/orders"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <UserRound size={18} />
                  @{user.username}
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/5"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-center text-sm font-bold text-white transition-all hover:from-blue-500 hover:to-indigo-500"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}