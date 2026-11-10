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
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(username, password);

      const from = (location.state as any)?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (user.is_admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12">

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">

        {/* LEFT SIDE - BRANDING */}
        <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 p-12 text-white">

          <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3 w-fit">
              <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
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
                    d="M12 2.75h-3.5A2.5 2.5 0 006 5.25v13.5a2.5 2.5 0 002.5 2.5h5a2.5 2.5 0 002.5-2.5V5.25a2.5 2.5 0 00-2.5-2.5H12zm-2 15.5h4"
                  />
                </svg>
              </div>

              <span className="text-2xl font-extrabold tracking-tight">
                Phone<span className="text-blue-300">Store</span>
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-blue-100 mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Your technology destination
            </span>

            <h2 className="text-5xl font-extrabold leading-tight mb-6">
              Discover the
              <span className="block text-blue-300">
                perfect phone
              </span>
              for your life.
            </h2>

            <p className="text-blue-100/80 text-lg leading-relaxed">
              Explore the latest smartphones, discover amazing deals, and
              enjoy a simple and secure shopping experience.
            </p>

            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-300 border-2 border-blue-800 flex items-center justify-center text-blue-950 font-bold">
                  P
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-300 border-2 border-blue-800 flex items-center justify-center text-purple-950 font-bold">
                  S
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-300 border-2 border-blue-800 flex items-center justify-center text-orange-950 font-bold">
                  T
                </div>
              </div>

              <div>
                <p className="font-semibold text-white">
                  A smarter way to shop
                </p>
                <p className="text-sm text-blue-200">
                  Find your next favorite smartphone.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex justify-between text-sm text-blue-200/70">
            <span>© 2026 PhoneStore</span>
            <span>Shop smarter. Live better.</span>
          </div>

        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14">

          <div className="w-full max-w-md">

            {/* MOBILE BRAND */}
            <div className="lg:hidden flex justify-center mb-10">
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
            <div className="mb-8">
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
                    d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m12-13a4 4 0 11-8 0 4 4 0 018 0zm4 13v-2a4 4 0 00-3-3.87M19 3.13a4 4 0 010 7.75"
                  />
                </svg>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Welcome back!
              </h1>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Sign in to your account and continue exploring your favorite
                smartphones.
              </p>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700"
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

            {/* LOGIN FORM */}
            <form onSubmit={submit} className="space-y-5">

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
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white hover:border-gray-300"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>
                </div>

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
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white hover:border-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
              </div>

              {/* SIGN IN BUTTON */}
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to your account

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

            {/* REGISTER LINK */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account yet?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* FOOTER */}
            <div className="mt-10 pt-6 border-t border-gray-100">
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

                Secure sign-in experience
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}