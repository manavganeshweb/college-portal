import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Search,
  ShieldCheck,
  Trophy,
} from "lucide-react";

import {
  getPublicRankingFilters,
  getPublicRankings,
} from "@/services/ranking.service";

type RankingsPageProps = {
  searchParams: Promise<{
    search?: string;
    year?: string;
    rankingBody?: string;
    category?: string;
  }>;
};

function formatScore(score: unknown) {
  if (score === null || score === undefined) {
    return null;
  }

  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    return null;
  }

  return Number.isInteger(numericScore)
    ? numericScore.toString()
    : numericScore.toFixed(2);
}

function getRankLabel(rank: number) {
  if (rank === 1) return "1st";
  if (rank === 2) return "2nd";
  if (rank === 3) return "3rd";

  return `${rank}th`;
}

function getRankStyle(rank: number) {
  if (rank === 1) {
    return {
      wrapper:
        "border-amber-200 bg-amber-50 text-amber-700",
      icon: "text-amber-500",
    };
  }

  if (rank === 2) {
    return {
      wrapper:
        "border-slate-200 bg-slate-50 text-slate-600",
      icon: "text-slate-400",
    };
  }

  if (rank === 3) {
    return {
      wrapper:
        "border-orange-200 bg-orange-50 text-orange-700",
      icon: "text-orange-500",
    };
  }

  return {
    wrapper:
      "border-gray-200 bg-white text-gray-700",
    icon: "text-[#15945c]",
  };
}

function buildFilterUrl(
  params: {
    search?: string;
    year?: string;
    rankingBody?: string;
    category?: string;
  },
) {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.year) {
    query.set("year", params.year);
  }

  if (params.rankingBody) {
    query.set("rankingBody", params.rankingBody);
  }

  if (params.category) {
    query.set("category", params.category);
  }

  const queryString = query.toString();

  return queryString
    ? `/rankings?${queryString}`
    : "/rankings";
}

export const metadata = {
  title: "College Rankings 2026 | Top Colleges in India | College Aadhar",
  description:
    "Explore college rankings in India by ranking body, year, category and college. Compare top colleges and find verified ranking information on College Aadhar.",
};

