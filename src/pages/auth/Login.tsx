import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export function Login() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(username, password);
      const from = (location.state as any)?.from?.pathname;
      if (from) navigate(from, { replace: true });
      else if (user.is_admin) navigate("/admin/dashboard");
      else navigate("/");
    } catch {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={submit} className="card p-8 space-y-5 shadow-lg border-0">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="label">Username</label>
            <input 
              required 
              className="input bg-gray-50" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input 
              required 
              type="password" 
              className="input bg-gray-50" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>
          <button className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}