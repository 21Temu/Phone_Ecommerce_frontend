import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-2 rounded-lg text-sm ${
    isActive ? "bg-brand-600 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

export function AdminLayout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-white border-r border-gray-200 p-4 flex flex-col">
        <Link to="/admin/dashboard" className="text-lg font-bold text-brand-600 mb-6">
          ⚙️ Admin
        </Link>
        <nav className="space-y-1 flex-1">
          <NavLink to="/admin/dashboard" className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
          <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
        </nav>
        <Link to="/" className="text-xs text-gray-500 hover:underline mb-2">← Back to store</Link>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="text-xs text-red-600 hover:underline text-left"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}