import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ExternalLink,
  MapPin,
} from "lucide-react";

import { getCollegeRankings } from "@/services/home.service";

type CollegeRanking = {
  id: string;
  rank: number;
  year: number;
  category: string;
  rankingBody: string;
  score: number | null;
  totalColleges: number | null;
  sourceUrl: string | null;
  publishedAt: Date | null;

  college: {
    id: string;
    name: string;
    slug: string;
    shortName: string | null;
    logo: string | null;
    verified: boolean;

    city: {
      name: string;
    } | null;

    state: {
      name: string;
    };
  };
};

function formatScore(score: number | null) {
  if (score === null) {
    return null;
  }

  return Number.isInteger(score)
    ? score.toString()
    : score.toFixed(2);
}

function getRankingDescription(ranking: CollegeRanking) {
  if (ranking.totalColleges) {
    return `Ranked #${ranking.rank} out of ${ranking.totalColleges} colleges`;
  }

  return `Ranked #${ranking.rank}`;
}

export default async function CollegeRankingSection() {
  const rankings = await getCollegeRankings(2026, undefined, undefined, 10);

  return (
    <section className="bg-slate-50 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-700">
              <Award className="h-4 w-4" />
              Rankings
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              College Ranking 2026
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Explore published college rankings with their ranking
              source and academic year.
            </p>
          </div>

          <Link
            href="/colleges"
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-700"
          >
            Explore colleges

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {rankings.length === 0 ? (
          <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white">
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Award className="h-7 w-7" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                2026 rankings are not published yet
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Rankings will appear here once verified 2026 ranking
                information has been added to College Aadhar.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[80px_minmax(0,1fr)_180px_140px_100px] items-center gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
              <span>Rank</span>
              <span>College</span>
              <span>Location</span>
              <span>Ranking Body</span>
              <span>Score</span>
            </div>

            <div className="divide-y divide-slate-100">
              {rankings.map((ranking) => (
                <div
                  key={ranking.id}
                  className="group grid gap-4 px-5 py-5 transition-colors hover:bg-emerald-50/40 md:grid-cols-[80px_minmax(0,1fr)_180px_140px_100px] md:items-center md:px-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-700">
                      #{ranking.rank}
                    </span>

                    <span className="text-xs font-medium text-slate-400 md:hidden">
                      Rank
                    </span>
                  </div>

                  <div className="min-w-0">
                    <Link
                      href={`/colleges/${ranking.college.slug}`}
                      className="flex items-start gap-3"
                    >
                      <div className="hidden h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 sm:flex">
                        {ranking.college.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={ranking.college.logo}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-500">
                            {ranking.college.shortName?.slice(0, 3) ??
                              ranking.college.name
                                .slice(0, 2)
                                .toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate font-bold text-slate-900 transition-colors group-hover:text-emerald-700">
                            {ranking.college.name}
                          </h3>

                          {ranking.college.verified && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          )}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {getRankingDescription(ranking)}
                        </p>
                      </div>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />

                    <span>
                      {ranking.college.city?.name ?? "City not available"},{" "}
                      {ranking.college.state.name ?? "State not available"}
                    </span>
                  </div>

                  <div>
                    <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      {ranking.rankingBody}
                    </span>
                  </div>

                  <div>
                    {ranking.score !== null ? (
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {formatScore(ranking.score)}
                        </p>

                        <p className="text-xs text-slate-400">
                          Score
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">
                        —
                      </span>
                    )}
                  </div>

                  {ranking.sourceUrl && (
                    <a
                      href={ranking.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 md:col-start-4"
                    >
                      Source
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}