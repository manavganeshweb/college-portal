import {
  Award,
  BarChart3,
  CalendarDays,
  ExternalLink,
  Medal,
  Trophy,
} from "lucide-react";

import type { CollegeDetail } from "@/services/college.service";

type CollegeRankingsProps = {
  collegeName: string;
  rankings: CollegeDetail["rankings"];
};

type RankingRecord = CollegeDetail["rankings"][number];

export default function CollegeRankings({
  collegeName,
  rankings,
}: CollegeRankingsProps) {
  const sortedRankings = [...rankings].sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year;
    }

    return a.rank - b.rank;
  });

  const latestRanking = sortedRankings[0];

  const rankingBodies = [
    ...new Set(sortedRankings.map((ranking) => ranking.rankingBody)),
  ];

  const categories = [
    ...new Set(sortedRankings.map((ranking) => ranking.category)),
  ];

  return (
    <article
      id="rankings"
      className="scroll-mt-32 rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="border-b border-slate-100 px-5 py-6 sm:px-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#15945c]/10">
            <Trophy className="h-5 w-5 text-[#15945c]" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {collegeName} Rankings 2026
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Explore ranking information for {collegeName}, including
              ranking bodies, categories, years, ranks and available
              ranking scores.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-5 py-6 sm:px-7">
        {sortedRankings.length === 0 ? (
          <EmptyRankings />
        ) : (
          <>
            {/* Latest Ranking */}
            {latestRanking && (
              <section>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Latest Ranking
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Most recent ranking record available
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#15945c]/10 px-3 py-1.5 text-xs font-semibold text-[#15945c]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {latestRanking.year}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <RankingStat
                    icon={<Medal className="h-4 w-4" />}
                    label="Rank"
                    value={`#${latestRanking.rank}`}
                  />

                  <RankingStat
                    icon={<Award className="h-4 w-4" />}
                    label="Ranking Body"
                    value={latestRanking.rankingBody}
                  />

                  <RankingStat
                    icon={<BarChart3 className="h-4 w-4" />}
                    label="Category"
                    value={latestRanking.category}
                  />

                  <RankingStat
                    icon={<Trophy className="h-4 w-4" />}
                    label="Total Colleges"
                    value={formatNumber(latestRanking.totalColleges)}
                  />
                </div>
              </section>
            )}

            {/* Ranking History */}
            <section>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Ranking History
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Available ranking records for {collegeName}.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {rankingBodies.length}{" "}
                    {rankingBodies.length === 1
                      ? "Ranking Body"
                      : "Ranking Bodies"}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                    {categories.length}{" "}
                    {categories.length === 1
                      ? "Category"
                      : "Categories"}
                  </span>
                </div>
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
                          Ranking Body
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Category
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Rank
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Score
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Colleges
                        </th>

                        <th className="px-4 py-3 font-semibold text-slate-700">
                          Source
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {sortedRankings.map((ranking) => (
                        <RankingRow
                          key={ranking.id}
                          ranking={ranking}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Ranking Bodies */}
            <section>
              <h3 className="text-lg font-bold text-slate-900">
                Ranking Bodies
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {rankingBodies.map((body) => {
                  const bodyRankings = sortedRankings.filter(
                    (ranking) => ranking.rankingBody === body
                  );

                  const latest = bodyRankings[0];

                  return (
                    <div
                      key={body}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {body}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {latest?.category || "Ranking"}
                          </p>
                        </div>

                        {latest && (
                          <span className="shrink-0 rounded-lg bg-[#15945c]/10 px-2.5 py-1 text-sm font-bold text-[#15945c]">
                            #{latest.rank}
                          </span>
                        )}
                      </div>

                      {latest && (
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                          <span className="text-slate-500">
                            {latest.year}
                          </span>

                          {latest.score !== null && (
                            <span className="font-medium text-slate-700">
                              Score: {formatScore(latest.score)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Source / Note */}
            <div className="rounded-xl border border-[#15945c]/20 bg-[#15945c]/5 p-4">
              <p className="text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-900">
                  Note:
                </span>{" "}
                Rankings can differ by ranking body, category and year.
                The information shown here is based on ranking records
                currently available for this college.
              </p>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function RankingRow({
  ranking,
}: {
  ranking: RankingRecord;
}) {
  return (
    <tr className="bg-white transition hover:bg-slate-50">
      <td className="px-4 py-4 font-semibold text-slate-900">
        {ranking.year}
      </td>

      <td className="px-4 py-4 text-slate-700">
        {ranking.rankingBody}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {ranking.category}
      </td>

      <td className="px-4 py-4">
        <span className="inline-flex items-center rounded-lg bg-[#15945c]/10 px-2.5 py-1 font-bold text-[#15945c]">
          #{ranking.rank}
        </span>
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatScore(ranking.score)}
      </td>

      <td className="px-4 py-4 text-slate-600">
        {formatNumber(ranking.totalColleges)}
      </td>

      <td className="px-4 py-4">
        {ranking.sourceUrl ? (
          <a
            href={ranking.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#15945c] hover:underline"
          >
            View
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
    </tr>
  );
}

function RankingStat({
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

      <p className="mt-2 truncate text-lg font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function EmptyRankings() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
      <Trophy className="mx-auto h-8 w-8 text-slate-400" />

      <h3 className="mt-3 font-semibold text-slate-900">
        Ranking information unavailable
      </h3>

      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
        Ranking records have not been added for this college yet.
      </p>
    </div>
  );
}

function formatScore(value: unknown): string {
  if (value === null || value === undefined) {
    return "—";
  }

  const score = Number(value);

  if (!Number.isFinite(score)) {
    return "—";
  }

  return score.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  });
}

function formatNumber(value: number | null): string {
  if (value === null || value === undefined) {
    return "—";
  }

  return value.toLocaleString("en-IN");
}