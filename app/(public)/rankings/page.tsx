import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ShieldCheck,
    ArrowUpRight,
  Building2,
  Sparkles,
  Trophy,
} from "lucide-react";

import CompareCollegeButton from "../components/public/college/CompareCollegeButton";
import {
  getPublicRankingFilters,
  getPublicRankings,
} from "@/services/ranking.service";
import { GraduationCap } from "lucide-react";
import { getColleges } from "@/services/college.service";
import CollegeFilterBar from "./CollegeFilterBar"

type RankingsPageProps = {
  searchParams: Promise<{
    search?: string;
    year?: string;
    rankingBody?: string;
    category?: string;
    rankingCategory?: string;
    stream?: string | string[];
    programType?: string | string[];
    collegeType?: string | string[];
    universityType?: string | string[];
    courseType?: string | string[];
    duration?: string | string[];
    fee?: string | string[];
    degree?: string | string[];
    state?: string | string[];
    city?: string | string[];
    course?: string | string[];
    page?: string;
  }>;
};




function formatScore(score: unknown) {
  if (score === null || score === undefined) return null;

  const numericScore = Number(score);
  if (!Number.isFinite(numericScore)) return null;

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
      wrapper: "border-amber-200 bg-amber-50 text-amber-700",
      icon: "text-amber-500",
    };
  }

  if (rank === 2) {
    return {
      wrapper: "border-slate-200 bg-slate-50 text-slate-600",
      icon: "text-slate-400",
    };
  }

  if (rank === 3) {
    return {
      wrapper: "border-orange-200 bg-orange-50 text-orange-700",
      icon: "text-orange-500",
    };
  }

  return {
    wrapper: "border-gray-200 bg-white text-gray-700",
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

const hasCollegeFilters = Boolean(
  params.stream ||
    params.programType ||
    params.collegeType ||
    params.universityType ||
    params.courseType ||
    params.category ||
    params.duration ||
    params.fee ||
    params.degree ||
    params.state ||
    params.city ||
    params.course,
);

const search = params.search?.trim() || "";
const year = params.year ? Number(params.year) : undefined;
const rankingBody = params.rankingBody?.trim() || "";
const rankingCategory = params.rankingCategory?.trim() || "";

const validYear =
  year !== undefined && Number.isFinite(year) ? year : undefined;

const [
  rankings,
  filterOptions,
  filteredCollegeResult,
  firstCollegePage,
] = await Promise.all([
  getPublicRankings({
    search,
    year: validYear,
    rankingBody: rankingBody || undefined,
    category: rankingCategory || undefined,
  }),

  getPublicRankingFilters(),

  hasCollegeFilters
    ? getColleges({
        limit: 499,
        search: search || undefined,
        state: params.state,
        city: params.city,
        collegeType: params.collegeType,
        institutionKind: params.universityType as
          | "UNIVERSITY"
          | "COLLEGE"
          | "OTHER"
          | undefined,
        course: params.course,
        stream: params.stream,
        programType: params.programType,
        courseType: params.courseType,
        category: params.category,
        duration: params.duration,
        fee: params.fee,
        degree: params.degree,
      })
    : Promise.resolve(null),

  getColleges({ page: 1, limit: 499 }),
]);

const filteredColleges = filteredCollegeResult?.data ?? [];
const allColleges = firstCollegePage.data;

const selectedYear = validYear ? String(validYear) : "";
  
  const remainingPages = Math.max(
    0,
    Math.ceil(filteredCollegeResult?.pagination.total ?? 0 / 50) - 1,
  );

  const remainingCollegeResults = await Promise.all(
    Array.from({ length: remainingPages }, (_, index) =>
      getColleges({ page: index + 2, limit: 499, ...params } as any),
    ),
  );


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
<CollegeFilterBar />

      {/* CONTENT */}
{/* RANKING TABLE: DEFAULT VIEW */}
{hasCollegeFilters && (
<section
  id="ranking-results"
  className="mx-auto mt-8 max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-8"
>
  <div className="overflow-hidden border border-gray-200 bg-white">
    {/* Results toolbar */}
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 px-5 py-5">
      <div>
        <h2 className="text-xl font-bold text-[#333] sm:text-2xl">
Found {filteredCollegeResult?.pagination.total ?? 0} Colleges
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Colleges matching your selected filters
        </p>
      </div>

      <Link
        href="/rankings"
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#15945c] hover:text-[#15945c]"
      >
        Clear filters
      </Link>
    </div>

    {filteredColleges.length === 0 ? (
      <div className="px-6 py-16 text-center">
        <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          No matching institutions found
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Try removing a filter or selecting different options.
        </p>
        <Link
          href="/rankings"
          className="mt-5 inline-flex rounded-lg bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#117a4b]"
        >
          Clear filters
        </Link>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table
          className="w-full min-w-[1450px] border-collapse text-left"
          style={{
            fontFamily: "Roboto, sans-serif",
            fontSize: "14px",
            lineHeight: 1.4,
            color: "#333",
          }}
        >
          <thead>
            <tr className="bg-[#5ea787] text-white">
              <th className="w-[105px] border border-white/40 px-4 py-4 text-base font-bold">
                CD Rank
              </th>
              <th className="w-[545px] border border-white/40 px-4 py-4 text-base font-bold">
                Colleges
              </th>
              <th className="w-[240px] border border-white/40 px-4 py-4 text-base font-bold">
                Course Fees
              </th>
              <th className="w-[240px] border border-white/40 px-4 py-4 text-base font-bold">
                Placement
              </th>
              <th className="w-[200px] border border-white/40 px-4 py-4 text-base font-bold">
                User Reviews
              </th>
              <th className="w-[240px] border border-white/40 px-4 py-4 text-base font-bold">
                Ranking
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredColleges.map((college, index) => (
              <tr
                key={college.id}
                className="align-top transition-colors hover:bg-[#f0f9f6]"
                style={{
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                }}
              >
                {/* Rank */}
                <td className="border border-[#dedede] px-4 py-4 align-top">
                  <span className="text-xl font-semibold text-[#222]">
                    #{index + 1}
                  </span>
                </td>

                {/* College details and actions */}
                <td className="border border-[#dedede] px-4 py-4 align-top">
                  <div className="flex items-start gap-3">
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="flex h-[54px] w-[54px] shrink-0 items-center justify-center border border-gray-100 bg-white p-1"
                      aria-label={`View ${college.name}`}
                    >
                      {college.logo ? (
                        <img
                          src={college.logo}
                          alt={`${college.name} logo`}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <GraduationCap className="h-8 w-8 text-[#15945c]" />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/colleges/${college.slug}`}
                        className="text-lg font-medium leading-6 text-[#32b5e8] hover:text-[#15945c] hover:underline"
                      >
                        {college.name}
                      </Link>

                      <p className="mt-1 text-[13px] text-[#666]">
                        {[college.city?.name, college.state?.name]
                          .filter(Boolean)
                          .join(", ") || "Location unavailable"}
                        <span className="mx-2 text-gray-400">|</span>
                        {college.collegeType?.replaceAll("_", " ") ||
                          college.institutionKind?.replaceAll("_", " ") ||
                          "Institution"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {college.institutionKind
                          ?.replaceAll("_", " ")
                          .toUpperCase() || "INSTITUTION"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 pl-1">
                    <Link
                      href={`/colleges/${college.slug}`}
                      className="inline-flex items-center gap-1.5 font-medium text-[#f07824] hover:underline"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Apply Now
                    </Link>

                    <span className="hidden h-4 border-l border-gray-300 sm:block" />

                    <Link
                      href={`/colleges/${college.slug}`}
                      className="inline-flex items-center gap-1.5 font-medium text-[#15945c] hover:underline"
                    >
                      <span className="text-base">↓</span>
                      View Details
                    </Link>

                    <span className="hidden h-4 border-l border-gray-300 sm:block" />


                      <div className="inline-flex items-center gap-1  font-medium text-gray-700 hover:text-gray-900 hover:underline">
                          <CompareCollegeButton college={college} />
                          </div>
                  </div>
                </td>

                {/* Course fees */}
                <td className="border border-[#dedede] px-4 py-4 align-top">
                  <p className="text-sm font-medium text-gray-400">
                    Not available
                  </p>
                  <p className="mt-2 text-[13px] leading-6 text-gray-500">
                    Course fee information has not been provided by this
                    college query.
                  </p>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#f07824] hover:underline"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    Explore Courses & Fees
                  </Link>
                </td>

                {/* Placement */}
                <td className="border border-[#dedede] px-4 py-4 align-top">
                  <p className="text-sm font-medium text-gray-400">
                    Not available
                  </p>
                  <p className="mt-2 text-[13px] leading-5 text-gray-500">
                    Placement statistics have not been provided.
                  </p>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#f07824] hover:underline"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    Placement Details
                  </Link>
                </td>

                {/* User reviews */}
                <td className="border border-[#dedede] px-4 py-4 align-top">
                  <p className="text-sm font-medium text-gray-400">
                    Not rated
                  </p>
                  <p className="mt-2 text-[13px] leading-5 text-gray-500">
                    No review summary is available in this result.
                  </p>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="mt-3 inline-flex text-sm font-medium text-[#32b5e8] hover:underline"
                  >
                    View College
                  </Link>
                </td>

                {/* Rankings */}
                <td className="border border-[#dedede] px-4 py-4 align-top">
                  <p className="text-sm font-medium text-gray-400">
                    Not ranked
                  </p>
                  <p className="mt-2 text-[13px] leading-5 text-gray-500">
                    Ranking information is not available in this result.
                  </p>
                  <Link
                    href="/rankings"
                    className="mt-3 inline-flex text-sm font-medium text-[#32b5e8] hover:underline"
                  >
                    Explore Rankings
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {filteredColleges.length > 0 && (
      <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-500">
        Showing {filteredColleges.length} colleges · Use the horizontal
        scrollbar to explore all table columns.
      </div>
    )}
  </div>
</section>
)}

{!hasCollegeFilters && (
<section
  id="ranking-results"
  className="mx-auto w-full max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-8"
  style={{
    fontFamily: "Roboto, sans-serif",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.4,
    color: "#333",
  }}
>
  {rankings.length === 0 ? (
    <div className="border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
        <Award className="h-7 w-7 text-gray-400" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-gray-900">
        No rankings found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        We couldn't find published rankings matching your selected filters.
        Try changing your search or removing some filters.
      </p>

      <Link
        href="/rankings"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#15945c] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#117b4c]"
      >
        View all rankings
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  ) : (
    <div className="overflow-hidden border border-gray-200 bg-white">
      {/* Results heading */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-5">
        <div>
          <h2 className="text-xl font-bold text-[#333] sm:text-2xl">
            College Rankings
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Published rankings by institution, ranking body, category, and year.
          </p>
        </div>

        <span className="inline-flex items-center rounded-md bg-[#15945c]/10 px-3 py-2 text-sm font-semibold text-[#15945c]">
          {rankings.length} rankings
        </span>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] border-collapse text-left">
          <thead>
            <tr className="bg-[#5ea787] text-white">
              <th className="w-[100px] border border-white/40 px-4 py-4 text-base font-bold">
                Rank
              </th>
              <th className="min-w-[390px] border border-white/40 px-4 py-4 text-base font-bold">
                Colleges
              </th>
              <th className="w-[190px] border border-white/40 px-4 py-4 text-base font-bold">
                Ranking Body
              </th>
              <th className="w-[190px] border border-white/40 px-4 py-4 text-base font-bold">
                Category
              </th>
              <th className="w-[140px] border border-white/40 px-4 py-4 text-base font-bold">
                Score
              </th>
              <th className="w-[130px] border border-white/40 px-4 py-4 text-base font-bold">
                Year
              </th>
            </tr>
          </thead>

          <tbody>
            {rankings.map((ranking, index) => {
              const rankStyle = getRankStyle(ranking.rank);
              const score = formatScore(ranking.score);

              return (
                <tr
                  key={ranking.id}
                  className="align-top transition-colors hover:bg-[#f0f9f6]"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
                  }}
                >
                  {/* Rank */}
                  <td className="border border-[#dedede] px-4 py-5 align-top">
                    <div className="text-xl font-semibold text-[#222]">
                      #{ranking.rank}
                    </div>

                    {ranking.totalColleges != null && (
                      <p className="mt-2 text-xs leading-5 text-gray-500">
                        of{" "}
                        {ranking.totalColleges.toLocaleString("en-IN")}
                      </p>
                    )}
                  </td>

                  {/* College information */}
                  <td className="border border-[#dedede] px-4 py-5 align-top">
                    <div className="flex items-start gap-3">
                      <Link
                        href={`/colleges/${ranking.college.slug}`}
                        aria-label={`View ${ranking.college.name}`}
                        className="flex h-[54px] w-[54px] shrink-0 items-center justify-center border border-gray-200 bg-white p-1.5"
                      >
                        {ranking.college.logo ? (
                          <img
                            src={ranking.college.logo}
                            alt={`${ranking.college.name} logo`}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <Award className="h-7 w-7 text-gray-400" />
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-1.5">
                          <Link
                            href={`/colleges/${ranking.college.slug}`}
                            className="text-base font-medium leading-6 text-[#32b5e8] hover:text-[#15945c] hover:underline"
                          >
                            {ranking.college.name}
                          </Link>

                          {ranking.college.verified && (
                            <CheckCircle2
                              className="mt-1 h-4 w-4 shrink-0 text-[#15945c]"
                              aria-label="Verified college"
                            />
                          )}
                        </div>

                        <p className="mt-1.5 flex flex-wrap items-center gap-1 text-[13px] text-[#666]">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          <span>
                            {[
                              ranking.college.city?.name,
                              ranking.college.city?.state?.name,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Location unavailable"}
                          </span>
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${rankStyle.wrapper}`}
                          >
                            <Trophy className="mr-1 h-3.5 w-3.5" />
                            {getRankLabel(ranking.rank)}
                          </span>

                        </div>
                        
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <Link
                        href={`/colleges/${ranking.college.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#f07824] hover:underline"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Apply Now
                      </Link>

                      <span className="hidden h-4 border-l border-gray-300 sm:block" />

                      <span className="hidden h-4 border-l border-gray-300 sm:block" />

                      <Link
                        href={`/colleges/${ranking.college.slug}`}
                        className="text-sm font-medium text-[#15945c] hover:underline"
                      >
                        View Details
                      </Link>

                      <div className="inline-flex items-center gap-1  font-medium text-gray-700 hover:text-gray-900 hover:underline">
                          <CompareCollegeButton college={ranking.college} />
                          </div>

                    </div>
                    
                  </td>

                  {/* Ranking body */}
                  <td className="border border-[#dedede] px-4 py-5 align-top">
                    <p className="font-semibold leading-5 text-gray-800">
                      {ranking.rankingBody}
                    </p>

                    {ranking.sourceUrl ? (
                      <a
                        href={ranking.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#15945c] hover:underline"
                      >
                        Official source
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : (
                      <span className="mt-3 block text-xs text-gray-400">
                        Source unavailable
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="border border-[#dedede] px-4 py-5 align-top">
                    <span className="inline-flex max-w-full items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700">
                      {ranking.category}
                    </span>

                    {ranking.totalColleges != null && (
                      <p className="mt-3 text-xs leading-5 text-gray-500">
                        Ranked among{" "}
                        <span className="font-semibold text-gray-700">
                          {ranking.totalColleges.toLocaleString("en-IN")}
                        </span>{" "}
                        colleges
                      </p>
                    )}
                  </td>

                  {/* Score */}
                  <td className="border border-[#dedede] px-4 py-5 align-top">
                    <p className="text-lg font-bold text-[#15945c]">
                      {score ?? "—"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {score !== null ? "Ranking score" : "No score published"}
                    </p>
                  </td>

                  {/* Year */}
                  <td className="border border-[#dedede] px-4 py-5 align-top">
                    <p className="text-xl font-semibold text-gray-700">
                      {ranking.year}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      Ranking year
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4">
        <p className="text-xs text-gray-500">
          Showing {rankings.length} ranking records.
        </p>

        <Link
          href="/rankings"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15945c] hover:underline"
        >
          View all rankings
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )}
</section>
)}
    

{/* PROMOTIONAL BANNERS */}
<section className="my-8 grid grid-cols-1 gap-4 md:grid-cols-2">
  {/* COLLEGE PREDICTOR */}
  <Link
    href="/college-predictor"
    className="group relative flex min-h-[150px] items-center justify-between overflow-hidden rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-amber-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg sm:p-6"
  >
    <div className="relative z-10 max-w-[75%]">
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
        <Sparkles className="h-3.5 w-3.5" />
        Admission Predictor
      </span>

      <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
        Know Your Chances of Admission
      </h3>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition-all group-hover:gap-3">
        Predict Now
        <ArrowRight className="h-4 w-4" />
      </span>
    </div>

    <div className="absolute -right-5 -top-7 h-36 w-36 rounded-full bg-orange-100/70 transition-transform duration-500 group-hover:scale-110 sm:h-44 sm:w-44" />

    <div className="relative z-10 mr-1 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-500 shadow-sm ring-1 ring-orange-100 sm:h-20 sm:w-20">
      <GraduationCap className="h-9 w-9 sm:h-11 sm:w-11" />
    </div>
  </Link>

  {/* AI COURSE FINDER */}
  <Link
    href="/courses"
    className="group relative flex min-h-[150px] items-center justify-between overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-6"
  >
    <div className="relative z-10 max-w-[75%]">
      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <Sparkles className="h-3.5 w-3.5" />
        Smart Course Discovery
      </span>

      <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
        Find Courses with the Help of AI
      </h3>

      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#15945c] transition-all group-hover:gap-3">
        Start Now
        <ArrowRight className="h-4 w-4" />
      </span>
    </div>

    <div className="absolute -right-5 -top-7 h-36 w-36 rounded-full bg-emerald-100/70 transition-transform duration-500 group-hover:scale-110 sm:h-44 sm:w-44" />

    <div className="relative z-10 mr-1 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-[#15945c] shadow-sm ring-1 ring-emerald-100 sm:h-20 sm:w-20">
      <Sparkles className="h-9 w-9 sm:h-11 sm:w-11" />
    </div>
  </Link>
</section>

{/* ALL COLLEGES GROUPED BY CATEGORY */}
<section className="mx-auto mt-12 w-full max-w-8xl px-4 pb-12 sm:px-6 lg:px-8">
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

    const groupedColleges = allColleges.reduce<
      Record<string, typeof allColleges>
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
      <div
        className="space-y-8"
        style={{
          fontFamily: "Roboto, sans-serif",
          fontSize: "0.875rem",
          fontWeight: 400,
          lineHeight: 1.4,
          color: "#333",
        }}
      >
        {/* SECTION HEADER */}
      

        {/* CATEGORY TABLES */}
        {availableCategories.map((category) => {
          const categoryColleges = groupedColleges[category];
          const categoryLabel =
            categoryLabels[category] ?? category.replaceAll("_", " ");

          return (
            <section
              key={category}
              className="overflow-hidden border border-gray-200 bg-white"
            >
                <div className="flex flex-col justify-between gap-4 border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:p-6">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#15945c]">
              <GraduationCap className="h-4 w-4" />
              Explore Institutions
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              All Colleges by Category
            </h2>

          
          </div>

          <Link
            href="/colleges"
            className="inline-flex w-fit shrink-0 items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#15945c] hover:text-[#15945c]"
          >
            View All Colleges
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
              {/* CATEGORY TITLE */}
              <div className="flex flex-col justify-between gap-3 border-b border-gray-200 bg-[#f8fbfb] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {categoryLabel}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    Browse and compare institutions in this category
                  </p>
                </div>

                <span className="inline-flex w-fit items-center border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
                  {categoryColleges.length}{" "}
                  {categoryColleges.length === 1
                    ? "Institution"
                    : "Institutions"}
                </span>
              </div>

              {/* TABLE — horizontal scroll on small screens */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[1050px]">
                  {/* TABLE HEADER */}
                  <div
                    className="grid border-b border-white text-white"
                    style={{
                      gridTemplateColumns:
                        "64px minmax(360px, 2.8fr) minmax(180px, 1.2fr) minmax(170px, 1fr) minmax(120px, 0.8fr)",
                      backgroundColor: "#5ea787",
                    }}
                  >
                    <div className="border-r border-white/60 px-3 py-4 font-bold">
                      Rank
                    </div>

                    <div className="border-r border-white/60 px-4 py-4 font-bold">
                      Colleges
                    </div>

                    <div className="border-r border-white/60 px-4 py-4 font-bold">
                      Location
                    </div>

                    <div className="border-r border-white/60 px-4 py-4 font-bold">
                      Institution Type
                    </div>

                    <div className="px-4 py-4 font-bold">Details</div>
                  </div>

                  {/* TABLE ROWS */}
                  {categoryColleges.map((college, index) => (
                    <article
                      key={college.id}
                      className="grid border-b border-gray-200 transition-colors last:border-b-0 hover:bg-[#eaf6f6]"
                      style={{
                        gridTemplateColumns:
                          "64px minmax(360px, 2.8fr) minmax(180px, 1.2fr) minmax(170px, 1fr) minmax(120px, 0.8fr)",
                        backgroundColor:
                          index % 2 === 0 ? "#fafafa" : "#ffffff",
                      }}
                    >
                      {/* RANK */}
                      <div className="border-r border-gray-200 px-3 py-5">
                        <span className="text-lg font-medium text-gray-900">
                          #{index + 1}
                        </span>
                      </div>

                      {/* COLLEGE INFORMATION */}
                      <div className="relative min-w-0 border-r border-gray-200 px-4 pb-12 pt-4">
                        <div className="flex items-start gap-3">
                          {/* LOGO */}
                          <Link
                            href={`/colleges/${college.slug}`}
                            aria-label={`View ${college.name}`}
                            className="flex h-12 w-12 shrink-0 items-center justify-center border border-gray-200 bg-white p-1.5"
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

                          {/* NAME AND LOCATION SUMMARY */}
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/colleges/${college.slug}`}
                              className="block text-base font-medium leading-6 text-sky-500 transition hover:text-sky-700 hover:underline"
                            >
                              {college.name}
                              {college.shortName
                                ? ` [${college.shortName}]`
                                : ""}
                            </Link>

                            {college.verified && (
                              <span className="mt-1 inline-flex items-center gap-1 text-xs text-gray-500">
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#15945c]" />
                                Verified Institution
                              </span>
                            )}

                            <p className="mt-1 text-xs leading-5 text-gray-600">
                              {[
                                college.city?.name,
                                college.state?.name,
                              ]
                                .filter(Boolean)
                                .join(", ") || "Location unavailable"}
                              {" | "}
                              {college.collegeType?.replaceAll("_", " ") ??
                                "Other"}
                            </p>
                          </div>
                        </div>

                        {/* ACTION LINKS */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 pl-0.5 text-sm">
                          <Link
                            href={`/colleges/${college.slug}`}
                            className="inline-flex items-center gap-1 font-medium text-orange-600 hover:text-orange-700 hover:underline"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                            Apply Now
                          </Link>

                          <span className="hidden h-4 border-l border-gray-300 sm:block" />

                          <Link
                            href={`/colleges/${college.slug}`}
                            className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            View Profile
                          </Link>

                          <span className="hidden h-4 border-l border-gray-300 sm:block" />
<div className="inline-flex items-center gap-1  font-medium text-gray-700 hover:text-gray-900 hover:underline">
                          <CompareCollegeButton college={college} />
                          </div>
                        </div>

                        {/* COLLEGE SCORE / VERIFIED LABEL */}
                        <div className="absolute bottom-0 left-0 inline-flex items-center gap-1.5 bg-[#fff8e5] px-2 py-1.5 text-xs text-gray-700">
                          <ShieldCheck className="h-4 w-4 text-[#15945c]" />
                          {college.verified
                            ? "Verified College"
                            : "College Profile"}
                        </div>
                      </div>

                      {/* LOCATION */}
                      <div className="border-r border-gray-200 px-4 py-5">
                        <div className="flex items-start gap-2 text-sm text-gray-700">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                          <span className="leading-5">
                            {college.city?.name ?? "City unavailable"}
                            {college.state?.name
                              ? `, ${college.state.name}`
                              : ""}
                          </span>
                        </div>

                        {college.establishedYear && (
                          <p className="mt-3 text-xs text-gray-500">
                            Established {college.establishedYear}
                          </p>
                        )}
                      </div>

                      {/* INSTITUTION TYPE */}
                      <div className="border-r border-gray-200 px-4 py-5">
                        <span className="inline-flex max-w-full items-center border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700">
                          {college.collegeType?.replaceAll("_", " ") ??
                            "Other"}
                        </span>

                        {college.verified && (
                          <p className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Verified
                          </p>
                        )}
                      </div>

                      {/* DETAILS */}
                      <div className="px-4 py-5">
                        <Link
                          href={`/colleges/${college.slug}`}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[#15945c] hover:underline"
                        >
                          View Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>

                        <Link
                          href={`/colleges/${college.slug}`}
                          className="mt-3 block text-xs text-gray-500 hover:text-[#15945c] hover:underline"
                        >
                          Explore profile
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

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
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#15945c] hover:underline"
                >
                  Explore Category
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          );
        })}

        {/* EMPTY STATE */}
        {allColleges.length === 0 && (
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
      </div>
    );
  })()}
</section>
    </main>
  );
}