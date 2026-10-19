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
import CompareCollegeButton from "../components/public/college/CompareCollegeButton";
import {
  getPublicRankingFilters,
  getPublicRankings,
} from "@/services/ranking.service";
import { GraduationCap } from "lucide-react";
import { getColleges } from "@/services/college.service";

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
  collegeResult,
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

  getColleges({
    limit: 200,
  }),
]);

// Data for the Explore All Colleges table.
const colleges = collegeResult.data;

const selectedYear =
  year && filterOptions.years.includes(year)
    ? String(year)
    : "";


  return (
    <main className="min-h-screen bg-[#f7faf8]">
 {/* HERO */}
<section className="relative isolate overflow-hidden border-b border-gray-200 bg-white">
  {/* BACKGROUND DECORATION */}
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full bg-[#15945c]/[0.07] blur-3xl" />

    <div className="absolute -bottom-48 left-[25%] h-[350px] w-[350px] rounded-full bg-emerald-100/50 blur-3xl" />

    <div className="absolute right-[12%] top-16 h-48 w-48 rounded-full border border-[#15945c]/10" />

    <div className="absolute right-[15%] top-20 h-40 w-40 rounded-full border border-[#15945c]/10" />

    <div
      className="absolute inset-0 opacity-[0.025]"
      style={{
        backgroundImage:
          "radial-gradient(#15945c 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
    <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
      {/* LEFT CONTENT */}
      <div className="max-w-2xl">
        {/* BADGE */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#15945c]/20 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#15945c] shadow-sm sm:text-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#15945c]/10">
            <Trophy className="h-3.5 w-3.5" />
          </span>

          College Rankings 2026
        </div>

        {/* HEADING */}
        <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
          Discover India's
          <span className="mt-1 block text-[#15945c]">
            Top Colleges
          </span>
        </h1>

        {/* DESCRIPTION */}
        <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
          Explore college rankings by ranking body, year, and
          category. Discover leading institutions, compare their
          rankings, and make a more informed decision about your
          educational future.
        </p>

        {/* ACTIONS */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#ranking-results"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#15945c] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#15945c]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#117b4c] hover:shadow-xl hover:shadow-[#15945c]/25"
          >
            Explore Rankings
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

          <Link
            href="/colleges"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-[#15945c]/40 hover:bg-[#15945c]/5 hover:text-[#15945c]"
          >
            Explore Colleges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* TRUST INDICATORS */}
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-gray-200/80 pt-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#15945c]/10">
              <ShieldCheck className="h-4 w-4 text-[#15945c]" />
            </span>

            Published ranking data
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#15945c]/10">
              <Trophy className="h-4 w-4 text-[#15945c]" />
            </span>

            Multiple ranking categories
          </div>
        </div>
      </div>

      {/* RIGHT RANKING PREVIEW */}
      <div className="relative mx-auto w-full max-w-md lg:ml-auto">
        {/* DECORATIVE GLOW */}
        <div className="absolute -inset-5 rounded-[2rem] bg-[#15945c]/[0.06] blur-2xl" />

        {/* MAIN CARD */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-[0_20px_70px_-25px_rgba(21,148,92,0.22)]">
          {/* CARD HEADER */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15945c]/10">
                <Trophy className="h-5 w-5 text-[#15945c]" />
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">
                  College Rankings
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Explore institutions
                </p>
              </div>
            </div>

            <span className="rounded-lg border border-[#15945c]/15 bg-[#15945c]/5 px-3 py-1.5 text-xs font-bold text-[#15945c]">
              2026
            </span>
          </div>

          {/* RANKING PREVIEW ROWS */}
          <div className="p-4 sm:p-5">
            {[
              {
                rank: "01",
                name: "Explore Top Universities",
                description: "Discover leading institutions",
                icon: "🏆",
                color: "border-amber-200 bg-amber-50 text-amber-700",
              },
              {
                rank: "02",
                name: "Compare College Rankings",
                description: "Explore rankings across categories",
                icon: "🎓",
                color: "border-gray-200 bg-gray-50 text-gray-600",
              },
              {
                rank: "03",
                name: "Find Your Ideal College",
                description: "Browse institutions across India",
                icon: "📚",
                color: "border-orange-200 bg-orange-50 text-orange-700",
              },
            ].map((item) => (
              <div
                key={item.rank}
                className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition duration-200 hover:border-[#15945c]/15 hover:bg-[#15945c]/[0.04] sm:gap-4 sm:p-4"
              >
                {/* RANK */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${item.color}`}
                >
                  {item.rank}
                </div>

                {/* DETAILS */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-5 text-gray-900 transition group-hover:text-[#15945c]">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    {item.description}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#15945c]" />
              </div>
            ))}
          </div>

          {/* CARD FOOTER */}
          <div className="border-t border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-6">
            <Link
              href="/colleges"
              className="flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Find your next opportunity
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Explore college profiles and details
                </p>
              </div>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#15945c] text-white transition hover:bg-[#117b4c]">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* FLOATING LABEL */}
        <div className="absolute -right-2 top-24 hidden items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-lg sm:flex sm:-right-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#15945c]/10">
            <ShieldCheck className="h-4 w-4 text-[#15945c]" />
          </span>

          <div>
            <p className="text-xs font-bold text-gray-900">
              Informed Choices
            </p>

            <p className="mt-0.5 text-[10px] text-gray-500">
              Explore with confidence
            </p>
          </div>
        </div>
      </div>
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
<div
  className="overflow-hidden  p-8 border-gray-200 bg-white"
  style={{
    fontFamily: "Roboto, sans-serif",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.3,
    color: "#333",
  }}
>
    {/* TABLE HEADER - DESKTOP */}
    <div className="hidden border-b border-gray-200 bg-green-50 lg:grid lg:grid-cols-[minmax(300px,1.8fr)_minmax(150px,0.8fr)_minmax(140px,0.8fr)_minmax(100px,0.55fr)_minmax(100px,0.55fr)]">
      <div className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        College Information
      </div>

      <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Ranking Body
      </div>

      <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Category
      </div>

      <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Score
      </div>

      <div className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Year
      </div>
    </div>

    {/* TABLE ROWS */}
    {rankings.map((ranking) => {
      const rankStyle = getRankStyle(ranking.rank);

      const score = formatScore(ranking.score);

      return (
      <article
  key={ranking.id}
  className="group border-b border-gray-200 last:border-b-0 transition-colors"
  style={{
    backgroundColor:
      rankings.indexOf(ranking) % 2 === 0
        ? "#fafafa"
        : "#ffffff",
  }}
>
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(300px,1.8fr)_minmax(150px,0.8fr)_minmax(140px,0.8fr)_minmax(100px,0.55fr)_minmax(100px,0.55fr)] lg:items-center lg:gap-0 lg:p-0">
            {/* COLLEGE INFORMATION */}
            <div className="min-w-0 lg:px-5 lg:py-5">
              <div className="flex items-start gap-3">
                {/* RANK */}
                <div
                  className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border ${rankStyle.wrapper}`}
                  title={`Rank ${ranking.rank}`}
                >
                  <span className="text-[10px] font-medium uppercase tracking-wide opacity-70">
                    Rank
                  </span>

                  <span className="text-sm font-bold leading-4">
                    #{ranking.rank}
                  </span>
                </div>

                {/* COLLEGE LOGO */}
                <Link
                  href={`/colleges/${ranking.college.slug}`}
                  className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5"
                  aria-label={`View ${ranking.college.name}`}
                >
                  {ranking.college.logo ? (
                    <img
                      src={ranking.college.logo}
                      alt={`${ranking.college.name} logo`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Award className="h-6 w-6 text-gray-400" />
                  )}
                </Link>

                {/* COLLEGE NAME AND LOCATION */}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/colleges/${ranking.college.slug}`}
                    className="inline-flex max-w-full items-start gap-1.5 text-sm font-bold leading-5 text-gray-900 transition hover:text-[#15945c] sm:text-base"
                  >
                    <span className="line-clamp-2">
                      {ranking.college.name}
                    </span>

                    {ranking.college.verified && (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#15945c]"
                        aria-label="Verified college"
                      />
                    )}
                  </Link>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />

                      <span>
                        {ranking.college.city?.name ??
                          "City not available"}
                        ,{" "}
                        {ranking.college.city?.state.name ??
                          "State not available"}
                      </span>
                    </span>
                  </div>

                  {/* MOBILE RANKING DETAILS */}
                  <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${rankStyle.wrapper}`}
                    >
                      <Trophy className="mr-1 h-3.5 w-3.5" />

                      {getRankLabel(ranking.rank)}
                    </span>

                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                      {ranking.year}
                    </span>

                    {score !== null && (
                      <span className="inline-flex items-center rounded-md bg-[#15945c]/10 px-2 py-1 text-xs font-semibold text-[#15945c]">
                        Score: {score}
                      </span>
                    )}
                  </div>
                <div className="mt-3 flex flex-row flex-wrap gap-2 ">
                    <CompareCollegeButton college={ranking.college} />
                    <Link
                    href={`/colleges/${ranking.college.slug}`}
                    className="inline-flex items-center gap-1.5  px-3 py-2 text-lg font-semibold text-green-500 transition hover:border-[#15945c]/30 hover:text-[#15945c]"
                    >
                    Apply Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                   
                    </div>
                </div>
              </div>
              {/* TOTAL COLLEGES */}
              {ranking.totalColleges && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 lg:ml-[104px]">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#15945c]" />

                  Ranked among{" "}
                  <span className="font-semibold text-gray-700">
                    {ranking.totalColleges.toLocaleString("en-IN")}
                  </span>{" "}
                  colleges
                </div>
              )}
            </div>

            {/* RANKING BODY */}
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-3 border-t border-gray-100 pt-3 lg:block lg:border-l lg:border-t-0 lg:border-gray-100 lg:px-4 lg:py-5">
              <span className="text-xs font-medium text-gray-500 lg:hidden">
                Ranking Body
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {ranking.rankingBody}
                </p>

                {ranking.sourceUrl && (
                  <a
                    href={ranking.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#15945c] hover:underline"
                  >
                    Official source
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>

            {/* CATEGORY */}
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-3 border-t border-gray-100 pt-3 lg:block lg:border-l lg:px-4 lg:py-5">
              <span className="text-xs font-medium text-gray-500 lg:hidden">
                Category
              </span>

              <div>
                <span className="inline-flex max-w-full items-center rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700">
                  {ranking.category}
                </span>
              </div>
            </div>

            {/* SCORE */}
            <div className="hidden lg:block lg:border-l lg:border-gray-100 lg:px-4 lg:py-5">
              <p className="text-xs text-gray-500">
                Score
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {score ?? "—"}
              </p>
            </div>

            {/* YEAR */}
            <div className="hidden lg:block lg:border-l lg:border-gray-100 lg:px-4 lg:py-5">
              <p className="text-xs text-gray-500">
                Ranking Year
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {ranking.year}
              </p>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-4 py-3 sm:px-5">
            <Link
              href={`/colleges/${ranking.college.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15945c] transition hover:text-[#117b4c] sm:text-sm"
            >
              View College Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-500">
                {ranking.category} · {ranking.year}
              </span>

              {ranking.sourceUrl && (
                <a
                  href={ranking.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#15945c]/30 hover:text-[#15945c]"
                >
                  Source
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </article>
      );
    })}
  </div>
)}


{/* ALL COLLEGES GROUPED BY CATEGORY */}
<section className="mx-auto mt-12 max-w-12xl px-4 pb-12 sm:px-6 lg:px-8">
  {/* SECTION HEADER */}
 <div
  className="overflow-hidden  p-8 border-gray-200 bg-white"
  style={{
    fontFamily: "Roboto, sans-serif",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.3,
    color: "#333",
  }}
>
    <div>
      <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#15945c]">
        <GraduationCap className="h-4 w-4" />
        Explore Institutions
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        All Colleges by Category
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
        Explore government, public, private, deemed, and autonomous
        institutions in India. Compare college information and visit
        individual profiles to learn more.
      </p>
    </div>

    <Link
      href="/colleges"
      className="inline-flex w-fit shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#15945c] hover:text-[#15945c]"
    >
      View All Colleges
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>

  {(() => {
    const categoryOrder = [
      "GOVERNMENT",
      "PUBLIC",
      "PRIVATE",
      "DEEMED",
      "AUTONOMOUS",
      "OTHER",
    ];

    const categoryLabels: Record<string, string> = {
      GOVERNMENT: "Government Colleges",
      PUBLIC: "Public Colleges",
      PRIVATE: "Private Colleges",
      DEEMED: "Deemed Universities",
      AUTONOMOUS: "Autonomous Colleges",
      OTHER: "Other Institutions",
    };

    const groupedColleges = colleges.reduce<
      Record<string, typeof colleges>
    >((groups, college) => {
      const category = college.collegeType || "OTHER";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(college);

      return groups;
    }, {});

    const availableCategories = Object.keys(groupedColleges).sort(
      (a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);

        return (
          (indexA === -1 ? categoryOrder.length : indexA) -
          (indexB === -1 ? categoryOrder.length : indexB)
        );
      },
    );

    return (
      <div className="space-y-8">
        {availableCategories.map((category) => {
          const categoryColleges = groupedColleges[category];
          const categoryLabel =
            categoryLabels[category] ??
            category.replaceAll("_", " ");

          return (
            <section
              key={category}
              className="overflow-hidden border border-gray-200 bg-white"
              style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 400,
                lineHeight: 1.3,
                color: "#333",
              }}
            >
              {/* CATEGORY HEADER */}
              <div className="flex flex-col gap-3 border-b border-gray-200 bg-green-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#15945c]/15 bg-white">
                    <GraduationCap className="h-5 w-5 text-[#15945c]" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                      {categoryLabel}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Explore institutions in this category
                    </p>
                  </div>
                </div>

                <span className="inline-flex w-fit items-center rounded-md border border-[#15945c]/20 bg-white px-3 py-1.5 text-xs font-semibold text-[#15945c]">
                  {categoryColleges.length}{" "}
                  {categoryColleges.length === 1
                    ? "Institution"
                    : "Institutions"}
                </span>
              </div>

              {/* DESKTOP TABLE HEADER */}
              <div className="hidden border-b border-gray-200 bg-white lg:grid lg:grid-cols-[minmax(300px,1.8fr)_minmax(170px,0.9fr)_minmax(130px,0.8fr)_minmax(110px,0.6fr)]">
                <div className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  College Information
                </div>

                <div className="border-l border-gray-100 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Location
                </div>

                <div className="border-l border-gray-100 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Institution Type
                </div>

                <div className="border-l border-gray-100 px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Details
                </div>
              </div>

              {/* COLLEGE ROWS */}
              {categoryColleges.map((college, index) => (
                <article
                  key={college.id}
                  className="group border-b border-gray-200 last:border-b-0 transition-colors duration-200 hover:bg-[#15945c]/5"
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? "#fafafa" : "#ffffff",
                  }}
                >
                  <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(300px,1.8fr)_minmax(170px,0.9fr)_minmax(130px,0.8fr)_minmax(110px,0.6fr)] lg:items-center lg:gap-0 lg:p-0">
                    {/* COLLEGE INFORMATION */}
                    <div className="min-w-0 lg:px-5 lg:py-5">
                      <div className="flex items-start gap-3">
                        {/* SERIAL NUMBER */}
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-bold text-gray-600">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        {/* COLLEGE LOGO */}
                        <Link
                          href={`/colleges/${college.slug}`}
                          aria-label={`View ${college.name}`}
                          className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5"
                        >
                          {college.logo ? (
                            <img
                              src={college.logo}
                              alt={`${college.name} logo`}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <GraduationCap className="h-6 w-6 text-gray-400" />
                          )}
                        </Link>

                        {/* NAME AND VERIFICATION */}
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/colleges/${college.slug}`}
                            className="inline-flex max-w-full items-start gap-1.5 text-sm font-bold leading-5 text-gray-900 transition hover:text-[#15945c] sm:text-base"
                          >
                            <span className="line-clamp-2">
                              {college.name}
                            </span>

                            {college.verified && (
                              <CheckCircle2
                                className="mt-0.5 h-4 w-4 shrink-0 text-[#15945c]"
                                aria-label="Verified institution"
                              />
                            )}
                          </Link>

                          {college.shortName && (
                            <p className="mt-1 text-xs text-gray-500">
                              {college.shortName}
                            </p>
                          )}

                          {/* MOBILE LOCATION */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-gray-500 lg:hidden">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />

                            <span>
                              {[
                                college.city?.name,
                                college.state?.name,
                              ]
                                .filter(Boolean)
                                .join(", ") || "Location not available"}
                            </span>
                          </div>

                          {/* MOBILE TYPE */}
                          <div className="mt-2 lg:hidden">
                            <span className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700">
                              {college.collegeType
                                ?.replaceAll("_", " ") ?? "Other"}
                            </span>
                          </div>

                          {/* MOBILE ACTIONS */}
                          <div className="mt-3 flex flex-wrap items-center gap-3 lg:hidden">
                            <Link
                              href={`/colleges/${college.slug}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15945c] transition hover:text-[#117b4c]"
                            >
                              View Details
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>

                            <CompareCollegeButton college={college} />
                          </div>

                          {college.verified && (
                            <div className="mt-2 hidden items-center gap-1.5 text-xs text-gray-500 lg:flex">
                              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#15945c]" />
                              Verified Institution
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-3 border-t border-gray-100 pt-3 lg:block lg:border-l lg:border-t-0 lg:px-4 lg:py-5">
                      <span className="text-xs font-medium text-gray-500 lg:hidden">
                        Location
                      </span>

                      <div className="flex items-start gap-1.5 text-sm text-gray-700">
                        <MapPin className="mt-0.5 hidden h-4 w-4 shrink-0 text-gray-400 lg:block" />

                        <span>
                          {college.city?.name ?? "City unavailable"}
                          <span className="text-gray-400">, </span>
                          {college.state?.name ?? "State unavailable"}
                        </span>
                      </div>
                    </div>

                    {/* INSTITUTION TYPE */}
                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-3 border-t border-gray-100 pt-3 lg:block lg:border-l lg:px-4 lg:py-5">
                      <span className="text-xs font-medium text-gray-500 lg:hidden">
                        Institution Type
                      </span>

                      <div>
                        <span className="inline-flex max-w-full items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700">
                          {college.collegeType
                            ?.replaceAll("_", " ") ?? "Other"}
                        </span>
                      </div>
                    </div>

                    {/* DESKTOP DETAILS ACTION */}
                    <div className="hidden lg:block lg:border-l lg:border-gray-100 lg:px-4 lg:py-5">
                      <Link
                        href={`/colleges/${college.slug}`}
                        aria-label={`View details for ${college.name}`}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[#15945c] transition hover:text-[#117b4c]"
                      >
                        View Details
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>

                      <div className="mt-3">
                        <CompareCollegeButton college={college} />
                      </div>
                    </div>
                  </div>

                  {/* ROW FOOTER */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-4 py-3 sm:px-5">
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15945c] transition hover:text-[#117b4c] sm:text-sm"
                    >
                      Explore College Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                      {college.establishedYear && (
                        <span className="text-xs text-gray-500">
                          Est. {college.establishedYear}
                        </span>
                      )}

                      {college.verified && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-[#15945c]/15 bg-white px-2 py-1 text-xs font-medium text-[#15945c]">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}

              {/* CATEGORY FOOTER */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-4 py-3 sm:px-5">
                <span className="text-xs text-gray-500">
                  Showing {categoryColleges.length}{" "}
                  {categoryColleges.length === 1
                    ? "institution"
                    : "institutions"}
                </span>

                <Link
                  href={`/colleges?category=${encodeURIComponent(category)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15945c] transition hover:text-[#117b4c] sm:text-sm"
                >
                  Explore Category
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    );
  })()}

  {/* EMPTY STATE */}
  {colleges.length === 0 && (
    <div className="border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <GraduationCap className="mx-auto h-10 w-10 text-gray-400" />

      <h3 className="mt-3 text-lg font-semibold text-gray-900">
        No colleges found
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        There are currently no colleges available to display.
      </p>
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