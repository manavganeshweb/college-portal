import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Eye,
  Plus,
  Search,
  ShieldCheck,
} from "lucide-react";

type AdminCollege = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  logo: string | null;
  coverImage: string | null;
  collegeType: string;
  establishedYear: number | null;
  verified: boolean;
  status: string;
  lastUpdated: string;
  createdAt: string;

  state: {
    id: string;
    name: string;
  };

  city: {
    id: string;
    name: string;
  };

  _count: {
    courses: number;
    reviews: number;
    rankings: number;
    departments: number;
    placements: number;
    questions: number;
  };
};

type AdminCollegesResponse = {
  success: boolean;
  data: AdminCollege[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

type SearchParams = Promise<{
  search?: string;
  stateId?: string;
  cityId?: string;
  collegeType?: string;
  status?: string;
  verified?: string;
  page?: string;
}>;

async function getAdminColleges(
  searchParams: Awaited<SearchParams>
): Promise<AdminCollegesResponse> {
  const params = new URLSearchParams();

  if (searchParams.search) {
    params.set("search", searchParams.search);
  }

  if (searchParams.stateId) {
    params.set("stateId", searchParams.stateId);
  }

  if (searchParams.cityId) {
    params.set("cityId", searchParams.cityId);
  }

  if (searchParams.collegeType) {
    params.set("collegeType", searchParams.collegeType);
  }

  if (searchParams.status) {
    params.set("status", searchParams.status);
  }

  if (searchParams.verified) {
    params.set("verified", searchParams.verified);
  }

  params.set("page", searchParams.page || "1");
  params.set("limit", "20");

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/admin/colleges?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch admin colleges");
  }

  return response.json();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getCollegeTypeLabel(type: string) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

export default async function AdminCollegesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const result = await getAdminColleges(params);

  const colleges = result.data;
  const pagination = result.pagination;

  function createPageUrl(page: number) {
    const query = new URLSearchParams();

    if (params.search) {
      query.set("search", params.search);
    }

    if (params.stateId) {
      query.set("stateId", params.stateId);
    }

    if (params.cityId) {
      query.set("cityId", params.cityId);
    }

    if (params.collegeType) {
      query.set("collegeType", params.collegeType);
    }

    if (params.status) {
      query.set("status", params.status);
    }

    if (params.verified) {
      query.set("verified", params.verified);
    }

    query.set("page", String(page));

    return `/admin/colleges?${query.toString()}`;
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#15945c]">
            Education Data
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Colleges
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage college information, verification and
            platform visibility.
          </p>
        </div>

        <Link
          href="/admin/colleges/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#15945c] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#117a4b]"
        >
          <Plus size={18} />
          Add College
        </Link>
      </section>

      {/* Filters */}
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <form
          method="GET"
          className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto]"
        >
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              name="search"
              defaultValue={params.search || ""}
              placeholder="Search colleges..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:bg-white focus:ring-2 focus:ring-[#15945c]/10"
            />
          </div>

          <select
            name="collegeType"
            defaultValue={params.collegeType || ""}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-[#15945c]"
          >
            <option value="">All Types</option>
            <option value="GOVERNMENT">Government</option>
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
            <option value="DEEMED">Deemed</option>
            <option value="AUTONOMOUS">Autonomous</option>
          </select>

          <select
            name="status"
            defaultValue={params.status || ""}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-[#15945c]"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            name="verified"
            defaultValue={params.verified || ""}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none focus:border-[#15945c]"
          >
            <option value="">Verification</option>
            <option value="true">Verified</option>
            <option value="false">Not Verified</option>
          </select>

          <input
            type="text"
            name="stateId"
            defaultValue={params.stateId || ""}
            placeholder="State ID"
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#15945c]"
          />

          <button
            type="submit"
            className="h-11 rounded-xl border border-[#15945c] bg-[#15945c]/5 px-5 text-sm font-semibold text-[#15945c] transition hover:bg-[#15945c] hover:text-white"
          >
            Filter
          </button>
        </form>
      </section>

      {/* Summary */}
      <section className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            College Directory
          </h2>

          <p className="text-sm text-gray-500">
            {pagination.total.toLocaleString("en-IN")} colleges found
          </p>
        </div>

        <p className="text-xs text-gray-400">
          Page {pagination.page} of {Math.max(1, pagination.totalPages)}
        </p>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {colleges.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <Building2
                size={26}
                className="text-gray-400"
              />
            </div>

            <h3 className="mt-4 text-base font-semibold text-gray-900">
              No colleges found
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              Try changing your search or filters, or add a new
              college to the database.
            </p>

            <Link
              href="/admin/colleges/new"
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#15945c] px-4 text-sm font-semibold text-white hover:bg-[#117a4b]"
            >
              <Plus size={17} />
              Add College
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="border-b border-gray-100 bg-gray-50/80">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    College
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Type
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Data
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {colleges.map((college) => (
                  <tr
                    key={college.id}
                    className="transition hover:bg-gray-50/60"
                  >
                    {/* College */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          {college.logo ? (
                            <img
                              src={college.logo}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Building2
                              size={20}
                              className="text-gray-400"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="max-w-[280px] truncate text-sm font-semibold text-gray-900">
                              {college.name}
                            </p>

                            {college.verified && (
                              <ShieldCheck
                                size={16}
                                className="shrink-0 text-[#15945c]"
                              />
                            )}
                          </div>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {college.shortName || college.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-gray-700">
                        {college.city.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {college.state.name}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {getCollegeTypeLabel(
                          college.collegeType
                        )}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {college.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 size={14} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                          <CircleX size={14} />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Data */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span>
                          {college._count.courses} courses
                        </span>

                        <span>
                          {college._count.departments} departments
                        </span>

                        <span>
                          {college._count.reviews} reviews
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Updated {formatDate(college.lastUpdated)}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/colleges/${college.id}`}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-xs font-semibold text-gray-700 transition hover:border-[#15945c] hover:text-[#15945c]"
                      >
                        <Eye size={15} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <section className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          {pagination.hasPreviousPage ? (
            <Link
              href={createPageUrl(pagination.page - 1)}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:border-[#15945c] hover:text-[#15945c]"
            >
              <ChevronLeft size={16} />
              Previous
            </Link>
          ) : (
            <span className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-100 px-3 text-sm font-medium text-gray-300">
              <ChevronLeft size={16} />
              Previous
            </span>
          )}

          <span className="text-sm text-gray-500">
            Page{" "}
            <strong className="text-gray-900">
              {pagination.page}
            </strong>{" "}
            of{" "}
            <strong className="text-gray-900">
              {pagination.totalPages}
            </strong>
          </span>

          {pagination.hasNextPage ? (
            <Link
              href={createPageUrl(pagination.page + 1)}
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:border-[#15945c] hover:text-[#15945c]"
            >
              Next
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className="inline-flex h-9 items-center gap-1 rounded-lg border border-gray-100 px-3 text-sm font-medium text-gray-300">
              Next
              <ChevronRight size={16} />
            </span>
          )}
        </section>
      )}
    </div>
  );
}