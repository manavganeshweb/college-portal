import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  GraduationCap,
  Landmark,
  Library,
  MapPin,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import CollegeFilters from "../components/public/CollegeFilters";
import CollegeCard from "../components/public/CollegeCard";

import { getColleges } from "@/services/college.service";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

type UniversitiesPageProps = {
  searchParams: Promise<{
    search?: string;
    stateId?: string;
    cityId?: string;
    collegeType?: string;
    verified?: string;
    page?: string;
  }>;
};

async function getLocations() {
  const [states, cities] = await Promise.all([
    prisma.state.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    prisma.city.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        stateId: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return { states, cities };
}

export default async function UniversitiesPage({
  searchParams,
}: UniversitiesPageProps) {
  const params = await searchParams;

  const search = params.search || undefined;
  const stateId = params.stateId || undefined;
  const cityId = params.cityId || undefined;
  const collegeType = params.collegeType || undefined;

  const verified =
    params.verified === "true"
      ? true
      : params.verified === "false"
        ? false
        : undefined;

  const pageNumber = Number(params.page || "1");

  const page =
    Number.isInteger(pageNumber) && pageNumber > 0
      ? pageNumber
      : 1;

  const [{ data: universities, pagination }, locations] =
    await Promise.all([
getColleges({
  search,
  state: stateId,
  city: cityId,
  collegeType,
  institutionKind: "UNIVERSITY",
  verified,
  page,
  limit: 12,
}),
      getLocations(),
    ]);

  function createPageUrl(pageNumber: number) {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (stateId) query.set("stateId", stateId);
    if (cityId) query.set("cityId", cityId);
    if (collegeType) query.set("collegeType", collegeType);

    if (params.verified) {
      query.set("verified", params.verified);
    }

    if (pageNumber > 1) {
      query.set("page", String(pageNumber));
    }

    const queryString = query.toString();

    return queryString
      ? `/universities?${queryString}`
      : "/universities";
  }

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(stateId) ||
    Boolean(cityId) ||
    Boolean(collegeType) ||
    Boolean(params.verified);

  return (
    <main className="min-h-screen bg-slate-50">
{/* =====================================================
    HERO
====================================================== */}
<section className="relative overflow-hidden border-b border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50">
  {/* Background decoration */}
  <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />

  <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-green-100/40 blur-3xl" />

  <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10">
      {/* LEFT CONTENT */}
      <div className="min-w-0 max-w-4xl">
        {/* Label */}
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm sm:text-sm">
          <Building2 size={15} />
          University Discovery
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Find the right university
          <span className="block text-emerald-700">
            for your future
          </span>
        </h1>

        {/* Description */}
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          Explore universities across India, compare
          institutions, discover courses, and make informed
          decisions about your education with College Aadhar.
        </p>

        {/* Trust indicators */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 sm:text-sm">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            University information
          </div>

          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 shrink-0 text-emerald-600" />
            Course details
          </div>

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-emerald-600" />
            Compare universities
          </div>
        </div>

        {/* UNIVERSITY TYPE SHORTCUTS */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {[
            { label: "All Universities", value: "" },
            { label: "Government", value: "GOVERNMENT" },
            { label: "Private", value: "PRIVATE" },
            { label: "Public", value: "PUBLIC" },
            { label: "Deemed", value: "DEEMED" },
            { label: "Autonomous", value: "AUTONOMOUS" },
          ].map((type) => {
            const isActive =
              (params.collegeType ?? "") === type.value;

            const query = new URLSearchParams();

            if (search) query.set("search", search);
            if (stateId) query.set("stateId", stateId);
            if (cityId) query.set("cityId", cityId);

            if (params.verified) {
              query.set("verified", params.verified);
            }

            if (type.value) {
              query.set("collegeType", type.value);
            }

            const queryString = query.toString();

            const href = queryString
              ? `/universities?${queryString}`
              : "/universities";

            return (
              <Link
                key={type.label}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm",
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
                ].join(" ")}
              >
                {type.label}
              </Link>
            );
          })}
        </div>

        {/* UNIVERSITY FILTERS */}
        <CollegeFilters
          states={locations.states}
          cities={locations.cities}
        />
      </div>

      {/* RIGHT ILLUSTRATION — DESKTOP */}
      <div className="relative hidden h-[250px] lg:block">
        {/* Soft glow */}
        <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/60 blur-3xl" />

        {/* Decorative rings */}
        <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/70" />

        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100" />

        {/* Main university icon */}
        <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[2rem] border border-emerald-200 bg-white shadow-xl shadow-emerald-900/10">
          <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-emerald-50">
            <Landmark
              size={56}
              strokeWidth={1.5}
              className="text-emerald-600"
            />
          </div>
        </div>

        {/* Location */}
        <div className="absolute left-5 top-10 flex h-12 w-12 rotate-[-10deg] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md">
          <MapPin
            size={23}
            strokeWidth={1.8}
            className="text-emerald-600"
          />
        </div>

        {/* Library */}
        <div className="absolute bottom-8 right-5 flex h-12 w-12 rotate-[8deg] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-md">
          <Library
            size={22}
            strokeWidth={1.8}
            className="text-emerald-600"
          />
        </div>

        {/* Award */}
        <div className="absolute right-2 top-7 flex h-11 w-11 rotate-[8deg] items-center justify-center rounded-2xl border border-emerald-100 bg-white shadow-md">
          <Award
            size={21}
            strokeWidth={1.8}
            className="text-emerald-600"
          />
        </div>

        {/* Sparkles */}
        <div className="absolute bottom-10 left-16 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
          <Sparkles size={17} />
        </div>

        {/* Decorative dots */}
        <span className="absolute left-1/2 top-2 h-2 w-2 rounded-full bg-emerald-400" />

        <span className="absolute bottom-3 right-1/3 h-1.5 w-1.5 rounded-full bg-emerald-300" />

        <span className="absolute left-8 top-1/2 h-1.5 w-1.5 rounded-full bg-green-300" />
      </div>
    </div>
  </div>
</section>
      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">


        {/* RESULTS HEADER */}
        <div className="mb-7 mt-12 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
              University Directory
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {search
                ? `Results for "${search}"`
                : "Explore universities"}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Discover institutions, explore their courses,
              and learn about their locations.
            </p>
          </div>

          <div className="shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {pagination.total}{" "}
            {pagination.total === 1
              ? "university"
              : "universities"}{" "}
            found
          </div>
        </div>

        {/* RESULTS */}
        {universities.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <SlidersHorizontal className="h-6 w-6 text-emerald-600" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No universities found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find any universities matching
              your current search or filters. Try changing
              your selection.
            </p>

            <Link
              href="/universities"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              View all universities
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {universities.map((university) => (
                <CollegeCard
                  key={university.id}
                  college={university}
                />
              ))}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {pagination.hasPreviousPage ? (
                  <Link
                    href={createPageUrl(
                      pagination.page - 1
                    )}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-xl border border-slate-100 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-400">
                    Previous
                  </span>
                )}

                <div className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </div>

                {pagination.hasNextPage ? (
                  <Link
                    href={createPageUrl(
                      pagination.page + 1
                    )}
                    className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Next
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                ) : (
                  <span className="rounded-xl border border-slate-100 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-400">
                    Next
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}