import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  BarChart3,
  Plus,
  Search,
  Pencil,
  Trash2,
} from "lucide-react";

type SearchParams = {
  search?: string;
  examId?: string;
  year?: string;
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const LIMIT = 20;

async function getCutoffs(searchParams: SearchParams) {
  const search = searchParams.search?.trim() || "";
  const examId = searchParams.examId?.trim() || "";
  const year = searchParams.year
    ? Number(searchParams.year)
    : undefined;

  const page = Math.max(
    Number(searchParams.page) || 1,
    1
  );

  const where = {
    ...(examId ? { examId } : {}),
    ...(year && !Number.isNaN(year) ? { year } : {}),
    ...(search
      ? {
          OR: [
            {
              college: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              exam: {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              course: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [cutoffs, total] = await Promise.all([
    prisma.collegeCutoff.findMany({
      where,
      select: {
        id: true,
        year: true,
        category: true,
        gender: true,
        course: true,
        openingRank: true,
        closingRank: true,
        exam: {
          select: {
            id: true,
            name: true,
            shortName: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        {
          year: "desc",
        },
        {
          id: "desc",
        },
      ],
      skip: (page - 1) * LIMIT,
      take: LIMIT,
    }),

    prisma.collegeCutoff.count({
      where,
    }),
  ]);

  return {
    cutoffs,
    pagination: {
      page,
      limit: LIMIT,
      total,
      totalPages: Math.ceil(total / LIMIT),
    },
  };
}

async function getExams() {
  return prisma.exam.findMany({
    select: {
      id: true,
      name: true,
      shortName: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export default async function AdminCutoffsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const [{ cutoffs, pagination }, exams] =
    await Promise.all([
      getCutoffs(params),
      getExams(),
    ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf8f1]">
                <BarChart3
                  size={22}
                  className="text-[#15945c]"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Cutoffs
                </h1>

                <p className="text-sm text-gray-500">
                  Manage exam cutoff data for colleges.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/admin/cutoffs/new"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#15945c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#13804f]"
          >
            <Plus size={18} />
            Add Cutoff
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Records
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {pagination.total}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Exams
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {exams.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Current Page
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {pagination.page}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <form
            method="GET"
            className="grid gap-3 md:grid-cols-[1fr_220px_140px_auto]"
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
                placeholder="Search college, exam or course..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#15945c] focus:ring-2 focus:ring-green-100"
              />
            </div>

            <select
              name="examId"
              defaultValue={params.examId || ""}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#15945c] focus:ring-2 focus:ring-green-100"
            >
              <option value="">All Exams</option>

              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.shortName || exam.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="year"
              defaultValue={params.year || ""}
              placeholder="Year"
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#15945c] focus:ring-2 focus:ring-green-100"
            />

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {cutoffs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <BarChart3
                  size={24}
                  className="text-gray-400"
                />
              </div>

              <h2 className="mt-4 font-semibold text-gray-900">
                No cutoff records found
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add your first exam cutoff record.
              </p>

              <Link
                href="/admin/cutoffs/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#15945c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#13804f]"
              >
                <Plus size={17} />
                Add Cutoff
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-5 py-3">
                      Exam
                    </th>

                    <th className="px-5 py-3">
                      College
                    </th>

                    <th className="px-5 py-3">
                      Year
                    </th>

                    <th className="px-5 py-3">
                      Category
                    </th>

                    <th className="px-5 py-3">
                      Gender
                    </th>

                    <th className="px-5 py-3">
                      Course
                    </th>

                    <th className="px-5 py-3">
                      Opening
                    </th>

                    <th className="px-5 py-3">
                      Closing
                    </th>

                    <th className="px-5 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {cutoffs.map((cutoff) => (
                    <tr
                      key={cutoff.id}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">
                          {cutoff.exam.shortName ||
                            cutoff.exam.name}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[220px] font-medium text-gray-900">
                          {cutoff.college.name}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {cutoff.year}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {cutoff.category || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {cutoff.gender || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {cutoff.course || "-"}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {cutoff.openingRank ?? "-"}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-700">
                        {cutoff.closingRank ?? "-"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/cutoffs/${cutoff.id}`}
                            className="rounded-lg p-2 text-gray-500 hover:bg-green-50 hover:text-[#15945c]"
                            title="Edit cutoff"
                          >
                            <Pencil size={17} />
                          </Link>

                          <button
                            type="button"
                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            title="Delete cutoff"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex gap-2">
              {pagination.page > 1 && (
                <Link
                  href={{
                    pathname: "/admin/cutoffs",
                    query: {
                      ...params,
                      page: pagination.page - 1,
                    },
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}

              {pagination.page <
                pagination.totalPages && (
                <Link
                  href={{
                    pathname: "/admin/cutoffs",
                    query: {
                      ...params,
                      page: pagination.page + 1,
                    },
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}