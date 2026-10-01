import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Eye,
  Plus,
  Search,
} from "lucide-react";

type CourseLevel =
  | "UG"
  | "PG"
  | "DIPLOMA"
  | "PHD"
  | "CERTIFICATE";

type CourseStatus = "ACTIVE" | "INACTIVE";

type AdminCourse = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  degree: string | null;
  level: CourseLevel;
  durationYears: number | null;
  averageFees: number | null;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;

  category: {
    id: string;
    name: string;
  };

  _count: {
    colleges: number;
  };
};

type Category = {
  id: string;
  name: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type AdminCoursesData = {
  courses: AdminCourse[];
  pagination: Pagination;
};

type SearchParams = Promise<{
  search?: string;
  categoryId?: string;
  level?: string;
  status?: string;
  page?: string;
}>;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getLevelLabel(level: CourseLevel) {
  const labels: Record<CourseLevel, string> = {
    UG: "Undergraduate",
    PG: "Postgraduate",
    DIPLOMA: "Diploma",
    PHD: "PhD",
    CERTIFICATE: "Certificate",
  };

  return labels[level];
}

function formatFees(fees: number | null) {
  if (fees === null || Number.isNaN(fees)) {
    return "—";
  }

  return `₹${fees.toLocaleString("en-IN")}`;
}

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */

async function getAdminCourses(
  searchParams: Awaited<SearchParams>
): Promise<AdminCoursesData> {
  const params = new URLSearchParams();

  if (searchParams.search) {
    params.set("search", searchParams.search);
  }

  if (searchParams.categoryId) {
    params.set("categoryId", searchParams.categoryId);
  }

  if (searchParams.level) {
    params.set("level", searchParams.level);
  }

  if (searchParams.status) {
    params.set("status", searchParams.status);
  }

  params.set("page", searchParams.page || "1");
  params.set("limit", "20");

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/admin/api/admin/courses?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("Admin courses API error:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
    });

    throw new Error(
      `Failed to fetch courses: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  if (!result.success) {
    console.error("Admin courses API returned success=false:", result);

    throw new Error(
      result.error || "Failed to fetch courses"
    );
  }

  /*
   * Supported response formats:
   *
   * 1.
   * {
   *   success: true,
   *   data: {
   *     courses: [],
   *     pagination: {}
   *   }
   * }
   *
   * 2.
   * {
   *   success: true,
   *   data: [],
   *   pagination: {}
   * }
   */

  const rawCourses = Array.isArray(result.data)
    ? result.data
    : result.data?.courses;

  const rawPagination =
    result.pagination || result.data?.pagination;

  const courses: AdminCourse[] = Array.isArray(rawCourses)
    ? rawCourses
    : [];

  const currentPage =
    Number(rawPagination?.page) ||
    Number(searchParams.page) ||
    1;

  const limit =
    Number(rawPagination?.limit) || 20;

  const total =
    Number(rawPagination?.total) || courses.length;

  const totalPages =
    Number(rawPagination?.totalPages) ||
    Math.max(1, Math.ceil(total / limit));

  const pagination: Pagination = {
    page: currentPage,
    limit,
    total,
    totalPages,
    hasNextPage:
      typeof rawPagination?.hasNextPage === "boolean"
        ? rawPagination.hasNextPage
        : currentPage < totalPages,
    hasPreviousPage:
      typeof rawPagination?.hasPreviousPage === "boolean"
        ? rawPagination.hasPreviousPage
        : currentPage > 1,
  };

  return {
    courses,
    pagination,
  };
}


async function getCategories(): Promise<Category[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/admin/api/admin/categories`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error(
      "Categories API failed:",
      response.status,
      response.statusText
    );

    return [];
  }

  const result = await response.json();

  if (!result?.success) {
    return [];
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  return [];
}
/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const courseData = await getAdminCourses(params);
  const categories = await getCategories();

  /*
   * These are guaranteed to exist because getAdminCourses()
   * always returns both properties.
   */
  const courses = courseData.courses;
  const pagination = courseData.pagination;

  const activeCourses = courses.filter(
    (course) => course.status === "ACTIVE"
  ).length;

  const inactiveCourses = courses.filter(
    (course) => course.status === "INACTIVE"
  ).length;

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Education Data
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Courses
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage courses, categories, levels and course information.
          </p>
        </div>

        <Link
          href="/admin/courses/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </Link>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Filters                                                            */}
      {/* ------------------------------------------------------------------ */}

      <form
        method="GET"
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_160px_auto]">
          {/* Search */}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              name="search"
              defaultValue={params.search || ""}
              placeholder="Search courses..."
              className="form-input w-full rounded-xl border-slate-200 pl-10"
            />
          </div>

          {/* Category */}

          <select
            name="categoryId"
            defaultValue={params.categoryId || ""}
            className="form-input rounded-xl border-slate-200"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* Level */}

          <select
            name="level"
            defaultValue={params.level || ""}
            className="form-input rounded-xl border-slate-200"
          >
            <option value="">All Levels</option>
            <option value="UG">Undergraduate</option>
            <option value="PG">Postgraduate</option>
            <option value="DIPLOMA">Diploma</option>
            <option value="PHD">PhD</option>
            <option value="CERTIFICATE">
              Certificate
            </option>
          </select>

          {/* Status */}

          <select
            name="status"
            defaultValue={params.status || ""}
            className="form-input rounded-xl border-slate-200"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Filter
          </button>
        </div>
      </form>

      {/* ------------------------------------------------------------------ */}
      {/* Stats                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Courses
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {pagination.total}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3">
              <BookOpen className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Active */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Active Courses
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {activeCourses}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Inactive */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Inactive Courses
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {inactiveCourses}
              </p>
            </div>

            <div className="rounded-xl bg-red-50 p-3">
              <CircleX className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Courses Table                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {courses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Course
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Level
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Fees
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Colleges
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    {/* Course */}

                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {course.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {course.shortName ||
                            course.slug}
                        </p>

                        {course.degree && (
                          <p className="mt-1 text-xs text-slate-400">
                            {course.degree}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Category */}

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {course.category?.name || "—"}
                      </span>
                    </td>

                    {/* Level */}

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {getLevelLabel(course.level)}
                      </p>

                      {course.durationYears !== null && (
                        <p className="mt-1 text-xs text-slate-400">
                          {course.durationYears} years
                        </p>
                      )}
                    </td>

                    {/* Fees */}

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {formatFees(course.averageFees)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Average
                      </p>
                    </td>

                    {/* Colleges */}

                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-700">
                        {course._count?.colleges ?? 0}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      {course.status === "ACTIVE" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Action */}

                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */

          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No courses found
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              No courses match your current filters.
              Try changing the search or filters.
            </p>

            <Link
              href="/admin/courses/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Add Course
            </Link>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Pagination                                                         */}
      {/* ------------------------------------------------------------------ */}

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-sm text-slate-500">
            Page{" "}
            <span className="font-semibold text-slate-700">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {pagination.totalPages}
            </span>
          </p>

          <div className="flex items-center gap-2">
            {pagination.hasPreviousPage && (
              <Link
                href={{
                  pathname: "/admin/courses",
                  query: {
                    ...params,
                    page: pagination.page - 1,
                  },
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Link>
            )}

            {pagination.hasNextPage && (
              <Link
                href={{
                  pathname: "/admin/courses",
                  query: {
                    ...params,
                    page: pagination.page + 1,
                  },
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}