export default async function RankingsPage({
  searchParams,
}: RankingsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() || "";
  const year = params.year
    ? Number(params.year)
    : undefined;

  const rankingBody =
    params.rankingBody?.trim() || "";

  const category =
    params.category?.trim() || "";

  const [
    rankings,
    filterOptions,
  ] = await Promise.all([
    getPublicRankings({
      search,
      year:
        year && Number.isFinite(year)
          ? year
          : undefined,
      rankingBody: rankingBody || undefined,
      category: category || undefined,
    }),
    getPublicRankingFilters(),
  ]);

  const selectedYear =
    year && filterOptions.years.includes(year)
      ? String(year)
      : "";

  return (
    <main className="min-h-screen bg-[#f7faf8]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#15945c]/5 blur-3xl" />

        <div className="absolute -bottom-40 -left-20 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#15945c]/15 bg-[#15945c]/5 px-3 py-1.5 text-sm font-medium text-[#15945c]">
              <Trophy className="h-4 w-4" />
              College Rankings
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Top College Rankings in India
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Explore published college rankings by ranking body,
              year and category. Find where colleges stand and
              compare ranking information in one place.
            </p>
          </div>
        </div>
      </section>

      {/* FILTERS */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <form
            method="GET"
            action="/rankings"
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]"
          >
            {/* SEARCH */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search college..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
              />
            </div>

            {/* RANKING BODY */}
            <select
              name="rankingBody"
              defaultValue={rankingBody}
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
            >
              <option value="">
                All Ranking Bodies
              </option>

              {filterOptions.rankingBodies.map(
                (body) => (
                  <option key={body} value={body}>
                    {body}
                  </option>
                ),
              )}
            </select>

            {/* YEAR */}
            <select
              name="year"
              defaultValue={selectedYear}
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
            >
              <option value="">All Years</option>

              {filterOptions.years.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            {/* CATEGORY */}
            <select
              name="category"
              defaultValue={category}
              className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
            >
              <option value="">
                All Categories
              </option>

              {filterOptions.categories.map(
                (item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ),
              )}
            </select>

            <button
              type="submit"
              className="h-11 rounded-xl bg-[#15945c] px-5 text-sm font-semibold text-white transition hover:bg-[#117b4c]"
            >
              Search
            </button>
          </form>

          {(search ||
            rankingBody ||
            category ||
            selectedYear) && (
            <div className="mt-3">
              <Link
                href="/rankings"
                className="text-sm font-medium text-[#15945c] hover:underline"
              >
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[#15945c]">
              Rankings
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              Published College Rankings
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {rankings.length}{" "}
            {rankings.length === 1
              ? "ranking"
              : "rankings"}{" "}
            found
          </p>
        </div>

        {rankings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
              <Award className="h-7 w-7 text-gray-400" />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              No rankings found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              We couldn't find published rankings matching
              your selected filters. Try changing your search
              or removing some filters.
            </p>

            <Link
              href="/rankings"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117b4c]"
            >
              View all rankings
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rankings.map((ranking) => {
              const rankStyle =
                getRankStyle(ranking.rank);

              const score = formatScore(
                ranking.score,
              );

              return (
                <article
                  key={ranking.id}
                  className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#15945c]/20 hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    {/* RANK */}
                    <div
                      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl border ${rankStyle.wrapper}`}
                    >
                      <Trophy
                        className={`h-5 w-5 ${rankStyle.icon}`}
                      />

                      <span className="mt-0.5 text-sm font-bold">
                        #{ranking.rank}
                      </span>
                    </div>

                    {/* COLLEGE */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          {ranking.college.logo ? (
                            <img
                              src={ranking.college.logo}
                              alt={`${ranking.college.name} logo`}
                              className="h-full w-full object-contain p-1.5"
                            />
                          ) : (
                            <Award className="h-5 w-5 text-gray-400" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <Link
                            href={`/colleges/${ranking.college.slug}`}
                            className="inline-flex max-w-full items-center gap-1.5 text-base font-bold text-gray-900 transition hover:text-[#15945c] sm:text-lg"
                          >
                            <span className="truncate">
                              {ranking.college.shortName ||
                                ranking.college.name}
                            </span>

                            {ranking.college.verified && (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#15945c]" />
                            )}
                          </Link>

                          <p className="mt-1 text-sm text-gray-500">
                            {ranking.college.name}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />

                              {ranking.college.city.name},{" "}
                              {
                                ranking.college.city
                                  .state.name
                              }
                            </span>

                            <span>
                              {ranking.rankingBody}
                            </span>

                            <span>
                              {ranking.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RANKING DETAILS */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:w-[330px] lg:grid-cols-3">
                      <div className="rounded-xl bg-gray-50 px-3 py-3">
                        <p className="text-xs text-gray-500">
                          Rank
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {getRankLabel(
                            ranking.rank,
                          )}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 px-3 py-3">
                        <p className="text-xs text-gray-500">
                          Score
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {score || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-gray-50 px-3 py-3">
                        <p className="text-xs text-gray-500">
                          Year
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                          {ranking.year}
                        </p>
                      </div>
                    </div>

                    {/* SOURCE */}
                    {ranking.sourceUrl && (
                      <a
                        href={ranking.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#15945c]/30 hover:bg-[#15945c]/5 hover:text-[#15945c]"
                      >
                        Source
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {ranking.totalColleges && (
                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ShieldCheck className="h-4 w-4 text-[#15945c]" />

                        Ranked among{" "}
                        <span className="font-semibold text-gray-700">
                          {ranking.totalColleges.toLocaleString(
                            "en-IN",
                          )}
                        </span>{" "}
                        colleges
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* INFORMATION SECTION */}
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-[#f7faf8] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15945c]/10">
                <Trophy className="h-5 w-5 text-[#15945c]" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Compare Rankings
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Explore how colleges are positioned across
                different ranking bodies and years.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#f7faf8] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15945c]/10">
                <ShieldCheck className="h-5 w-5 text-[#15945c]" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Published Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Rankings shown here are limited to records
                published through the College Aadhar platform.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-[#f7faf8] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15945c]/10">
                <Award className="h-5 w-5 text-[#15945c]" />
              </div>

              <h3 className="mt-4 font-semibold text-gray-900">
                Explore Colleges
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Open a college profile to explore courses,
                admissions, placements, cutoffs and more.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}