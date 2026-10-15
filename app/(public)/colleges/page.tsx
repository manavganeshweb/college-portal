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
  Scale,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

import CollegeFilters from "../components/public/CollegeFilters";
import CollegeCard from "../components/public/CollegeCard";
import { getColleges } from "@/services/college.service";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

type CollegesPageProps = {
  searchParams: Promise<{
    search?: string;
    stateId?: string;
    cityId?: string;
    collegeType?: string;
    verified?: string;
    page?: string;
  }>;
};

const COLLEGE_TYPES = [
  { value: "GOVERNMENT", label: "Government" },
  { value: "PRIVATE", label: "Private" },
  { value: "PUBLIC", label: "Public" },
  { value: "DEEMED", label: "Deemed" },
  { value: "AUTONOMOUS", label: "Autonomous" },
] as const;

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

export default async function CollegesPage({
  searchParams,
}: CollegesPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const stateId = params.stateId ?? "";
  const cityId = params.cityId ?? "";
  const collegeType = params.collegeType ?? "";

  const verified =
    params.verified === "true"
      ? true
      : params.verified === "false"
        ? false
        : undefined;

  const pageParam = Number(params.page ?? "1");

  const page =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;

  const [
    { data: colleges, pagination },
    locations,
  ] = await Promise.all([
    getColleges({
      search: search || undefined,
      state: stateId || undefined,
      city: cityId || undefined,
      collegeType: collegeType || undefined,
      verified,
      page,
      limit: 12,
    }),

    getLocations(),
  ]);

  const hasFilters =
    Boolean(search) ||
    Boolean(stateId) ||
    Boolean(cityId) ||
    Boolean(collegeType) ||
    Boolean(params.verified);

  const selectedState = locations.states.find(
    (state) => state.id === stateId,
  );

  const selectedCity = locations.cities.find(
    (city) => city.id === cityId,
  );

  const selectedCollegeType = COLLEGE_TYPES.find(
    (type) => type.value === collegeType,
  );

  function createPageUrl(nextPage: number) {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (stateId) query.set("stateId", stateId);
    if (cityId) query.set("cityId", cityId);
    if (collegeType) query.set("collegeType", collegeType);

    if (params.verified) {
      query.set("verified", params.verified);
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/colleges?${queryString}`
      : "/colleges";
  }

  function createCollegeTypeUrl(type: string) {
    const query = new URLSearchParams();

    if (search) query.set("search", search);
    if (stateId) query.set("stateId", stateId);
    if (cityId) query.set("cityId", cityId);

    query.set("collegeType", type);

    if (params.verified) {
      query.set("verified", params.verified);
    }

    // Filter changes start from the first page.
    return `/colleges?${query.toString()}`;
  }

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
            {/* =================================================
                LEFT CONTENT
            ================================================== */}
            <div className="min-w-0 max-w-4xl">
              {/* Label */}
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm sm:text-sm">
                <Building2 size={15} />
                Explore Colleges
              </div>

              {/* Heading */}
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Find the right college for your future
              </h1>

              {/* Description */}
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Explore colleges and universities across India.
                Compare institutions, discover courses, check
                locations and find the right place to pursue your
                education.
              </p>

              {/* Trust indicators */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 sm:text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  College information
                </div>

                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 shrink-0 text-emerald-600" />
                  Course details
                </div>

                <div className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4 shrink-0 text-emerald-600" />
                  Compare colleges
                </div>
              </div>

              {/* =================================================
                  COLLEGE TYPE SHORTCUTS
              ================================================== */}
              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {COLLEGE_TYPES.map((type) => {
                  const isActive = collegeType === type.value;

                  return (
                    <Link
                      key={type.value}
                      href={createCollegeTypeUrl(type.value)}
                      aria-current={
                        isActive ? "page" : undefined
                      }
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

              {/* =================================================
                  COLLEGE FILTERS
              ================================================== */}
              <CollegeFilters
                states={locations.states}
                cities={locations.cities}
              />
            </div>

            {/* =================================================
                RIGHT COLLEGE ILLUSTRATION
                Desktop only, matching the Course Hero
            ================================================== */}
            <div className="relative hidden h-[250px] lg:block">
              {/* Soft glow */}
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/60 blur-3xl" />

              {/* Decorative rings */}
              <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/70" />

              <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100" />

              {/* Main college icon */}
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

      {/* =====================================================
          COLLEGE RESULTS
      ====================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Results header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              {pagination.total}{" "}
              {pagination.total === 1 ? "college" : "colleges"}{" "}
              found
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {hasFilters
                ? "College Search Results"
                : "Explore Colleges"}
            </h2>

            {/* Active filter summary */}
            {hasFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {search && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    Search:{" "}
                    <span className="font-semibold text-slate-800">
                      {search}
                    </span>
                  </span>
                )}

                {selectedState && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    State:{" "}
                    <span className="font-semibold">
                      {selectedState.name}
                    </span>
                  </span>
                )}

                {selectedCity && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    City:{" "}
                    <span className="font-semibold">
                      {selectedCity.name}
                    </span>
                  </span>
                )}

                {selectedCollegeType && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Type:{" "}
                    <span className="font-semibold">
                      {selectedCollegeType.label}
                    </span>
                  </span>
                )}

                {params.verified && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {params.verified === "true"
                      ? "Verified only"
                      : "Unverified"}
                  </span>
                )}

                <Link
                  href="/colleges"
                  className="text-xs font-semibold text-red-500 transition-colors hover:text-red-600"
                >
                  Clear all
                </Link>
              </div>
            )}

            {search && (
              <p className="mt-2 text-sm text-slate-500">
                Showing results for{" "}
                <span className="font-semibold text-slate-700">
                  &quot;{search}&quot;
                </span>
              </p>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-semibold text-slate-700">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.totalPages}
              </span>
            </p>
          )}
        </div>

        {/* College grid */}
        {colleges.length > 0 ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <SlidersHorizontal size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No colleges found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn&apos;t find any colleges matching your
              current search or filters. Try changing your search
              criteria.
            </p>

            <Link
              href="/colleges"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Building2 size={17} />
              View all colleges
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <nav
            aria-label="College pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            {pagination.hasPreviousPage ? (
              <Link
                href={createPageUrl(pagination.page - 1)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <ArrowLeft size={16} />
                Previous
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                <ArrowLeft size={16} />
                Previous
              </span>
            )}

            <span
              aria-current="page"
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              {pagination.page}
            </span>

            {pagination.hasNextPage ? (
              <Link
                href={createPageUrl(pagination.page + 1)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                Next
                <ArrowRight size={16} />
              </Link>
            ) : (
              <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-slate-100 bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-400">
                Next
                <ArrowRight size={16} />
              </span>
            )}
          </nav>
        )}
      </section>
    </main>
  );
}