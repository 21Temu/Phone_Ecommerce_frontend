import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  Users,
  Store,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    path: "/admin/products",
    icon: Smartphone,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
];

export function AdminLayout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const sidebarContent = (
    <>
      {/* Brand */}
      <Link
        to="/admin/dashboard"
        onClick={closeMobileMenu}
        className="flex items-center gap-3 border-b border-white/10 px-5 py-6"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-600/20">
          <Store size={22} className="text-white" />
        </div>

        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-white">
            Phone<span className="text-blue-400">Store</span>
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Administration
          </p>
        </div>
      </Link>

      {/* Admin Profile */}
      <div className="mx-4 mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
          <ShieldCheck size={21} />
        </div>

        <div>
          <p className="text-sm font-bold text-white">Admin Panel</p>
          <p className="text-xs text-slate-500">Store Management</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 pt-8">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Main Menu
        </p>

        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-3">
                      <Icon
                        size={19}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-500 group-hover:text-blue-400"
                        }
                      />
                      {item.name}
                    </span>

                    {isActive && <ChevronRight size={16} />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-white/10 p-4">
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to Store
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>

        <p className="mt-5 text-center text-[10px] text-slate-600">
          PhoneStore Admin © {new Date().getFullYear()}
        </p>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#080d18]">

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0b1220] lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0b1220]/95 px-4 backdrop-blur-xl lg:hidden">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
            <Store size={19} className="text-white" />
          </div>

          <span className="font-extrabold text-white">
            Phone<span className="text-blue-400">Store</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((previous) => !previous)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileMenu}
            className="absolute inset-0 bg-black/70"
          />

          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-[#0b1220] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pr-4">
              {sidebarContent}

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300"
              >
                <X size={19} />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-[calc(100vh-64px)] bg-[#f4f7fb] p-4 sm:p-6 lg:ml-64 lg:min-h-screen lg:p-8">
        <div className="mx-auto max-w-[1600px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}