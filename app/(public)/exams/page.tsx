import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { getExams } from "@/services/exam.service";

import ExamCard from "../components/public/ExamCard";
import ExamFilters from "../components/public/ExamFilters";

export const revalidate = 3600;

type ExamsPageProps = {
  searchParams: Promise<{
    search?: string;
    conductingBody?: string;
    page?: string;
  }>;
};

export default async function ExamsPage({
  searchParams,
}: ExamsPageProps) {
  const params = await searchParams;

  const pageParam = Number(params.page ?? "1");

  const page =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;

  const { exams, pagination } = await getExams({
    search: params.search,
    conductingBody: params.conductingBody,
    page,
    limit: 12,
  });

  function createPageUrl(nextPage: number) {
    const query = new URLSearchParams();

    if (params.search) {
      query.set("search", params.search);
    }

    if (params.conductingBody) {
      query.set(
        "conductingBody",
        params.conductingBody
      );
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/exams?${queryString}`
      : "/exams";
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 shadow-sm">
              <CalendarDays size={16} />
              Entrance Exams
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Find the right entrance exam
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Explore entrance exams, important dates,
              eligibility information and college cutoff
              records to plan your next step.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ExamFilters />

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">
              {pagination.total}{" "}
              {pagination.total === 1 ? "exam" : "exams"} found
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Entrance Exams
            </h2>
          </div>

          {pagination.totalPages > 1 && (
            <p className="text-sm text-slate-500">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>
          )}
        </div>

        {exams.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {exams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <CalendarDays
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No exams found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filter.
            </p>

            <Link
              href="/exams"
              className="mt-5 inline-flex rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              View all exams
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            {pagination.hasPreviousPage ? (
              <Link
                href={createPageUrl(
                  pagination.page - 1
                )}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
              >
                <ArrowLeft size={16} />
                Previous
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                <ArrowLeft size={16} />
                Previous
              </span>
            )}

            <span className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white">
              {pagination.page}
            </span>

            {pagination.hasNextPage ? (
              <Link
                href={createPageUrl(
                  pagination.page + 1
                )}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-300 hover:text-emerald-700"
              >
                Next
                <ArrowRight size={16} />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                Next
                <ArrowRight size={16} />
              </span>
            )}
          </div>
        )}
      </section>
    </main>
  );
}