import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

export function Register() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

        setError(
          Array.isArray(firstError)
            ? String(firstError[0])
            : String(firstError)
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-10">

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">

        {/* LEFT SIDE - BRANDING */}
        <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-12 text-white">

          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>

          {/* BRAND LOGO */}
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 w-fit">

              <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="6"
                    y="2"
                    width="12"
                    height="20"
                    rx="2"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M10 18h4"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <span className="text-2xl font-extrabold tracking-tight">
                Phone<span className="text-blue-300">Store</span>
              </span>

            </Link>
          </div>

          {/* BRAND CONTENT */}
          <div className="relative z-10 max-w-md">

            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-blue-100 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Join our shopping community
            </span>

            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Your next
              <span className="block text-blue-300">
                favorite phone
              </span>
              starts here.
            </h2>

            <p className="text-blue-100/80 text-lg leading-relaxed">
              Create your account to explore the latest smartphones,
              discover great deals, and enjoy a convenient shopping
              experience.
            </p>

            {/* BENEFITS */}
            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <svg
                    className="w-5 h-5 text-blue-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M5 12l4 4L19 6"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold">Easy shopping</p>
                  <p className="text-sm text-blue-200">
                    Discover and shop your favorite phones.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <svg
                    className="w-5 h-5 text-blue-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold">Secure account</p>
                  <p className="text-sm text-blue-200">
                    Enjoy a secure account experience.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                  <svg
                    className="w-5 h-5 text-blue-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <div>
                  <p className="font-semibold">Convenient experience</p>
                  <p className="text-sm text-blue-200">
                    Manage your shopping in one place.
                  </p>
                </div>
              </div>

            </div>
          </div>

          <div className="relative z-10 flex justify-between text-sm text-blue-200/70">
            <span>© 2026 PhoneStore</span>
            <span>Shop smarter. Live better.</span>
          </div>

        </div>

        {/* RIGHT SIDE - REGISTRATION FORM */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">

          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}
            <div className="lg:hidden flex justify-center mb-8">
              <Link to="/" className="flex items-center gap-2">

                <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="6"
                      y="2"
                      width="12"
                      height="20"
                      rx="2"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M10 18h4"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <span className="text-2xl font-extrabold text-gray-900">
                  Phone<span className="text-blue-600">Store</span>
                </span>

              </Link>
            </div>

            {/* HEADING */}
            <div className="mb-7">

              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl mb-5">
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m12-13a4 4 0 11-8 0 4 4 0 018 0zM19 8v6m3-3h-6"
                  />
                </svg>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Create your account
              </h1>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Join us today and discover a smarter way to shop for
                smartphones.
              </p>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
              >
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
                  />
                </svg>

                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* REGISTRATION FORM */}
            <form onSubmit={submit} className="space-y-4">

              {/* USERNAME */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Username
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m12-13a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    minLength={3}
                    placeholder="Choose a username"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white hover:border-gray-300"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                  />

                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email address
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        strokeWidth="1.8"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 7l9 6 9-6"
                      />
                    </svg>
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white hover:border-gray-300"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />

                </div>
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Phone number
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M3 5a2 2 0 012-2h3.3a1 1 0 011 .8l.7 3a1 1 0 01-.5 1.1l-2 1.2a11 11 0 005.4 5.4l1.2-2a1 1 0 011.1-.5l3 .7a1 1 0 01.8 1V17a2 2 0 01-2 2A14 14 0 013 5z"
                      />
                    </svg>
                  </div>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="Enter your phone number"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white hover:border-gray-300"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />

                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        strokeWidth="1.8"
                      />
                      <path
                        strokeLinecap="round"
                        strokeWidth="1.8"
                        d="M7 11V7a5 5 0 0110 0v4"
                      />
                    </svg>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="Create a password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white hover:border-gray-300"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4 9.5 7-.4 1.3-1.3 2.8-2.6 4M6.2 6.2C3.9 7.5 2.8 9.5 2.5 12c.6 2 2.4 4.5 5.5 6.1A10.8 10.8 0 0012 19"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
                        />
                        <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
                      </svg>
                    )}
                  </button>

                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Password must contain at least 6 characters.
                </p>
              </div>

              {/* CREATE ACCOUNT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-lg shadow-blue-600/20 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Creating account...
                  </>
                ) : (
                  <>
                    Create my account

                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 12h14m-7-7l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>

            </form>

            {/* LOGIN LINK */}
            <div className="mt-7 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* SECURITY FOOTER */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-xs">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M9 12l2 2 4-4"
                  />
                </svg>

                Your information is handled securely.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}