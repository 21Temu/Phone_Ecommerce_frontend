
import { useEffect, useMemo, useState } from "react";
import { adminBlockUser, adminFetchUsers } from "../../api/admin";
import type { User } from "../../types";

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState<number | null>(null);

  const reload = async () => {
    setError("");

    try {
      const data = await adminFetchUsers();
      setUsers(data);
    } catch {
      setError("Unable to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const roles = useMemo(
    () => Array.from(new Set(users.map((user) => user.role))),
    [users]
  );

  const toggle = async (id: number) => {
    if (processingId !== null) return;

    setProcessingId(id);
    setError("");
    setSuccess("");

    try {
      await adminBlockUser(id);
      await reload();
      setSuccess("User account status updated successfully.");
    } catch {
      setError("Unable to update this user's account. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (username: string) => {
    return username
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      "bg-blue-100 text-blue-700",
      "bg-purple-100 text-purple-700",
      "bg-emerald-100 text-emerald-700",
      "bg-orange-100 text-orange-700",
      "bg-pink-100 text-pink-700",
      "bg-indigo-100 text-indigo-700",
    ];

    const index = username
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0);

    return colors[index % colors.length];
  };

  const getRoleStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "administrator":
        return "bg-purple-50 text-purple-700 border-purple-100";

      case "staff":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";

      case "customer":
        return "bg-blue-50 text-blue-700 border-blue-100";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // This component uses the existing User type.
  // If your API exposes an is_active field, it is used to display status.
  const isUserActive = (user: User) =>
    (user as User & { is_active?: boolean }).is_active !== false;

  const activeCount = users.filter(isUserActive).length;
  const blockedCount = users.length - activeCount;

  return (
    <div className="min-h-screen space-y-8">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-800 p-6 sm:p-8 text-white shadow-xl">

        <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-28 w-64 h-64 rounded-full bg-purple-400/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-blue-100 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              User Administration
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Users Management
            </h1>

            <p className="mt-3 max-w-xl text-sm sm:text-base text-blue-100">
              Manage registered customers and user accounts, monitor account
              availability, and control access to your PhoneStore platform.
            </p>
          </div>

          <div className="w-20 h-20 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
            <svg
              className="w-11 h-11 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
              />
            </svg>
          </div>

        </div>

        <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">

          <HeaderStat label="Total Users" value={users.length} />
          <HeaderStat label="Active Accounts" value={activeCount} />
          <HeaderStat label="Blocked Accounts" value={blockedCount} />

        </div>

      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <span className="text-xl">✓</span>
          <p className="text-sm font-semibold">{success}</p>

          <button
            type="button"
            onClick={() => setSuccess("")}
            className="ml-auto hover:text-emerald-950"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-semibold">{error}</p>

          <button
            type="button"
            onClick={reload}
            className="ml-auto text-sm font-bold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <SummaryCard
          title="Registered Users"
          value={users.length}
          description="All accounts in your platform"
          icon="👥"
          color="bg-blue-50 text-blue-700"
        />

        <SummaryCard
          title="Active Accounts"
          value={activeCount}
          description="Accounts currently available"
          icon="✓"
          color="bg-emerald-50 text-emerald-700"
        />

        <SummaryCard
          title="Blocked Accounts"
          value={blockedCount}
          description="Accounts currently restricted"
          icon="🔒"
          color="bg-red-50 text-red-700"
        />

      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Table Header */}
        <div className="border-b border-slate-100 p-5 sm:p-6">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                All Users
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                View and manage registered accounts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search */}
              <div className="relative">

                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
                  <path
                    d="m16 16 5 5"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search username or email..."
                  className="w-full sm:w-72 rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              >
                <option value="all">All Roles</option>

                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>

        {/* Loading */}
        {loading ? (

          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 rounded-xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full text-sm text-left">

              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-bold">User</th>
                  <th className="px-5 py-4 font-bold">Email Address</th>
                  <th className="px-5 py-4 font-bold">Role</th>
                  <th className="px-5 py-4 font-bold">Account Status</th>
                  <th className="px-5 py-4 font-bold text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredUsers.map((user) => {
                  const active = isUserActive(user);
                  const processing = processingId === user.id;

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-slate-50"
                    >

                      {/* User */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3 min-w-44">

                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${getAvatarColor(user.username)}`}
                          >
                            {getInitials(user.username) || "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">
                              {user.username}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              User ID: #{user.id}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <span className="text-slate-600">
                          {user.email}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${getRoleStyle(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="px-5 py-4">
                        {active ? (
                          <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-xs font-bold text-red-600">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Blocked
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          disabled={processing}
                          onClick={() => toggle(user.id)}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                            active
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          }`}
                        >
                          {processing ? (
                            <>
                              <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                              Updating...
                            </>
                          ) : active ? (
                            <>
                              <span>🔒</span>
                              Block User
                            </>
                          ) : (
                            <>
                              <span>✓</span>
                              Unblock User
                            </>
                          )}
                        </button>

                      </td>

                    </tr>
                  );
                })}

                {/* Empty State */}
                {filteredUsers.length === 0 && (

                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">

                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
                        <svg
                          className="h-8 w-8 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="11" cy="11" r="7" strokeWidth="1.7" />
                          <path
                            d="m16 16 5 5"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <h3 className="font-bold text-slate-900">
                        {users.length === 0
                          ? "No users found"
                          : "No matching users"}
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        {users.length === 0
                          ? "Registered accounts will appear here."
                          : "Try another username, email address or role."}
                      </p>

                      {(search || roleFilter !== "all") && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setRoleFilter("all");
                          }}
                          className="mt-4 text-sm font-bold text-blue-600 hover:text-blue-800"
                        >
                          Clear filters
                        </button>
                      )}

                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        )}

        {/* Footer */}
        {!loading && (
          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>
              Showing {filteredUsers.length} of {users.length} users
            </p>

            <p>PhoneStore User Administration</p>
          </div>
        )}

      </div>

    </div>
  );
}

function HeaderStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 p-3 sm:p-4 backdrop-blur-sm">
      <p className="text-xs font-medium text-blue-200">
        {label}
      </p>

      <p className="mt-1 text-2xl font-extrabold">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: number;
  description: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-extrabold text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${color}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}
