import Link from "next/link";
import {
  Plus,
  Search,
  ExternalLink,
  Pencil,
  FileText,
  GraduationCap,
} from "lucide-react";

type Exam = {
  id: string;
  name: string;
  slug: string;
  shortName: string | null;
  description: string | null;
  conductingBody: string | null;
  examType: string | null;
  eligibility: string | null;
  applicationFee: number | null;
  website: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type ExamsResponse = {
  success: boolean;
  data: Exam[];
  pagination: Pagination;
};

type SearchParams = {
  search?: string;
  conductingBody?: string;
  page?: string;
};

async function getExams(
  searchParams: SearchParams
): Promise<ExamsResponse> {
  const search = searchParams.search?.trim() || "";
  const conductingBody =
    searchParams.conductingBody?.trim() || "";

  const page = Math.max(
    1,
    Number(searchParams.page || "1")
  );

  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (conductingBody) {
    params.set("conductingBody", conductingBody);
  }

  params.set("page", String(page));
  params.set("limit", "12");

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/admin/api/admin/exams?${params.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exams");
  }

  return response.json();
}

function formatCurrency(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function createPageUrl(
  searchParams: SearchParams,
  page: number
) {
  const params = new URLSearchParams();

  if (searchParams.search) {
    params.set("search", searchParams.search);
  }

  if (searchParams.conductingBody) {
    params.set(
      "conductingBody",
      searchParams.conductingBody
    );
  }

  params.set("page", String(page));

  return `/admin/exams?${params.toString()}`;
}

export default async function AdminExamsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const result = await getExams(params);

  const exams = result.success ? result.data : [];
  const pagination = result.pagination;

  const conductingBodies = Array.from(
    new Set(
      exams
        .map((exam) => exam.conductingBody)
        .filter(
          (body): body is string => Boolean(body)
        )
    )
  ).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-green-700">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Exams
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage entrance exams and examination information.
          </p>
        </div>

        <Link
          href="/admin/exams/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800"
        >
          <Plus className="h-4 w-4" />
          Add Exam
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Exams
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {pagination.total}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Exam Types
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {
                  new Set(
                    exams
                      .map((exam) => exam.examType)
                      .filter(Boolean)
                  ).size
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Conducting Bodies
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {conductingBodies.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <form className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_250px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              name="search"
              defaultValue={params.search || ""}
              placeholder="Search by exam name or short name..."
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <input
            type="text"
            name="conductingBody"
            defaultValue={params.conductingBody || ""}
            placeholder="Conducting body"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          <button
            type="submit"
            className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Search
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {exams.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-300" />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No exams found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or add a new exam.
            </p>

            <Link
              href="/admin/exams/new"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            >
              <Plus className="h-4 w-4" />
              Add Exam
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Exam
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Conducting Body
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Type
                  </th>

                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Application Fee
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {exams.map((exam) => (
                  <tr
                    key={exam.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          href={`/admin/exams/${exam.id}`}
                          className="font-medium text-gray-900 hover:text-green-700"
                        >
                          {exam.name}
                        </Link>

                        <p className="mt-1 text-xs text-gray-500">
                          {exam.shortName || exam.slug}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {exam.conductingBody || "—"}
                    </td>

                    <td className="px-6 py-4">
                      {exam.examType ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          {exam.examType}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatCurrency(exam.applicationFee)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/exams/${exam.id}`}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          title="View / Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        {exam.website && (
                          <a
                            href={exam.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-green-700"
                            title="Official website"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
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
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>

          <div className="flex gap-2">
            {pagination.hasPreviousPage ? (
              <Link
                href={createPageUrl(
                  params,
                  pagination.page - 1
                )}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-300">
                Previous
              </span>
            )}

            {pagination.hasNextPage ? (
              <Link
                href={createPageUrl(
                  params,
                  pagination.page + 1
                )}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-300">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
