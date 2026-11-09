import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const count = useCartStore((s) => s.count());
  const navigate = useNavigate();

  return (
    <header className="bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-white flex items-center gap-2">
          📱 PhoneStore
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/phones" className="hover:text-blue-400 font-medium text-gray-300 transition-colors">Phones</Link>
          <Link to="/track" className="hover:text-blue-400 font-medium text-gray-300 transition-colors">Track Order</Link>
          <Link to="/cart" className="relative hover:text-blue-400 flex items-center gap-1 font-medium text-gray-300 transition-colors">
            🛒 Cart
            {count > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              {user.is_admin && (
                <Link to="/admin" className="text-sm font-medium text-blue-400 hover:text-blue-300">Admin</Link>
              )}
              <Link to="/account/orders" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                @{user.username}
              </Link>
              <button
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm rounded-full px-5">Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}