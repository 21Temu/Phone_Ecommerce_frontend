import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function RequireAuth({ children, adminOnly }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { token, user, loading } = useAuthStore();
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (loading || (adminOnly && !user)) return <div className="p-8 text-gray-500">Loading…</div>;
  if (adminOnly && !user?.is_admin) return <Navigate to="/" replace />;
  return <>{children}</>;
}