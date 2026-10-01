import {
  ArrowDownUp,
  BarChart3,
  BookOpen,
  Filter,
  GraduationCap,
} from "lucide-react";

import type { CollegeDetail } from "@/services/college.service";

type CollegeCutoffsProps = {
  collegeName: string;
  cutoffs: CollegeDetail["cutoffs"];
};

export default function CollegeCutoffs({
   collegeName,
  cutoffs,
}: CollegeCutoffsProps) {
  const sortedCutoffs = [...cutoffs].sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }

    return (a.closingRank ?? Infinity) - (b.closingRank ?? Infinity);
  });

  const years = [...new Set(sortedCutoffs.map((item) => item.year))];

  const exams = [
    ...new Map(
      sortedCutoffs.map((item) => [
        item.exam.id,
        item.exam,
      ])
    ).values(),
  ];

  return (
    <article
      id="cutoff"
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10">
            <BarChart3 className="h-5 w-5 text-[#15945c]" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {collegeName} Cutoff 2026
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Check previous and latest available cutoff information,
              including opening and closing ranks for different exams,
              categories and courses.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        {sortedCutoffs.length === 0 ? (
          <EmptyCutoff />
        ) : (
          <>
            {/* Quick Overview */}
            <section>
              <h3 className="text-lg font-bold text-slate-900">
                Cutoff Overview
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <OverviewCard
                  icon={<BarChart3 className="h-4 w-4" />}
                  label="Cutoff Records"
                  value={sortedCutoffs.length.toLocaleString("en-IN")}
                />

                <OverviewCard
                  icon={<Filter className="h-4 w-4" />}
                  label="Years Available"
                  value={years.length.toLocaleString("en-IN")}
                />

                <OverviewCard
                  icon={<BookOpen className="h-4 w-4" />}
                  label="Exams"
                  value={exams.length.toLocaleString("en-IN")}
                />
              </div>
            </section>

            {/* Cutoff Table */}
            <section>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Cutoff Ranks
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Opening and closing ranks from available cutoff records.
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                  <ArrowDownUp className="h-3.5 w-3.5" />
                  Latest first
                </span>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Year
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Exam
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Course
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Category
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Gender
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Opening Rank
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Closing Rank
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {sortedCutoffs.map((cutoff) => (
                        <CutoffRow
                          key={cutoff.id}
                          cutoff={cutoff}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Course-wise cutoff */}
            <section>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#15945c]" />

                <h3 className="text-lg font-bold text-slate-900">
                  Course-wise Cutoff
                </h3>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {getCourses(sortedCutoffs).map((course) => {
                  const records = sortedCutoffs.filter(
                    (cutoff) => cutoff.course === course
                  );

                  const latest = records[0];

                  return (
                    <div
                      key={course}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <h4 className="font-semibold text-slate-900">
                        {course}
                      </h4>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <RankBox
                          label="Opening Rank"
                          value={formatRank(
                            latest?.openingRank
                          )}
                        />

                        <RankBox
                          label="Closing Rank"
                          value={formatRank(
                            latest?.closingRank
                          )}
                        />
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        {latest?.year
                          ? `Latest available record: ${latest.year}`
                          : "Latest available record"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Note */}
            <div className="rounded-xl border border-[#15945c]/20 bg-[#15945c]/5 p-4">
              <p className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-900">
                  Note:
                </span>{" "}
                Cutoff ranks can vary by examination, course, category,
                gender and admission year. The table above reflects the
                cutoff records currently available for this college.
              </p>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function CutoffRow({
  cutoff,
}: {
  cutoff: CollegeDetail["cutoffs"][number];
}) {
  return (
    <tr className="bg-white transition hover:bg-slate-50">
      <td className="px-4 py-4 font-semibold text-slate-900">
        {cutoff.year}
      </td>

      <td className="px-4 py-4 text-slate-700">
        {getExamName(cutoff)}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {cutoff.course || "All Courses"}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {cutoff.category || "—"}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {cutoff.gender
          ? formatValue(cutoff.gender)
          : "All"}
      </td>

      <td className="px-4 py-4 font-medium text-slate-900">
        {formatRank(cutoff.openingRank)}
      </td>

      <td className="px-4 py-4 font-semibold text-[#15945c]">
        {formatRank(cutoff.closingRank)}
      </td>
    </tr>
  );
}

function OverviewCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="text-[#15945c]">{icon}</span>

        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function RankBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-[11px] font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EmptyCutoff() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <BarChart3 className="mx-auto h-8 w-8 text-slate-400" />

      <h3 className="mt-3 font-semibold text-slate-900">
        Cutoff information unavailable
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        Cutoff records have not been added for this college yet.
      </p>
    </div>
  );
}

function getExamName(
  cutoff: CollegeDetail["cutoffs"][number]
): string {
  return cutoff.exam?.name || "—";
}

function getCollegeName(
  cutoffs: CollegeDetail["cutoffs"]
): string {
  /*
   * College name is not part of the cutoff relation.
   * The page heading is therefore intentionally generic when
   * the component only receives cutoff records.
   */
  return "College";
}

function getCourses(
  cutoffs: CollegeDetail["cutoffs"]
): string[] {
  return [
    ...new Set(
      cutoffs
        .map((cutoff) => cutoff.course)
        .filter(
          (course): course is string =>
            Boolean(course)
        )
    ),
  ];
}

function formatRank(value: number | null): string {
  if (value === null || value === undefined) {
    return "—";
  }

  return value.toLocaleString("en-IN");
}

function formatValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}