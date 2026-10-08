"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  User,
  Users,
} from "lucide-react";

type UserRole = "USER" | "ADMIN";

type Application = {
  id: string;
  phoneNumber: string;
  status:
    | "INTERESTED"
    | "APPLIED"
    | "IN_REVIEW"
    | "SHORTLISTED"
    | "ACCEPTED"
    | "REJECTED"
    | "WITHDRAWN";
  courseName: string | null;
  notes: string | null;
  appliedAt: string | null;
  createdAt: string;
  updatedAt: string;
  college: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    logo: string | null;
    verified: boolean;
    city: {
      name: string;
      state: {
        name: string;
      };
    };
  };
};

type Shortlist = {
  id: string;
  createdAt: string;
  college: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    logo: string | null;
    verified: boolean;
    city: {
      name: string;
      state: {
        name: string;
      };
    };
  };
};

type UserDetails = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;

  applications: Application[];
  shortlists: Shortlist[];

  _count: {
    applications: number;
    shortlists: number;
    reviews: number;
  };
};

type ApiResponse = {
  success: boolean;
  data?: UserDetails;
  message?: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

function statusClass(status: Application["status"]) {
  switch (status) {
    case "ACCEPTED":
      return "bg-green-50 text-green-700";

    case "REJECTED":
      return "bg-red-50 text-red-700";

    case "IN_REVIEW":
      return "bg-blue-50 text-blue-700";

    case "SHORTLISTED":
      return "bg-purple-50 text-purple-700";

    case "APPLIED":
      return "bg-amber-50 text-amber-700";

    case "WITHDRAWN":
      return "bg-gray-100 text-gray-600";

    default:
      return "bg-[#eaf8f1] text-[#13804f]";
  }
}

export default function AdminUserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, setUser] = useState<UserDetails | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        setLoading(true);
        setError("");

        const { id } = await params;

        const response = await fetch(
          `/admin/api/admin/users/${id}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        );

        const data: ApiResponse =
          await response.json();

        if (!response.ok || !data.success || !data.data) {
          throw new Error(
            data.message || "Failed to fetch user.",
          );
        }

        if (mounted) {
          setUser(data.data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch user.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [params]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200" />
        <div className="h-56 animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-5">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Users
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || "User not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link
          href="/admin/users"
          className="hover:text-gray-900"
        >
          Users
        </Link>

        <ChevronRight size={14} />

        <span>{user.name}</span>
      </div>

      {/* Profile header */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-[#eaf8f1] via-white to-[#f6f8f7]" />

        <div className="-mt-12 px-5 pb-6 sm:px-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-[#15945c] text-2xl font-bold text-white shadow-sm">
                  {getInitials(user.name)}
                </div>
              )}

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>

                  {user.role === "ADMIN" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[11px] font-semibold text-purple-700">
                      <ShieldCheck size={12} />
                      ADMIN
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-500">
                  Registered {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            <Link
              href="/admin/users"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft size={16} />
              Back to Users
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#15945c]">
              <FileText size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Applications
              </p>

              <p className="text-xl font-bold text-gray-900">
                {user._count.applications}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Star size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Shortlisted
              </p>

              <p className="text-xl font-bold text-gray-900">
                {user._count.shortlists}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <p className="text-xs text-gray-400">
                Reviews
              </p>

              <p className="text-xl font-bold text-gray-900">
                {user._count.reviews}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile information */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#15945c]">
            <User size={19} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">
              Profile Information
            </h2>

            <p className="text-xs text-gray-400">
              Account details
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-gray-400">
              Full Name
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {user.name}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <Mail size={13} />
              Email
            </p>

            <p className="mt-1 break-all font-medium text-gray-900">
              {user.email}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <Phone size={13} />
              Phone
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {user.phone || "Not provided"}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <CalendarDays size={13} />
              Registered
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {formatDateTime(user.createdAt)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <Clock3 size={13} />
              Last Updated
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {formatDateTime(user.updatedAt)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <ShieldCheck size={13} />
              Account Role
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {user.role}
            </p>
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8f1] text-[#15945c]">
              <FileText size={19} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Applications
              </h2>

              <p className="text-xs text-gray-400">
                Colleges this user has applied to
              </p>
            </div>
          </div>
        </div>

        {user.applications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FileText
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-600">
              No applications yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {user.applications.map((application) => (
              <div
                key={application.id}
                className="p-5 sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    {application.college.logo ? (
                      <img
                        src={application.college.logo}
                        alt={application.college.name}
                        className="h-12 w-12 shrink-0 rounded-xl border border-gray-100 object-contain"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                        <Users size={18} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900">
                        {application.college.name}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={12} />
                        {application.college.city.name},{" "}
                        {application.college.city.state.name}
                      </p>

                      {application.courseName && (
                        <p className="mt-2 text-xs font-medium text-[#15945c]">
                          Course: {application.courseName}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`self-start rounded-full px-3 py-1.5 text-[11px] font-semibold ${statusClass(
                      application.status,
                    )}`}
                  >
                    {application.status.replaceAll(
                      "_",
                      " ",
                    )}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400">
                  <span>
                    Added {formatDate(application.createdAt)}
                  </span>

                  {application.appliedAt && (
                    <span>
                      Applied{" "}
                      {formatDate(application.appliedAt)}
                    </span>
                  )}

                  <span>
                    Phone: {application.phoneNumber}
                  </span>
                </div>

                {application.notes && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                    <span className="font-semibold">
                      Notes:
                    </span>{" "}
                    {application.notes}
                  </div>
                )}

                <div className="mt-4">
                  <Link
                    href={`/colleges/${application.college.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15945c] hover:underline"
                  >
                    View College
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shortlists */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Star size={19} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Shortlisted Colleges
              </h2>

              <p className="text-xs text-gray-400">
                Colleges saved by this user
              </p>
            </div>
          </div>
        </div>

        {user.shortlists.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Star
              size={32}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 text-sm font-medium text-gray-600">
              No shortlisted colleges
            </p>
          </div>
        ) : (
          <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
            {user.shortlists.map((shortlist) => (
              <div
                key={shortlist.id}
                className="rounded-xl border border-gray-100 bg-gray-50/70 p-4"
              >
                <div className="flex items-start gap-3">
                  {shortlist.college.logo ? (
                    <img
                      src={shortlist.college.logo}
                      alt={shortlist.college.name}
                      className="h-11 w-11 shrink-0 rounded-lg border border-gray-100 bg-white object-contain"
                    />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400">
                      <Users size={17} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900">
                      {shortlist.college.name}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <MapPin size={11} />
                      {shortlist.college.city.name},{" "}
                      {shortlist.college.city.state.name}
                    </p>

                    <p className="mt-2 text-[11px] text-gray-400">
                      Added {formatDate(shortlist.createdAt)}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/colleges/${shortlist.college.slug}`}
                  target="_blank"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#15945c] hover:underline"
                >
                  View College
                  <ExternalLink size={13} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}