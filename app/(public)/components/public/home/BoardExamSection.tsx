import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ExternalLink,
  GraduationCap,
} from "lucide-react";

import { getHomepageBoardExams } from "@/services/home.service";

function formatDate(date: Date | null) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function BoardExamSection() {
  const exams = await getHomepageBoardExams(6);

  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-700">
              <GraduationCap className="h-4 w-4" />
              Board examinations
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Board Exam Updates
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Stay updated with board examination schedules,
              results, and official resources.
            </p>
          </div>

          <Link
            href="/exams"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            View all exams
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {exams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CalendarDays className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              Board exam information is not published yet
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              Official board examination information will appear
              here once it has been added and published.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <article
                key={exam.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  {exam.examYear && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {exam.examYear}
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                  {exam.name}
                </h3>

                {(exam.board || exam.className) && (
                  <p className="mt-1 text-sm font-medium text-emerald-700">
                    {[exam.board, exam.className]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}

                {exam.description && (
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                    {exam.description}
                  </p>
                )}

                <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                  {exam.examDate && (
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-slate-500">
                        Exam date
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatDate(exam.examDate)}
                      </span>
                    </div>
                  )}

                  {exam.resultDate && (
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-slate-500">
                        Result date
                      </span>

                      <span className="font-semibold text-slate-800">
                        {formatDate(exam.resultDate)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <Link
                    href={`/exams/${exam.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    View details
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  {exam.officialUrl && (
                    <a
                      href={exam.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Official website for ${exam.name}`}
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}