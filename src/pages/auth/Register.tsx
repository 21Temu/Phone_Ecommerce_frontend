import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      await login(form.username, form.password);
      navigate("/");
    } catch (err: any) {
      const data = err?.response?.data;
      console.log("Backend error:", data);
      if (data && typeof data === "object") {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError("Registration failed. Check the console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Create an account</h1>
          <p className="text-gray-500 mt-2">Join PhoneStore today</p>
        </div>

        <form onSubmit={submit} className="card p-8 space-y-5 shadow-lg border-0">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="label">Username</label>
            <input required className="input bg-gray-50" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="johndoe" />
          </div>
          <div>
            <label className="label">Email</label>
            <input required type="email" className="input bg-gray-50" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
          </div>
          <div>
            <label className="label">Phone</label>
            <input required className="input bg-gray-50" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0912345678" />
          </div>
          <div>
            <label className="label">Password</label>
            <input required type="password" minLength={6} className="input bg-gray-50" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" />
          </div>
          <button className="btn-primary w-full py-2.5 mt-2" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}