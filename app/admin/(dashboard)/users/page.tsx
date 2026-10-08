"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

type UserRole = "USER" | "ADMIN";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  _count: {
    applications: number;
    shortlists: number;
    reviews: number;
  };
};

type ApiResponse = {
  success: boolean;
  data: UserRow[];
  stats: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  message?: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<ApiResponse["stats"]>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
  });

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] =
    useState<ApiResponse["pagination"] | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (role) {
        params.set("role", role);
      }

      params.set("page", String(page));
      params.set("limit", "20");

      const response = await fetch(
        `/admin/api/admin/users?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      );

      const data: ApiResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch users.",
        );
      }

      setUsers(data.data);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch users.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, role, page]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, role]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users size={16} />
          <span>Management</span>
          <ChevronRight size={14} />
          <span>Users</span>
        </div>

        <div className="mt-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage registered users and view their activity.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Users
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#15945c]">
              <Users size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Regular Users
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.regularUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User size={21} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Administrators
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stats.adminUsers}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name, email or phone..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#15945c] focus:bg-white focus:ring-2 focus:ring-[#15945c]/10"
            />
          </div>

          <select
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition focus:border-[#15945c] focus:bg-white"
          >
            <option value="">All roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-gray-100 bg-gray-50/70">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Role
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Applications
                </th>

                <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Shortlists
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Registered
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index}>
                    <td
                      colSpan={7}
                      className="px-5 py-4"
                    >
                      <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <Users
                      size={32}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      No users found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf8f1] text-sm font-bold text-[#15945c]">
                            {getInitials(user.name)}
                          </div>
                        )}

                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">
                        {user.email}
                      </p>

                      {user.phone && (
                        <p className="mt-1 text-xs text-gray-400">
                          {user.phone}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-[#eaf8f1] text-[#13804f]"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                      {user._count.applications}
                    </td>

                    <td className="px-5 py-4 text-center text-sm font-semibold text-gray-700">
                      {user._count.shortlists}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-[#15945c]/30 hover:bg-[#eaf8f1] hover:text-[#13804f]"
                      >
                        <Eye size={15} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 lg:hidden">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl bg-gray-100"
            />
          ))
        ) : users.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center">
            <Users
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-700">
              No users found
            </p>
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eaf8f1] font-bold text-[#15945c]">
                      {getInitials(user.name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    user.role === "ADMIN"
                      ? "bg-purple-50 text-purple-700"
                      : "bg-[#eaf8f1] text-[#13804f]"
                  }`}
                >
                  {user.role}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-[11px] text-gray-400">
                    Applications
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {user._count.applications}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-gray-400">
                    Shortlists
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {user._count.shortlists}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-xs text-gray-400">
                  Joined {formatDate(user.createdAt)}
                </p>

                <Link
                  href={`/admin/users/${user.id}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#15945c] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#117d4d]"
                >
                  <Eye size={14} />
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {(pagination.page - 1) * pagination.limit + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-gray-700">
              {Math.min(
                pagination.page * pagination.limit,
                pagination.total,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">
              {pagination.total}
            </span>{" "}
            users
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1),
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="px-2 text-sm font-medium text-gray-700">
              {pagination.page} / {pagination.totalPages}
            </span>

            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPage((current) =>
                  current + 1,
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}